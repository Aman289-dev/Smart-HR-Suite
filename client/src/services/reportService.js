import apiClient from './apiClient';

export const fetchDashboardStatsRequest = () => apiClient.get('/reports/dashboard-stats');
export const fetchAttendanceReportRequest = (params) => apiClient.get('/reports/attendance-summary', { params });
export const fetchLeaveUsageRequest = (params) => apiClient.get('/reports/leave-usage', { params });
