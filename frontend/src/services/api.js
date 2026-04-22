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

export const getDoctorsByCity = (city, params = {}) =>
  API.get("/doctors", {
    params: {
      city,
      ...params,
    },
  });

export const getRemedySuggestions = (data) => API.post("/remedy/suggest", data);

export const saveCycleLog = (data) => API.post("/cycle/log", data);
export const getCycleLogs = () => API.get("/cycle/logs");
export const deleteCycleLog = (id) => API.delete(`/cycle/log/${id}`);

// Risk Prediction
export const getRiskPrediction = () => API.get("/risk/predict");
