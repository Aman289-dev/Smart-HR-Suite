import { useRef, useState } from 'react';
import { Upload, File, X } from 'lucide-react';

export default function FileUpload({ onFileSelect, accept = '*', label = 'Upload file' }) {
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const clear = () => {
    setFileName(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      data-icod-id="src_components_fileupload_jsx_7e30">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        data-icod-id="src_components_fileupload_jsx_7c0d" />
      {fileName ? (
        <div
          className="flex items-center justify-center gap-2"
          data-icod-id="src_components_fileupload_jsx_e6c3">
          <File size={20} className="text-indigo-600" />
          <span
            className="text-sm font-medium text-[#0F172A]"
            data-icod-id="src_components_fileupload_jsx_f6df">{fileName}</span>
          <button
            onClick={(e) => { e.stopPropagation(); clear(); }}
            className="p-1 hover:bg-gray-100 rounded"
            data-icod-id="src_components_fileupload_jsx_d7ae">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div data-icod-id="src_components_fileupload_jsx_aad4">
          <Upload size={24} className="mx-auto mb-2 text-[#64748B]" />
          <p
            className="text-sm text-[#64748B]"
            data-icod-id="src_components_fileupload_jsx_1829">{label}</p>
          <p
            className="text-xs text-gray-400 mt-1"
            data-icod-id="src_components_fileupload_jsx_466a">Drag & drop or click to browse</p>
        </div>
      )}
    </div>
  );
}
