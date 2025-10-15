import axios from "axios";

const API_URL = "http://localhost:8000/api/vehicles";

export const getVehicles =() => {
    const token = localStorage.getItem("token");
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createVehicle =  (vehicleData) => {
  const token = localStorage.getItem("token");
  return axios.post(API_URL, vehicleData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateVehicle = (id, vehicleData) => {
  const token = localStorage.getItem("token");
  return axios.put(`${API_URL}/${id}`, vehicleData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteVehicle = (id) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};