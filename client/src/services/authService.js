import api from '../utils/api';

export const loginUser = async (email, password, role) => {
  try {
    const response = await api.post('/auth/login', { email, password, role });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { user, token };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data.user;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
