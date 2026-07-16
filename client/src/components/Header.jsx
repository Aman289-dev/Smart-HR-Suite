import { useState, useEffect } from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchNotifications } from '../store/slices/notificationSlice';
import NotificationBell from './NotificationBell';

export default function Header() {
  const user = useAppSelector(state => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex items-center justify-between"
      data-icod-id="src_components_header_jsx_174c">
      <div
        className="flex items-center gap-3"
        data-icod-id="src_components_header_jsx_05a8">
        <Menu size={20} className="lg:hidden text-gray-600" />
        <h2
          className="text-lg font-semibold text-[#0F172A] hidden sm:block"
          data-icod-id="src_components_header_jsx_b38d">
          Welcome back, {user?.name?.split(' ')[0]}
        </h2>
      </div>
      <div
        className="flex items-center gap-4"
        data-icod-id="src_components_header_jsx_87b4">
        <NotificationBell />
        
        <div className="relative" data-icod-id="src_components_header_jsx_0bde">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-all"
            data-icod-id="src_components_header_jsx_0011">
            <div
              className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm"
              data-icod-id="src_components_header_jsx_d888">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span
              className="hidden sm:block text-sm font-medium text-[#0F172A]"
              data-icod-id="src_components_header_jsx_a83c">{user?.name}</span>
          </button>
          
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
                data-icod-id="src_components_header_jsx_2d64" />
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
                data-icod-id="src_components_header_jsx_f12a">
                <div
                  className="px-4 py-2 border-b border-gray-100"
                  data-icod-id="src_components_header_jsx_ce51">
                  <p
                    className="text-sm font-medium text-[#0F172A]"
                    data-icod-id="src_components_header_jsx_acde">{user?.name}</p>
                  <p
                    className="text-xs text-[#64748B] capitalize"
                    data-icod-id="src_components_header_jsx_dc6d">{user?.role}</p>
                </div>
                <a
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-[#0F172A] hover:bg-gray-50"
                  data-icod-id="src_components_header_jsx_e44d">Dashboard</a>
                <a
                  href="/auth"
                  onClick={() => { localStorage.clear(); }}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  data-icod-id="src_components_header_jsx_b148">Sign Out</a>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
