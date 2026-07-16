import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const clockIn = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  const existing = await Attendance.findOne({ userId, date: today });
  if (existing && existing.clockIn) throw new Error('Already clocked in today');
  
  const now = new Date();
  const nineAM = new Date(now);
  nineAM.setHours(9, 0, 0, 0);
  const isLate = now > nineAM;
  
  const record = await Attendance.create({
    userId, date: today, clockIn: now,
    status: isLate ? 'late' : 'present',
    isLate
  });
  return record;
};

export const clockOut = async (userId) => {
  const today = new Date().toISOString().split('T')[0];
  const record = await Attendance.findOne({ userId, date: today });
  if (!record || !record.clockIn) throw new Error('No clock-in record found for today');
  if (record.clockOut) throw new Error('Already clocked out today');
  
  const now = new Date();
  const sixPM = new Date(now);
  sixPM.setHours(18, 0, 0, 0);
  const isEarlyExit = now < sixPM;
  
  const totalMs = now - record.clockIn;
  const totalHours = Math.round((totalMs / (1000 * 60 * 60)) * 100) / 100;
  const overtimeHours = totalHours > 9 ? Math.round((totalHours - 9) * 100) / 100 : 0;
  
  record.clockOut = now;
  record.totalHours = totalHours;
  record.isEarlyExit = isEarlyExit;
  record.overtimeHours = overtimeHours;
  await record.save();
  return record;
};

export const getMyAttendance = async (userId, { month, year }) => {
  const filter = { userId };
  if (month && year) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;
    filter.date = { $gte: startDate, $lte: endDate };
  }
  return Attendance.find(filter).sort({ date: -1 });
};

export const getAttendanceRecords = async ({ role, userId, targetUserId, department, startDate, endDate }) => {
  const filter = {};
  
  if (role === 'manager') {
    const team = await User.find({ managerId: userId }).select('_id');
    const teamIds = team.map(t => t._id);
    filter.userId = { $in: [...teamIds, userId] };
  } else if (targetUserId) {
    filter.userId = targetUserId;
  }
  
  if (department) {
    const deptUsers = await User.find({ department }).select('_id');
    filter.userId = { $in: deptUsers.map(u => u._id) };
  }
  if (startDate) filter.date = { ...filter.date, $gte: startDate };
  if (endDate) filter.date = { ...filter.date, $lte: endDate };
  
  return Attendance.find(filter).populate('userId', 'name email employeeId department').sort({ date: -1 });
};

export const getAttendanceSummary = async ({ period, department, startDate, endDate }) => {
  const matchStage = {};
  if (startDate) matchStage.date = { $gte: startDate };
  if (endDate) matchStage.date = { ...matchStage.date, $lte: endDate };
  
  const pipeline = [{ $match: matchStage }];
  
  if (department) {
    pipeline.push({
      $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' }
    });
    pipeline.push({ $unwind: '$user' });
    pipeline.push({ $match: { 'user.department': department } });
  }
  
  if (period === 'daily') {
    pipeline.push({ $group: { _id: '$date', totalPresent: { $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] } }, totalAbsent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } }, totalLate: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } } } });
    pipeline.push({ $sort: { _id: -1 } });
  } else {
    pipeline.push({ $group: { _id: null, totalPresent: { $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] } }, totalAbsent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } }, totalLate: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } }, avgHours: { $avg: '$totalHours' } } });
  }
  
  return Attendance.aggregate(pipeline);
};

export const requestRegularization = async (attendanceId, userId, notes) => {
  const record = await Attendance.findById(attendanceId);
  if (!record) throw new Error('Attendance record not found');
  if (record.userId.toString() !== userId) throw new Error('Not authorized');
  
  record.regularizationRequested = true;
  record.regularizationStatus = 'pending';
  record.notes = notes;
  await record.save();
  
  // Notify HR
  const hrUsers = await User.find({ role: { $in: ['hr', 'admin'] } });
  for (const hr of hrUsers) {
    await Notification.create({
      userId: hr._id, title: 'Regularization Request',
      message: `An employee has requested attendance regularization`, type: 'attendance'
    });
  }
  
  return record;
};

export const approveRegularization = async (attendanceId, status) => {
  const record = await Attendance.findByIdAndUpdate(
    attendanceId, { regularizationStatus: status }, { new: true }
  ).populate('userId', 'name email');
  if (!record) throw new Error('Record not found');
  
  await Notification.create({
    userId: record.userId._id, title: 'Regularization Update',
    message: `Your regularization request has been ${status}`, type: 'attendance'
  });
  
  return record;
};

export const exportAttendance = async (filters) => {
  const records = await getAttendanceRecords(filters);
  return records.map(r => ({
    employeeName: r.userId?.name || '',
    employeeId: r.userId?.employeeId || '',
    department: r.userId?.department || '',
    date: r.date,
    clockIn: r.clockIn,
    clockOut: r.clockOut,
    totalHours: r.totalHours,
    status: r.status,
    isLate: r.isLate,
    overtimeHours: r.overtimeHours
  }));
};
