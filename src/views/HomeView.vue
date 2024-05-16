<script setup>
import objectTab from "../components/objectTab.vue";
import topMenu from "../components/topMenu.vue";
import mapOpen from "../components/mapOpen.vue";
import { ref } from "vue";
window.addEventListener("storage", () => {
  console.log("helo");
});
</script>
<template>
  <topMenu />
  <objectTab @show-position="showPoint" />
</template>
<style scoped></style>
