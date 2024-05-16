<template>
  <div class="container">
    <i class="fa fa-remove removeGap" @click="closeEdit"></i>
    <div>
      <label for="">update Information</label>
      <div class="inputs">
        <input type="text" placeholder="first name" v-model="first_name" />
        <input type="text" placeholder="last name" v-model="last_name" />
        <input type="text" placeholder="phone" v-model="phone" />
        <input type="email" placeholder="email" v-model="email" />
        <input type="text" placeholder="city" v-model="city" />
        <input type="text" placeholder="country" v-model="country" />
        <input type="text" placeholder="address" v-model="address" />
        <input type="text" placeholder="post code" v-model="post_code" />
      </div>
    </div>
    <div class="box">
      <label for="">update password</label>
      <div class="inputs">
        <input
          type="password"
          placeholder="current password"
          v-model="curPass"
        /><br />
        <input type="password" placeholder="password" v-model="password" />
        <input
          type="password"
          placeholder="confirm password"
          v-model="confirmPass"
        />
      </div>
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
let first_name = ref();
let last_name = ref();
let phone = ref();
let email = ref();
let city = ref();
let country = ref();
let address = ref();
let post_code = ref();

let curPass = ref();
let password = ref();
let confirmPass = ref();

const closeEdit = () => {
  router.push("/");
};
let updateObj = ref({});

const editObject = () => {
  updateObj.value.user_id = route.params.editUserId;
  if (first_name.value) {
    updateObj.value.first_name = first_name.value;
  }
  if (last_name.value) {
    updateObj.value.last_name = last_name.value;
  }
  if (phone.value) {
    updateObj.value.phone = phone.value;
  }
  if (email.value) {
    updateObj.value.email = email.value;
  }
  if (city.value) {
    updateObj.value.city = city.value;
  }
  if (address.value) {
    updateObj.value.address = address.value;
  }
  if (country.value) {
    updateObj.value.country = country.value;
  }
  if (post_code.value) {
    updateObj.value.post_code = post_code.value;
  }
  if (
    password.value &&
    confirmPass.value &&
    password.value == confirmPass.value &&
    curPass.value
  ) {
    updateObj.value.password = password.value;
    updateObj.value.curPass = curPass.value;
  }
  axios
    .put("/updateuser", updateObj.value)
    .then((response) => {
      if (response.data.code == 201) {
        toast.success("user data and password updated successfully", {
          autoClose: 3000,
        });
        router.push("/");
      } else if (response.data.code == 200) {
        toast.success("user data updated successfully", {
          autoClose: 3000,
        });
        router.push("/");
      } else {
        toast.error("somthing went wrong when updating user", {
          autoClose: 3000,
        });
      }
    })
    .catch((error) => {
      toast.error("somthing went wrong when updating user", {
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
  display: static;
  background: none;
}

.submit {
  cursor: pointer;
  width: 20%;
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
    height: 65%;
    background-color: var(--background);
    font-size: 12px;
    border-radius: 8px;
  }
}
input {
  height: 25px;
  outline: none;
  background: $hover;
  border: 1px solid var(--icons);
  border-radius: 4px;
  @media (max-width: 500px) {
    width: 45%;
  }
}
input::placeholder {
  color: var(--text);
  padding-left: 10px;
}
.inputs {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 10px;
  @media (max-width: 500px) {
    gap: 1rem;
  }
}
.box {
  border-top: 1px solid var(--text);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
label {
  margin-top: 10px;
}
</style>
