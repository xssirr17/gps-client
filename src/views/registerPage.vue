<template>
  <div class="container">
    <img
      src="../../public/Lovepik_com-401246127-gps-satellite-navigation.png"
      alt=""
    />
    <div class="register-form">
      <h1>Register User</h1>
      <div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" />
        </div>
        <div>
          <label for="password">confirm Password:</label>
          <input type="password" v-model="confirmPassword" />
        </div>
        <div>
          <label for="first-name">First Name:</label>
          <input type="text" v-model="first_name" />
        </div>
        <div>
          <label for="last-name">Last Name:</label>
          <input type="text" v-model="last_name" />
        </div>
        <div>
          <label for="phone">Phone:</label>
          <input type="text" v-model="phone" />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="text" v-model="email" />
        </div>
        <div>
          <label for="city">City:</label>
          <input type="text" v-model="city" />
        </div>
        <div>
          <label for="country">Country:</label>
          <input type="text" v-model="country" />
        </div>
        <div class="buttons">
          <input
            type="submit"
            @click="register"
            v-if="password == confirmPassword"
            value="register"
          />
          <button v-else type="submit" disabled>Register</button>
          <router-link to="/login">
            <button type="submit" @click="login">I have an account</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "../service/axiosInstance";
import router from "../router/index";
import { toast } from "vue3-toastify";

const password = ref();
const confirmPassword = ref();
const city = ref();
const country = ref();
const address = ref();
const post_code = ref();
const email = ref();
const first_name = ref();
const last_name = ref();
const phone = ref();

const register = () => {
  axios
    .post("/register", {
      email: email.value,
      password: password.value,
      city: city.value,
      country: country.value,
      address: address.value,
      post_code: post_code.value,
      first_name: first_name.value,
      last_name: last_name.value,
      phone: phone.value,
    })
    .then((response) => {
      if (response.data.code == 200) {
        router.push("/login");
      } else {
        toast.error("somthing went wrong", {
          autoClose: 3000,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      toast.error("somthing went wrong", {
        autoClose: 3000,
      });
    });
};
</script>

<style scoped>
@media (max-width: 500px) {
  img {
    display: none;
  }
}
.hidden {
  display: none;
}
.show {
  display: flex;
}

.container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}
img {
  width: 90%;
}
.register-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register-form label {
  font-weight: bold;
  margin-bottom: 5px;
}

.register-form input[type="text"] {
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}
.register-form input[type="password"] {
  padding: 8px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}

.register-form button[type="submit"] {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}
.register-form input[type="submit"] {
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.register-form button[type="submit"]:hover {
  background-color: #45a049;
}

.register-form input[type="submit"]:hover {
  background-color: #45a049;
}
.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  /* width: 100%; */
  padding: 8px;
}
</style>
