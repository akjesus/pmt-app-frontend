import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const AUTH_URL = `${API_URL}/auth`;
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const login =  (username, password) => {
    return axios.post(`${AUTH_URL}/login`, { username, password });
};

export const logout = () => {
  return axios.post(`${AUTH_URL}/logout`);
};

export const forgotPassword = (email) => {
  return axios.post(`${AUTH_URL}/forgot-password`, { email });
};

export const getUsers = () => {
  return axios.get(`${AUTH_URL}/users`, {
    headers: getAuthHeaders()
  });
};

export const addUser = (userData) => {
  return axios.post(`${AUTH_URL}/register`, userData, {
    headers: getAuthHeaders()
  });
}