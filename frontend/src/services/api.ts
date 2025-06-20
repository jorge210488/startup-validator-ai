import axios from "axios";

console.log("API baseURL:", process.env.NEXT_PUBLIC_API_URL); // ✅ DEBE ser http://localhost:8000/api
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default api;
