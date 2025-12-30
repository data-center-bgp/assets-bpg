// ==================== ENUMS ====================
export type AssetType = "movable" | "immovable";
export type AssetCondition = "excellent" | "good" | "fair" | "poor" | "damaged";
export type AssetStatus =
  | "available"
  | "in_use"
  | "maintenance"
  | "retired"
  | "disposed";
export type UsageStatus = "active" | "completed" | "cancelled";
export type MaintenanceType =
  | "preventive"
  | "corrective"
  | "emergency"
  | "routine";
export type DocumentType =
  | "invoice"
  | "warranty"
  | "manual"
  | "certificate"
  | "other";
export type PhysicalStatus = "found" | "not_found" | "damaged" | "missing";
export type DisposalMethod =
  | "sale"
  | "donation"
  | "scrap"
  | "transfer"
  | "destruction";

// ==================== BASE INTERFACES ====================

export interface BusinessUnit {
  id: number;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface Location {
  id: number;
  business_unit_id: number;
  name: string;
  floor: string | null;
  room: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Employee {
  id: number;
  employee_code: string;
  name: string;
  position: string | null;
  department: string | null;
  business_unit_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  password: string;
  business_unit_id: number;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string | null;
  auth_user_id: string;
}

export interface Role {
  id: number;
  role_code: string;
  role_name: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Permission {
  id: number;
  permission_code: string;
  permission_name: string;
  created_at: string;
}

export interface UserRole {
  id: number;
  user_id: number;
  role_id: number;
  created_at: string;
}

export interface RolePermission {
  id: number;
  role_id: number;
  permission_id: number;
}

export interface AssetCategory {
  id: number;
  code: string;
  name: string;
  useful_life: number;
  created_at: string;
  updated_at: string | null;
}

export interface Asset {
  id: number;
  asset_code: string;
  asset_name: string;
  category_id: number;
  asset_type: AssetType;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  business_unit_id: number;
  location_id: number;
  condition: AssetCondition;
  status: AssetStatus;
  created_at: string;
  updated_at: string | null;
}

export interface AssetUsage {
  id: number;
  asset_id: number;
  employee_id: number;
  start_date: string;
  end_date: string | null;
  usage_status: UsageStatus;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface AssetMutation {
  id: number;
  asset_id: number;
  from_employee_id: number | null;
  to_employee_id: number | null;
  from_location_id: number;
  to_location_id: number;
  mutation_date: string;
  reason: string | null;
  created_at: string;
}

export interface AssetMaintenance {
  id: number;
  asset_id: number;
  maintenance_date: string;
  maintenance_type: MaintenanceType;
  vendor: string | null;
  cost: number | null;
  notes: string | null;
  created_at: string;
}

export interface AssetDocument {
  id: number;
  asset_id: number;
  document_type: DocumentType;
  file_path: string;
  created_at: string;
}

export interface AssetAudit {
  id: number;
  asset_id: number;
  audit_date: string;
  physical_status: PhysicalStatus;
  notes: string | null;
  audited_by: number;
  created_at: string;
}

export interface AssetDepreciation {
  id: number;
  asset_id: number;
  period: string;
  depreciation_value: number;
  book_value: number;
  created_at: string;
}

export interface AssetDisposal {
  id: number;
  asset_id: number;
  disposal_date: string;
  method: DisposalMethod;
  disposal_value: number | null;
  notes: string | null;
  created_at: string;
}

// ==================== WITH RELATIONS ====================

export interface AssetWithRelations extends Asset {
  category?: AssetCategory;
  business_unit?: BusinessUnit;
  location?: Location;
  current_usage?: AssetUsage & {
    employee?: Employee;
  };
  maintenance_records?: AssetMaintenance[];
  documents?: AssetDocument[];
}

export interface LocationWithRelations extends Location {
  business_unit?: BusinessUnit;
}

export interface EmployeeWithRelations extends Employee {
  business_unit?: BusinessUnit;
  current_assets?: Asset[];
}

export interface ProfileWithRelations extends Profile {
  business_unit?: BusinessUnit;
  roles?: (UserRole & { role?: Role })[];
}

// ==================== CREATE/UPDATE INPUTS ====================

export interface CreateAssetInput {
  asset_code: string;
  asset_name: string;
  category_id: number;
  asset_type: AssetType;
  brand?: string | null;
  model?: string | null;
  serial_number?: string | null;
  purchase_date?: string | null;
  purchase_price?: number | null;
  business_unit_id: number;
  location_id: number;
  condition: AssetCondition;
  status: AssetStatus;
}

export interface UpdateAssetInput extends Partial<CreateAssetInput> {
  id: number;
}

export interface CreateAssetUsageInput {
  asset_id: number;
  employee_id: number;
  start_date: string;
  end_date?: string | null;
  usage_status: UsageStatus;
  notes?: string | null;
}

export interface CreateAssetMaintenanceInput {
  asset_id: number;
  maintenance_date: string;
  maintenance_type: MaintenanceType;
  vendor?: string | null;
  cost?: number | null;
  notes?: string | null;
}

export interface CreateAssetMutationInput {
  asset_id: number;
  from_employee_id?: number | null;
  to_employee_id?: number | null;
  from_location_id: number;
  to_location_id: number;
  mutation_date: string;
  reason?: string | null;
}

export interface CreateAssetDisposalInput {
  asset_id: number;
  disposal_date: string;
  method: DisposalMethod;
  disposal_value?: number | null;
  notes?: string | null;
}

// ==================== FILTERS ====================

export interface AssetFilters {
  search?: string;
  status?: AssetStatus | AssetStatus[];
  condition?: AssetCondition | AssetCondition[];
  asset_type?: AssetType;
  category_id?: number;
  business_unit_id?: number;
  location_id?: number;
  purchase_date_from?: string;
  purchase_date_to?: string;
  price_min?: number;
  price_max?: number;
}

export interface AssetMaintenanceFilters {
  asset_id?: number;
  maintenance_type?: MaintenanceType;
  date_from?: string;
  date_to?: string;
}

// ==================== PAGINATION ====================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ==================== FORM DATA ====================

export interface AssetFormData extends CreateAssetInput {
  // Additional fields for form handling
  image?: File | null;
  documents?: File[];
}

// ==================== STATISTICS ====================

export interface AssetStatistics {
  total_assets: number;
  by_status: Record<AssetStatus, number>;
  by_condition: Record<AssetCondition, number>;
  by_type: Record<AssetType, number>;
  total_value: number;
  maintenance_due: number;
}

export interface BusinessUnitStatistics {
  business_unit_id: number;
  business_unit_name: string;
  total_assets: number;
  total_value: number;
  assets_in_use: number;
  assets_available: number;
}
