<template>
  <div class="container">
    <img
      src="../../public/Lovepik_com-401246127-gps-satellite-navigation.png"
      alt=""
    />
    <div class="register-form">
      <h1>Login</h1>
      <div>
        <div>
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="buttons">
          <button type="submit" @click="login">log in</button>
          <router-link to="/register">
            <button type="submit">I don't have an account</button>
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

const email = ref();
const password = ref();

const login = () => {
  axios
    .post("/login", {
      email: email.value,
      password: password.value,
    })
    .then((response) => {
      if (response.data.code == 200) {
        localStorage.setItem("user", email.value);
        localStorage.setItem("user_id", response.data.user_id);
        router.push("/loadingPage");
        setTimeout(() => {
          router.push("/");
        }, 3000);
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
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register-form label {
  font-weight: bold;
  margin-bottom: 5px;
}

.register-form input {
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

.register-form button[type="submit"]:hover {
  background-color: #45a049;
}
.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  padding: 8px;
}
</style>
