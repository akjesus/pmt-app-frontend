import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';
const API_URL = `${BASE_URL}/loading-info`;

// Example: Pass the token in the header for all requests
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const getBusLoading = (dateFrom, dateTo) => {
  return axios.get(API_URL, {
    params: { dateFrom, dateTo },
    headers: getAuthHeaders()
  });
};

export const createLoadingInfo = (data) => {
  return axios.post(API_URL, { data }, {
    headers: getAuthHeaders()
  });
};

export const getBusexpenses = (tableBusFrom, tableBusTo, dateFrom, dateTo) => {
  return axios.get(`${BASE_URL}/bus-expenses/`, {
    params: {
      vehicleId1: tableBusFrom.split(":")[0],
      vehicleId2: tableBusTo.split(":")[0],
      dateFrom,
      dateTo
    },
    headers: getAuthHeaders()
  });
};

export const createBusExpenses = (busId, data, date) => {
  return axios.post(`${BASE_URL}/bus-expenses`, { busId, data, date }, {
    headers: getAuthHeaders()
  });
};

export const getBusPerformance = (data) => {
  return axios.get(`${BASE_URL}/reports/bus-performance`, {
    params: { data },
    headers: getAuthHeaders()
  });
};

export const getExpenseItems = () => {
  return axios.get(`${BASE_URL}/bus-expenses/expense-items`, {
    headers: getAuthHeaders()
  });
};

export const addExpenseItem = (data) => {
  return axios.post(`${BASE_URL}/bus-expenses/expense-items`, { data }, {
    headers: getAuthHeaders()
  });
};
