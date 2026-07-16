import apiClient from './apiClient';

export const fetchPolicyRequest = () => apiClient.get('/policy');
export const createPolicyRequest = (data) => apiClient.post('/policy', data);
export const applyPolicyRequest = (id) => apiClient.post(`/policy/${id}/apply`);
