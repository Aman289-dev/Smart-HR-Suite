import * as reportService from '../services/reportService.js';

export const getAttendanceSummary = async (req, res, next) => {
  try {
    const data = await reportService.getAttendanceReport(req.query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getLeaveUsage = async (req, res, next) => {
  try {
    const data = await reportService.getLeaveUsageReport(req.query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await reportService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
