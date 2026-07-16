import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Clock, CalendarDays, Info } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchNotifications, markAsRead, markAllAsRead } from '../store/slices/notificationSlice';

const typeIcons = { leave: CalendarDays, attendance: Clock, system: Info };
const typeColors = { leave: 'bg-indigo-100 text-indigo-600', attendance: 'bg-amber-100 text-amber-600', system: 'bg-blue-100 text-blue-600' };

export default function Notifications() {
  const dispatch = useAppDispatch();
  const { items, unreadCount } = useAppSelector(state => state.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  const handleMarkRead = (id) => { dispatch(markAsRead(id)); };
  const handleMarkAll = () => { dispatch(markAllAsRead()); };

  return (
    <div className="space-y-6" data-icod-id="src_pages_notifications_jsx_3fc4">
      <div
        className="flex items-center justify-between"
        data-icod-id="src_pages_notifications_jsx_fb75">
        <h1
          className="text-2xl font-bold text-[#0F172A]"
          data-icod-id="src_pages_notifications_jsx_97c1">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-sm font-medium"
            data-icod-id="src_pages_notifications_jsx_09d0">
            <CheckCheck size={16} /> Mark All Read
          </button>
        )}
      </div>
      <div className="space-y-3" data-icod-id="src_pages_notifications_jsx_5d90">
        {items.length === 0 ? (
          <div
            className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
            data-icod-id="src_pages_notifications_jsx_3258">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <p
              className="text-[#64748B]"
              data-icod-id="src_pages_notifications_jsx_420d">No notifications yet</p>
          </div>
        ) : (
          items.map(n => {
            const Icon = typeIcons[n.type] || Info;
            const colorClass = typeColors[n.type] || typeColors.system;
            return (
              <motion.div key={n._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${n.isRead ? 'border-gray-100 opacity-70' : 'border-indigo-200 bg-indigo-50/30'}`}
              >
                <div
                  className="flex items-start gap-4"
                  data-icod-id={`src_pages_notifications_jsx_5c80_${n._id}`}>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}
                    data-icod-id={`src_pages_notifications_jsx_08c7_${n._id}`}>
                    <Icon size={20} />
                  </div>
                  <div
                    className="flex-1 min-w-0"
                    data-icod-id={`src_pages_notifications_jsx_ab96_${n._id}`}>
                    <div
                      className="flex items-center justify-between mb-1"
                      data-icod-id={`src_pages_notifications_jsx_4c6b_${n._id}`}>
                      <h4
                        className={`text-sm font-semibold ${n.isRead ? 'text-[#64748B]' : 'text-[#0F172A]'}`}
                        data-icod-id={`src_pages_notifications_jsx_9ac0_${n._id}`}>{n.title}</h4>
                      <span
                        className="text-xs text-[#64748B] whitespace-nowrap"
                        data-icod-id={`src_pages_notifications_jsx_adf9_${n._id}`}>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p
                      className="text-sm text-[#64748B]"
                      data-icod-id={`src_pages_notifications_jsx_968e_${n._id}`}>{n.message}</p>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n._id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-[#64748B]"
                      title="Mark as read"
                      data-icod-id={`src_pages_notifications_jsx_2631_${n._id}`}>
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
