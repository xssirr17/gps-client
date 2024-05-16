<script setup>
import { ref } from "@vue/reactivity";
import toggleMode from "./toggleMode.vue";

import router from "../router/index";
const objectId = ref(localStorage.getItem("user_id"));
const user = ref(localStorage.getItem("user"));
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("user_id");
  router.push("/login");
};
</script>

<template>
  <div class="topInformation">
    <img src="../../public/logo2.png" alt="" style="width: 120px" />
    <div class="left">
      <router-link :to="'/edituserinfo/' + objectId"
        ><button class="icon">
          <i class="fa-regular fa-gear"></i></button
      ></router-link>
      <router-link :to="'/userdata/' + objectId"
        ><button class="icon">
          <i class="fa fa-dashboard" aria-hidden="true"></i></button
      ></router-link>
      <router-link to="/chargingManyObjects"
        ><button class="icon">
          <i class="fa fa-usd" aria-hidden="true"></i></button
      ></router-link>
    </div>
    <div class="right">
      <toggleMode class="toggleMode" />
      <!-- <router-link to="/remaindays" class="remain">
        <button class="remainIcon" :class="remainStyle">
          <i
            class="fa fa-hourglass-half"
            aria-hidden="true"
            :class="remainStyle"
          ></i>
        </button>
        <label for="" class="remainNum">Subscriptions</label>
      </router-link> -->
      <router-link :to="'/userdata/' + objectId">
        <div class="user">
          <i class="fa fa-user"></i>
          <p class="userEmail">{{ user }}</p>
        </div>
      </router-link>
      <router-link to="/login"
        ><button class="remainIcon" @click="logout">
          <i class="fa-solid fa-right-from-bracket"></i></button
      ></router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  text-decoration: none;
}
.toggleMode {
  transform: scale(80%);
}
i {
  color: var(--icons);
}
.red {
  color: var(--icons);
}
.green {
  color: green;
}

.remainNum {
  color: var(--text);
}

.remain {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 2px;
  border-right: 1px solid var(--icons);
  width: 130px;
  @media (max-width: 500px) {
    border: none;
  }
}
.remainIcon {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.userEmail {
  @media screen and (max-width: 500px) {
    display: none;
  }
}

.topInformation {
  padding-left: 0.5%;
  z-index: 12;
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  gap: 0.5rem;
  background-color: var(--background);
  height: 40px;
}
.left {
  display: flex;
  gap: 0.5rem;
}
.right {
  display: flex;
  position: fixed;
  align-items: center;
  right: 0;
  gap: 0.2rem;
  cursor: pointer;
  @media (max-width: 500px) {
    gap: 0.1rem;
  }
}
.user {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  height: 30px;
  padding-left: 10px;
  padding-right: 10px;
  justify-content: center;
  color: var(--text);
  border-right: 1px solid var(--icons);
  @media (max-width: 500px) {
    display: none;
  }
}
.icon {
  background: none;
  color: var(--icons);
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.user:hover,
.logOut:hover,
.icon:hover {
  background: var(--hover);
}
.gps {
  display: flex;
  flex-direction: column;
  width: 200px;
  gap: 0.5rem;
}
.gpsBtn {
  background: var(--background);
}
.gpsBtn:hover {
  transform: scale(150%);
}
</style>
