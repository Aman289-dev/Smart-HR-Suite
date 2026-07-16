import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          data-icod-id="src_components_modal_jsx_ad8b">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-auto`}
          >
            <div
              className="flex items-center justify-between p-6 border-b border-gray-100"
              data-icod-id="src_components_modal_jsx_0cfe">
              <h3
                className="text-lg font-bold text-[#0F172A]"
                data-icod-id="src_components_modal_jsx_f758">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-all"
                data-icod-id="src_components_modal_jsx_89dc">
                <X size={20} className="text-[#64748B]" />
              </button>
            </div>
            <div className="p-6" data-icod-id="src_components_modal_jsx_dbf8">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
