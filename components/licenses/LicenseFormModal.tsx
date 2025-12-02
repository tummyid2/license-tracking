import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { ComputedLicenseData, Company, Tag, Scope } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface LicenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any | null;
  categories?: any[];
}

export const LicenseFormModal: React.FC<LicenseFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const supabase = createClient();

  // Fetch master data
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [scopes, setScopes] = useState<Scope[]>([]);

  const [formData, setFormData] = useState({
    license_number: '',
    expire_date: '',
    company_id: '',
    tag_id: '',
    scope_id: '',
    certification_authority: '',
    effective_date: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch master data on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [companiesRes, tagsRes, scopesRes] = await Promise.all([
          fetch('/api/companies'),
          fetch('/api/tags'),
          fetch('/api/scopes')
        ]);

        if (companiesRes.ok) setCompanies(await companiesRes.json());
        if (tagsRes.ok) setTags(await tagsRes.json());
        if (scopesRes.ok) setScopes(await scopesRes.json());
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      // Convert from ComputedLicenseData format
      const convertDateToInput = (dateStr: string) => {
        if (!dateStr || dateStr === '-') return '';
        // If format is DD/MM/YYYY, convert to YYYY-MM-DD
        if (dateStr.includes('/')) {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }
        return dateStr;
      };

      setFormData({
        license_number: initialData.registrationNo || initialData.license_number || '',
        expire_date: convertDateToInput(initialData.validUntil || initialData.expire_date || ''),
        company_id: initialData.companyId || '',
        tag_id: initialData.tagId || '',
        scope_id: initialData.scopeId || '',
        certification_authority: initialData.certificationAuthority || '',
        effective_date: convertDateToInput(initialData.effectiveDate || initialData.effective_date || '')
      });
    } else {
      // Reset for Create mode
      setFormData({
        license_number: '',
        expire_date: '',
        company_id: '',
        tag_id: '',
        scope_id: '',
        certification_authority: '',
        effective_date: ''
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare payload using snake_case for DB
      const payload = {
        registration_no: formData.license_number,
        valid_until: formData.expire_date,
        company_id: formData.company_id || null,
        tag_id: formData.tag_id || null,
        scope_id: formData.scope_id || null,
        certification_authority: formData.certification_authority || null,
        effective_date: formData.effective_date || null,
        status: 'Active'
      };

      if (initialData?.id) {
        // UPDATE via API
        const response = await fetch(`/api/licenses/${initialData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to update license');
      } else {
        // CREATE via API
        const response = await fetch('/api/licenses/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to create license');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">
            {initialData ? 'แก้ไขใบอนุญาต (Edit License)' : 'เพิ่มใบอนุญาตใหม่ (Add License)'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 mb-4">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* License Number */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เลขที่ใบอนุญาต (License No.) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g. ACFS-2024-001"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">บริษัท (Company)</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
              >
                <option value="">-- เลือกบริษัท --</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Tag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag (ตัวย่อ)</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.tag_id}
                onChange={(e) => setFormData({ ...formData, tag_id: e.target.value })}
              >
                <option value="">-- เลือก Tag --</option>
                {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            {/* Scope */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">ขอบข่าย (Scope)</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.scope_id}
                onChange={(e) => setFormData({ ...formData, scope_id: e.target.value })}
              >
                <option value="">-- เลือก Scope --</option>
                {scopes.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.standard_code} - {s.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Authority */}
            <div className="col-span-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">หน่วยงานผู้ออกใบ (Authority)</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. กรมวิชาการเกษตร"
                value={formData.certification_authority}
                onChange={(e) => setFormData({ ...formData, certification_authority: e.target.value })}
              />
            </div>

            {/* Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วันที่มีผล (Effective)</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.effective_date}
                onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันหมดอายุ (Expiry) <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none border-l-4 border-l-blue-500"
                value={formData.expire_date}
                onChange={(e) => setFormData({ ...formData, expire_date: e.target.value })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  บันทึกข้อมูล
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
