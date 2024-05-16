<template>
  <div class="container">
    <div class="center">
      <p>Do you want to remove object?</p>
      <div class="buttoms">
        <button @click="removeObject">YES</button>
        <button @click="cancle">NO</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import router from "../router";
import axios from "../service/axiosInstance";
import { toast } from "vue3-toastify";
const cancle = () => {
  router.push("/");
  localStorage.removeItem("object_id");
  localStorage.removeItem("gps_imei");
};
const removeObject = () => {
  axios
    .post("/user/deleteObject", {
      object_id: localStorage.getItem("object_id"),
      gps_imei: localStorage.getItem("gps_imei"),
    })
    .then((res) => {
      toast.success("object removed successfully", {
        autoClose: 3000,
      });
      router.push("/");
    })
    .catch((err) => {
      toast.error("something went wrong when remove object", {
        autoClose: 3000,
      });
    });
  localStorage.removeItem("object_id");
  localStorage.removeItem("gps_imei");
};
</script>

<style lang="scss" scoped>
.container {
  transition: all 1s ease;
  border-radius: 20px;
  position: absolute;
  left: 30%;
  top: 16%;
  z-index: 13;
  width: 20%;
  height: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background);
  border: 1px solid var(--icons);
  @media (max-width: 500px) {
    transition: all 1s ease;
    border-radius: 10px;
    position: absolute;
    left: 0%;
    right: 0%;
    top: 16%;
    z-index: 13;
    width: auto;
    height: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background);
  }
}
.center {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.buttoms {
  justify-content: center;
  align-items: center;
  width: 100%;
  display: flex;
  gap: 10px;
}
button {
  cursor: pointer;
  height: 25px;
  width: 30%;
  outline: none;
  background: $hover;
  border: 1px solid var(--icons);
  border-radius: 4px;
  @media (max-width: 500px) {
    width: 45%;
  }
}
button::placeholder {
  color: var(--text);
  padding-left: 10px;
}
</style>
