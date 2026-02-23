<template>
  <div class="container-fluid">
    <div class="row">

      <!-- Sidebar -->
      <div class="col-md-3 col-lg-2 bg-success p-0">
        <AppSidebar />
      </div>

      <!-- Main Content -->
      <div class="col-md-9 col-lg-10 p-0">

        <!-- Header -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom px-3">
          <span class="navbar-brand mb-0 h5">
            SmartTools Office
          </span>
        </nav>

        <!-- Content -->
        <div class="p-4">
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