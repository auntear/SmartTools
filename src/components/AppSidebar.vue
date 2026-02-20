<template>
  <div>

    <!-- แสดงชื่อผู้ใช้งาน -->
    <div style="padding:15px; border-bottom:1px solid #eee;">
      <div v-if="user != null">
        <strong>{{ user.name }}</strong>
      </div>
      <div v-else>
        <strong>Guest</strong>
      </div>
    </div>

    <el-menu default-active="1">

      <el-menu-item index="1" @click="goDashboard">
        Dashboard
      </el-menu-item>

      <el-menu-item index="2" @click="goSmartStock">
        Smart Stock
      </el-menu-item>

      <el-menu-item index="2" @click="handleLogout">
        Logout
      </el-menu-item>

    </el-menu>

  </div>
</template>

<script>
import { useAuthStore } from "../stores/authStore";

export default {
  computed: {
    user: function () {
      const auth = useAuthStore();

      if (auth.user != null) {
        return auth.user;
      } else {
        return null;
      }
    }
  },
  methods: {
    goDashboard: function () {
      this.$router.push("/");
    },
    goSmartStock: function () {
      this.$router.push("/smart-stock");
    },
    handleLogout: function () {
      const auth = useAuthStore();

      this.$confirm("ต้องการออกจากระบบหรือไม่?", "Confirm", {
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
        type: "warning"
      })
        .then(function () {
          auth.logout();
          this.$router.push("/login");
        }.bind(this))
        .catch(function () {
          // ยกเลิก
        });
    }
  }
};
</script>