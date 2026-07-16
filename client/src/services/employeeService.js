import apiClient from './apiClient';

export const fetchEmployeesRequest = (params) => apiClient.get('/employees', { params });
export const fetchEmployeeRequest = (id) => apiClient.get(`/employees/${id}`);
export const updateEmployeeRequest = (id, data) => apiClient.put(`/employees/${id}`, data);
export const updateStatusRequest = (id, status) => apiClient.patch(`/employees/${id}/status`, { status });
export const uploadDocumentRequest = (id, formData) => apiClient.post(`/employees/${id}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteDocumentRequest = (id, docId) => apiClient.delete(`/employees/${id}/documents/${docId}`);
