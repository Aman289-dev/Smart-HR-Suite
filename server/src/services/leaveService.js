import Leave from '../models/Leave.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

const countWeekdays = (start, end) => {
  let count = 0;
  const current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

export const applyLeave = async ({ userId, leaveType, startDate, endDate, reason, attachmentUrl }) => {
  const totalDays = countWeekdays(new Date(startDate), new Date(endDate));
  if (totalDays <= 0) throw new Error('Invalid date range');
  
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  if (leaveType !== 'unpaid' && leaveType !== 'other') {
    const available = user.leaveBalances[leaveType];
    if (available === undefined) throw new Error('Invalid leave type');
    if (available < totalDays) throw new Error(`Insufficient ${leaveType} leave balance. Available: ${available}, Requested: ${totalDays}`);
  }
  
  const leave = await Leave.create({
    userId, leaveType, startDate: new Date(startDate), endDate: new Date(endDate),
    totalDays, reason, attachmentUrl, status: 'pending'
  });
  
  // Notify manager
  if (user.managerId) {
    await Notification.create({
      userId: user.managerId, title: 'New Leave Request',
      message: `${user.name} has applied for ${totalDays} day(s) of ${leaveType} leave`,
      type: 'leave'
    });
  }
  
  return leave;
};

export const getMyLeaves = async (userId) => {
  return Leave.find({ userId }).sort({ appliedAt: -1 });
};

export const getAllLeaves = async ({ role, userId, status, leaveType, startDate, endDate }) => {
  const filter = {};
  
  if (role === 'manager') {
    const team = await User.find({ managerId: userId }).select('_id');
    filter.userId = { $in: team.map(t => t._id) };
  }
  
  if (status) filter.status = status;
  if (leaveType) filter.leaveType = leaveType;
  if (startDate) filter.startDate = { $gte: new Date(startDate) };
  if (endDate) filter.endDate = { $lte: new Date(endDate) };
  
  return Leave.find(filter).populate('userId', 'name email employeeId department')
    .populate('managerApprovedBy', 'name')
    .populate('hrApprovedBy', 'name')
    .sort({ appliedAt: -1 });
};

export const managerApproveLeave = async (leaveId, managerId, approved, comment) => {
  const leave = await Leave.findById(leaveId);
  if (!leave) throw new Error('Leave request not found');
  if (leave.status !== 'pending') throw new Error('Leave already processed');
  
  const newStatus = approved ? 'manager_approved' : 'rejected';
  leave.status = newStatus;
  leave.managerApprovedBy = managerId;
  leave.managerComment = comment;
  await leave.save();
  
  if (approved) {
    // Notify HR for final approval
    const hrUsers = await User.find({ role: { $in: ['hr', 'admin'] } });
    for (const hr of hrUsers) {
      await Notification.create({
        userId: hr._id, title: 'Leave Pending HR Approval',
        message: `A leave request by ${(await User.findById(leave.userId)).name} needs your final approval`,
        type: 'leave'
      });
    }
  } else {
    await Notification.create({
      userId: leave.userId, title: 'Leave Rejected',
      message: `Your leave request has been rejected by manager. ${comment || ''}`,
      type: 'leave'
    });
  }
  
  return leave.populate('userId', 'name email department');
};

export const hrApproveLeave = async (leaveId, hrId, approved, comment) => {
  const leave = await Leave.findById(leaveId);
  if (!leave) throw new Error('Leave request not found');
  if (leave.status !== 'manager_approved') throw new Error('Leave must be manager-approved first');
  
  if (approved) {
    leave.status = 'approved';
    leave.hrApprovedBy = hrId;
    leave.hrComment = comment;
    leave.notificationSent = true;
    await leave.save();
    
    // Deduct balance
    if (leave.leaveType !== 'unpaid' && leave.leaveType !== 'other') {
      await User.findByIdAndUpdate(leave.userId, {
        $inc: { [`leaveBalances.${leave.leaveType}`]: -leave.totalDays }
      });
    }
    
    await Notification.create({
      userId: leave.userId, title: 'Leave Approved',
      message: `Your ${leave.leaveType} leave (${leave.totalDays} days) has been approved`,
      type: 'leave'
    });
  } else {
    leave.status = 'rejected';
    leave.hrApprovedBy = hrId;
    leave.hrComment = comment;
    await leave.save();
    
    await Notification.create({
      userId: leave.userId, title: 'Leave Rejected',
      message: `Your leave request has been rejected by HR. ${comment || ''}`,
      type: 'leave'
    });
  }
  
  return leave.populate('userId', 'name email department');
};

export const getLeaveCalendar = async (year, month) => {
  const filter = { status: 'approved' };
  if (year && month) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    filter.startDate = { $lte: end };
    filter.endDate = { $gte: start };
  }
  return Leave.find(filter).populate('userId', 'name department').sort({ startDate: 1 });
};

export const getLeaveBalance = async (userId) => {
  const user = await User.findById(userId).select('leaveBalances name');
  if (!user) throw new Error('User not found');
  return user.leaveBalances;
};

export const exportLeaves = async (filters) => {
  const leaves = await getAllLeaves(filters);
  return leaves.map(l => ({
    employeeName: l.userId?.name || '',
    employeeId: l.userId?.employeeId || '',
    department: l.userId?.department || '',
    leaveType: l.leaveType,
    startDate: l.startDate,
    endDate: l.endDate,
    totalDays: l.totalDays,
    reason: l.reason,
    status: l.status,
    appliedAt: l.appliedAt
  }));
};
