import axios from "axios";
import { Config } from "../Config";

// Prefer Vite env; fallback to localhost
const baseURL = Config.BASE_URL || "http://localhost:3000";

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
