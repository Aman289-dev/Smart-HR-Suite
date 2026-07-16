import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import DataTable from '../components/DataTable';
import ExportButton from '../components/ExportButton';
import { fetchAttendanceReportRequest, fetchLeaveUsageRequest } from '../services/reportService';
import { exportAttendanceRequest } from '../services/attendanceService';
import { exportLeavesRequest } from '../services/leaveService';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Reports() {
  const [reportTab, setReportTab] = useState('attendance');
  const [attData, setAttData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [deptFilter, setDeptFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => { loadReport(); }, [reportTab, deptFilter, startDate, endDate]);

  const loadReport = async () => {
    try {
      const params = {};
      if (deptFilter) params.department = deptFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      if (reportTab === 'attendance') {
        const { data } = await fetchAttendanceReportRequest(params);
        setAttData(data.data?.map(d => ({
          date: d._id?.date || d._id,
          present: d.present || 0,
          absent: d.absent || 0,
          late: d.late || 0
        })) || []);
      } else {
        const { data } = await fetchLeaveUsageRequest(params);
        setLeaveData(data.data?.map(d => ({
          name: d._id?.leaveType || d._id,
          days: d.totalDays || 0,
          count: d.count || 0
        })) || []);
      }
    } catch (err) { /* ignore */ }
  };

  return (
    <div className="space-y-6" data-icod-id="src_pages_reports_jsx_05a1">
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        data-icod-id="src_pages_reports_jsx_a69b">
        <h1
          className="text-2xl font-bold text-[#0F172A]"
          data-icod-id="src_pages_reports_jsx_0766">Reports</h1>
        <ExportButton onClick={() => reportTab === 'attendance' ? exportAttendanceRequest({ department: deptFilter, startDate, endDate }) : exportLeavesRequest({ department: deptFilter, startDate, endDate })} />
      </div>
      <div className="flex gap-2" data-icod-id="src_pages_reports_jsx_2e60">
        {[{ id: 'attendance', label: 'Attendance Summary', icon: BarChartIcon }, { id: 'leave', label: 'Leave Usage', icon: PieChartIcon }].map(t => (
          <button
            key={t.id}
            onClick={() => setReportTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${reportTab === t.id ? 'bg-indigo-600 text-white' : 'bg-white text-[#64748B] border border-gray-200 hover:bg-gray-50'}`}
            data-icod-id={`src_pages_reports_jsx_0394_${t.id}`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
        data-icod-id="src_pages_reports_jsx_7fd2">
        <div
          className="flex flex-col sm:flex-row gap-3 mb-6"
          data-icod-id="src_pages_reports_jsx_4772">
          <input
            type="text"
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            placeholder="Filter by department..."
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500"
            data-icod-id="src_pages_reports_jsx_286a" />
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500"
            data-icod-id="src_pages_reports_jsx_4a57" />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500"
            data-icod-id="src_pages_reports_jsx_d64c" />
        </div>
      </div>
      {reportTab === 'attendance' ? (
        <div className="space-y-6" data-icod-id="src_pages_reports_jsx_eb5b">
          <div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            data-icod-id="src_pages_reports_jsx_49f4">
            <h3
              className="text-lg font-bold text-[#0F172A] mb-4"
              data-icod-id="src_pages_reports_jsx_4955">Daily Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attData.slice(0, 30)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#10B981" radius={[4,4,0,0]} />
                <Bar dataKey="absent" fill="#EF4444" radius={[4,4,0,0]} />
                <Bar dataKey="late" fill="#F59E0B" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100"
            data-icod-id="src_pages_reports_jsx_1b04">
            <DataTable columns={[
              { key: 'date', label: 'Date', sortable: true },
              { key: 'present', label: 'Present', sortable: true },
              { key: 'absent', label: 'Absent', sortable: true },
              { key: 'late', label: 'Late', sortable: true },
            ]} data={attData} pageSize={10} />
          </div>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          data-icod-id="src_pages_reports_jsx_aea4">
          <div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            data-icod-id="src_pages_reports_jsx_a37c">
            <h3
              className="text-lg font-bold text-[#0F172A] mb-4"
              data-icod-id="src_pages_reports_jsx_c37b">Leave Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={leaveData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="days" label={({ name, days }) => `${name}: ${days}d`}>
                  {leaveData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100"
            data-icod-id="src_pages_reports_jsx_fc5b">
            <DataTable columns={[
              { key: 'name', label: 'Leave Type', render: v => <span className="capitalize" data-icod-id="src_pages_reports_jsx_db77">{v}</span>, sortable: true },
              { key: 'days', label: 'Total Days', sortable: true },
              { key: 'count', label: 'Requests', sortable: true },
            ]} data={leaveData} pageSize={10} />
          </div>
        </div>
      )}
    </div>
  );
}
