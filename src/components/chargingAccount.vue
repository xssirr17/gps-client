<template>
  <div class="container">
    <i class="fa fa-remove removeGap" @click="closeEdit"></i>
    <div class="item">
      <input
        type="range"
        min="1"
        max="720"
        class="input"
        v-model="day"
        required
      />
      <label>hours</label><input type="text" v-model="day" class="text" />
    </div>
    <br />
    <label for="" class="totalCost"
      >Total Costs :
      {{ (+day * 1000).toLocaleString() }}
      <i class="fa fa-usd"></i
    ></label>
    <input
      type="submit"
      class="submit"
      value="charge Account"
      @click="chargeAccount"
    />
  </div>
</template>

<script setup>
import router from "../router";
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "../service/axiosInstance";
import { toast } from "vue3-toastify";

const route = useRoute();

let day = ref(1);


const closeEdit = () => {
  router.push("/");
};
console.log(route.params.user_id);
const chargeAccount = () => {
  axios
    .post("/user/chargingObject", {
      hours: day.value,
      total_cost: +day.value * 1000,
      object_id: route.params.user_id,
    })
    .then((response) => {
      if (response.data.code == 200) {
        toast.success("account charge request sent successfully", {
          autoClose: 3000,
        });
        router.push("/");
      } else {
        toast.error("somthing went wrong when charging account", {
          autoClose: 3000,
        });
      }
    })
    .catch((error) => {
      toast.error("somthing went wrong when charging account", {
        autoClose: 3000,
      });
    });
};
</script>

<style scoped lang="scss">
* {
  transition: all 1s ease;
}
.hidden {
  display: none;
}
.show {
  display: flex;
  background: none;
}

.totalCost {
  font-size: 30px;
}
.totalCost i {
  color: var(--icons);
}
.checkLabels {
  margin-right: 30px;
}
.check {
  width: 2%;
}
.text {
  width: 5%;
  outline: none;
  background: var(--hover);
  border: 1px solid var(--icons);
  border-radius: 4px;
}
.text::placeholder {
  color: var(--text);
}
.submit {
  cursor: pointer;
  width: 30%;
  height: 25px;
  outline: none;
  background: var(--hover);
  border: 1px solid var(--icons);
  border-radius: 4px;
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
  gap: 20px;
  width: 40%;
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

.item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  width: 90%;
}
.item2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  @media (max-width: 500px) {
    width: 100%;
    gap: 0.1rem;
    padding-left: 10px;
  }
}
.input {
  width: 70%;
}
</style>
