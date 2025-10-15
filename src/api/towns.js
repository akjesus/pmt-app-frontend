// src/api/departments.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:30000/api';
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getTowns = () => {
    return axios.get(`${API_URL}/towns`, {
        headers: getAuthHeaders()
    });
};
export const addTown = (data) => {
    return axios.post(`${API_URL}/towns`, data, {
        headers: getAuthHeaders()
    });
};
export const updateTown = (id, data) => {
    return axios.put(`${API_URL}/towns/${id}`, data, {
        headers: getAuthHeaders()
    });
};
export const deleteTown = (id) => {
    return axios.delete(`${API_URL}/towns/${id}`, {
        headers: getAuthHeaders()
    });
};
