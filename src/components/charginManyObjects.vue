<template>
  <div class="container">
    <i class="fa fa-remove removeGap" @click="closeEdit"></i>
    <div class="box">
      <div v-for="(value, index) in objects" :key="index" class="objects">
        <p>{{ index }} _</p>
        <input type="checkbox" v-model="objectCharging[index]" />
        <p>{{ value.gps_imei }}</p>
      </div>
    </div>
    <div class="box1">
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
        {{ totalCost }}
        <i class="fa fa-usd"></i
      ></label>
      <input
        type="submit"
        class="submit"
        value="Calculate Cost"
        @click="calculateCost"
      />
      <input
        type="submit"
        :class="submit"
        value="charge Account"
        @click="chargeAccount"
      />
    </div>
  </div>
</template>

<script setup>
import router from "../router";
import { ref } from "vue";
import axios from "../service/axiosInstance";


let day = ref(1);
let count = ref(0);
let totalCost = ref(0);
const objects = ref();
const submit = ref("hidden");
const objectCharging = ref([]);

const calculateCost = () => {
  objectCharging.value.forEach((el) => {
    if (el) {
      count.value++;
    }
  });
  totalCost.value = +day.value * count.value * 1000;
  submit.value = "submit";
};

const closeEdit = () => {
  router.push("/");
};
const getObjects = () => {
  axios
    .post("/user/fetchUserObject", {
      user_id: localStorage.getItem("user_id"),
    })
    .then((response) => {
      objects.value = response.data.objectsData;
      objectCharging.value.length = objects.value.length;
    });
};
getObjects();
const chargeAccount = () => {
  calculateCost();
  objectCharging.value.forEach((element, index) => {
    if (element) {
      axios.post("/user/chargingObject", {
        hours: day.value,
        total_cost: day.value * 1000,
        object_id: objects.value[index].object_id,
      });
    }
  });
  router.push("/");
};
</script>

<style scoped lang="scss">
* {
  transition: all 1s ease;
}
.select {
  background-color: var(--background);
  color: var(--text);
  padding: 2px;
  border-radius: 5px;
}
.objects {
  display: flex;
  gap: 2px;
}
.hidden {
  display: none;
}
.show {
  display: flex;
  background: none;
}
.box {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--text);
  border-radius: 10px;
  padding: 5px;
  overflow-y: auto;
  @media (max-width: 500px) {
    width: 50%;
  }
}
.box1 {
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.totalCost {
  font-size: 30px;
  @media (max-width: 500px) {
    font-size: 20px;
  }
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
  @media (max-width: 500px) {
    width: 17%;
  }
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
  @media (max-width: 500px) {
    width: 60%;
  }
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
  flex-direction: row;
  position: absolute;
  align-items: center;
  justify-content: center;
  left: 30%;
  top: 10%;
  border-radius: 20px;
  background-color: var(--background);
  gap: 20px;
  width: 50%;
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
