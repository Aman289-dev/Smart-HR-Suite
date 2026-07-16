import { CalendarDays } from 'lucide-react';

export default function LeaveBalanceCard({ balances }) {
  if (!balances) return null;
  
  const types = [
    { key: 'casual', label: 'Casual', color: 'bg-blue-500' },
    { key: 'sick', label: 'Sick', color: 'bg-rose-500' },
    { key: 'annual', label: 'Annual', color: 'bg-emerald-500' },
    { key: 'unpaid', label: 'Unpaid', color: 'bg-gray-400' },
  ];

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      data-icod-id="src_components_leavebalancecard_jsx_1758">
      {types.map(t => (
        <div
          key={t.key}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"
          data-icod-id={`src_components_leavebalancecard_jsx_2e52_${t.key}`}>
          <div
            className={`w-2 h-2 rounded-full mx-auto mb-2 ${t.color}`}
            data-icod-id={`src_components_leavebalancecard_jsx_b856_${t.key}`} />
          <p
            className="text-2xl font-bold text-[#0F172A]"
            data-icod-id={`src_components_leavebalancecard_jsx_4614_${t.key}`}>{balances[t.key] ?? 0}</p>
          <p
            className="text-xs text-[#64748B] font-medium"
            data-icod-id={`src_components_leavebalancecard_jsx_8303_${t.key}`}>{t.label} Leave</p>
        </div>
      ))}
    </div>
  );
}
