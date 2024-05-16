<template>
  <div class="container">
    <i class="fa fa-remove removeGap" @click="closeEdit"></i>
    <div class="box">
      <div class="item" v-for="(value, key, index) in userData" :key="index">
        {{ key }} : {{ value }}
      </div>
    </div>
  </div>
</template>

<script setup>
import router from "../router";
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "../service/axiosInstance";
import { toast } from "vue3-toastify";

const userData = ref();
const route = useRoute();
const closeEdit = () => {
  router.push("/");
};

const fetchUserData = () => {
  axios
    .put("/fetchdata", {
      user_id: route.params.user_id,
    })
    .then((response) => {
      userData.value = response.data.userData;
      if (response.data.code != 200) {
        toast.error("somthing went wrong when fetching user", {
          autoClose: 3000,
        });
      }
    })
    .catch((error) => {
      toast.error("somthing went wrong when fetching user", {
        autoClose: 3000,
      });
    });
};
fetchUserData();
</script>

<style scoped lang="scss">
* {
  transition: all 1s ease;
}
.submit {
  cursor: pointer;
  width: 20%;
}
.hidden {
  display: none;
}
.show {
  display: flex;
  background: none;
}

.removeGap {
  position: absolute;
  top: 7%;
  right: 2%;
  font-size: 20px;
  color: var(--icons);
  cursor: pointer;
}
.removeGap:hover {
  transform: scale(120%);
}

.container {
  z-index: 2;
  padding: 1%;
  display: flex;
  flex-direction: column;
  position: absolute;
  align-items: center;
  justify-content: center;
  left: 30%;
  top: 10%;
  border-radius: 20px;
  background-color: var(--background);
  gap: 30px;
  width: 52%;
  border: 1px solid var(--icons);
  @media (max-width: 500px) {
    border: 1px solid var(--icons);
    z-index: 3;
    position: absolute;
    left: 0%;
    right: 0%;
    width: auto;
    top: 20%;
    height: 50%;
    background-color: var(--background);
    font-size: 12px;
    border-radius: 8px;
  }
}

.box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 10px;
  @media (max-width: 500px) {
    gap: 1rem;
  }
}
.item {
  background-color: var(--hover);
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  width: 40%;
}
</style>
