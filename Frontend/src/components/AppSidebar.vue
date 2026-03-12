<template>
  <div class="sidebar bg-success text-white d-flex flex-column vh-100">

    <!-- User Profile -->
    <div class="p-3 border-bottom border-light text-center">

      <div class="mb-3">
        <div class="avatar-circle mx-auto">
          {{ firstLetter }}
        </div>
      </div>

      <div v-if="user != null">
        <strong>{{ user.name }}</strong>
      </div>
      <div v-else>
        <strong>Guest</strong>
      </div>

    </div>

    <!-- Menu -->
    <ul class="nav nav-pills flex-column p-3">

      <li class="nav-item mb-2">
        <router-link to="/" class="nav-link text-white menu-link" exact-active-class="active-menu">
          Dashboard
        </router-link>
      </li>

      <li class="nav-item mb-2">

        <!-- Smart Stock -->
        <div class="nav-link text-white menu-link d-flex justify-content-between align-items-center"
          @click="toggleSmartStock">

          <span>Smart Stock</span>

          <span v-if="isSmartStockOpen === true">
            ▼
          </span>
          <span v-else>
            ▶
          </span>

        </div>

        <!-- Sub Menu -->
        <ul v-if="isSmartStockOpen === true" class="nav flex-column submenu">

          <li class="nav-item">
            <router-link to="/smart-stock/product" class="nav-link text-white submenu-link" active-class="active-menu">
              ลงทะเบียนครุภัณฑ์
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/smart-stock/draw" class="nav-link text-white submenu-link" active-class="active-menu">
              เบิกXXXX
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/smart-stock/report" class="nav-link text-white submenu-link" active-class="active-menu">
              รายงานXXX
            </router-link>
          </li>

        </ul>

      </li>

      <li class="nav-item mt-3 border-top pt-3">
        <button class="btn btn-outline-light w-100" @click="handleLogout">
          Logout
        </button>
      </li>

    </ul>

  </div>
</template>

<script>
import { useAuthStore } from "../stores/authStore";

export default {

  data: function () {
    return {
      isSmartStockOpen: false
    };
  },

  mounted: function () {

    const currentPath = this.$route.path;

    if (currentPath.indexOf("/smart-stock") === 0) {
      this.isSmartStockOpen = true;
    } else {
      this.isSmartStockOpen = false;
    }

  },

  watch: {

    $route: function (to) {

      const currentPath = to.path;

      if (currentPath.indexOf("/smart-stock") === 0) {
        this.isSmartStockOpen = true;
      } else {
        this.isSmartStockOpen = false;
      }

    }

  },

  computed: {

    user: function () {
      const auth = useAuthStore();

      if (auth.user != null) {
        return auth.user;
      } else {
        return null;
      }
    },

    firstLetter: function () {

      if (this.user != null && this.user.name != null) {
        return this.user.name.charAt(0).toUpperCase();
      } else {
        return "G";
      }

    }

  },

  methods: {

    toggleSmartStock: function () {

      if (this.isSmartStockOpen === true) {
        this.isSmartStockOpen = false;
      } else {
        this.isSmartStockOpen = true;
      }

    },

    handleLogout: function () {

      const auth = useAuthStore();

      if (auth.isLoggedIn === true) {
        auth.logout();
        this.$router.push("/login");
      } else {
        this.$router.push("/login");
      }

    }

  }

};
</script>

<style>
.sidebar {
  min-height: 100%;
}

.menu-link {
  border-radius: 6px;
  transition: 0.2s ease-in-out;
}

.menu-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.active-menu {
  background-color: white !important;
  color: #198754 !important;
  font-weight: 600;
}

.avatar-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #198754;
  border-radius: 50%;
  width: 25%;
  aspect-ratio: 1 / 1;
  font-size: 1.5rem;
  font-weight: bold;
}

.submenu {
  padding-left: 20px;
}

.submenu-link {
  font-size: 0.9rem;
  border-radius: 6px;
  transition: 0.2s ease-in-out;
}

.submenu-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
}
</style>