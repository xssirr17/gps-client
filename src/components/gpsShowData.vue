<script setup>
import store from "../store/index";
import axios from "../service/axiosInstance";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { watch } from "vue";
import router from "../router/index";
import { toast } from "vue3-toastify";
import dynamicTable from "./dynamicTable.vue";

const route = useRoute();
let objectData = ref({});
let mainData = ref({});
let boxStyle = ref("hidden");
let infoStyle = ref("");
let limitStyle = ref("");
let eventStyle = ref("");
let mainStyle = ref("Active");
let boxStyleLimit = ref("hidden");
let boxStyleMain = ref("container");
let boxStyleEvent = ref("hidden");
let limits = ref({});
let events = ref({});
let limitsCopy = ref({});
let eventSize = ref(0);
const getObjectData = () => {
  axios
    .post("/user/fetchObjectData", {
      object_id: route.params.objectId,
    })
    .then((response) => {
      objectData.value = response.data.objectData;
      mainData.value.gps_imei = objectData.value.gps_imei;
      mainData.value.time = objectData.value.time;
      mainData.value.gps_time = objectData.value.gps_time;
      mainData.value.server_time = objectData.value.server_time;
      mainData.value.frTime = objectData.value.server_time;
      delete objectData.value?.object_id;
      objectData.value.frTime = objectData.value.time;
      objectData.value = Object.fromEntries(
        Object.entries(objectData.value).sort((a, b) =>
          a[0].localeCompare(b[0])
        )
      );
    })
    .catch((error) => {
      console.log(error);
    });
};
const getLimits = () => {
  axios
    .post("/user/fetchLimits", {
      object_id: route.params.objectId,
    })
    .then((response) => {
      limits.value = response.data.limits;
      limitsCopy.value = JSON.parse(JSON.stringify(limits.value));
      for (let limit of limits.value) {
        limit.delete = "delete";
        limit.show = "show";
        delete limit.object_id;
        delete limit.limit_id;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
const getEvents = () => {
  axios
    .post("/user/fetchEvents", {
      object_id: route.params.objectId,
      title: "limitation_event",
    })
    .then((response) => {
      events.value = response.data.events;
      for (let event of events.value) {
        delete event.object_id;
        delete event.event_id;
      }
      events.value.sort((a, b) => {
        const timeA = new Date(a.time);
        const timeB = new Date(b.time);
        return timeB - timeA;
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
if (route.path.startsWith("/object")) {
  getObjectData();
  getLimits();
  getEvents();
}
setInterval(() => {
  if (route.path.startsWith("/object")) {
    getObjectData();
    getLimits();
    getEvents();
  }
}, 5000);

watch(
  () => route.fullPath,
  async () => {
    if (route.path.startsWith("/object")) {
      getObjectData();
      getLimits();
      getEvents();
    }
  }
);
watch(
  events,
  (newEvents) => {
    // toast.info("you have new event!");
    eventSize.value = newEvents?.length;
  },
  { deep: true }
);
watch(eventSize, () => {
  if (eventSize.value) {
    toast.info("you have new event!");
  }
});
const closeDataBox = () => {
  router.push("/");
};
const infoActive = () => {
  infoStyle.value = "Active";
  limitStyle.value = "";
  boxStyleLimit.value = "hidden";
  boxStyle.value = "container";
  eventStyle.value = "";
  boxStyleEvent.value = "hidden";
  mainStyle.value = "";
  boxStyleMain.value = "hidden";
};
const limitActive = () => {
  infoStyle.value = "";
  limitStyle.value = "Active";
  boxStyle.value = "hidden";
  boxStyleLimit.value = "containerLimit";
  eventStyle.value = "";
  boxStyleEvent.value = "hidden";
  mainStyle.value = "";
  boxStyleMain.value = "hidden";
};
const eventActive = () => {
  infoStyle.value = "";
  limitStyle.value = "";
  eventStyle.value = "Active";
  boxStyle.value = "hidden";
  boxStyleEvent.value = "containerEvent";
  boxStyleLimit.value = "hidden";
  mainStyle.value = "";
  boxStyleMain.value = "hidden";
};
const mainActive = () => {
  infoStyle.value = "";
  limitStyle.value = "";
  eventStyle.value = "";
  boxStyle.value = "hidden";
  boxStyleEvent.value = "containerEvent";
  boxStyleLimit.value = "hidden";
  mainStyle.value = "Active";
  boxStyleMain.value = "container";
};
</script>

<template>
  <div class="menus">
    <button class="menuBtn" @click="mainActive" :class="mainStyle">main</button>
    <button class="menuBtn" @click="infoActive" :class="infoStyle">
      Informations
    </button>
    <button class="menuBtn" @click="limitActive" :class="limitStyle">
      limits
    </button>
    <button class="menuBtn" @click="eventActive" :class="eventStyle">
      events
    </button>
  </div>
  <div :class="boxStyle">
    <i class="fa fa-close close" @click="closeDataBox"></i>
    <div class="data" v-for="(value, key, index) in objectData" :key="index">
      <div class="key" v-if="key != 'time' && key != 'frTime'">
        <i :class="store.state.icons[key]"></i>
        <div class="keyAndValue">
          <p>{{ key }}</p>
          <p>{{ value }}</p>
        </div>
      </div>
      <div class="key" v-if="key == 'time'">
        <i :class="store.state.icons[key]"></i>
        <div class="keyAndValue">
          <p>en date</p>
          <p>{{ new Date(value).toLocaleString("en") }}</p>
        </div>
      </div>
      <div class="key" v-if="key == 'frTime'">
        <i :class="store.state.icons['time']"></i>
        <div class="keyAndValue">
          <p>fa date</p>
          <p>{{ new Date(value).toLocaleString("fa-Ir") }}</p>
        </div>
      </div>
    </div>
  </div>
  <div :class="boxStyleLimit">
    <i class="fa fa-close close" @click="closeDataBox"></i>
    <dynamicTable
      :headers="[
        'create_at',
        'logitude',
        'latitude',
        'radius',
        'delete',
        'show',
      ]"
      :tableData="limits"
      :limits="limitsCopy"
      class="Table"
    />
  </div>

  <div :class="boxStyleEvent">
    <i class="fa fa-close close" @click="closeDataBox"></i>
    <dynamicTable
      :headers="['title', 'message', 'status', 'time']"
      :tableData="events"
      class="Table"
    />
  </div>
  <div :class="boxStyleMain">
    <i class="fa fa-close close" @click="closeDataBox"></i>
    <div class="mainData" v-for="(value, key, index) in mainData" :key="index">
      <div
        class="key"
        v-if="
          key != 'server_time' &&
          key != 'gps_time' &&
          key != 'time' &&
          key != 'frTime'
        "
      >
        <i :class="store.state.icons['gps_imei']"></i>
        <div class="keyAndValue">
          <p>gps imei</p>
          <p>{{ value }}</p>
        </div>
      </div>
      <div class="key" v-if="key == 'time'">
        <i :class="store.state.icons[key]"></i>
        <div class="keyAndValue">
          <p>gps time</p>
          <p>{{ new Date(value).toLocaleString("en") }}</p>
        </div>
      </div>
      <div class="key" v-if="key == 'gps_time'">
        <i :class="store.state.icons['time']"></i>  
        <div class="keyAndValue">
          <p>gps fa time</p>
          <p>{{ new Date(value).toLocaleString("fa-Ir") }}</p>
        </div>
      </div>
      <div class="key" v-if="key == 'frTime'">
        <i :class="store.state.icons['time']"></i>
        <div class="keyAndValue">
          <p>server fa time</p>
          <p>{{ new Date(value).toLocaleString("fa-Ir") }}</p>
        </div>
      </div>
      <div class="key" v-if="key == 'server_time'">
        <i :class="store.state.icons['time']"></i>
        <div class="keyAndValue">
          <p>server time</p>
          <p>{{ new Date(value).toLocaleString("en") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hidden {
  display: none;
}
.Table {
  margin-top: 40px;
  width: auto;
}
.show {
  display: flex;
  background: none;
}
p {
  font-size: 60%;
}
.Active {
  // transform: scale(140%);
  border: 3px solid green;
  // margin-left: 6%;
  // margin-right: 6%;
}
.close {
  position: absolute;
  top: 3%;
  z-index: 3;
  right: 1%;
  cursor: pointer;
  @media (max-width: 500px) {
    right: 3%;
  }
}
.removeLimit:hover {
  color: red;
}
.showLimit:hover {
  color: green;
}
.menus {
  display: flex;
  z-index: 3;
  position: absolute;
  bottom: 42%;
  left: 21%;
  gap: 0.2rem;
  @media (max-width: 500px) {
    left: 0%;
    bottom: 80%;
    gap: 0.1rem;
  }
}

.menuBtn {
  padding: 0.6rem;
  width: 120px;
  background-color: var(--background);
  border-radius: 0px 25px 0px 0px;
  border-bottom: none;
  outline: none;
  cursor: pointer;
  color: var(--text);
  @media (max-width: 500px) {
    width: 80px;
    padding: 0.3rem;
    font-size: 10px;
    border-radius: 0px 15px 0px 0px;
  }
}
.container {
  z-index: 2;
  padding: 1%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: absolute;
  justify-content: flex-start;
  align-items: center;
  bottom: 0;
  right: 0;
  left: 21%;
  background-color: var(--background);
  height: 38%;
  gap: 2%;
  overflow-y: scroll;
  transition: all 1s ease;
  @media (max-width: 500px) {
    border: 1px solid var(--icons);
    z-index: 3;
    position: absolute;
    left: 0%;
    right: 0%;
    width: auto;
    top: 20%;
    height: 70%;
    background-color: var(--background);
    font-size: 12px;
    border-radius: 8px;
    overflow: scroll;
  }
}

.containerLimit {
  z-index: 2;
  padding: 1%;
  display: flex;
  position: absolute;
  flex-direction: column;
  bottom: 0;
  right: 0;
  left: 21%;
  background-color: var(--background);
  height: 38%;
  gap: 2%;
  overflow-y: scroll;
  transition: all 1s ease;
  @media (max-width: 500px) {
    border: 1px solid var(--icons);
    z-index: 3;
    position: absolute;
    left: 0%;
    right: 0%;
    width: auto;
    top: 20%;
    height: 70%;
    background-color: var(--background);
    font-size: 12px;
    border-radius: 8px;
    overflow: scroll;
  }
}

.containerEvent {
  z-index: 2;
  padding: 1%;
  display: flex;
  position: absolute;
  flex-direction: column;
  bottom: 0;
  right: 0;
  left: 21%;
  background-color: var(--background);
  height: 38%;
  gap: 2%;
  overflow-y: scroll;
  transition: all 1s ease;
  @media (max-width: 500px) {
    border: 1px solid var(--icons);
    z-index: 3;
    position: absolute;
    left: 0%;
    right: 0%;
    width: auto;
    top: 20%;
    height: 70%;
    background-color: var(--background);
    font-size: 12px;
    border-radius: 8px;
    overflow: scroll;
  }
}

.itemEvent {
  width: 300px;
  @media (max-width: 500px) {
    max-width: 60px;
    font-size: 8px;
  }
}
.indexEvent {
  width: 90px;
  @media (max-width: 500px) {
    width: 30px;
  }
}

.dataLimit {
  color: var(--text);
  display: flex;
  flex-direction: row;
  cursor: pointer;
  justify-content: flex-start;
  padding: 2%;
  padding-left: 0%;
  width: 100%;
  border-bottom: 1px solid var(--text);
  @media (max-width: 500px) {
    width: 90%;
    gap: 0.8rem;
    margin-top: 15px;
  }
}
.item {
  width: 180px;
  @media (max-width: 500px) {
    max-width: 30px;
    font-size: 8px;
  }
}
.index {
  @media (max-width: 500px) {
    max-width: 5px;
  }
}

.keyAndValue {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
i {
  color: var(--icons);
  font-size: 20px;
}
.data {
  gap: 1rem;
  color: var(--text);
  display: flex;
  cursor: pointer;
  width: 17%;
  height: 25px;
  padding: 0.5%;
  border-bottom: 1px solid var(--text);
  @media (max-width: 500px) {
    width: 90%;
    margin-top: 15px;
  }
}
.mainData {
  gap: 1rem;
  color: var(--text);
  display: flex;
  cursor: pointer;
  width: 30%;
  height: 25px;
  padding: 0.5%;
  border-bottom: 1px solid var(--text);
  @media (max-width: 500px) {
    width: 90%;
    margin-top: 5px;
  }
}
.key {
  font-size: 19px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
}
.keyLimit {
  display: flex;
  flex-direction: row;
  @media (max-width: 500px) {
    gap: 0.8rem;
  }
}
.dataLimit:hover {
  background-color: var(--hover);
  border: none;
  border-radius: 10px;
}

.data:hover {
  background-color: var(--hover);
  border: none;
  border-radius: 10px;
}
.mainData:hover {
  background-color: var(--hover);
  border: none;
  border-radius: 10px;
}
</style>
