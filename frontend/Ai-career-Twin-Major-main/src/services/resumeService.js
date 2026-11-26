import axios from "axios";
import API from "./api.js";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API}/api/resume/upload`,
    formData,
    getAuthConfig()
  );

  return response.data;
};

export const analyzeResume = async (resumeId) => {
  const response = await axios.post(
    `${API}/api/resume/${resumeId}/analyze`,
    {},
    getAuthConfig()
  );

  return response.data;
};

export const getResumeAnalysis = async (resumeId) => {
  const response = await axios.get(
    `${API}/api/resume/${resumeId}`,
    getAuthConfig()
  );

  return response.data;
};

export const getResumeHistory = async () => {
  const response = await axios.get(
    `${API}/api/resume/history`,
    getAuthConfig()
  );

  return response.data;
};