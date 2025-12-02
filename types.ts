
export type LicenseStatus = 'Active' | 'Expiring Soon' | 'Expired';

// License Category Type
export interface Category {
  id: number;
  name: string;
  user_id?: string;
}

// Normalized Data Types
export interface Company {
  id: string;
  name: string;
  address?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
}

export interface Scope {
  id: string;
  standard_code: string;
  description: string;
}

// Updated License Interface
export interface License {
  id: string;
  registration_no: string;
  company_id: string;
  tag_id: string;
  scope_id: string;
  valid_until: string; // YYYY-MM-DD
  effective_date?: string; // YYYY-MM-DD
  certification_authority?: string;
  status: string;
  remark?: string;

  // Joined Data (Optional, present when fetched with joins)
  companies?: Company;
  tags?: Tag;
  scopes?: Scope;
}

// For Frontend Display (Computed)
export interface ComputedLicenseData {
  id: string;
  registrationNo: string;
  company: string; // Flattened name
  tag: string; // Flattened name
  standardScope: string; // Flattened code
  criteriaScope: string; // Flattened description
  certificationAuthority: string;
  effectiveDate: string;
  validUntil: string;
  status: string;
  daysRemaining: number;
  computedStatus: LicenseStatus;

  // Raw IDs for editing
  companyId?: string;
  tagId?: string;
  scopeId?: string;
  remark?: string;
}

export interface GroupedData {
  [key: string]: ComputedLicenseData[];
}
