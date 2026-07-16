import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, MoreVertical, UserCheck, UserX, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import AttendanceBadge from '../components/AttendanceBadge';
import { fetchEmployeesRequest, updateStatusRequest } from '../services/employeeService';
import { registerRequest } from '../services/authService';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const [newEmp, setNewEmp] = useState({ name: '', email: '', password: '', department: '', role: 'employee', employeeId: '' });

  useEffect(() => { loadEmployees(); }, [search, filterDept, filterStatus]);

  const loadEmployees = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (filterDept) params.department = filterDept;
      if (filterStatus) params.status = filterStatus;
      const { data } = await fetchEmployeesRequest(params);
      setEmployees(data.data);
    } catch (err) { toast.error('Failed to load employees'); }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await registerRequest(newEmp);
      toast.success('Employee created successfully');
      setShowAddModal(false);
      setNewEmp({ name: '', email: '', password: '', department: '', role: 'employee', employeeId: '' });
      loadEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to create employee');
    }
  };

  const toggleStatus = async (emp) => {
    try {
      const newStatus = emp.status === 'active' ? 'inactive' : 'active';
      await updateStatusRequest(emp._id, newStatus);
      toast.success(`Employee ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      loadEmployees();
    } catch (err) { toast.error('Failed to update status'); }
  };

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  const columns = [
    { key: 'employeeId', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true, render: (v, row) => (
      <button
        onClick={() => navigate(`/employees/${row._id}`)}
        className="text-indigo-600 hover:underline font-medium"
        data-icod-id="src_pages_employees_jsx_d33b">{v}</button>
    )},
    { key: 'email', label: 'Email', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (v) => <span
      className="capitalize px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
      data-icod-id="src_pages_employees_jsx_520e">{v}</span> },
    { key: 'status', label: 'Status', render: (v) => <AttendanceBadge status={v === 'active' ? 'present' : 'absent'} />, sortable: true },
    { key: '_actions', label: 'Actions', render: (_, row) => (
      <div
        className="flex items-center gap-1"
        data-icod-id="src_pages_employees_jsx_9490">
        <button
          onClick={() => navigate(`/employees/${row._id}`)}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#64748B]"
          title="View Profile"
          data-icod-id="src_pages_employees_jsx_b5f8"><FileText size={16} /></button>
        <button
          onClick={() => toggleStatus(row)}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#64748B]"
          title={row.status === 'active' ? 'Deactivate' : 'Activate'}
          data-icod-id="src_pages_employees_jsx_70ff">
          {row.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6" data-icod-id="src_pages_employees_jsx_b485">
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        data-icod-id="src_pages_employees_jsx_418f">
        <h1
          className="text-2xl font-bold text-[#0F172A]"
          data-icod-id="src_pages_employees_jsx_070e">Employees</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-sm font-medium"
          data-icod-id="src_pages_employees_jsx_db8e">
          <Plus size={16} /> Add Employee
        </button>
      </div>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
        data-icod-id="src_pages_employees_jsx_025c">
        <div
          className="flex flex-col sm:flex-row gap-3 mb-4"
          data-icod-id="src_pages_employees_jsx_c5ca">
          <div className="relative flex-1" data-icod-id="src_pages_employees_jsx_46bd">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
              data-icod-id="src_pages_employees_jsx_76c1" />
          </div>
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500"
            data-icod-id="src_pages_employees_jsx_e84a">
            <option value="" data-icod-id="src_pages_employees_jsx_b515">All Departments</option>
            {departments.map(d => <option key={d} value={d} data-icod-id={`src_pages_employees_jsx_469b_${d}`}>{d}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500"
            data-icod-id="src_pages_employees_jsx_b12c">
            <option value="" data-icod-id="src_pages_employees_jsx_0212">All Status</option>
            <option value="active" data-icod-id="src_pages_employees_jsx_dcfc">Active</option>
            <option value="inactive" data-icod-id="src_pages_employees_jsx_f3f9">Inactive</option>
          </select>
        </div>
        <DataTable columns={columns} data={employees} pageSize={10} />
      </div>
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Employee" maxWidth="max-w-xl">
        <form
          onSubmit={handleAddEmployee}
          className="space-y-4"
          data-icod-id="src_pages_employees_jsx_4864">
          <div
            className="grid grid-cols-2 gap-4"
            data-icod-id="src_pages_employees_jsx_d4f8">
            <div data-icod-id="src_pages_employees_jsx_e92d">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1"
                data-icod-id="src_pages_employees_jsx_9ae7">Full Name *</label>
              <input
                required
                type="text"
                value={newEmp.name}
                onChange={e => setNewEmp({...newEmp, name: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                data-icod-id="src_pages_employees_jsx_4b06" />
            </div>
            <div data-icod-id="src_pages_employees_jsx_6c9a">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1"
                data-icod-id="src_pages_employees_jsx_a6cc">Employee ID *</label>
              <input
                required
                type="text"
                value={newEmp.employeeId}
                onChange={e => setNewEmp({...newEmp, employeeId: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                data-icod-id="src_pages_employees_jsx_160d" />
            </div>
          </div>
          <div
            className="grid grid-cols-2 gap-4"
            data-icod-id="src_pages_employees_jsx_e317">
            <div data-icod-id="src_pages_employees_jsx_a9d1">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1"
                data-icod-id="src_pages_employees_jsx_ce15">Email *</label>
              <input
                required
                type="email"
                value={newEmp.email}
                onChange={e => setNewEmp({...newEmp, email: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                data-icod-id="src_pages_employees_jsx_fb8c" />
            </div>
            <div data-icod-id="src_pages_employees_jsx_7687">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1"
                data-icod-id="src_pages_employees_jsx_5cfb">Password *</label>
              <input
                required
                type="password"
                value={newEmp.password}
                onChange={e => setNewEmp({...newEmp, password: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                data-icod-id="src_pages_employees_jsx_8be9" />
            </div>
          </div>
          <div
            className="grid grid-cols-2 gap-4"
            data-icod-id="src_pages_employees_jsx_4995">
            <div data-icod-id="src_pages_employees_jsx_a8c1">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1"
                data-icod-id="src_pages_employees_jsx_880e">Department</label>
              <input
                type="text"
                value={newEmp.department}
                onChange={e => setNewEmp({...newEmp, department: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                data-icod-id="src_pages_employees_jsx_35ca" />
            </div>
            <div data-icod-id="src_pages_employees_jsx_0d97">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1"
                data-icod-id="src_pages_employees_jsx_c5e0">Role</label>
              <select
                value={newEmp.role}
                onChange={e => setNewEmp({...newEmp, role: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                data-icod-id="src_pages_employees_jsx_052c">
                <option value="employee" data-icod-id="src_pages_employees_jsx_4acb">Employee</option>
                <option value="manager" data-icod-id="src_pages_employees_jsx_0329">Manager</option>
                <option value="hr" data-icod-id="src_pages_employees_jsx_e83a">HR</option>
                <option value="admin" data-icod-id="src_pages_employees_jsx_8567">Admin</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium text-sm"
            data-icod-id="src_pages_employees_jsx_9a62">
            Create Employee
          </button>
        </form>
      </Modal>
    </div>
  );
}
