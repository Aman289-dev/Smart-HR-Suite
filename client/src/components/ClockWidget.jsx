import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { clockInRequest, clockOutRequest, fetchMyAttendanceRequest } from '../services/attendanceService';

export default function ClockWidget() {
  const [time, setTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    loadTodayRecord();
    return () => clearInterval(timer);
  }, []);

  const loadTodayRecord = async () => {
    try {
      const today = new Date().toISOString().split('T')[0].split('-');
      const { data } = await fetchMyAttendanceRequest({ month: today[1], year: today[0] });
      const record = data.data.find(r => r.date === new Date().toISOString().split('T')[0]);
      setTodayRecord(record);
    } catch (err) { /* ignore */ }
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      await clockInRequest();
      toast.success('Clocked in successfully');
      await loadTodayRecord();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to clock in');
    }
    setLoading(false);
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await clockOutRequest();
      toast.success('Clocked out successfully');
      await loadTodayRecord();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to clock out');
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div
        className="flex items-center justify-between mb-4"
        data-icod-id="src_components_clockwidget_jsx_2446">
        <div
          className="flex items-center gap-3"
          data-icod-id="src_components_clockwidget_jsx_1d1a">
          <div
            className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center"
            data-icod-id="src_components_clockwidget_jsx_d1ae">
            <Clock size={20} className="text-indigo-600" />
          </div>
          <div data-icod-id="src_components_clockwidget_jsx_2dbc">
            <p
              className="text-2xl font-bold text-[#0F172A] tabular-nums"
              data-icod-id="src_components_clockwidget_jsx_bd4d">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p
              className="text-xs text-[#64748B]"
              data-icod-id="src_components_clockwidget_jsx_0a6b">{time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>
      <div className="space-y-3" data-icod-id="src_components_clockwidget_jsx_d972">
        <div
          className="flex items-center justify-between text-sm"
          data-icod-id="src_components_clockwidget_jsx_a7a1">
          <span
            className="text-[#64748B]"
            data-icod-id="src_components_clockwidget_jsx_3801">Clock In:</span>
          <span
            className="font-medium text-[#0F172A]"
            data-icod-id="src_components_clockwidget_jsx_df92">
            {todayRecord?.clockIn ? new Date(todayRecord.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </span>
        </div>
        <div
          className="flex items-center justify-between text-sm"
          data-icod-id="src_components_clockwidget_jsx_527b">
          <span
            className="text-[#64748B]"
            data-icod-id="src_components_clockwidget_jsx_c989">Clock Out:</span>
          <span
            className="font-medium text-[#0F172A]"
            data-icod-id="src_components_clockwidget_jsx_85ac">
            {todayRecord?.clockOut ? new Date(todayRecord.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </span>
        </div>
        <div
          className="flex items-center justify-between text-sm"
          data-icod-id="src_components_clockwidget_jsx_7476">
          <span
            className="text-[#64748B]"
            data-icod-id="src_components_clockwidget_jsx_e53e">Total Hours:</span>
          <span
            className="font-medium text-[#0F172A]"
            data-icod-id="src_components_clockwidget_jsx_159f">{todayRecord?.totalHours || 0}h</span>
        </div>

        <div
          className="pt-3 flex gap-2"
          data-icod-id="src_components_clockwidget_jsx_6a90">
          {!todayRecord?.clockIn ? (
            <button
              onClick={handleClockIn}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium text-sm disabled:opacity-50"
              data-icod-id="src_components_clockwidget_jsx_7149">
              <LogIn size={16} /> Clock In
            </button>
          ) : !todayRecord?.clockOut ? (
            <button
              onClick={handleClockOut}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-medium text-sm disabled:opacity-50"
              data-icod-id="src_components_clockwidget_jsx_9de1">
              <LogOut size={16} /> Clock Out
            </button>
          ) : (
            <div
              className="flex-1 py-2.5 bg-emerald-100 text-emerald-700 rounded-xl text-center font-medium text-sm"
              data-icod-id="src_components_clockwidget_jsx_1ea0">
              Day Complete
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
