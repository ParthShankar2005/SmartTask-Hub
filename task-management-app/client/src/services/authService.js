import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const registerUser = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, payload);
  return response.data;
};

const loginUser = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, payload);
  return response.data;
};

export { registerUser, loginUser };
