const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const db = mysql.createConnection({
    host: "192.168.100.41",
    user: "sa",
    password: "Cwhos@11020@",
    database: "dna",
    port: 3306,
});

db.connect(function (err) {
    if (err !== null) {
        console.log("Database connect error");
    } else {
        console.log("Database connected");
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ===========================
// CREATE USER API
// ===========================
app.post("/api/create-user", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const fullname = req.body.fullname;
    const role = req.body.role;

    if (username === null || username === undefined || username === "") {
        return res.status(400).json({ message: "กรอก Username" });
    }

    if (password === null || password === undefined || password === "") {
        return res.status(400).json({ message: "กรอก Password" });
    }

    if (fullname === null || fullname === undefined || fullname === "") {
        return res.status(400).json({ message: "กรอก Fullname" });
    }

    if (role === null || role === undefined || role === "") {
        return res.status(400).json({ message: "กรอก Role" });
    }

    // ตรวจสอบ username ซ้ำ
    const checkSql = "SELECT id FROM users WHERE username = ?";
    db.query(checkSql, [username], function (err, results) {
        if (err !== null) {
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: "Username นี้ถูกใช้งานแล้ว" });
        }
        // hash password
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const insertSql = `
      INSERT INTO users 
      (username, password, fullname, role, status, login_attempt, locked_until)
      VALUES (?, ?, ?, ?, 'active', 0, NULL)
    `;

        db.query(
            insertSql,
            [username, hashedPassword, fullname, role],
            function (err2) {
                if (err2 !== null) {
                    return res.status(500).json({ message: "Insert error" });
                }

                return res.json({
                    message: "สร้างผู้ใช้งานสำเร็จ",
                });
            },
        );
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ===========================
// LOGIN API
// ===========================
app.post("/api/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (username === null || username === undefined || username === "") {
        return res.status(400).json({ message: "กรอก Username" });
    }
    if (password === null || password === undefined || password === "") {
        return res.status(400).json({ message: "กรอก Password" });
    }

    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], function (err, results) {
        if (err !== null) {
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "ไม่พบผู้ใช้งาน" });
        }

        const user = results[0];

        // เช็คสถานะบัญชี
        if (user.status !== "active") {
            return res.status(403).json({ message: "บัญชีถูกระงับ" });
        }

        // เช็ค lock
        if (user.locked_until !== null) {
            const now = new Date();
            const lockedTime = new Date(user.locked_until);

            if (now < lockedTime) {
                return res.status(403).json({ message: "บัญชีถูกล็อคชั่วคราว" });
            }
        }

        let isMatch = false;

        try {
            isMatch = bcrypt.compareSync(password, user.password);
        } catch (error) {
            return res.status(500).json({ message: "Password format error" });
        }

        if (isMatch === true) {
            // reset login attempt
            const resetSql =
                "UPDATE users SET login_attempt = 0, locked_until = NULL WHERE id = ?";
            db.query(resetSql, [user.id]);

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                SECRET_KEY,
                { expiresIn: "8h" },
            );

            // บันทึก log
            const ip = req.ip;
            const logSql =
                "INSERT INTO login_logs (user_id, login_time, ip_address) VALUES (?, NOW(), ?)";
            db.query(logSql, [user.id, ip]);

            return res.json({
                message: "Login success",
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname,
                    role: user.role,
                },
            });
        } else {
            // เพิ่มจำนวนครั้งที่ผิด
            const attempts = user.login_attempt + 1;

            if (attempts >= 5) {
                const lockTime = new Date();
                lockTime.setMinutes(lockTime.getMinutes() + 15);

                const lockSql =
                    "UPDATE users SET login_attempt = ?, locked_until = ? WHERE id = ?";
                db.query(lockSql, [attempts, lockTime, user.id]);

                return res
                    .status(403)
                    .json({ message: "รหัสผิดเกิน 5 ครั้ง บัญชีถูกล็อค 15 นาที" });
            } else {
                const updateSql = "UPDATE users SET login_attempt = ? WHERE id = ?";
                db.query(updateSql, [attempts, user.id]);

                return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
            }
        }
    });
});

// ===========================
app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
