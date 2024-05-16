<template>
  <i :class="tabStyle" aria-hidden="true" @click="closeTab"></i>
  <div :class="container">
    <div class="search">
      <input
        type="text"
        placeholder="To add object enter IMEI"
        v-model="imei"
      />
      <button class="addObject" @click="addObject">
        <i class="fa fa-add"></i>
      </button>
      <a href="/" class="addObject"><i class="fa fa-refresh"></i></a>
    </div>
    <div class="scroll">
      <div class="titleIconsOfTable titleItem">
        <i :class="showAllOrNotStyle" @click="showAllObjects"></i>
        <i class="fa-solid fa-shoe-prints titleItem"></i>
        <i class="fa fa-server server titleItem" aria-hidden="true"></i>
        <p class="totals titleItem">
          Totals: <strong>{{ objects?.length }}</strong>
        </p>

        <p class="totals">
          Actives: <strong>{{ totalActives }}</strong>
        </p>
        <p class="totals">
          Subscription: <strong>{{ subscription }}</strong>
        </p>
      </div>
      <div
        v-for="(item, index) in objects"
        :key="index"
        :class="activeOrNot[index] || 'objectsFirst'"
      >
        <input
          type="checkbox"
          class="checkShow"
          v-model="showPositionOnMap[index]"
        />
        <input
          type="checkbox"
          class="checkShow"
          v-model="showPositionOnMap1[index]"
          @click="zoomToPoint(index)"
        />
        <div
          class="objects"
          @click="
            objectShowPositionAndData(item.object_id, item.gps_imei, index)
          "
        >
          <i
            v-if="
              item.engin_status == 'on' &&
              item.status == 'enable' &&
              item.priority == 1 &&
              item.satellites >= 3
            "
            :class="store.state.icons[item.type]"
            style="color: green"
            class="objectLogo"
          ></i>
          <i
            v-else
            :class="store.state.icons[item.type]"
            class="objectLogo"
          ></i>
          <div class="time">
            <p class="item1">
              {{ item.gps_imei }}
              <label
                for=""
                :class="
                  remainHoursStyle[index] ? 'remainHours' : 'remainHours-red'
                "
                >{{
                  parseInt(item.remainHours / 24) < 0
                    ? 0
                    : parseInt(item.remainHours / 24)
                }}
                days</label
              >
            </p>
            <p class="item1" v-if="item.status == 'enable'">
              {{ new Date(item.time).toLocaleString("fa-Ir") }}
            </p>
          </div>
          <p class="item1" v-if="item.status == 'enable'">
            {{ item.speed }} kph
          </p>
          <i
            class="fa fa-wifi item1"
            v-if="
              item.engin_status == 'on' &&
              item.status == 'enable' &&
              item.priority != 3
            "
            style="color: green"
          ></i>
          <i
            class="fa fa-wifi item1"
            v-else
            style="color: red"
            v-if="item.engin_status == 'off' && item.status == 'enable'"
          ></i>
          <i
            class="fa fa-exclamation-circle"
            v-if="
              item.engin_status == 'on' &&
              item.status == 'enable' &&
              item.priority == 3
            "
            style="color: green"
          >
          </i>
          <p v-if="item.status == 'disable'" class="label">Inactive</p>
        </div>
      </div>
      <div :class="edit">
        <router-link
          :to="'/object/' + objectId"
          class="editItem"
          @click="dataObj"
        >
          <i class="fa fa-desktop" aria-hidden="true"></i>data</router-link
        >
        <router-link to="" class="editItem" @click="editObj">
          <i class="fa fa-edit"></i>edit
        </router-link>
        <router-link :to="'/history/' + objectId" class="editItem">
          <i class="fa fa-history" aria-hidden="true"></i>history
        </router-link>
        <router-link to="" class="editItem" @click="removeObject">
          <i class="fa fa-trash"></i>delete
        </router-link>
        <router-link :to="'/sendCommand/' + editGpsImei" class="editItem">
          <i class="fa fa-paper-plane" aria-hidden="true"></i>command
        </router-link>
        <router-link to="" class="editItem" @click="activeOrInactive">
          <i class="fa fa-power-off"></i>off/on
        </router-link>
        <router-link :to="'/charging/' + objectId" class="editItem"
          ><i class="fa fa-usd"></i>charging</router-link
        >
        <router-link to="" class="editItem" @click="DrawComponent">
          <i :class="DrawStyle"></i>limitation
        </router-link>
        <router-link to="" class="editItem" @click="closeEdit">
          <i class="fa fa-remove removeGap"></i>
        </router-link>
      </div>
    </div>
  </div>
  <div :class="DrawContainer">
    <div class="DrawCenter">
      <p>Do you want to add limit for this object?</p>
      <div class="DrawButtoms">
        <button @click="addLimit" class="drawBtn">YES</button>
        <button @click="cancle" class="drawBtn">NO</button>
      </div>
    </div>
  </div>
  <mapOpen
    :objects="objects"
    :showPositionOrNot="showPositionOnMap"
    :zoomOnPosition="zoomOnPosition"
    :vector="vector"
    :isVector="isVector"
    :isDraw="isDraw"
    :removeDraw="removeDraw"
    :addLimit="addLimitToStorage"
    :isShowLimit="isShowLimit"
    :showLimitObject="showLimitObject"
  />
</template>

<script setup>
import { ref, defineEmits } from "vue";
import axios from "../service/axiosInstance";
import store from "../store/index";
import { useRoute } from "vue-router";
import router from "../router";
import mapOpen from "./mapOpen.vue";
import { watch } from "vue";
import { toast } from "vue3-toastify";
import { computed } from "vue";

const emit = defineEmits(["showPosition"]);
let activeOrNot = ref([]);
const showAllOrNotStyle = ref("fa-solid fa-eye  titleItem");
let objects = ref();
const tabStyle = ref("fa fa-angle-double-right openTab");
const container = ref("mobileHidden");
const editGpsImei = ref();
const user_id = ref(localStorage.getItem("user_id"));
const edit = ref("hidden");
const route = useRoute();
const objectId = ref();
const totalActives = ref(0);
const isAllShowOrNot = ref(true);
let remainHoursStyle = ref([]);
let zoomOnPosition = ref({});
let showPositionOnMap = ref([]);
let showPositionOnMap1 = ref([]);
let subscription = ref(0);
let vector = ref([]);
let isVector = ref(false);
let DrawStyle = ref("fa-solid fa-expand");
let isDraw = ref(false);
let removeDraw = ref(false);
let DrawContainer = ref("hidden");
let addLimitToStorage = ref(false);
activeOrNot.value.length = objects.value?.length ?? 0;
showPositionOnMap.value.length = objects.value?.length ?? 0;
showPositionOnMap1.value.length = objects.value?.length ?? 0;
let showLimitObject = ref({});
let isShowLimit = ref(false);

const DrawComponent = () => {
  closeTab();
  if (DrawStyle.value == "fa-solid fa-expand") {
    router.push("/draw");
    DrawStyle.value = "fa fa-stop";
    isDraw.value = true;
  } else {
    router.push("/");
    DrawContainer.value = "DrawContainer";
    container.value = "mobileHidden";
    DrawStyle.value = "fa-solid fa-expand";
    isDraw.value = false;
  }
};

const cancle = () => {
  DrawContainer.value = "hidden";
  removeDraw.value = true;
};
const addLimit = () => {
  addLimitToStorage.value = true;
  setTimeout(() => {
    let centerCoords = localStorage.getItem("centerCoords");
    centerCoords = JSON.parse(centerCoords);
    let radius = localStorage.getItem("radius");
    if (objectId.value) {
      axios
        .post("/user/addLimit", {
          longitude: centerCoords[0],
          latitude: centerCoords[1],
          radius: JSON.parse(radius),
          object_id: objectId.value,
        })
        .then((response) => {
          if (response.data.code != 200) {
            toast.error("somthing went wrong when adding limit to object", {
              autoClose: 3000,
            });
          } else if (response.data.code == 200) {
            toast.success("object limited successfully", {
              autoClose: 3000,
            });
          }
        })
        .catch((error) => {
          toast.error("somthing went wrong", {
            autoClose: 3000,
          });
        });
    }
    localStorage.removeItem("centerCoords");
    localStorage.removeItem("radius");
    cancle();
  }, 1000);
};
const activeOrInactive = () => {
  let status;
  for (let i = 0; i < objects.value.length; i++) {
    if (objects.value[i].object_id == objectId.value) {
      status = objects.value[i].status;
      break;
    }
  }
  if (status == "disable") {
    axios
      .post("/user/enableObject", {
        object_id: objectId.value,
        gps_imei: editGpsImei.value,
      })
      .then((response) => {
        if (response.data.code != 200) {
          toast.error("somthing went wrong when enabling object", {
            autoClose: 3000,
          });
        } else if (response.data.code == 200) {
          toast.success("object enabled successfully", {
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        toast.error("somthing went wrong", {
          autoClose: 3000,
        });
      });
  } else {
    axios
      .post("/user/disableObject", {
        object_id: objectId.value,
        gps_imei: editGpsImei.value,
      })
      .then((response) => {
        if (response.data.code != 200) {
          toast.error("somthing went wrong when disabling object", {
            autoClose: 3000,
          });
        } else if (response.data.code == 200) {
          toast.success("object disabled successfully", {
            autoClose: 3000,
          });
        }
      })
      .catch((error) => {
        toast.error("somthing went wrong", {
          autoClose: 3000,
        });
      });
  }
};

watch(showPositionOnMap1.value, () => {
  for (let i = 0; i < showPositionOnMap1.value.length; i++) {
    showPositionOnMap.value[i] = showPositionOnMap1.value[i];
  }
});
watch(route, () => {
  if (route.path.startsWith("/showLimit")) {
    isShowLimit.value = true;
    showLimitObject.value.longitude = route.params.longitude;
    showLimitObject.value.latitude = route.params.latitude;
    showLimitObject.value.radius = route.params.radius;
    for (let i = 0; i < showPositionOnMap1.value.length; i++) {
      showPositionOnMap1.value[i] = false;
    }
    zoomOnPosition.value.long = undefined;
    zoomOnPosition.value.lat = undefined;
    zoomOnPosition.value.index = undefined;
  } else {
    isShowLimit.value = false;
    showLimitObject.value = {};
  }
  if (route.path != "/") {
    container.value = "mobileHidden";
    tabStyle.value = "fa fa-angle-double-right openTab";
  }
});
watch(route, (newRoute, oldRoute) => {
  if (newRoute.path == "/showGraph") {
    let history = localStorage.getItem("history");
    history = JSON.parse(history);
    localStorage.removeItem("history");
    for (let i = 0; i < history.length; i++) {
      vector.value.push([
        parseFloat(history[i][0]),
        parseFloat(history[i][1]),
        parseFloat(history[i][2]),
      ]);
    }
    isVector.value = true;
  } else {
    isVector.value = false;
  }
});

const showAllObjects = () => {
  if (isAllShowOrNot.value) {
    for (let i = 0; i < objects.value.length; i++) {
      showPositionOnMap.value[i] = true;
    }
    isAllShowOrNot.value = false;
    showAllOrNotStyle.value = "fa-solid fa-eye-slash titleItem";
  } else {
    for (let i = 0; i < objects.value.length; i++) {
      showPositionOnMap.value[i] = false;
    }
    isAllShowOrNot.value = true;
    showAllOrNotStyle.value = "fa-solid fa-eye titleItem";
  }
};

const zoomToPoint = (index) => {
  for (let i = 0; i < showPositionOnMap1.value.length; i++) {
    showPositionOnMap1.value[i] = false;
  }
  showPositionOnMap1.value[index] = true;
  if (zoomOnPosition.value.long && zoomOnPosition.value.index == index) {
    zoomOnPosition.value.long = undefined;
    zoomOnPosition.value.lat = undefined;
    zoomOnPosition.value.index = undefined;
  } else {
    setInterval(() => {
      if (zoomOnPosition.value.index != index) {
        return;
      }
      zoomOnPosition.value.long = objects.value[index].longitude;
      zoomOnPosition.value.lat = objects.value[index].latitude;
    }, 100);
    zoomOnPosition.value.index = index;
  }
};

const objectShowPositionAndData = (object_id, imei, index) => {
  objectId.value = object_id;
  editGpsImei.value = imei;
  edit.value = "edit";
  for (let i = 0; i < activeOrNot.value.length; i++) {
    activeOrNot.value[i] = "objectsFirst";
  }
  activeOrNot.value[index] = "objectsFirstActive";
  router.push("/");
};
const closeTab = () => {
  if (tabStyle.value == "fa fa-angle-double-left closeTab") {
    container.value = "mobileHidden";
    tabStyle.value = "fa fa-angle-double-right openTab";
  } else {
    container.value = "container";
    tabStyle.value = "fa fa-angle-double-left closeTab";
    router.push("/");
  }
};

const getObjects = () => {
  if (user_id.value) {
    axios
      .post("/user/fetchUserObject", {
        user_id: user_id.value,
      })
      .then((response) => {
        objects.value = response.data.objectsData;
        subscription.value = 0;
        remainHoursStyle.value.length = 0;
        remainHoursStyle.value.length = objects.value.length;
        for (let i = 0; i < objects.value.length; i++) {
          if (objects.value[i].remainHours > 0) {
            subscription.value++;
          }
          if (parseFloat(objects.value[i].remainHours / 24) > 0) {
            remainHoursStyle.value[i] = true;
          } else {
            remainHoursStyle.value[i] = false;
          }
          if (objects.value[i].remainHours <= 60 * 60 * 24 * 5) {
            activeOrNot[i] = "objectsFirst";
          }
        }

        totalActives.value = 0;
        for (let i = 0; i < objects.value?.length; i++) {
          if (objects.value[i].status == "enable") {
            totalActives.value++;
          }
        }
        for (let i = 0; i < objects.value?.length; i++) {
          for (let j = 0; j < objects.value?.length; j++) {
            if (objects.value[i].gps_imei < objects.value[j].gps_imei) {
              [objects.value[i], objects.value[j]] = [
                objects.value[j],
                objects.value[i],
              ];
            }
          }
        }
      })
      .catch((error) => {
        toast.error("somthing went wrong when fetchig objects", {
          autoClose: 3000,
        });
      });
  }
};
getObjects();

setInterval(() => {
  getObjects();
}, 1000);
const imei = ref();
const addObject = () => {
  axios
    .post("/user/addObject", {
      user_id: user_id.value,
      gps_imei: imei.value,
    })
    .then((response) => {
      objects.value.push({
        user_id: user_id.value,
        gps_imei: imei.value,
      });
      if (response.data.code == 200) {
        toast.success("object added successfully", { autoClose: 3000 });
      } else {
        toast.error("somthing went wrong when adding object", {
          autoClose: 3000,
        });
      }
    })
    .catch((error) => {
      toast.error("somthing went wrong when adding object", {
        autoClose: 3000,
      });
    });
};
const closeEdit = () => {
  edit.value = "hidden";
  router.push("/");
  for (let i = 0; i < activeOrNot.value.length; i++) {
    activeOrNot.value[i] = "objectsFirst";
  }
};
const removeObject = () => {
  localStorage.setItem("object_id", objectId.value);
  localStorage.setItem("gps_imei", editGpsImei.value);
  router.push("/removeObject");
};
const editObj = () => {
  container.value = "mobileHidden";
  tabStyle.value = "fa fa-angle-double-right openTab";
  router.push("/editobject/" + objectId.value);
};
const dataObj = () => {
  container.value = "mobileHidden";
  tabStyle.value = "fa fa-angle-double-right openTab";
};
</script>

<style scoped lang="scss">
.editItem {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  width: 100px;
  margin-left: 10px;
  @media (max-width: 500px) {
    font-size: 10px;
    width: 70px;
  }
}
.Toastify__toast-container {
  z-index: 20;
}
.totals {
  font-size: 60%;
}
.checkShow {
  width: 5%;
  @media (max-width: 500px) {
    width: 7.5%;
  }
}
.hidden {
  display: none;
}
// .titleItem {
//   border-right: 1px solid var(--text);
// }
p {
  font-size: 70%;
}
.item1 {
  display: flex;
  justify-content: space-between;
}
.remainHours {
  background-color: green;
  border-radius: 10px;
  padding: 5px;
  color: white;
}
.remainHours-red {
  background-color: rgb(207, 16, 9);
  border-radius: 10px;
  padding: 5px;
  color: white;
}
.label {
  background-color: red;
  padding: 2px;
  border-radius: 7px;
}
.show {
  display: flex;
  background: none;
}

.titleIconsOfTable {
  background-color: var(--hover);
  display: flex;
  height: 30px;
  align-items: center;
  border-radius: 5px;
  gap: 0.4rem;
  margin-left: 3px;
  padding-left: 6px;
}
.closeTab {
  @media (max-width: 500px) {
    z-index: 20;
    cursor: pointer;
    position: absolute;
    left: 77%;
    top: 6.2%;
    background-color: var(--background);
    font-size: 35px;
    border-radius: 8px;
  }
}
.openTab {
  @media (max-width: 500px) {
    z-index: 20;
    position: absolute;
    cursor: pointer;
    left: 1%;
    top: 6.2%;
    background-color: var(--background);
    font-size: 35px;
    border-radius: 8px;
  }
}
.showEdit {
  display: flex;
  position: absolute;
  top: 10%;
  left: 20%;
}
.removeGap {
  margin-top: 20px;
}
.hidden {
  display: none;
}
.mobileHidden {
  @media (max-width: 500px) {
    display: none;
  }
  width: 20%;
  z-index: 4;
  position: absolute;
  top: 4.1%;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding-top: 3%;
  padding-left: 1%;
  gap: 2rem;
  align-items: flex-start;
  background-color: var(--background);
}
.edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  background-color: var(--background);
  width: 120px;
  border-radius: 5px 10px 50px 5px;
  position: absolute;
  padding: 3% 0% 3% 0%;
  left: 101%;
  border: 1px solid var(--icons);
  top: 2%;
  @media (max-width: 500px) {
    border: 1px solid var(--icons);
    top: 14%;
    width: 90px;
    overflow: hidden;
  }
}
.edit i {
  cursor: pointer;
}
.edit i:hover {
  transform: scale(120%);
}

.scroll {
  overflow-y: scroll;
  overflow-x: hidden;
  width: 99%;
  margin-left: -3%;
}
.objectLogo {
  width: 20px;
}

.container {
  width: 20%;
  z-index: 4;
  position: absolute;
  top: 4.1%;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding-top: 3%;
  padding-left: 1%;
  gap: 2rem;
  align-items: flex-start;
  background-color: var(--background);
  border-right: 1px solid var(--icons);
  @media (max-width: 500px) {
    width: 75%;
    border-right: 1px solid var(--icons);
    top: 0;
  }
}
.addObject {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.addObject:hover {
  transform: scale(150%);
}
i {
  font-size: 20px;
  color: var(--icons);
}
.search {
  display: flex;
  flex-direction: row;
  margin-left: -1%;
  gap: 1rem;
  width: 93%;
  @media (max-width: 500px) {
    margin-top: 13%;
  }
}
input {
  width: 100%;
  height: 25px;
  outline: none;
  background: var(--hover);
  border: 1px solid var(--icons);
  border-radius: 4px;
}
input::placeholder {
  color: var(--text);
}
.objects {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  padding-left: 2%;
  gap: 2%;
}
.objectsFirst {
  width: 97%;
  display: flex;
  margin-left: 1%;
  flex-direction: row;
  align-items: center;
  border-top: 1px dotted var(--text);
  cursor: pointer;
  padding-left: 2%;
  margin-top: 1%;
  gap: 0.4rem;
  max-height: 45px;
}
.objectsFirstActive {
  width: 97%;
  margin-top: 1%;
  display: flex;
  margin-left: 1%;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  padding-left: 2%;
  background-color: var(--hover);
  border-radius: 10px;
  gap: 0.4rem;
  max-height: 45px;
}
.objectsFirst:hover {
  background-color: var(--hover);
}

.time {
  line-height: 5px;
  font-size: 15px;
  width: 60%;
}
.bars {
  background: none;
  border: none;
  cursor: pointer;
}
.bars:hover {
  transform: scale(150%);
}
* {
  text-decoration: none;
  color: var(--text);
}
.DrawContainer {
  transition: all 1s ease;
  border-radius: 20px;
  position: absolute;
  left: 30%;
  top: 16%;
  z-index: 13;
  width: 20%;
  height: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background);
  border: 1px solid var(--icons);
  @media (max-width: 500px) {
    border-radius: 10px;
    position: absolute;
    left: 0%;
    top: 16%;
    z-index: 13;
    width: auto;
    right: 0%;
    height: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--background);
  }
}
.DrawCenter {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 22px;
}
.DrawButtoms {
  justify-content: center;
  align-items: center;
  width: 90%;
  display: flex;
  gap: 10%;
}

.drawBtn {
  width: 40%;
  cursor: pointer;
  height: 25px;
  outline: none;
  background: $hover;
  border: 1px solid var(--icons);
  border-radius: 4px;
  @media (max-width: 500px) {
    width: 45%;
  }
}

.DrawButtoms::placeholder {
  color: var(--text);
  padding-left: 10px;
}
</style>
