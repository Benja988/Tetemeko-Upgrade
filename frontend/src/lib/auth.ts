// lib/auth.ts
// src/lib/auth.ts

import axios from './axios';
import axiosInstance from './axios';

export const registerAdmin = async (data: {
  name: string;
  email: string;
  password: string;
  adminSecret: string;
}) => {
  return (await axios.post('/auth/register-admin', data)).data;
};

export const loginAdmin = async (data: {
  email: string;
  password: string;
}) => {
  return (await axios.post('/auth/login', data)).data;
};

export const logoutAdmin = async () => {
  return (await axios.post('/auth/logout')).data;
};

export const getAdminProfile = async () => {
  const response = await axiosInstance.get('/auth/profile');

  return response.data;
};

export const refreshToken = async () => {
  // This call sends the refresh token cookie and returns a new access token
  const response = await axiosInstance.post('/auth/refresh-token');
  return response.data;
};
