import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppSelector } from '../store/hooks';
import ClockWidget from '../components/ClockWidget';
import DataTable from '../components/DataTable';
import AttendanceBadge from '../components/AttendanceBadge';
import ExportButton from '../components/ExportButton';
import Modal from '../components/Modal';
import { fetchMyAttendanceRequest, fetchAttendanceRequest, exportAttendanceRequest, requestRegularizationRequest } from '../services/attendanceService';

export default function Attendance() {
  const user = useAppSelector(state => state.auth.user);
  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [regNotes, setRegNotes] = useState('');

  useEffect(() => { loadRecords(); }, [month, year, search, deptFilter]);

  const loadRecords = async () => {
    try {
      if (user?.role === 'employee') {
        const { data } = await fetchMyAttendanceRequest({ month, year });
        setRecords(data.data);
      } else {
        const params = { startDate: `${year}-${String(month).padStart(2,'0')}-01`, endDate: `${year}-${String(month).padStart(2,'0')}-31` };
        if (search) params.userId = search;
        if (deptFilter) params.department = deptFilter;
        const { data } = await fetchAttendanceRequest(params);
        setRecords(data.data);
      }
    } catch (err) { /* ignore */ }
  };

  const handleRegularize = async () => {
    if (!selectedRecord) return;
    try {
      await requestRegularizationRequest(selectedRecord._id, regNotes);
      toast.success('Regularization requested');
      setShowRegModal(false);
      setRegNotes('');
      loadRecords();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const isEmployee = user?.role === 'employee';

  // Generate heatmap data for employee view
  const getHeatmapColor = (status) => {
    switch(status) {
      case 'present': return 'bg-emerald-400';
      case 'late': return 'bg-amber-400';
      case 'absent': return 'bg-red-400';
      case 'half-day': return 'bg-blue-400';
      case 'holiday': return 'bg-purple-400';
      default: return 'bg-gray-200';
    }
  };

  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
  const dayMap = {};
  records.forEach(r => { dayMap[r.date] = r; });

  return (
    <div className="space-y-6" data-icod-id="src_pages_attendance_jsx_9573">
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        data-icod-id="src_pages_attendance_jsx_056d">
        <h1
          className="text-2xl font-bold text-[#0F172A]"
          data-icod-id="src_pages_attendance_jsx_4886">Attendance</h1>
        {!isEmployee && <ExportButton onClick={() => exportAttendanceRequest({ month, year, department: deptFilter })} />}
      </div>
      {isEmployee && (
        <div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          data-icod-id="src_pages_attendance_jsx_a357">
          <ClockWidget />
          <div
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            data-icod-id="src_pages_attendance_jsx_b095">
            <h3
              className="text-lg font-bold text-[#0F172A] mb-4"
              data-icod-id="src_pages_attendance_jsx_70e6">Monthly Overview</h3>
            <div
              className="grid grid-cols-7 gap-1.5"
              data-icod-id="src_pages_attendance_jsx_d4d4">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div
                  key={d}
                  className="text-center text-xs font-medium text-[#64748B] py-1"
                  data-icod-id={`src_pages_attendance_jsx_0a4e_${d}`}>{d}</div>
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const record = dayMap[dateStr];
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium cursor-default ${record ? getHeatmapColor(record.status) + ' text-white' : 'bg-gray-100 text-[#64748B]'}`}
                    title={record ? `${record.status} - ${record.totalHours || 0}h` : `Day ${day}`}
                    onClick={() => { if (record && record.regularizationRequested !== true) { setSelectedRecord(record); setShowRegModal(true); }}}
                    data-icod-id="src_pages_attendance_jsx_ce2a">
                    {day}
                  </div>
                );
              })}
            </div>
            <div
              className="flex items-center gap-4 mt-4 text-xs text-[#64748B]"
              data-icod-id="src_pages_attendance_jsx_6f14">
              <span
                className="flex items-center gap-1"
                data-icod-id="src_pages_attendance_jsx_115f"><span
                className="w-3 h-3 rounded bg-emerald-400"
                data-icod-id="src_pages_attendance_jsx_cbb9" /> Present</span>
              <span
                className="flex items-center gap-1"
                data-icod-id="src_pages_attendance_jsx_3753"><span
                className="w-3 h-3 rounded bg-amber-400"
                data-icod-id="src_pages_attendance_jsx_05df" /> Late</span>
              <span
                className="flex items-center gap-1"
                data-icod-id="src_pages_attendance_jsx_0b03"><span
                className="w-3 h-3 rounded bg-red-400"
                data-icod-id="src_pages_attendance_jsx_216c" /> Absent</span>
            </div>
          </div>
        </div>
      )}
      {!isEmployee && (
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
          data-icod-id="src_pages_attendance_jsx_85d0">
          <div
            className="flex flex-col sm:flex-row gap-3 mb-4"
            data-icod-id="src_pages_attendance_jsx_9791">
            <input
              type="month"
              value={`${year}-${String(month).padStart(2,'0')}`}
              onChange={e => { const [y,m] = e.target.value.split('-'); setYear(y); setMonth(m); }}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500"
              data-icod-id="src_pages_attendance_jsx_a821" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500"
              data-icod-id="src_pages_attendance_jsx_7686" />
          </div>
        </div>
      )}
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100"
        data-icod-id="src_pages_attendance_jsx_eee2">
        <DataTable columns={[
          ...(isEmployee ? [] : [{ key: 'userId', label: 'Employee', render: (_, r) => r.userId?.name || '-', sortable: true }]),
          { key: 'date', label: 'Date', sortable: true },
          { key: 'clockIn', label: 'Clock In', render: v => v ? new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--' },
          { key: 'clockOut', label: 'Clock Out', render: v => v ? new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--' },
          { key: 'totalHours', label: 'Hours', render: v => `${v || 0}h`, sortable: true },
          { key: 'status', label: 'Status', render: v => <AttendanceBadge status={v} />, sortable: true },
          ...(isEmployee ? [{ key: '_actions', label: '', render: (_, r) => (
            !r.regularizationRequested && r.status !== 'present' ? (
              <button
                onClick={() => { setSelectedRecord(r); setShowRegModal(true); }}
                className="text-xs text-indigo-600 hover:underline"
                data-icod-id="src_pages_attendance_jsx_f679">Regularize</button>
            ) : r.regularizationRequested ? <span
              className="text-xs text-[#64748B]"
              data-icod-id="src_pages_attendance_jsx_009b">Requested</span> : null
          )}] : []),
        ]} data={records} pageSize={10} />
      </div>
      <Modal isOpen={showRegModal} onClose={() => setShowRegModal(false)} title="Request Regularization">
        <div className="space-y-4" data-icod-id="src_pages_attendance_jsx_237a">
          <p
            className="text-sm text-[#64748B]"
            data-icod-id="src_pages_attendance_jsx_6bf7">Request regularization for {selectedRecord?.date}</p>
          <textarea
            value={regNotes}
            onChange={e => setRegNotes(e.target.value)}
            rows={3}
            placeholder="Reason for regularization..."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
            data-icod-id="src_pages_attendance_jsx_4613" />
          <button
            onClick={handleRegularize}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium text-sm"
            data-icod-id="src_pages_attendance_jsx_bac0">
            Submit Request
          </button>
        </div>
      </Modal>
    </div>
  );
}
