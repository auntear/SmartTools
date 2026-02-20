<template>
  <div style="width:300px;margin:100px auto;">
    <el-card>
      <h3>Login</h3>

      <el-input v-model="username" placeholder="Username" />
      <br /><br />
      <el-input v-model="password" type="password" placeholder="Password" />
      <br /><br />

      <el-button type="primary" @click="handleLogin" style="width:100%">
        Login
      </el-button>
    </el-card>
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
    handleLogin: function () {
      const auth = useAuthStore();

      if (this.username !== "" && this.password !== "") {
        auth.login("dummy-token", { name: this.username });
        this.$router.push("/");
      } else {
        alert("กรุณากรอกข้อมูลให้ครบ");
      }
    }
  }
};
</script>