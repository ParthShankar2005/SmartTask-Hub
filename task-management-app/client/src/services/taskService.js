import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const getTasks = async () => {
  const response = await axios.get(`${API_BASE_URL}/tasks`);
  return response.data;
};

const createTask = async (taskPayload, token) => {
  const response = await axios.post(`${API_BASE_URL}/tasks`, taskPayload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export { getTasks, createTask };
