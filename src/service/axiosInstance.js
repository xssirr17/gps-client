import axios from "axios";

const instance = axios.create({
  baseURL: "http://45.89.236.151:8080",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

export default instance;
