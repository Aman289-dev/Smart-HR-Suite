import apiClient from './apiClient';

export const clockInRequest = () => apiClient.post('/attendance/clock-in');
export const clockOutRequest = () => apiClient.post('/attendance/clock-out');
export const fetchMyAttendanceRequest = (params) => apiClient.get('/attendance/my', { params });
export const fetchAttendanceRequest = (params) => apiClient.get('/attendance', { params });
export const fetchSummaryRequest = (params) => apiClient.get('/attendance/summary', { params });
export const requestRegularizationRequest = (id, notes) => apiClient.post(`/attendance/regularize/${id}`, { notes });
export const approveRegularizationRequest = (id, status) => apiClient.patch(`/attendance/regularize/${id}`, { status });
export const exportAttendanceRequest = (params) => apiClient.get('/attendance/export', { params, responseType: 'blob' });
