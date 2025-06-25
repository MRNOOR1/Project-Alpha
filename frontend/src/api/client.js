import axios from "axios";

const client = axios.create({
  baseURL: "/api", // thanks to the proxy
  withCredentials: true, // if you use cookies
  headers: { "Content-Type": "application/json" },
});

export default client;
