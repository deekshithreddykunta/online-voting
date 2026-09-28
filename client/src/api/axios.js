import axios from "axios";

const API = axios.create({
  baseURL: "https://online-voting-qss7.onrender.com/api",
  withCredentials: true,
});

export default API;