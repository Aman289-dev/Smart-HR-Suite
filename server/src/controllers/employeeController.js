import * as employeeService from '../services/employeeService.js';

export const getAllEmployees = async (req, res, next) => {
  try {
    const { department, status, search } = req.query;
    const employees = await employeeService.getAllEmployees({
      role: req.user.role, userId: req.user._id, department, status, search
    });
    res.json({ success: true, data: employees });
  } catch (err) {
    next(err);
  }
};

export const getEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.updateEmployee(req.params.id, req.body, req.user);
    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const employee = await employeeService.updateEmployeeStatus(req.params.id, req.body.status);
    res.json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded', statusCode: 400 });
    }
    const docUrl = `uploads/${req.file.filename}`;
    const user = await employeeService.addDocument(req.params.id, req.body.name || req.file.originalname, docUrl);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const user = await employeeService.removeDocument(req.params.id, req.params.docId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
