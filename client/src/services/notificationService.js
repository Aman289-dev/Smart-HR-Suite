import apiClient from './apiClient';

export const fetchNotificationsRequest = () => apiClient.get('/notifications');
export const markReadRequest = (id) => apiClient.patch(`/notifications/${id}/read`);
export const markAllReadRequest = () => apiClient.patch('/notifications/read-all');
