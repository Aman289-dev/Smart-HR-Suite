import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, clearError } from '../store/slices/authSlice';

const DEMO_USERS = [
  { role: 'HR Admin', email: 'hr@company.com', password: 'Hr@1234' },
  { role: 'Manager', email: 'manager@company.com', password: 'Manager@1234' },
  { role: 'Employee', email: 'employee@company.com', password: 'Employee@1234' },
];

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter email and password');
    
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      toast.success('Login successful');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  const fillDemo = (user) => {
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4"
      data-icod-id="src_pages_auth_jsx_7c85">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          data-icod-id="src_pages_auth_jsx_ae56">
          <div
            className="bg-[#1E1B4B] px-8 py-6 text-center"
            data-icod-id="src_pages_auth_jsx_bdbf">
            <div
              className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3"
              data-icod-id="src_pages_auth_jsx_ae47">
              <LogIn size={24} className="text-white" />
            </div>
            <h1
              className="text-2xl font-bold text-white"
              data-icod-id="src_pages_auth_jsx_b57c">HRMS Login</h1>
            <p
              className="text-indigo-300 text-sm mt-1"
              data-icod-id="src_pages_auth_jsx_0ee6">Human Resource Management System</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-4"
            data-icod-id="src_pages_auth_jsx_7cfa">
            {error && (
              <div
                className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-xl"
                data-icod-id="src_pages_auth_jsx_444d">{error}</div>
            )}
            
            <div data-icod-id="src_pages_auth_jsx_dff8">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
                data-icod-id="src_pages_auth_jsx_798b">Email</label>
              <div className="relative" data-icod-id="src_pages_auth_jsx_1288">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                  placeholder="Enter your email"
                  data-icod-id="src_pages_auth_jsx_8175" />
              </div>
            </div>

            <div data-icod-id="src_pages_auth_jsx_15ca">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
                data-icod-id="src_pages_auth_jsx_061f">Password</label>
              <div className="relative" data-icod-id="src_pages_auth_jsx_3674">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                  placeholder="Enter your password"
                  data-icod-id="src_pages_auth_jsx_068a" />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium text-sm disabled:opacity-50"
              data-icod-id="src_pages_auth_jsx_5db1">
              {status === 'loading' ? 'Signing in...' : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div
            className="bg-gray-50 px-8 py-5 border-t border-gray-100"
            data-icod-id="src_pages_auth_jsx_6443">
            <p
              className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3"
              data-icod-id="src_pages_auth_jsx_334a">Demo credentials:</p>
            <div className="space-y-2" data-icod-id="src_pages_auth_jsx_7219">
              {DEMO_USERS.map(u => (
                <div
                  key={u.role}
                  className="flex items-center justify-between text-xs"
                  data-icod-id={`src_pages_auth_jsx_82d1_${u.role}`}>
                  <span
                    className="text-[#0F172A]"
                    data-icod-id={`src_pages_auth_jsx_d24e_${u.role}`}>
                    <span
                      className="font-medium"
                      data-icod-id={`src_pages_auth_jsx_6d72_${u.role}`}>{u.role}:</span> {u.email} / {u.password}
                  </span>
                  <button
                    onClick={() => fillDemo(u)}
                    className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-xs font-medium"
                    data-icod-id={`src_pages_auth_jsx_97e2_${u.role}`}>
                    Fill
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
