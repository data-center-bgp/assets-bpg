import React, { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import {
  type CreateAssetInput,
  type AssetCategory,
  type BusinessUnit,
  type Location,
} from "../../lib/types";

interface CreateAssetModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAssetModal: React.FC<CreateAssetModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState<CreateAssetInput>({
    asset_code: "",
    asset_name: "",
    category_id: 0,
    asset_type: "movable",
    brand: "",
    model: "",
    serial_number: "",
    purchase_date: "",
    purchase_price: 0,
    business_unit_id: 0,
    location_id: 0,
    condition: "good",
    status: "available",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from("asset_categories")
        .select("*")
        .order("name");

      // Fetch business units
      const { data: businessUnitsData } = await supabase
        .from("business_units")
        .select("*")
        .eq("is_active", true)
        .order("name");

      // Fetch locations
      const { data: locationsData } = await supabase
        .from("locations")
        .select("*")
        .order("name");

      setCategories(categoriesData || []);
      setBusinessUnits(businessUnitsData || []);
      setLocations(locationsData || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "category_id" ||
        name === "business_unit_id" ||
        name === "location_id" ||
        name === "purchase_price"
          ? Number(value)
          : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.asset_code.trim()) {
      newErrors.asset_code = "Asset code is required";
    }
    if (!formData.asset_name.trim()) {
      newErrors.asset_name = "Asset name is required";
    }
    if (!formData.category_id) {
      newErrors.category_id = "Category is required";
    }
    if (!formData.business_unit_id) {
      newErrors.business_unit_id = "Business unit is required";
    }
    if (!formData.location_id) {
      newErrors.location_id = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const { error } = await supabase.from("assets").insert([
        {
          ...formData,
          brand: formData.brand || null,
          model: formData.model || null,
          serial_number: formData.serial_number || null,
          purchase_date: formData.purchase_date || null,
          purchase_price: formData.purchase_price || null,
        },
      ]);

      if (error) throw error;

      onSuccess();
    } catch (error: any) {
      console.error("Error creating asset:", error);
      if (error.code === "23505") {
        setErrors({ asset_code: "Asset code already exists" });
      } else {
        alert("Failed to create asset. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Create New Asset
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Asset Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="asset_code"
                  value={formData.asset_code}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.asset_code ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="e.g., AST-001"
                />
                {errors.asset_code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.asset_code}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Asset Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="asset_name"
                  value={formData.asset_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.asset_name ? "border-red-500" : "border-slate-300"
                  }`}
                  placeholder="e.g., Laptop Dell XPS 15"
                />
                {errors.asset_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.asset_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category_id ? "border-red-500" : "border-slate-300"
                  }`}
                >
                  <option value={0}>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category_id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Asset Type
                </label>
                <select
                  name="asset_type"
                  value={formData.asset_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="movable">Movable</option>
                  <option value="immovable">Immovable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Dell"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., XPS 15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serial_number"
                  value={formData.serial_number || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., SN123456789"
                />
              </div>
            </div>
          </div>

          {/* Location & Assignment */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Location & Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Business Unit <span className="text-red-500">*</span>
                </label>
                <select
                  name="business_unit_id"
                  value={formData.business_unit_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.business_unit_id
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                >
                  <option value={0}>Select business unit</option>
                  {businessUnits.map((bu) => (
                    <option key={bu.id} value={bu.id}>
                      {bu.name}
                    </option>
                  ))}
                </select>
                {errors.business_unit_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.business_unit_id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.location_id ? "border-red-500" : "border-slate-300"
                  }`}
                >
                  <option value={0}>Select location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                      {loc.floor && ` - Floor ${loc.floor}`}
                      {loc.room && ` - ${loc.room}`}
                    </option>
                  ))}
                </select>
                {errors.location_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location_id}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Purchase Price (IDR)
                </label>
                <input
                  type="number"
                  name="purchase_price"
                  value={formData.purchase_price || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Status & Condition */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Status & Condition
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="in_use">In Use</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                  <option value="disposed">Disposed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {loading ? "Creating..." : "Create Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssetModal;
