<template>
  <div class="container-fluid vh-100">
    <div class="row h-100">

      <!-- Sidebar -->
      <div class="col-md-3 col-lg-2 bg-success p-0 h-100 sidebar-fixed">
        <AppSidebar />
      </div>

      <!-- Main -->
      <div class="col-md-9 col-lg-10 p-0 d-flex flex-column h-100">

        <!-- Header -->
        <nav class="navbar navbar-light bg-light border-bottom px-3 header-fixed">
          <span class="navbar-brand mb-0 h5">
            SmartTools Office
          </span>
        </nav>

        <!-- Content -->
        <div class="content-area p-4">
          <router-view />
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import AppSidebar from "../components/AppSidebar.vue";

export default {
  components: {
    AppSidebar
  }
};
</script>

<style>

.sidebar-fixed{
  height:100vh;
  overflow-y:auto;
}

.header-fixed{
  flex-shrink:0;
}

.content-area{
  flex-grow:1;
  overflow-y:auto;
  background:#f5f6fa;
}

</style>