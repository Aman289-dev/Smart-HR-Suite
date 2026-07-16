import User from '../models/User.js';

export const getAllEmployees = async ({ role, userId, department, status, search }) => {
  const filter = {};
  
  if (role === 'manager') {
    filter.managerId = userId;
  }
  if (department) filter.department = department;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } }
    ];
  }
  
  return User.find(filter).select('-password').populate('managerId', 'name email').sort({ createdAt: -1 });
};

export const getEmployeeById = async (id) => {
  const user = await User.findById(id).select('-password').populate('managerId', 'name email');
  if (!user) throw new Error('Employee not found');
  return user;
};

export const updateEmployee = async (id, updates, requestingUser) => {
  const allowedFields = ['name', 'department', 'role', 'contactInfo', 'managerId', 'dateOfJoining', 'leaveBalances'];
  const isSelf = requestingUser._id.toString() === id;
  
  if (isSelf && !['hr', 'admin'].includes(requestingUser.role)) {
    // Employee can only update own contact info
    const filteredUpdates = {};
    if (updates.contactInfo) filteredUpdates.contactInfo = updates.contactInfo;
    if (updates.name) filteredUpdates.name = updates.name;
    return User.findByIdAndUpdate(id, filteredUpdates, { new: true, runValidators: true }).select('-password');
  }
  
  const filteredUpdates = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
  }
  
  return User.findByIdAndUpdate(id, filteredUpdates, { new: true, runValidators: true }).select('-password');
};

export const updateEmployeeStatus = async (id, status) => {
  const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
  if (!user) throw new Error('Employee not found');
  return user;
};

export const addDocument = async (userId, docName, docUrl) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { documents: { name: docName, url: docUrl, uploadedAt: new Date() } } },
    { new: true }
  ).select('-password');
  if (!user) throw new Error('Employee not found');
  return user;
};

export const removeDocument = async (userId, docId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { documents: { _id: docId } } },
    { new: true }
  ).select('-password');
  if (!user) throw new Error('Employee not found');
  return user;
};
