import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/routes` : 'http://localhost:8000/api/routes';
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});
export const getRoutes= () => {
   return  axios.get(API_URL, {
        headers: getAuthHeaders()
    });
};
export const addRoutes = (data) => {
    return axios.post(API_URL, data, {
        headers: getAuthHeaders()   
    })
};

export const addFares = (data) => {
    return axios.post(`${API_URL}/fares`, {data}, {
        headers: getAuthHeaders()
    })
};
export const updateRoutes = (id, data) => {
    return axios.put(`${API_URL}/${id}`, data, {
        headers: getAuthHeaders()
    })
};

export const getAllFares = () => {
    return axios.get(`${API_URL}/fares`, {
        headers: getAuthHeaders()   
    })
};  