import * as attendanceService from '../services/attendanceService.js';
import XLSX from 'xlsx';

export const clockIn = async (req, res, next) => {
  try {
    const record = await attendanceService.clockIn(req.user._id);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

export const clockOut = async (req, res, next) => {
  try {
    const record = await attendanceService.clockOut(req.user._id);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

export const getMyAttendance = async (req, res, next) => {
  try {
    const records = await attendanceService.getMyAttendance(req.user._id, req.query);
    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

export const getAttendance = async (req, res, next) => {
  try {
    const records = await attendanceService.getAttendanceRecords({
      role: req.user.role, userId: req.user._id, ...req.query
    });
    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const summary = await attendanceService.getAttendanceSummary(req.query);
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
};

export const requestRegularization = async (req, res, next) => {
  try {
    const record = await attendanceService.requestRegularization(req.params.id, req.user._id, req.body.notes);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

export const approveRegularization = async (req, res, next) => {
  try {
    const record = await attendanceService.approveRegularization(req.params.id, req.body.status);
    res.json({ success: true, data: record });
  } catch (err) {
    next(err);
  }
};

export const exportAttendance = async (req, res, next) => {
  try {
    const data = await attendanceService.exportAttendance({
      role: req.user.role, userId: req.user._id, ...req.query
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance_export.xlsx');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};
