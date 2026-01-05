import axios from "axios";

const http = axios.create({
  baseURL:  "https://ml-backend-0dqu.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default http;
// import.meta.env.VITE_API_URL ||