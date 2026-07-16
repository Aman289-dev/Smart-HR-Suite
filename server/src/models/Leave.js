import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaveType: { type: String, enum: ['casual', 'sick', 'annual', 'unpaid', 'other'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  reason: { type: String, trim: true },
  attachmentUrl: { type: String },
  status: { type: String, enum: ['pending', 'manager_approved', 'approved', 'rejected'], default: 'pending' },
  managerApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hrApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  managerComment: { type: String, trim: true },
  hrComment: { type: String, trim: true },
  appliedAt: { type: Date, default: Date.now },
  notificationSent: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Leave', leaveSchema);
