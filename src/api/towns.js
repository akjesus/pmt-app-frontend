// src/api/departments.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/towns';

export const getTowns = () => {
    const token = localStorage.getItem('token');
    return axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
export const addTown = (data) => {
    const token = localStorage.getItem('token');
    return axios.post(API_URL, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
export const updateTown = (id, data) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
export const deleteTown = (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};  
