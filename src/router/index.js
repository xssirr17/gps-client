import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/object",
      name: "object",
      component: () => import("../components/gpsShowData.vue"),
      children: [
        {
          path: ":objectId",
          name: "objectId",
          component: () => import("../components/gpsShowData.vue"),
        },
      ],
    },
    {
      path: "/editobject",
      name: "editobject",
      component: () => import("../components/updateObject.vue"),
      children: [
        {
          path: ":editObjectId",
          name: "editObjectId",
          component: () => import("../components/updateObject.vue"),
        },
      ],
    },
    {
      path: "/edituserinfo",
      name: "edituserinfo",
      component: () => import("../components/updateUserInfo.vue"),
      children: [
        {
          path: ":editUserId",
          name: "editUserId",
          component: () => import("../components/updateUserInfo.vue"),
        },
      ],
    },
    {
      path: "/userdata",
      name: "userdata",
      component: () => import("../components/showUserData.vue"),
      children: [
        {
          path: ":user_id",
          name: "user_id",
          component: () => import("../components/showUserData.vue"),
        },
      ],
    },
    {
      path: "/charging",
      name: "charging",
      component: () => import("../components/chargingAccount.vue"),
      children: [
        {
          path: ":user_id",
          name: "userId",
          component: () => import("../components/chargingAccount.vue"),
        },
      ],
    },
    {
      path: "/history",
      name: "getHistory",
      component: () => import("../components/getHistory.vue"),
      children: [
        {
          path: ":object_id",
          name: "objectIdHistory",
          component: () => import("../components/getHistory.vue"),
        },
      ],
    },
    {
      path: "/commands",
      name: "commands",
      component: () => import("../components/listOfCommands.vue"),
      children: [
        {
          path: ":object_id",
          name: "objectIdCommands",
          component: () => import("../components/listOfCommands.vue"),
        },
      ],
    },
    {
      path: "/showLimit/:longitude/:latitude/:radius",
      name: "showLimit",
    },
    {
      path: "/removeObject",
      name: "removeObject",
      component: () => import("../components/removeObject.vue"),
    },
    {
      path: "/chargingManyObjects",
      name: "chargingManyObjects",
      component: () => import("../components/charginManyObjects.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/loginPage.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/registerPage.vue"),
    },
    {
      path: "/loadingPage",
      name: "loadingPage",
      component: () => import("../components/loadingPage.vue"),
    },
    {
      path: "/sendCommand",
      name: "sendCommand",
      component: () => import("../components/sendCommand.vue"),
      children: [
        {
          path: ":imei",
          name: "imei",
          component: () => import("../components/sendCommand.vue"),
        },
      ],
    },
  ],
});

export default router;
