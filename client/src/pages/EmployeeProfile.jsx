import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Trash2, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import AttendanceBadge from '../components/AttendanceBadge';
import LeaveBalanceCard from '../components/LeaveBalanceCard';
import DataTable from '../components/DataTable';
import FileUpload from '../components/FileUpload';
import { fetchEmployeeRequest, uploadDocumentRequest, deleteDocumentRequest, updateEmployeeRequest } from '../services/employeeService';
import { fetchMyAttendanceRequest, fetchAttendanceRequest } from '../services/attendanceService';
import { fetchMyLeavesRequest, fetchAllLeavesRequest } from '../services/leaveService';
import { useAppSelector } from '../store/hooks';

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAppSelector(state => state.auth.user);
  const [employee, setEmployee] = useState(null);
  const [tab, setTab] = useState('info');
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    loadProfile();
  }, [id]);

  useEffect(() => {
    if (tab === 'attendance') loadAttendance();
    if (tab === 'leaves') loadLeaves();
  }, [tab]);

  const loadProfile = async () => {
    try {
      const { data } = await fetchEmployeeRequest(id);
      setEmployee(data.data);
    } catch (err) { toast.error('Failed to load profile'); }
  };

  const loadAttendance = async () => {
    try {
      const { data } = await fetchAttendanceRequest({ userId: id });
      setAttendance(data.data);
    } catch (err) { /* ignore */ }
  };

  const loadLeaves = async () => {
    try {
      const { data } = await fetchAllLeavesRequest({});
      setLeaves(data.data.filter(l => l.userId?._id === id));
    } catch (err) { /* ignore */ }
  };

  const handleUploadDoc = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    try {
      await uploadDocumentRequest(id, formData);
      toast.success('Document uploaded');
      loadProfile();
    } catch (err) { toast.error('Upload failed'); }
  };

  const handleDeleteDoc = async (docId) => {
    try {
      await deleteDocumentRequest(id, docId);
      toast.success('Document deleted');
      loadProfile();
    } catch (err) { toast.error('Delete failed'); }
  };

  if (!employee) return (
    <div
      className="flex items-center justify-center h-64 text-[#64748B]"
      data-icod-id="src_pages_employeeprofile_jsx_f40e">Loading...</div>
  );

  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'leaves', label: 'Leaves' },
  ];

  return (
    <div className="space-y-6" data-icod-id="src_pages_employeeprofile_jsx_aee5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#64748B] hover:text-indigo-600 transition-colors text-sm"
        data-icod-id="src_pages_employeeprofile_jsx_d5b4">
        <ArrowLeft size={16} /> Back
      </button>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        data-icod-id="src_pages_employeeprofile_jsx_1b12">
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6"
          data-icod-id="src_pages_employeeprofile_jsx_c882">
          <div
            className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold"
            data-icod-id="src_pages_employeeprofile_jsx_cc99">
            {employee.name?.charAt(0)}
          </div>
          <div data-icod-id="src_pages_employeeprofile_jsx_5c90">
            <h1
              className="text-2xl font-bold text-[#0F172A]"
              data-icod-id="src_pages_employeeprofile_jsx_888c">{employee.name}</h1>
            <p
              className="text-[#64748B]"
              data-icod-id="src_pages_employeeprofile_jsx_f35f">{employee.employeeId} &middot; <span className="capitalize" data-icod-id="src_pages_employeeprofile_jsx_c2ad">{employee.role}</span> &middot; {employee.department}</p>
          </div>
          <div className="sm:ml-auto" data-icod-id="src_pages_employeeprofile_jsx_5e8c">
            <AttendanceBadge status={employee.status === 'active' ? 'present' : 'absent'} />
          </div>
        </div>

        <div
          className="flex gap-1 border-b border-gray-200 mb-6"
          data-icod-id="src_pages_employeeprofile_jsx_87ad">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'}`}
              data-icod-id={`src_pages_employeeprofile_jsx_57a1_${t.id}`}>{t.label}</button>
          ))}
        </div>

        {tab === 'info' && (
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            data-icod-id="src_pages_employeeprofile_jsx_e719">
            <div className="space-y-4" data-icod-id="src_pages_employeeprofile_jsx_f703">
              <h3
                className="text-lg font-bold text-[#0F172A]"
                data-icod-id="src_pages_employeeprofile_jsx_6d72">Contact Information</h3>
              <div className="space-y-3" data-icod-id="src_pages_employeeprofile_jsx_9221">
                <div
                  className="flex items-center gap-3 text-sm"
                  data-icod-id="src_pages_employeeprofile_jsx_031f">
                  <Mail size={16} className="text-[#64748B]" />
                  <span
                    className="text-[#0F172A]"
                    data-icod-id="src_pages_employeeprofile_jsx_9f46">{employee.email}</span>
                </div>
                <div
                  className="flex items-center gap-3 text-sm"
                  data-icod-id="src_pages_employeeprofile_jsx_1d7c">
                  <Phone size={16} className="text-[#64748B]" />
                  <span
                    className="text-[#0F172A]"
                    data-icod-id="src_pages_employeeprofile_jsx_c4cf">{employee.contactInfo?.phone || 'Not provided'}</span>
                </div>
                <div
                  className="flex items-center gap-3 text-sm"
                  data-icod-id="src_pages_employeeprofile_jsx_7a90">
                  <MapPin size={16} className="text-[#64748B]" />
                  <span
                    className="text-[#0F172A]"
                    data-icod-id="src_pages_employeeprofile_jsx_99ab">{employee.contactInfo?.address || 'Not provided'}</span>
                </div>
                <div
                  className="flex items-center gap-3 text-sm"
                  data-icod-id="src_pages_employeeprofile_jsx_8e16">
                  <Briefcase size={16} className="text-[#64748B]" />
                  <span
                    className="text-[#0F172A]"
                    data-icod-id="src_pages_employeeprofile_jsx_1ec3">Manager: {employee.managerId?.name || 'None'}</span>
                </div>
                <div
                  className="flex items-center gap-3 text-sm"
                  data-icod-id="src_pages_employeeprofile_jsx_a331">
                  <Calendar size={16} className="text-[#64748B]" />
                  <span
                    className="text-[#0F172A]"
                    data-icod-id="src_pages_employeeprofile_jsx_333e">Joined: {new Date(employee.dateOfJoining).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4" data-icod-id="src_pages_employeeprofile_jsx_05e5">
              <h3
                className="text-lg font-bold text-[#0F172A]"
                data-icod-id="src_pages_employeeprofile_jsx_7c00">Leave Balance</h3>
              <LeaveBalanceCard balances={employee.leaveBalances} />
              
              <h3
                className="text-lg font-bold text-[#0F172A] mt-6"
                data-icod-id="src_pages_employeeprofile_jsx_c899">Documents</h3>
              {['hr', 'admin'].includes(currentUser?.role) && (
                <div className="mb-3" data-icod-id="src_pages_employeeprofile_jsx_5c5d">
                  <FileUpload onFileSelect={handleUploadDoc} label="Upload document" />
                </div>
              )}
              {employee.documents?.length > 0 ? (
                <div className="space-y-2" data-icod-id="src_pages_employeeprofile_jsx_0ffc">
                  {employee.documents.map(doc => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      data-icod-id={`src_pages_employeeprofile_jsx_63d5_${doc._id}`}>
                      <span
                        className="text-sm text-[#0F172A]"
                        data-icod-id={`src_pages_employeeprofile_jsx_16b3_${doc._id}`}>{doc.name}</span>
                      {['hr', 'admin'].includes(currentUser?.role) && (
                        <button
                          onClick={() => handleDeleteDoc(doc._id)}
                          className="text-red-500 hover:text-red-700"
                          data-icod-id={`src_pages_employeeprofile_jsx_b2f0_${doc._id}`}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : <p
                className="text-sm text-[#64748B]"
                data-icod-id="src_pages_employeeprofile_jsx_9b0a">No documents uploaded</p>}
            </div>
          </div>
        )}

        {tab === 'attendance' && (
          <DataTable columns={[
            { key: 'date', label: 'Date', sortable: true },
            { key: 'clockIn', label: 'Clock In', render: v => v ? new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--' },
            { key: 'clockOut', label: 'Clock Out', render: v => v ? new Date(v).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--' },
            { key: 'totalHours', label: 'Hours', render: v => `${v || 0}h` },
            { key: 'status', label: 'Status', render: v => <AttendanceBadge status={v} /> },
          ]} data={attendance} pageSize={10} />
        )}

        {tab === 'leaves' && (
          <DataTable columns={[
            { key: 'leaveType', label: 'Type', render: v => <span className="capitalize" data-icod-id="src_pages_employeeprofile_jsx_6f03">{v}</span> },
            { key: 'startDate', label: 'From', render: v => new Date(v).toLocaleDateString() },
            { key: 'endDate', label: 'To', render: v => new Date(v).toLocaleDateString() },
            { key: 'totalDays', label: 'Days' },
            { key: 'status', label: 'Status', render: v => <AttendanceBadge status={v} /> },
          ]} data={leaves} pageSize={10} />
        )}
      </div>
    </div>
  );
}
