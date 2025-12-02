import React from 'react';
import { X, Calendar, Building, Tag, FileCheck, AlertTriangle, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { License } from '@/types';

interface LicenseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: License | null;
}

export const LicenseDetailsModal: React.FC<LicenseDetailsModalProps> = ({ isOpen, onClose, license }) => {
  if (!isOpen || !license) return null;

  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  // 1. แก้ expire_date เป็น valid_until
  const daysRemaining = getDaysRemaining(license.valid_until);

  const getStatusConfig = (days: number) => {
    if (days < 0) return {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: <AlertTriangle size={18} />,
      text: 'Expired'
    };
    if (days <= 90) return {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: <Clock size={18} />,
      text: 'Expiring Soon'
    };
    return {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: <CheckCircle size={18} />,
      text: 'Active'
    };
  };

  const status = getStatusConfig(daysRemaining);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${status.color}`}>
                {status.icon}
                {status.text}
              </span>
              <span className="text-gray-400 text-sm font-medium">ID: #{license.id}</span>
            </div>
            {/* 2. แก้ license_number เป็น registration_no */}
            <h2 className="text-2xl font-bold text-gray-900">{license.registration_no}</h2>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Tag size={14} />
              {/* 3. แก้การเรียกชื่อ Tag จาก Object tags */}
              {license.tags?.name || 'Uncategorized'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors shadow-sm border border-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left Column: Organization Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Building size={16} /> Organization
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Company Name</span>
                    <p className="font-semibold text-gray-800 text-lg">
                      {/* 4. แก้การเรียก Company name */}
                      {license.companies?.name || '-'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Tag</span>
                      <span className="inline-block px-2 py-1 bg-white border border-gray-200 rounded text-sm font-mono text-blue-600">
                        {/* 5. แก้การเรียก Tag name */}
                        {license.tags?.name || '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block mb-1">Authority</span>
                      <p className="text-sm font-medium text-gray-700">{license.certification_authority || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileCheck size={16} /> Scope & Standards
                </h3>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-4">
                  <div>
                    <span className="text-xs text-blue-600/70 font-bold block mb-1">Standard Scope</span>
                    {/* 6. แก้การเรียก Scope standard_code */}
                    <p className="text-gray-800 font-medium">{license.scopes?.standard_code || '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-blue-600/70 font-bold block mb-1">Criteria Scope</span>
                    {/* 7. แก้การเรียก Scope description */}
                    <p className="text-gray-800">{license.scopes?.description || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dates & Status */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar size={16} /> Duration
                </h3>
                <div className="bg-white border-2 border-gray-100 p-5 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Effective Date</span>
                    <span className="font-mono font-medium text-gray-700">{formatDate(license.effective_date)}</span>
                  </div>
                  <div className="flex justify-between items-center relative">
                    <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-gray-200 -z-10"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Expiration Date</span>
                    {/* 8. แก้ expire_date เป็น valid_until */}
                    <span className="font-mono font-bold text-gray-900">{formatDate(license.valid_until)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="text-blue-400" />
                  <span className="font-medium text-gray-200">Status Summary</span>
                </div>
                <div className="text-3xl font-bold mb-1">
                  {daysRemaining < 0 ? Math.abs(daysRemaining) : daysRemaining}
                  <span className="text-base font-normal text-gray-400 ml-2">days {daysRemaining < 0 ? 'overdue' : 'remaining'}</span>
                </div>
                <p className="text-sm text-gray-400">
                  {daysRemaining < 0
                    ? "This license has expired. Please renew immediately."
                    : daysRemaining <= 90
                      ? "Renewal recommended. Approaching expiration date."
                      : "License is currently valid and active."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};