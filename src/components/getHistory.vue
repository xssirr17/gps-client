<template>
  <div :class="container">
    <i class="fa fa-remove removeGap" @click="closeEdit"></i>
    <div :class="configs">
      <div class="boxConfigs">
        <custom-date-picker
          v-model="date"
          color="gray"
          placeholder="select time duration"
          range
          clearable
          format="YYYY-MM-DD"
        ></custom-date-picker>
        <div class="submit">
          <button class="btnSubmit" @click="getHistory">Get History</button>
          <button :class="btn" @click="showHistory">Show</button>
        </div>
      </div>
    </div>
  </div>
  <div :class="tableStyle">
    <DynamicTable
      :headers="[
        'time',
        'longitude',
        'latitude',
        'altitude',
        'angle',
        'satellites',
        'speed',
      ]"
      :tableData="history?.slice(cur - 1, cur + 5)"
    />
    <vue-awesome-paginate
      class="paginate"
      :total-items="totalItems"
      :items-per-page="6"
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
import DynamicTable from "./dynamicTable.vue";

const date = ref([]);
const history = ref([]);
const configs = ref("configs");
const route = useRoute();
const btn = ref("hidden");
const container = ref("container");
const cur = ref(1);
const totalItems = ref(0);
const tableStyle = ref("hidden");
const closeEdit = () => {
  router.push("/");
};
const showHistory = () => {
  let History = [];
  for (let i = 0; i < history.value.length; i++) {
    History.push([history.value[i].longitude, history.value[i].latitude,history.value[i].angle]);
  }
  localStorage.setItem("history", JSON.stringify(History));
  router.push("/showGraph");
};
const getHistory = () => {
  if (!date.value[0] || !date.value[1]) {
    toast.error("Please select a range", {
      autoClose: 3000,
    });
    return
  }
  axios
    .post("/user/fetchHistory", {
      object_id: route.params.object_id,
      startDate: date.value[0],
      endDate: date.value[1],
    })
    .then((response) => {
      console.log(response);
      tableStyle.value = "table";
      history.value = response.data.history;
      totalItems.value = history.value.length;
      if (!history.value.length) {
        toast.error("history is emplty", {
          autoClose: 3000,
        });
      } else if (response.data.code != 200) {
        toast.error("somthing went wrong when fetching history", {
          autoClose: 3000,
        });
      } else {
        btn.value = "btnSubmit";
      }
    })
    .catch((error) => {
      toast.error("somthing went wrong when fetching history", {
        autoClose: 3000,
      });
    });
};
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
* {
  transition: all 1s ease;
}
.hidden {
  display: none;
}
.map {
  display: none;
}
.mapAcitve {
  display: flex;
  z-index: 15;
}
.paginate {
  @media (max-width: 500px) {
    transform: scale(70%);
  }
}
.table {
  z-index: 1;
  display: flex;
  flex-direction: column;
  position: absolute;
  justify-content: center;
  align-items: center;
  left: 30%;
  top: 31%;
  border-radius: 20px;
  width: 65%;
  @media (max-width: 500px) {
    top: 17%;
    padding: 0%;
    right: 0%;
    height: 70%;
    width: auto;
    left: 0%;
  }
}

.configs {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
  @media (max-width: 500px) {
    width: 100%;
  }
}
.boxConfigs {
  width: 50%;
  padding: 5%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  align-items: center;
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
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 30%;
  top: 10%;
  bottom: 0;
  max-height: 20%;
  border-radius: 20px;
  background-color: var(--background);
  width: 25%;
  border: 1px solid var(--icons);
  @media (max-width: 500px) {
    border: 1px solid var(--icons);
    z-index: 3;
    position: absolute;
    left: 0%;
    right: 0%;
    width: auto;
    top: 15%;
    height: 17%;
    background-color: var(--background);
    font-size: 12px;
    border-radius: 8px;
  }
}
</style>
