<template>
  <div class="table">
    <i class="fa fa-remove removeGap" @click="closeEdit"></i>
    <div
      class="rows"
      v-for="(rows, index) in commands?.slice(cur - 1, cur + 9)"
      :key="index"
    >
      <div class="row" v-for="(value, key, index2) in rows" :key="index2">
        <div
          v-if="index == 0 && key != 'gps_imei' && key != 'command_id'"
          class="tableItem tableFixedTitle"
        >
          {{ key }}
        </div>
        <p
          v-if="key != 'gps_imei' && key != 'command_id' && index != 0"
          class="tableItem"
        >
          {{ value }}
        </p>
      </div>
    </div>
    <vue-awesome-paginate
      class="paginate"
      :total-items="totalItems"
      :items-per-page="10"
      :max-pages-shown="5"
      v-model="cur"
    />
  </div>
</template>

<script setup>
import router from "../router";
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "../service/axiosInstance";
import { toast } from "vue3-toastify";
const commands = ref();
const route = useRoute();
const cur = ref(1);
const totalItems = ref(0);

const closeEdit = () => {
  router.push("/");
};

const getCommands = () => {
  axios
    .post("/fetchOjbectCommands", {
      gps_imei: route.params.object_id,
    })
    .then((response) => {
      commands.value = response.data.commands;
      totalItems.value = commands.value.length;
      if (!commands.value.length) {
        toast.error("commands is emplty", {
          autoClose: 3000,
        });
      } else if (response.data.code != 200) {
        toast.error("somthing went wrong when fetching commands", {
          autoClose: 3000,
        });
      }
    })
    .catch((error) => {
      toast.error("somthing went wrong when fetching commands", {
        autoClose: 3000,
      });
    });
};
getCommands();
</script>

<style>
.pagination-container {
  display: flex;
  column-gap: 10px;
}
.paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}
.paginate-buttons:hover {
  background-color: #d8d8d8;
}
.active-page {
  background-color: #3498db;
  border: 1px solid #3498db;
  color: white;
}
.active-page:hover {
  background-color: #2988c8;
}
</style>

<style scoped lang="scss">
.tableFixedTitle {
  font-weight: bold;
}

.tableItem {
  width: 80px;
  @media (max-width: 500px) {
    width: 10px;
    font-size: 10px;
  }
}
.rows {
  display: flex;
  gap: 3rem;
  margin-left: 10px;
  @media (max-width: 500px) {
    transform: scale(85%);
    margin-left: 0%;
  }
}
.paginate {
  @media (max-width: 500px) {
    transform: scale(70%);
  }
}
.removeGap {
  position: absolute;
  top: 2%;
  right: 2%;
  font-size: 20px;
  color: var(--icons);
  cursor: pointer;
}
.removeGap:hover {
  transform: scale(120%);
}

.table {
  z-index: 1;
  display: flex;
  flex-direction: column;
  position: absolute;
  justify-content: center;
  align-items: center;
  left: 25%;
  top: 10%;
  height: 80%;
  border-radius: 20px;
  background-color: var(--background);
  width: 45%;
  border: 1px solid var(--icons);
  @media (max-width: 500px) {
    top: 27%;
    padding: 0%;
    width: 90%;
    height: 70%;
    left: 5%;
  }
}

.btnSubmit {
  cursor: pointer;
  width: 50%;
  background-color: var(--hover);
  border-radius: 10px;
  border: none;
  outline: none;
  height: 30px;
}
.submit {
  width: 80%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  display: flex;
  @media (max-width: 500px) {
    height: 30px;
    flex-direction: row;
  }
}
.hidden {
  display: none;
}
.show {
  display: flex;
  background: none;
}
</style>
