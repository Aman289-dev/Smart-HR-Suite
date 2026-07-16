import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: true });

const userSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  department: { type: String, trim: true },
  role: { type: String, enum: ['employee', 'manager', 'hr', 'admin'], default: 'employee' },
  contactInfo: {
    phone: { type: String, trim: true },
    address: { type: String, trim: true }
  },
  dateOfJoining: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  leaveBalances: {
    casual: { type: Number, default: 10 },
    sick: { type: Number, default: 10 },
    annual: { type: Number, default: 15 },
    unpaid: { type: Number, default: 0 }
  },
  documents: [documentSchema]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
