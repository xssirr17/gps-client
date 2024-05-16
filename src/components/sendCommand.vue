<template>
  <div class="container">
    <i class="fa fa-remove removeGap" @click="closeEdit"></i>
    <div class="choices">
      <div class="optinos">
        <label for="type">commands</label>
        <select name="" id="type" v-model="command">
          <option
            v-for="(option, index) in commands"
            :key="index"
            :value="option.command_code"
          >
            {{ option.define }}
          </option>
        </select>
      </div>
      <input
        type="password"
        id=""
        placeholder="enter your password"
        v-model="pass"
      />
      <input
        type="submit"
        id=""
        placeholder="send command"
        value="sendCommand"
        class="btn"
        @click="openMessagingApp"
      />
    </div>
  </div>
</template>

<script setup>
import router from "../router";
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "../service/axiosInstance";
import { toast } from "vue3-toastify";

const route = useRoute();

let command = ref();
let commands = ref();
let pass = ref();

const openMessagingApp = async () => {
  if (pass.value) {
    try {
      const imei = route.params.imei;
      const result = await axios.post("user/fetchGpsNumber", {
        gps_imei: imei,
      });
      const message = `p${pass.value}p${command.value}`;

      const customURL = `sms:${result.data.number}?body=${encodeURIComponent(
        message
      )}`;

      window.location.href = customURL;
      router.push("/");
    } catch (err) {
      toast.error("something went wrong");
    }
  } else {
    toast.info("enter password at first");
  }
};

const closeEdit = () => {
  router.push("/");
};
const fetchCommands = () => {
  axios
    .post("/user/fetchCommands")
    .then((response) => {
      commands.value = response.data.commands;
    })
    .catch((error) => {
      toast.error("somthing went wrong when fetching commands", {
        autoClose: 3000,
      });
    });
};
fetchCommands();
</script>

<style scoped lang="scss">
* {
  transition: all 1s ease;
}
.choices {
  align-items: center;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 90%;
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: centert;
  }
}
.btn {
  cursor: pointer;
}
.optinos {
  display: flex;
  gap: 1rem;
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
input {
  width: 50%;
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
