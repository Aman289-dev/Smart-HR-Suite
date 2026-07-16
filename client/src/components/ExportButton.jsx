import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExportButton({ onClick, label = 'Export Excel' }) {
  const handleExport = async () => {
    try {
      const response = await onClick();
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Export downloaded successfully');
    } catch (err) {
      toast.error('Failed to export');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-sm font-medium"
      data-icod-id="src_components_exportbutton_jsx_248c">
      <Download size={16} />
      {label}
    </button>
  );
}
