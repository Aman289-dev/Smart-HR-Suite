import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import User from '../models/User.js';

export const getAttendanceReport = async ({ department, startDate, endDate }) => {
  const matchStage = {};
  if (startDate) matchStage.date = { $gte: startDate };
  if (endDate) matchStage.date = { ...matchStage.date, $lte: endDate };
  
  const pipeline = [{ $match: matchStage }];
  
  pipeline.push({
    $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' }
  });
  pipeline.push({ $unwind: '$user' });
  
  if (department) {
    pipeline.push({ $match: { 'user.department': department } });
  }
  
  pipeline.push({
    $group: {
      _id: { date: '$date', department: '$user.department' },
      present: { $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] } },
      absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
      late: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } },
      avgHours: { $avg: '$totalHours' }
    }
  });
  pipeline.push({ $sort: { '_id.date': -1 } });
  
  return Attendance.aggregate(pipeline);
};

export const getLeaveUsageReport = async ({ department, leaveType, startDate, endDate }) => {
  const matchStage = { status: 'approved' };
  if (startDate) matchStage.startDate = { $gte: new Date(startDate) };
  if (endDate) matchStage.endDate = { $lte: new Date(endDate) };
  if (leaveType) matchStage.leaveType = leaveType;
  
  const pipeline = [{ $match: matchStage }];
  
  pipeline.push({
    $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' }
  });
  pipeline.push({ $unwind: '$user' });
  
  if (department) {
    pipeline.push({ $match: { 'user.department': department } });
  }
  
  pipeline.push({
    $group: {
      _id: { leaveType: '$leaveType', department: '$user.department' },
      totalDays: { $sum: '$totalDays' },
      count: { $sum: 1 }
    }
  });
  
  return Leave.aggregate(pipeline);
};

export const getDashboardStats = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  const totalEmployees = await User.countDocuments({ status: 'active' });
  const presentToday = await Attendance.countDocuments({ date: today, status: { $in: ['present', 'late'] } });
  const onLeaveToday = await Leave.countDocuments({
    status: 'approved',
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() }
  });
  const pendingApprovals = await Leave.countDocuments({ status: { $in: ['pending', 'manager_approved'] } });
  
  return { totalEmployees, presentToday, onLeaveToday, pendingApprovals };
};
