import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async ({ name, email, password, department, role, employeeId, managerId, contactInfo }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name, email, password: hashedPassword, department, role,
    employeeId, managerId, contactInfo,
    leaveBalances: { casual: 10, sick: 10, annual: 15, unpaid: 0 }
  });
  
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { ...user.toObject(), password: undefined } };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  if (user.status === 'inactive') throw new Error('Account is deactivated');
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { ...user.toObject(), password: undefined } };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password').populate('managerId', 'name email');
  if (!user) throw new Error('User not found');
  return user;
};

export const seedDemoUsers = async () => {
  const demoUsers = [
    { name: 'HR Admin', email: 'hr@company.com', password: 'Hr@1234', role: 'admin', department: 'Human Resources', employeeId: 'EMP001' },
    { name: 'John Manager', email: 'manager@company.com', password: 'Manager@1234', role: 'manager', department: 'Engineering', employeeId: 'EMP002' },
    { name: 'Jane Employee', email: 'employee@company.com', password: 'Employee@1234', role: 'employee', department: 'Engineering', employeeId: 'EMP003' }
  ];

  let managerId = null;
  for (const u of demoUsers) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const result = await User.updateOne(
      { email: u.email },
      { $set: { ...u, password: hashedPassword, leaveBalances: { casual: 10, sick: 10, annual: 15, unpaid: 0 }, status: 'active' } },
      { upsert: true }
    );
    const user = await User.findOne({ email: u.email });
    if (u.role === 'manager') managerId = user._id;
  }
  
  // Set Jane's manager to John
  if (managerId) {
    await User.updateOne({ email: 'employee@company.com' }, { $set: { managerId } });
  }
  
  console.log('[SEED] Demo users seeded successfully');
};
