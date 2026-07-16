import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CalendarDays, AlertCircle, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { useAppSelector } from '../store/hooks';
import ClockWidget from '../components/ClockWidget';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import AttendanceBadge from '../components/AttendanceBadge';
import DataTable from '../components/DataTable';
import { fetchDashboardStatsRequest, fetchAttendanceReportRequest } from '../services/reportService';
import { fetchMyLeavesRequest } from '../services/leaveService';
import { fetchMyAttendanceRequest } from '../services/attendanceService';
import { fetchAllLeavesRequest } from '../services/leaveService';
import { fetchAttendanceRequest } from '../services/attendanceService';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard() {
  const user = useAppSelector(state => state.auth.user);
  const notifications = useAppSelector(state => state.notifications.items);
  const [stats, setStats] = useState(null);
  const [myLeaves, setMyLeaves] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveDist, setLeaveDist] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (['hr', 'admin'].includes(user?.role)) {
        const { data } = await fetchDashboardStatsRequest();
        setStats(data.data);
        
        // Get attendance report for chart
        try {
          const attReport = await fetchAttendanceReportRequest({});
          setAttendanceData(attReport.data.data?.slice(0, 7)?.map(d => ({ date: d._id?.date, present: d.present, absent: d.absent })) || []);
        } catch(e) {}
        
        try {
          const leaves = await fetchAllLeavesRequest({});
          const dist = {};
          leaves.data.data?.forEach(l => { dist[l.leaveType] = (dist[l.leaveType] || 0) + l.totalDays; });
          setLeaveDist(Object.entries(dist).map(([name, value]) => ({ name, value })));
        } catch(e) {}
      }
      
      if (user?.role === 'employee') {
        try {
          const { data } = await fetchMyLeavesRequest();
          setMyLeaves(data.data?.slice(0, 5) || []);
        } catch(e) {}
        
        try {
          const now = new Date();
          const { data } = await fetchMyAttendanceRequest({ month: String(now.getMonth() + 1), year: String(now.getFullYear()) });
          setMyAttendance(data.data?.slice(0, 7) || []);
        } catch(e) {}
      }
      
      if (user?.role === 'manager') {
        try {
          const { data } = await fetchAllLeavesRequest({ status: 'pending' });
          setTeamLeaves(data.data?.slice(0, 5) || []);
        } catch(e) {}
      }
    } catch (err) { /* ignore */ }
  };

  const KpiCard = ({ icon: Icon, label, value, color }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div
        className="flex items-center gap-4"
        data-icod-id="src_pages_dashboard_jsx_3ce3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
          data-icod-id="src_pages_dashboard_jsx_f8f3">
          <Icon size={24} className="text-white" />
        </div>
        <div data-icod-id="src_pages_dashboard_jsx_4c29">
          <p
            className="text-2xl font-bold text-[#0F172A]"
            data-icod-id="src_pages_dashboard_jsx_eed0">{value ?? '-'}</p>
          <p
            className="text-xs text-[#64748B] font-medium"
            data-icod-id="src_pages_dashboard_jsx_3810">{label}</p>
        </div>
      </div>
    </motion.div>
  );

  // Employee Dashboard
  if (user?.role === 'employee') {
    return (
      <div className="space-y-6" data-icod-id="src_pages_dashboard_jsx_4acc">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          data-icod-id="src_pages_dashboard_jsx_426a">
          <ClockWidget />
          <div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            data-icod-id="src_pages_dashboard_jsx_525d">
            <h3
              className="text-lg font-bold text-[#0F172A] mb-4"
              data-icod-id="src_pages_dashboard_jsx_4882">Leave Balance</h3>
            <LeaveBalanceCard balances={user?.leaveBalances} />
          </div>
        </div>
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          data-icod-id="src_pages_dashboard_jsx_9b20">
          <div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            data-icod-id="src_pages_dashboard_jsx_c80b">
            <h3
              className="text-lg font-bold text-[#0F172A] mb-4"
              data-icod-id="src_pages_dashboard_jsx_8cc6">Recent Attendance</h3>
            <DataTable columns={[
              { key: 'date', label: 'Date', sortable: true },
              { key: 'status', label: 'Status', render: (v) => <AttendanceBadge status={v} /> },
              { key: 'totalHours', label: 'Hours', render: (v) => `${v || 0}h` },
            ]} data={myAttendance} pageSize={5} />
          </div>

          <div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            data-icod-id="src_pages_dashboard_jsx_c63f">
            <h3
              className="text-lg font-bold text-[#0F172A] mb-4"
              data-icod-id="src_pages_dashboard_jsx_81f0">Recent Leave Requests</h3>
            <DataTable columns={[
              { key: 'leaveType', label: 'Type', render: (v) => <span className="capitalize" data-icod-id="src_pages_dashboard_jsx_0bfe">{v}</span> },
              { key: 'totalDays', label: 'Days' },
              { key: 'status', label: 'Status', render: (v) => <AttendanceBadge status={v} /> },
            ]} data={myLeaves} pageSize={5} />
          </div>
        </div>
      </div>
    );
  }

  // Manager Dashboard
  if (user?.role === 'manager') {
    return (
      <div className="space-y-6" data-icod-id="src_pages_dashboard_jsx_9a25">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          data-icod-id="src_pages_dashboard_jsx_1752">
          <ClockWidget />
          <div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            data-icod-id="src_pages_dashboard_jsx_9cde">
            <h3
              className="text-lg font-bold text-[#0F172A] mb-4"
              data-icod-id="src_pages_dashboard_jsx_dce6">Pending Leave Approvals</h3>
            {teamLeaves.length === 0 ? (
              <p
                className="text-[#64748B] text-sm py-8 text-center"
                data-icod-id="src_pages_dashboard_jsx_727e">No pending approvals</p>
            ) : (
              <DataTable columns={[
                { key: 'userId', label: 'Employee', render: (_, r) => r.userId?.name },
                { key: 'leaveType', label: 'Type', render: (v) => <span className="capitalize" data-icod-id="src_pages_dashboard_jsx_4338">{v}</span> },
                { key: 'totalDays', label: 'Days' },
                { key: 'status', label: 'Status', render: (v) => <AttendanceBadge status={v} /> },
              ]} data={teamLeaves} pageSize={5} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // HR/Admin Dashboard
  return (
    <div className="space-y-6" data-icod-id="src_pages_dashboard_jsx_e2f1">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        data-icod-id="src_pages_dashboard_jsx_7578">
        <KpiCard icon={Users} label="Total Employees" value={stats?.totalEmployees} color="bg-blue-500" />
        <KpiCard icon={Clock} label="Present Today" value={stats?.presentToday} color="bg-emerald-500" />
        <KpiCard icon={CalendarDays} label="On Leave Today" value={stats?.onLeaveToday} color="bg-amber-500" />
        <KpiCard icon={AlertCircle} label="Pending Approvals" value={stats?.pendingApprovals} color="bg-red-500" />
      </div>
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        data-icod-id="src_pages_dashboard_jsx_eb17">
        <div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          data-icod-id="src_pages_dashboard_jsx_6ba8">
          <div
            className="flex items-center gap-2 mb-4"
            data-icod-id="src_pages_dashboard_jsx_d1ec">
            <TrendingUp size={20} className="text-indigo-600" />
            <h3
              className="text-lg font-bold text-[#0F172A]"
              data-icod-id="src_pages_dashboard_jsx_f697">Attendance Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          data-icod-id="src_pages_dashboard_jsx_5f79">
          <div
            className="flex items-center gap-2 mb-4"
            data-icod-id="src_pages_dashboard_jsx_8f9b">
            <PieChartIcon size={20} className="text-indigo-600" />
            <h3
              className="text-lg font-bold text-[#0F172A]"
              data-icod-id="src_pages_dashboard_jsx_8e68">Leave Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={leaveDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {leaveDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
