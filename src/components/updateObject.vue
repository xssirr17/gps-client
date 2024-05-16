<template>
  <div class="container">
    <i class="fa fa-remove removeGap" @click="closeEdit"></i>
    <div class="choices">
      <label for="type">object type:</label>
      <select name="" id="type" v-model="type">
        <option value="car">car</option>
        <option value="bus">bus</option>
        <option value="truck">truck</option>
        <option value="Bike">Bike</option>
        <option value="motorcycle">motorcycle</option>
        <option value="human">human</option>
      </select>
      <input type="text" id="driver" placeholder="driver id" v-model="driver" />
    </div>

    <div class="choices">
      <label for="model">model:</label>
      <select name="" id="type" v-model="model">
        <option value="">value1</option>
        <option value="">value2</option>
        <option value="">value3</option>
        <option value="">value4</option>
        <option value="">value5</option>
      </select>
      <input type="text" id="engin" placeholder="engin id" v-model="enginId" />
    </div>
    <div class="choices">
      <label for="engin">engin type:</label>
      <select name="" id="type" v-model="enginType">
        <option value="">value1</option>
        <option value="">value2</option>
        <option value="">value3</option>
        <option value="">value4</option>
        <option value="">value5</option>
      </select>
      <input
        type="text"
        id="address"
        placeholder="address "
        v-model="address"
      />
    </div>
    <input type="submit" class="submit" value="Edit" @click="editObject" />
  </div>
</template>

<script setup>
import router from "../router";
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "../service/axiosInstance";
import { toast } from "vue3-toastify";

const route = useRoute();
let type = ref();
let model = ref();
let enginId = ref();
let driver = ref();
let enginType = ref();
let address = ref();

const closeEdit = () => {
  router.push("/");
};
let updateObj = ref({});

const editObject = () => {
  updateObj.value.object_id = route.params.editObjectId;
  if (type.value) {
    updateObj.value.type = type.value;
  }
  if (model.value) {
    updateObj.value.model = model.value;
  }
  if (enginId.value) {
    updateObj.value.engin_id = enginId.value;
  }
  if (driver.value) {
    updateObj.value.driver_id = driver.value;
  }
  if (enginType.value) {
    updateObj.value.engin_type = enginType.value;
  }
  if (address.value) {
    updateObj.value.address = address.value;
  }
  axios
    .post("/user/updateObject", updateObj.value)
    .then((response) => {
      if (response.data.code == 200) {
        toast.success("object updated successfully", {
          autoClose: 3000,
        });
        router.push("/");
      } else {
        toast.error("somthing went wrong when updating object", {
          autoClose: 3000,
        });
      }
    })
    .catch((error) => {
      toast.error("somthing went wrong when updating object", {
        autoClose: 3000,
      });
    });
};
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
.choices {
  align-items: center;
  justify-content: flex-end;
  display: flex;
  gap: 10px;
  width: 90%;
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
  }
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
  width: 50%;
  border: 1px solid var(--icons);
  @media (max-width: 500px) {
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    left: 0%;
    right: 0%;
    width: auto;
    top: 20%;
    height: 56%;
    background-color: var(--background);
    border: 1px solid var(--icons);
    font-size: 12px;
    border-radius: 8px;
  }
}
input {
  width: 70%;
  height: 25px;
  outline: none;
  background: var(--hover);
  border: 1px solid var(--icons);
  border-radius: 4px;
  @media (max-width: 500px) {
    width: 90%;
  }
}
input::placeholder {
  color: var(--text);
  padding-left: 10px;
}
select {
  background-color: var(--hover);
  border: 1px solid var(--icons);
}
</style>
