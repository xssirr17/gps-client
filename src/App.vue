<script setup>
import { RouterView } from "vue-router";
import HomeView from "./views/HomeView.vue";
import { useRoute } from "vue-router";
import router from "./router/index";
const route = useRoute();

if (!localStorage.getItem("user")) {
  router.push("/login");
} else {
  router.push("/");
}

</script>

<template>
  <HomeView v-if="route.path != '/login' && route.path != '/register'" />
  <RouterView />
</template>

<style lang="scss">
.sendMsg{
  position: absolute;
  z-index: 2000;
}
:root {
  --background-color-primary: #ebebeb;
  --background-color-secondary: #fafafa;
  --accent-color: #cacaca;
  --text-primary-color: rgba(98, 82, 97, 0.887);
  --element-size: 4rem;
  --background: rgb(247, 242, 242);
  --backgroundLoading: rgb(247, 242, 242);
  --icons: rgba(98, 82, 97, 0.887);
  --text: rgb(60, 64, 72);
  --hover: rgba(178, 178, 178, 0.501);
  --filter: brightness(1);
}

/* Define styles for the root window with dark - mode preference */
:root.dark-theme {
  --background-color-primary: #4e4646;
  --background-color-secondary: #414147;
  --accent-color: #3f3f3f;
  --text-primary-color: #ddd;
  --background: rgb(59, 52, 52);
  --backgroundLoading: rgb(26, 24, 24);
  --icons: rgba(240, 235, 239, 0.887);
  --text: rgb(219, 224, 235);
  --hover: rgba(178, 178, 178, 0.501);
  --filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg)
    saturate(0.3) brightness(0.7);
}
@import "./assets/styles/color.scss";

.hidden {
  display: none;
  z-index: 11;
  opacity: 0;
}
.show {
  display: flex;
  z-index: 12;
  background-color: $backgroundLoading;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
