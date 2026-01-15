export interface RentRollType {
  id: number;
  address?: string;
  property: string;
  unit?: string;
  tenant?: string;
  lease_start?: string;
  lease_end?: string;
  sqft?: number;
  monthly_payment?: number;
  invalid_columns?: string[];
}