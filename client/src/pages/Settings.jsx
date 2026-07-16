import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchPolicyRequest, createPolicyRequest, applyPolicyRequest } from '../services/policyService';

export default function Settings() {
  const [policy, setPolicy] = useState({ name: 'Default Policy', casualDays: 10, sickDays: 10, annualDays: 15, unpaidAllowed: true });
  const [existingPolicy, setExistingPolicy] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadPolicy(); }, []);

  const loadPolicy = async () => {
    try {
      const { data } = await fetchPolicyRequest();
      if (data.data) {
        setExistingPolicy(data.data);
        setPolicy({
          name: data.data.name,
          casualDays: data.data.casualDays,
          sickDays: data.data.sickDays,
          annualDays: data.data.annualDays,
          unpaidAllowed: data.data.unpaidAllowed
        });
      }
    } catch (err) { /* ignore */ }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await createPolicyRequest(policy);
      setExistingPolicy(data.data);
      toast.success('Policy saved and applied to all employees');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save policy');
    }
    setLoading(false);
  };

  const handleApply = async () => {
    if (!existingPolicy) return toast.error('Save policy first');
    try {
      await applyPolicyRequest(existingPolicy._id);
      toast.success('Policy applied to all active employees');
    } catch (err) { toast.error('Failed to apply policy'); }
  };

  return (
    <div className="space-y-6" data-icod-id="src_pages_settings_jsx_1999">
      <h1
        className="text-2xl font-bold text-[#0F172A]"
        data-icod-id="src_pages_settings_jsx_74c6">Settings</h1>
      <div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        data-icod-id="src_pages_settings_jsx_63a0">
        <h2
          className="text-lg font-bold text-[#0F172A] mb-6"
          data-icod-id="src_pages_settings_jsx_9891">Leave Policy Configuration</h2>
        
        <form
          onSubmit={handleSave}
          className="space-y-5 max-w-lg"
          data-icod-id="src_pages_settings_jsx_b8f0">
          <div data-icod-id="src_pages_settings_jsx_2f03">
            <label
              className="block text-sm font-medium text-[#0F172A] mb-1.5"
              data-icod-id="src_pages_settings_jsx_e253">Policy Name</label>
            <input
              type="text"
              value={policy.name}
              onChange={e => setPolicy({...policy, name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
              data-icod-id="src_pages_settings_jsx_8a7c" />
          </div>

          <div
            className="grid grid-cols-3 gap-4"
            data-icod-id="src_pages_settings_jsx_1145">
            <div data-icod-id="src_pages_settings_jsx_25e1">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
                data-icod-id="src_pages_settings_jsx_b52e">Casual Days</label>
              <input
                type="number"
                min="0"
                value={policy.casualDays}
                onChange={e => setPolicy({...policy, casualDays: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                data-icod-id="src_pages_settings_jsx_91a2" />
            </div>
            <div data-icod-id="src_pages_settings_jsx_9782">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
                data-icod-id="src_pages_settings_jsx_a20b">Sick Days</label>
              <input
                type="number"
                min="0"
                value={policy.sickDays}
                onChange={e => setPolicy({...policy, sickDays: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                data-icod-id="src_pages_settings_jsx_facd" />
            </div>
            <div data-icod-id="src_pages_settings_jsx_14e7">
              <label
                className="block text-sm font-medium text-[#0F172A] mb-1.5"
                data-icod-id="src_pages_settings_jsx_d5d0">Annual Days</label>
              <input
                type="number"
                min="0"
                value={policy.annualDays}
                onChange={e => setPolicy({...policy, annualDays: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                data-icod-id="src_pages_settings_jsx_6b0e" />
            </div>
          </div>

          <div
            className="flex items-center gap-3"
            data-icod-id="src_pages_settings_jsx_619d">
            <input
              type="checkbox"
              checked={policy.unpaidAllowed}
              onChange={e => setPolicy({...policy, unpaidAllowed: e.target.checked})}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              data-icod-id="src_pages_settings_jsx_74d1" />
            <label
              className="text-sm text-[#0F172A]"
              data-icod-id="src_pages_settings_jsx_3bd1">Allow unpaid leave</label>
          </div>

          <div
            className="flex items-center gap-3 pt-4"
            data-icod-id="src_pages_settings_jsx_3724">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium text-sm disabled:opacity-50"
              data-icod-id="src_pages_settings_jsx_c356">
              <Save size={16} /> {loading ? 'Saving...' : 'Save & Apply Policy'}
            </button>
            {existingPolicy && (
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-all font-medium text-sm"
                data-icod-id="src_pages_settings_jsx_6de0">
                <RefreshCw size={16} /> Re-apply to All
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
