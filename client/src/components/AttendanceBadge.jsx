const statusColors = {
  present: 'bg-emerald-100 text-emerald-700',
  late: 'bg-amber-100 text-amber-700',
  absent: 'bg-red-100 text-red-700',
  'half-day': 'bg-blue-100 text-blue-700',
  holiday: 'bg-purple-100 text-purple-700',
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-emerald-100 text-emerald-700',
  manager_approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AttendanceBadge({ status }) {
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-700';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}
      data-icod-id="src_components_attendancebadge_jsx_2fc5">
      {status?.replace('_', ' ')}
    </span>
  );
}
