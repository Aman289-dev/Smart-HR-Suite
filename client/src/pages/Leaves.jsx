import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar as CalIcon, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppSelector } from '../store/hooks';
import Modal from '../components/Modal';
import DataTable from '../components/DataTable';
import AttendanceBadge from '../components/AttendanceBadge';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import ExportButton from '../components/ExportButton';
import FileUpload from '../components/FileUpload';
import { applyLeaveRequest, fetchMyLeavesRequest, fetchAllLeavesRequest, managerApproveRequest, hrApproveRequest, fetchCalendarRequest, exportLeavesRequest } from '../services/leaveService';

export default function Leaves() {
  const user = useAppSelector(state => state.auth.user);
  const [leaves, setLeaves] = useState([]);
  const [calendarLeaves, setCalendarLeaves] = useState([]);
  const [tab, setTab] = useState('history');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const [form, setForm] = useState({ leaveType: 'casual', startDate: '', endDate: '', reason: '' });
  const [attachFile, setAttachFile] = useState(null);

  useEffect(() => { loadData(); }, [tab, calMonth, calYear]);

  const loadData = async () => {
    try {
      if (tab === 'calendar') {
        const { data } = await fetchCalendarRequest({ year: calYear, month: calMonth });
        setCalendarLeaves(data.data);
        return;
      }
      
      if (user?.role === 'employee') {
        const { data } = await fetchMyLeavesRequest();
        setLeaves(data.data);
      } else {
        const { data } = await fetchAllLeavesRequest(tab === 'pending' ? { status: 'pending' } : {});
        setLeaves(data.data);
      }
    } catch (err) { /* ignore */ }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('leaveType', form.leaveType);
    formData.append('startDate', form.startDate);
    formData.append('endDate', form.endDate);
    formData.append('reason', form.reason);
    if (attachFile) formData.append('attachment', attachFile);
    
    try {
      await applyLeaveRequest(formData);
      toast.success('Leave applied successfully');
      setShowApplyModal(false);
      setForm({ leaveType: 'casual', startDate: '', endDate: '', reason: '' });
      setAttachFile(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to apply');
    }
  };

  const handleManagerApprove = async (id, approved) => {
    try {
      await managerApproveRequest(id, { approved, comment: '' });
      toast.success(approved ? 'Approved' : 'Rejected');
      loadData();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const handleHrApprove = async (id, approved) => {
    try {
      await hrApproveRequest(id, { approved, comment: '' });
      toast.success(approved ? 'Final Approved' : 'Rejected');
      loadData();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  };

  const tabs = user?.role === 'employee' 
    ? [{ id: 'history', label: 'My Leaves' }, { id: 'calendar', label: 'Company Calendar' }]
    : user?.role === 'manager'
    ? [{ id: 'pending', label: 'Pending Approvals' }, { id: 'history', label: 'Team History' }, { id: 'calendar', label: 'Calendar' }]
    : [{ id: 'history', label: 'All Leaves' }, { id: 'pending', label: 'Pending' }, { id: 'calendar', label: 'Calendar' }];

  // Calendar grid
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const firstDay = new Date(calYear, calMonth - 1, 1).getDay();

  return (
    <div className="space-y-6" data-icod-id="src_pages_leaves_jsx_b12c">
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        data-icod-id="src_pages_leaves_jsx_68f5">
        <h1
          className="text-2xl font-bold text-[#0F172A]"
          data-icod-id="src_pages_leaves_jsx_a104">Leaves</h1>
        <div
          className="flex items-center gap-2"
          data-icod-id="src_pages_leaves_jsx_de7a">
          {user?.role === 'employee' && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-sm font-medium"
              data-icod-id="src_pages_leaves_jsx_44f7">
              <Plus size={16} /> Apply Leave
            </button>
          )}
          {tab !== 'calendar' && ['hr', 'admin', 'manager'].includes(user?.role) && (
            <ExportButton onClick={() => exportLeavesRequest({})} />
          )}
        </div>
      </div>
      {user?.role === 'employee' && tab !== 'calendar' && (
        <LeaveBalanceCard balances={user?.leaveBalances} />
      )}
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100"
        data-icod-id="src_pages_leaves_jsx_a49e">
        <div
          className="flex gap-1 border-b border-gray-200 px-4"
          data-icod-id="src_pages_leaves_jsx_0922">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'}`}
              data-icod-id={`src_pages_leaves_jsx_9d43_${t.id}`}>{t.label}</button>
          ))}
        </div>

        <div className="p-4" data-icod-id="src_pages_leaves_jsx_2506">
          {tab === 'calendar' ? (
            <div data-icod-id="src_pages_leaves_jsx_db0c">
              <div
                className="flex items-center justify-between mb-4"
                data-icod-id="src_pages_leaves_jsx_580d">
                <button
                  onClick={() => { if (calMonth === 1) { setCalMonth(12); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  data-icod-id="src_pages_leaves_jsx_ef01">&lt;</button>
                <h3
                  className="text-lg font-bold text-[#0F172A]"
                  data-icod-id="src_pages_leaves_jsx_37c1">
                  {new Date(calYear, calMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={() => { if (calMonth === 12) { setCalMonth(1); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  data-icod-id="src_pages_leaves_jsx_2b5b">&gt;</button>
              </div>
              <div
                className="grid grid-cols-7 gap-1"
                data-icod-id="src_pages_leaves_jsx_31a8">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                  <div
                    key={d}
                    className="text-center text-xs font-medium text-[#64748B] py-2"
                    data-icod-id={`src_pages_leaves_jsx_14e0_${d}`}>{d}</div>
                ))}
                {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} data-icod-id="src_pages_leaves_jsx_cb72" />)}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const dateStr = `${calYear}-${String(calMonth).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                  const dayLeaves = calendarLeaves.filter(l => {
                    const start = new Date(l.startDate).toISOString().split('T')[0];
                    const end = new Date(l.endDate).toISOString().split('T')[0];
                    return dateStr >= start && dateStr <= end;
                  });
                  return (
                    <div
                      key={day}
                      className={`min-h-[60px] p-1 rounded-lg border text-xs ${dayLeaves.length > 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-100'}`}
                      data-icod-id="src_pages_leaves_jsx_4739">
                      <span
                        className="font-medium text-[#0F172A]"
                        data-icod-id="src_pages_leaves_jsx_d7d8">{day}</span>
                      {dayLeaves.map((l, idx) => (
                        <div
                          key={idx}
                          className="truncate text-[10px] text-indigo-700 mt-0.5"
                          title={`${l.userId?.name} - ${l.leaveType}`}
                          data-icod-id={`src_pages_leaves_jsx_b6a4_${idx}`}>
                          {l.userId?.name?.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <DataTable columns={[
              ...(['hr', 'admin', 'manager'].includes(user?.role) ? [{ key: 'userId', label: 'Employee', render: (_, r) => r.userId?.name || '-', sortable: true }] : []),
              { key: 'leaveType', label: 'Type', render: v => <span className="capitalize" data-icod-id="src_pages_leaves_jsx_31e2">{v}</span>, sortable: true },
              { key: 'startDate', label: 'From', render: v => new Date(v).toLocaleDateString(), sortable: true },
              { key: 'endDate', label: 'To', render: v => new Date(v).toLocaleDateString(), sortable: true },
              { key: 'totalDays', label: 'Days', sortable: true },
              { key: 'status', label: 'Status', render: v => <AttendanceBadge status={v} />, sortable: true },
              ...((user?.role === 'manager' && tab === 'pending') ? [{ key: '_actions', label: 'Actions', render: (_, r) => r.status === 'pending' ? (
                <div
                  className="flex items-center gap-1"
                  data-icod-id="src_pages_leaves_jsx_57b6">
                  <button
                    onClick={() => handleManagerApprove(r._id, true)}
                    className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
                    data-icod-id="src_pages_leaves_jsx_41f9"><Check size={14} /></button>
                  <button
                    onClick={() => handleManagerApprove(r._id, false)}
                    className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    data-icod-id="src_pages_leaves_jsx_10ba"><X size={14} /></button>
                </div>
              ) : null }] : []),
              ...((['hr', 'admin'].includes(user?.role)) ? [{ key: '_hr_actions', label: 'HR Action', render: (_, r) => r.status === 'manager_approved' ? (
                <div
                  className="flex items-center gap-1"
                  data-icod-id="src_pages_leaves_jsx_0cf0">
                  <button
                    onClick={() => handleHrApprove(r._id, true)}
                    className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
                    data-icod-id="src_pages_leaves_jsx_190d"><Check size={14} /></button>
                  <button
                    onClick={() => handleHrApprove(r._id, false)}
                    className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                    data-icod-id="src_pages_leaves_jsx_204b"><X size={14} /></button>
                </div>
              ) : null }] : []),
            ]} data={leaves} pageSize={10} />
          )}
        </div>
      </div>
      <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply for Leave" maxWidth="max-w-lg">
        <form
          onSubmit={handleApply}
          className="space-y-4"
          data-icod-id="src_pages_leaves_jsx_525c">
          <div data-icod-id="src_pages_leaves_jsx_1541">
            <label
              className="block text-sm font-medium text-[#0F172A] mb-1"
              data-icod-id="src_pages_leaves_jsx_7bc9">Leave Type *</label>
            <select
              value={form.leaveType}
              onChange={e => setForm({...form, leaveType: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
              data-icod-id="src_pages_leaves_jsx_70bd">
              <option value="casual" data-icod-id="src_pages_leaves_jsx_6f7a">Casual Leave</option>
              <option value="sick" data-icod-id="src_pages_leaves_jsx_c9d1">Sick Leave</option>
              <option value="annual" data-icod-id="src_pages_leaves_jsx_4a35">Annual Leave</option>
              <option value="unpaid" data-icod-id="src_pages_leaves_jsx_5655">Unpaid Leave</option>
              <option value="other" data-icod-id="src_pages_leaves_jsx_3ed6">Other</option>
            </select>
          </div>
          <div
            className="grid grid-cols-2 gap-4"
            data-icod-id="src_pages_leaves_jsx_f533">
            <div data-icod-id="src_pages_leaves_jsx_f5e3">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1"
                data-icod-id="src_pages_leaves_jsx_9fcd">Start Date *</label>
              <input
                required
                type="date"
                value={form.startDate}
                onChange={e => setForm({...form, startDate: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                data-icod-id="src_pages_leaves_jsx_eb76" />
            </div>
            <div data-icod-id="src_pages_leaves_jsx_4e85">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1"
                data-icod-id="src_pages_leaves_jsx_36f9">End Date *</label>
              <input
                required
                type="date"
                value={form.endDate}
                onChange={e => setForm({...form, endDate: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                data-icod-id="src_pages_leaves_jsx_6099" />
            </div>
          </div>
          <div data-icod-id="src_pages_leaves_jsx_bd1d">
            <label
              className="block text-sm font-medium text-[#0F172A] mb-1"
              data-icod-id="src_pages_leaves_jsx_ea85">Reason</label>
            <textarea
              value={form.reason}
              onChange={e => setForm({...form, reason: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
              data-icod-id="src_pages_leaves_jsx_8525" />
          </div>
          <FileUpload onFileSelect={setAttachFile} label="Attach supporting document (optional)" />
          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium text-sm"
            data-icod-id="src_pages_leaves_jsx_3f1e">
            Submit Application
          </button>
        </form>
      </Modal>
    </div>
  );
}
