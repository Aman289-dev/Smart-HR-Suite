import apiClient from './apiClient';

export const loginRequest = (email, password) => apiClient.post('/auth/login', { email, password });
export const getProfileRequest = () => apiClient.get('/auth/me');
export const registerRequest = (data) => apiClient.post('/auth/register', data);
