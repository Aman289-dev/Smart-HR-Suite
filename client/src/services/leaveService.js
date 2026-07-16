import apiClient from './apiClient';

export const applyLeaveRequest = (formData) => apiClient.post('/leaves', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const fetchMyLeavesRequest = () => apiClient.get('/leaves/my');
export const fetchAllLeavesRequest = (params) => apiClient.get('/leaves', { params });
export const managerApproveRequest = (id, data) => apiClient.patch(`/leaves/${id}/manager-approve`, data);
export const hrApproveRequest = (id, data) => apiClient.patch(`/leaves/${id}/hr-approve`, data);
export const fetchCalendarRequest = (params) => apiClient.get('/leaves/calendar', { params });
export const fetchBalanceRequest = (userId) => apiClient.get(`/leaves/balance/${userId}`);
export const exportLeavesRequest = (params) => apiClient.get('/leaves/export', { params, responseType: 'blob' });
