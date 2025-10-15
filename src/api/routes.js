import axios from 'axios';

const API_URL = 'http://localhost:8000/api/routes';

export const getRoutes= () => {
   return  axios.get(API_URL, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};
export const addRoutes = (data) => {
    return axios.post(API_URL, data, {
        headers : {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
};

export const addFares = (data) => {
    return axios.post(`${API_URL}/fares`, {data}, {
        headers : {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
};

export const getAllFares = () => {
    return axios.get(`${API_URL}/fares`, {
        headers : {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
}