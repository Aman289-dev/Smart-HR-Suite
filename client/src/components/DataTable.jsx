import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({ columns, data, pageSize = 10, onRowClick }) {
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);

  const sorted = [...data].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageData = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  if (data.length === 0) {
    return (
      <div
        className="text-center py-12 text-[#64748B]"
        data-icod-id="src_components_datatable_jsx_2f1a">
        <p data-icod-id="src_components_datatable_jsx_74dc">No data available</p>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto"
      data-icod-id="src_components_datatable_jsx_db26">
      <table
        className="w-full text-sm"
        data-icod-id="src_components_datatable_jsx_342e">
        <thead data-icod-id="src_components_datatable_jsx_d600">
          <tr
            className="border-b border-gray-200"
            data-icod-id="src_components_datatable_jsx_9afd">
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left font-semibold text-[#0F172A] ${col.sortable ? 'cursor-pointer hover:bg-gray-50 select-none' : ''}`}
                onClick={() => col.sortable && handleSort(col.key)}
                data-icod-id={`src_components_datatable_jsx_3fb2_${col.key}`}>
                <div
                  className="flex items-center gap-1"
                  data-icod-id={`src_components_datatable_jsx_7759_${col.key}`}>
                  {col.label}
                  {col.sortable && (
                    sortField === col.key ? (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ChevronsUpDown size={14} className="text-gray-300" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody data-icod-id="src_components_datatable_jsx_1dc5">
          {pageData.map((row, idx) => (
            <tr
              key={row._id || idx}
              className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
              data-icod-id={`src_components_datatable_jsx_b92d_${idx}`}>
              {columns.map(col => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-[#0F172A]"
                  data-icod-id={`src_components_datatable_jsx_15f5_${idx}_${col.key}`}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-4 py-3 border-t border-gray-200"
          data-icod-id="src_components_datatable_jsx_9e2f">
          <p
            className="text-xs text-[#64748B]"
            data-icod-id="src_components_datatable_jsx_d452">Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}</p>
          <div
            className="flex items-center gap-1"
            data-icod-id="src_components_datatable_jsx_c0e7">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
              data-icod-id="src_components_datatable_jsx_9e6e">
              <ChevronLeft size={16} />
            </button>
            <span
              className="text-xs text-[#64748B] px-2"
              data-icod-id="src_components_datatable_jsx_c211">Page {page + 1} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
              data-icod-id="src_components_datatable_jsx_6d36">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
