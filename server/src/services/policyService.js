import LeavePolicy from '../models/LeavePolicy.js';
import User from '../models/User.js';

export const getCurrentPolicy = async () => {
  return LeavePolicy.findOne().sort({ effectiveFrom: -1 });
};

export const createPolicy = async (policyData) => {
  const policy = await LeavePolicy.create(policyData);
  
  // Apply default balances to all active employees
  await User.updateMany(
    { status: 'active' },
    {
      $set: {
        'leaveBalances.casual': policyData.casualDays,
        'leaveBalances.sick': policyData.sickDays,
        'leaveBalances.annual': policyData.annualDays
      }
    }
  );
  
  return policy;
};

export const applyPolicyToAll = async (policyId) => {
  const policy = await LeavePolicy.findById(policyId);
  if (!policy) throw new Error('Policy not found');
  
  await User.updateMany(
    { status: 'active' },
    {
      $set: {
        'leaveBalances.casual': policy.casualDays,
        'leaveBalances.sick': policy.sickDays,
        'leaveBalances.annual': policy.annualDays
      }
    }
  );
  
  return { success: true, message: 'Policy applied to all active employees' };
};
