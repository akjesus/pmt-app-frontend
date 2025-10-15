import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

export const login =  (username, password) => {
    return axios.post(`${API_URL}/login`, { username, password });
};

export const logout = () => {
  return axios.post(`${API_URL}/logout`);
};

export const forgotPassword = (email) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

export const getUsers = () => {
  return axios.get(`${API_URL}/users`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const addUser = (userData) => {
  return axios.post(`${API_URL}/register`, userData, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}