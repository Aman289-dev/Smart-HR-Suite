import * as policyService from '../services/policyService.js';

export const getPolicy = async (req, res, next) => {
  try {
    const policy = await policyService.getCurrentPolicy();
    res.json({ success: true, data: policy });
  } catch (err) {
    next(err);
  }
};

export const createPolicy = async (req, res, next) => {
  try {
    const policy = await policyService.createPolicy({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: policy });
  } catch (err) {
    next(err);
  }
};

export const applyPolicy = async (req, res, next) => {
  try {
    const result = await policyService.applyPolicyToAll(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
