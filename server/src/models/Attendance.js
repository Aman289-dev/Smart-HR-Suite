import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  clockIn: { type: Date },
  clockOut: { type: Date },
  totalHours: { type: Number, default: 0 },
  status: { type: String, enum: ['present', 'absent', 'late', 'half-day', 'holiday'], default: 'present' },
  isLate: { type: Boolean, default: false },
  isEarlyExit: { type: Boolean, default: false },
  overtimeHours: { type: Number, default: 0 },
  notes: { type: String, trim: true },
  regularizationRequested: { type: Boolean, default: false },
  regularizationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: null }
}, { timestamps: true });

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
