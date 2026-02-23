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
    <router-link
      to="/"
      class="nav-link text-white menu-link"
      exact-active-class="active-menu">
      Dashboard
    </router-link>
  </li>

  <li class="nav-item mb-2">
    <router-link
      to="/smart-stock"
      class="nav-link text-white menu-link"
      active-class="active-menu">
      Smart Stock
    </router-link>
  </li>

  <li class="nav-item mt-3 border-top pt-3">
    <button
      class="btn btn-outline-light w-100"
      @click="handleLogout">
      Logout
    </button>
  </li>

</ul>

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
    goDashboard: function () {
      this.$router.push("/");
    },

    goSmartStock: function () {
      this.$router.push("/smart-stock");
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
</style>