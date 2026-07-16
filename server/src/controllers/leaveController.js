import * as leaveService from '../services/leaveService.js';
import XLSX from 'xlsx';

export const applyLeave = async (req, res, next) => {
  try {
    const attachmentUrl = req.file ? `uploads/${req.file.filename}` : req.body.attachmentUrl;
    const leave = await leaveService.applyLeave({
      userId: req.user._id, ...req.body, attachmentUrl
    });
    res.status(201).json({ success: true, data: leave });
  } catch (err) {
    next(err);
  }
};

export const getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await leaveService.getMyLeaves(req.user._id);
    res.json({ success: true, data: leaves });
  } catch (err) {
    next(err);
  }
};

export const getAllLeaves = async (req, res, next) => {
  try {
    const leaves = await leaveService.getAllLeaves({
      role: req.user.role, userId: req.user._id, ...req.query
    });
    res.json({ success: true, data: leaves });
  } catch (err) {
    next(err);
  }
};

export const managerApprove = async (req, res, next) => {
  try {
    const { approved, comment } = req.body;
    const leave = await leaveService.managerApproveLeave(req.params.id, req.user._id, approved, comment);
    res.json({ success: true, data: leave });
  } catch (err) {
    next(err);
  }
};

export const hrApprove = async (req, res, next) => {
  try {
    const { approved, comment } = req.body;
    const leave = await leaveService.hrApproveLeave(req.params.id, req.user._id, approved, comment);
    res.json({ success: true, data: leave });
  } catch (err) {
    next(err);
  }
};

export const getCalendar = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const leaves = await leaveService.getLeaveCalendar(year, month);
    res.json({ success: true, data: leaves });
  } catch (err) {
    next(err);
  }
};

export const getBalance = async (req, res, next) => {
  try {
    const balance = await leaveService.getLeaveBalance(req.params.userId);
    res.json({ success: true, data: balance });
  } catch (err) {
    next(err);
  }
};

export const exportLeaves = async (req, res, next) => {
  try {
    const data = await leaveService.exportLeaves({
      role: req.user.role, userId: req.user._id, ...req.query
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Leaves');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=leaves_export.xlsx');
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};
