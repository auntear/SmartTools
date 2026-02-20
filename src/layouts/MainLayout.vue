<template>
  <el-container style="height: 100vh">
    <el-aside width="200px">
      <AppSidebar />
    </el-aside>

    <el-container>
      <el-header>
        SmartTools Back Office
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppSidebar from "../components/AppSidebar.vue";

export default {
  components: {
    AppSidebar
  }
};
</script>