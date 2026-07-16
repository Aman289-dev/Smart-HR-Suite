import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, CalendarDays, BarChart3, Bell, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['employee', 'manager', 'hr', 'admin'] },
  { path: '/employees', icon: Users, label: 'Employees', roles: ['hr', 'admin'] },
  { path: '/attendance', icon: Clock, label: 'Attendance', roles: ['employee', 'manager', 'hr', 'admin'] },
  { path: '/leaves', icon: CalendarDays, label: 'Leaves', roles: ['employee', 'manager', 'hr', 'admin'] },
  { path: '/reports', icon: BarChart3, label: 'Reports', roles: ['hr', 'admin'] },
  { path: '/notifications', icon: Bell, label: 'Notifications', roles: ['employee', 'manager', 'hr', 'admin'] },
  { path: '/settings', icon: Settings, label: 'Settings', roles: ['hr', 'admin'] },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useAppSelector(state => state.auth.user);
  const unreadCount = useAppSelector(state => state.notifications.unreadCount);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/auth';
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      className="fixed left-0 top-0 h-screen bg-[#1E1B4B] text-white z-50 flex flex-col transition-all duration-300"
    >
      <div
        className="flex items-center justify-between p-4 border-b border-indigo-800"
        data-icod-id="src_components_sidebar_jsx_eb09">
        {!collapsed && <h1
          className="text-xl font-bold tracking-tight"
          data-icod-id="src_components_sidebar_jsx_770a">HRMS</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-indigo-800 rounded"
          data-icod-id="src_components_sidebar_jsx_a387">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav
        className="flex-1 py-4 space-y-1 px-2"
        data-icod-id="src_components_sidebar_jsx_103e">
        {filteredItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <NavLink key={item.path} to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group ${isActive ? 'bg-[#4F46E5] border-l-4 border-indigo-300' : 'hover:bg-indigo-800/50 border-l-4 border-transparent'}`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && <span
                className="text-sm font-medium"
                data-icod-id={`src_components_sidebar_jsx_d785_${item.path}`}>{item.label}</span>}
              {item.path === '/notifications' && unreadCount > 0 && (
                <span
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  data-icod-id={`src_components_sidebar_jsx_2e64_${item.path}`}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              {collapsed && (
                <div
                  className="absolute left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50"
                  data-icod-id={`src_components_sidebar_jsx_5895_${item.path}`}>
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div
        className="p-3 border-t border-indigo-800"
        data-icod-id="src_components_sidebar_jsx_f83c">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-all w-full"
          data-icod-id="src_components_sidebar_jsx_ed22">
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span
            className="text-sm font-medium"
            data-icod-id="src_components_sidebar_jsx_c708">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
