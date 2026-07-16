import mongoose from 'mongoose';

const leavePolicySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  casualDays: { type: Number, required: true, default: 10 },
  sickDays: { type: Number, required: true, default: 10 },
  annualDays: { type: Number, required: true, default: 15 },
  unpaidAllowed: { type: Boolean, default: true },
  effectiveFrom: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('LeavePolicy', leavePolicySchema);
