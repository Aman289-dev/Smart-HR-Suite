import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppSelector } from './store/hooks';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeProfile from './pages/EmployeeProfile';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function ProtectedRoute({ children, roles }) {
  const user = useAppSelector(state => state.auth.user);
  if (!user) return <Navigate to="/auth" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-icod-id="src_app_jsx_ab8d">
      <Sidebar />
      <div
        className="lg:ml-[240px] transition-all duration-300"
        data-icod-id="src_app_jsx_f861">
        <Header />
        <main className="p-6 max-w-7xl mx-auto" data-icod-id="src_app_jsx_fdbc">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>
        } />
        
        <Route path="/employees" element={
          <ProtectedRoute roles={['hr', 'admin']}><AppLayout><Employees /></AppLayout></ProtectedRoute>
        } />
        
        <Route path="/employees/:id" element={
          <ProtectedRoute><AppLayout><EmployeeProfile /></AppLayout></ProtectedRoute>
        } />
        
        <Route path="/attendance" element={
          <ProtectedRoute><AppLayout><Attendance /></AppLayout></ProtectedRoute>
        } />
        
        <Route path="/leaves" element={
          <ProtectedRoute><AppLayout><Leaves /></AppLayout></ProtectedRoute>
        } />
        
        <Route path="/reports" element={
          <ProtectedRoute roles={['hr', 'admin']}><AppLayout><Reports /></AppLayout></ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
          <ProtectedRoute><AppLayout><Notifications /></AppLayout></ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute roles={['hr', 'admin']}><AppLayout><Settings /></AppLayout></ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
