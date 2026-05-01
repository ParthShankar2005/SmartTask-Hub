import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";
const getAuthHeaders = (token) => (token ? { Authorization: `Bearer ${token}` } : {});
const isUnauthorizedError = (error) => error?.response?.status === 401;

const getTasks = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/tasks`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

const addTask = async (taskPayload, token) => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, taskPayload, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

const updateTask = async (taskId, taskPayload, token) => {
  const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskPayload, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

const deleteTask = async (taskId, token) => {
  const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export { getTasks, addTask, updateTask, deleteTask, isUnauthorizedError };
