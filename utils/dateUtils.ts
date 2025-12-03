import { License, ComputedLicenseData, LicenseStatus } from '../types';

// 1. แก้ไขการ Parse วันที่ (Supabase ส่งมาเป็น YYYY-MM-DD)
export const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  // Supabase date format is usually 'YYYY-MM-DD' which Date() handles natively
  return new Date(dateStr);
};

export const calculateDaysRemaining = (validUntil: string): number => {
  if (!validUntil) return 0;

  const targetDate = parseDate(validUntil);
  const today = new Date();

  // Reset hours to compare dates only
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getStatus = (days: number): LicenseStatus => {
  if (days < 0) return 'Expired';
  if (days <= 90) return 'Expiring Soon'; // Warn 3 months ahead
  return 'Active';
};

// Helper to format date as DD/MM/YYYY (for Display)
export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper to convert date to YYYY-MM-DD (for Input)
export const toInputDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return '';
  // If already YYYY-MM-DD
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;

  // If DD/MM/YYYY
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }

  // Try to parse standard date string
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  return '';
};

// 2. แก้ไข Input Type เป็น License[] (ข้อมูลดิบจาก DB)
export const processLicenseData = (data: License[]): ComputedLicenseData[] => {
  return data.map(item => {
    // คำนวณวันจาก valid_until (snake_case)
    const days = calculateDaysRemaining(item.valid_until);

    // 3. แปลงข้อมูล (Mapping) จาก DB Structure -> UI Structure
    return {
      id: item.id,
      registrationNo: item.registration_no, // snake_case -> camelCase

      // Flatten joined data (ดึงชื่อจากตารางที่ Join มา)
      company: item.companies?.name || 'Unknown',
      tag: item.tags?.name || '-',
      standardScope: item.scopes?.standard_code || '-',
      criteriaScope: item.scopes?.description || '-',

      certificationAuthority: item.certification_authority || '-',
      effectiveDate: item.effective_date || '',
      validUntil: item.valid_until,

      remark: item.remark,

      // Computed fields
      daysRemaining: days,
      computedStatus: getStatus(days),

      // IDs for editing (เก็บไว้ใช้เวลาจะ Edit)
      companyId: item.companies?.id,
      tagId: item.tags?.id,
      scopeId: item.scopes?.id
    };
  }).sort((a, b) => a.daysRemaining - b.daysRemaining); // Sort by urgency
};