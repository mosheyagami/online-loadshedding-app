import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api', // this must match the proxy server
});

export const searchArea = async (text) => {
  const response = await API.get(`/search?text=${text}`);
  return response.data;
};

export const getAreaInfo = async (id) => {
  const response = await API.get(`/area?id=${id}`);
  return response.data;
};
