<template>
  <div class="login-bg">
    <div class="container">
      <div class="row justify-content-center align-items-center vh-100">
        <div class="col-md-4">

          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4">

              <div class="text-center mb-4">
                <div class="hospital-icon mb-2">
                  🏥
                </div>
                <h4 class="fw-bold text-primary">
                  Smart Tools
                </h4>
                <small class="text-muted">
                  กรุณาเข้าสู่ระบบ
                </small>
              </div>

              <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" v-model="username" class="form-control form-control-lg rounded-3"
                  placeholder="กรอก Username" />
              </div>

              <div class="mb-4">
                <label class="form-label">Password</label>
                <input type="password" v-model="password" class="form-control form-control-lg rounded-3"
                  placeholder="กรอก Password" />
              </div>

              <button class="btn btn-primary w-100 btn-lg rounded-3" @click="handleLogin">
                Login
              </button>

            </div>
          </div>

          <div class="text-center mt-3">
            <small class="text-muted">
              © 2026 Smart Hospital System By DNA.
            </small>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/authStore";

export default {
  data: function () {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    handleLogin: async function () {

      if (this.username !== "" && this.password !== "") {

        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });

        const data = await response.json();

        if (response.status === 200) {

          localStorage.setItem("token", data.token);

          const auth = useAuthStore();
          auth.login(data.token, data.user);

          this.$router.push("/");

        } else {
          alert(data.message);
        }

      } else {
        alert("กรุณากรอกข้อมูลให้ครบ");
      }

    }
  }
};
</script>

<style>
.login-bg {
  background: linear-gradient(135deg, #e6f4f9, #f8fbff);
}

.card {
  backdrop-filter: blur(6px);
}

.hospital-icon {
  font-size: 40px;
}

.btn-primary {
  background-color: #0d6efd;
  border: none;
}

.btn-primary:hover {
  background-color: #0b5ed7;
}
</style>