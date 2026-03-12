import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import MainLayout from "../layouts/MainLayout.vue";
import { useAuthStore } from "../stores/authStore";
import SmartStockProduct from "../views/SmartStock/SmartStockProduct.vue";
import SmartStockDraw from "../views/SmartStock/SmartStockDraw.vue";
import SmartStockReport from "../views/SmartStock/SmartStockReport.vue";

const routes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        component: Dashboard,
      },
      {
        path: "smart-stock/product",
        component: SmartStockProduct,
      },
      {
        path: "smart-stock/draw",
        component: SmartStockDraw,
      },
      {
        path: "smart-stock/report",
        component: SmartStockReport,
      },
    ],
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth === true) {
    if (auth.isLoggedIn === true) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
