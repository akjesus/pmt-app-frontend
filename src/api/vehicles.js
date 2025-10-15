import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/vehicles` : "http://localhost:30000/api/vehicles";
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});
export const getVehicles =() => {
  return axios.get(API_URL, {
    headers: getAuthHeaders()
  });
};

export const createVehicle =  (vehicleData) => {
  return axios.post(API_URL, vehicleData, {
    headers: getAuthHeaders()
  });
};

export const updateVehicle = (id, vehicleData) => {
  return axios.put(`${API_URL}/${id}`, vehicleData, {
    headers: getAuthHeaders()
  });
};

export const deleteVehicle = (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });
};