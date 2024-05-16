import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3PersianDatetimePicker from "vue3-persian-datetime-picker";
import "../public/style.css";
import "vue3-toastify/dist/index.css";
import axios from "axios";
import VueAxios from "vue-axios";
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";
// import Vue3Toastify from "vue3-toastify";

axios.defaults.withCredentials = true;

const app = createApp(App);
// app.use(Vue3Toastify, {
//   autoClose: 3000,
// });

app.use(VueAwesomePaginate);
app.use(Vue3PersianDatetimePicker, {
  name: "CustomDatePicker",
});
app.use(VueAxios, axios);
app.use(router);

app.mount("#app");
