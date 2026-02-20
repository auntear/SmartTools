import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: function () {
    return {
      token: null,
      user: null
    };
  },
  getters: {
    isLoggedIn: function (state) {
      if (state.token !== null && state.token !== undefined) {
        return true;
      } else {
        return false;
      }
    }
  },
  actions: {
    login: function (token, user) {
      this.token = token;
      this.user = user;
    },
    logout: function () {
      this.token = null;
      this.user = null;
    }
  }
});