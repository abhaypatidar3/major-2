import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

export const registerUser = (formData) => API.post("/user/register", formData);
export const loginUser = (formData) => API.post("/user/login", formData);
export const logoutUser = () => API.get("/user/logout");
export const getProfile = () => API.get("/user/me");
export const updateProfile = (formData) => API.put("/user/profile", formData);

export const getAllSymptoms = () => API.get("/symptoms");
export const getSymptomById = (id) => API.get(`/symptoms/${id}`);

export const chatWithSyncoraAI = (message, history) =>
  API.post("/ai/chat", { message, history });

export const getJustdialGynaecologists = (city) =>
  API.get(`/gynaecologists/justdial?city=${encodeURIComponent(city)}`);
