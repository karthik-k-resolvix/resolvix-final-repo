// src/types.ts
export interface BrandContact {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  country_code: string;
  phone_number?: string | null;
  created_at?: string;
}
