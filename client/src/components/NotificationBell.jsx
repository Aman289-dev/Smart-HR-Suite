import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchNotifications } from '../store/slices/notificationSlice';

export default function NotificationBell() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const unreadCount = useAppSelector(state => state.notifications.unreadCount);

  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="relative p-2 rounded-xl hover:bg-gray-100 transition-all"
      data-icod-id="src_components_notificationbell_jsx_66a0">
      <Bell size={20} className="text-[#64748B]" />
      {unreadCount > 0 && (
        <span
          className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse"
          data-icod-id="src_components_notificationbell_jsx_3b25">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
