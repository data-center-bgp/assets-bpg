import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../../utils/supabase";
import CreateAssetModal from "./CreateAsset";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import {
  type AssetWithRelations,
  type AssetFilters,
  type AssetStatus,
  type AssetCondition,
} from "../../lib/types";

const Assets = () => {
  const { classes } = useThemeClasses();
  const [assets, setAssets] = useState<AssetWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState<AssetFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAssets();
  }, [filters]);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("assets")
        .select(
          `
          *,
          category:asset_categories(id, name, code),
          business_unit:business_units(id, name, code),
          location:locations(id, name, floor, room)
        `
        )
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          query = query.in("status", filters.status);
        } else {
          query = query.eq("status", filters.status);
        }
      }

      if (filters.condition) {
        if (Array.isArray(filters.condition)) {
          query = query.in("condition", filters.condition);
        } else {
          query = query.eq("condition", filters.condition);
        }
      }

      if (filters.asset_type) {
        query = query.eq("asset_type", filters.asset_type);
      }

      if (filters.category_id) {
        query = query.eq("category_id", filters.category_id);
      }

      if (filters.business_unit_id) {
        query = query.eq("business_unit_id", filters.business_unit_id);
      }

      if (filters.location_id) {
        query = query.eq("location_id", filters.location_id);
      }

      if (searchTerm) {
        query = query.or(
          `asset_code.ilike.%${searchTerm}%,asset_name.ilike.%${searchTerm}%,serial_number.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchAssets();
  };

  const getStatusColor = (status: AssetStatus) => {
    return classes.status[status] || "bg-slate-500/10 text-slate-400";
  };

  const getConditionColor = (condition: AssetCondition) => {
    return classes.condition[condition] || "bg-slate-500/10 text-slate-400";
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className={`flex-1 overflow-auto ${classes.bg.primary}`}>
      {/* Header */}
      <header
        className={`${classes.bg.secondary} ${classes.border.primary} border-b px-8 py-4`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${classes.text.heading}`}>
              Assets
            </h1>
            <p className={`${classes.text.secondary} text-sm mt-1`}>
              Manage your organization's assets
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Asset
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 space-y-6">
        {/* Search and Filters */}
        <div
          className={`${classes.bg.card} ${classes.border.primary} border rounded-xl p-4`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by code, name, or serial number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className={`w-full pl-10 pr-4 py-2 ${classes.input.bg} ${classes.input.border} border rounded-lg ${classes.input.text} ${classes.input.placeholder} focus:outline-none ${classes.input.focus} transition-colors`}
                />
                <svg
                  className={`w-5 h-5 ${classes.text.tertiary} absolute left-3 top-1/2 -translate-y-1/2`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value as AssetStatus | undefined,
                })
              }
              className={`px-4 py-2 ${classes.input.bg} ${classes.input.border} border rounded-lg ${classes.input.text} focus:outline-none ${classes.input.focus} transition-colors`}
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
              <option value="disposed">Disposed</option>
            </select>

            {/* Condition Filter */}
            <select
              value={filters.condition || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  condition: e.target.value as AssetCondition | undefined,
                })
              }
              className={`px-4 py-2 ${classes.input.bg} ${classes.input.border} border rounded-lg ${classes.input.text} focus:outline-none ${classes.input.focus} transition-colors`}
            >
              <option value="">All Conditions</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>
        </div>

        {/* Assets Table */}
        <div
          className={`${classes.bg.card} ${classes.border.primary} border rounded-xl overflow-hidden`}
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className={`w-16 h-16 ${classes.text.tertiary} mx-auto mb-4`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3
                className={`text-lg font-medium ${classes.text.heading} mb-1`}
              >
                No assets found
              </h3>
              <p className={classes.text.secondary}>
                Get started by creating your first asset
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead
                  className={`${classes.bg.tertiary} ${classes.border.primary} border-b`}
                >
                  <tr>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium ${classes.text.secondary} uppercase tracking-wider`}
                    >
                      Asset Code
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium ${classes.text.secondary} uppercase tracking-wider`}
                    >
                      Asset Name
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium ${classes.text.secondary} uppercase tracking-wider`}
                    >
                      Category
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium ${classes.text.secondary} uppercase tracking-wider`}
                    >
                      Location
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium ${classes.text.secondary} uppercase tracking-wider`}
                    >
                      Status
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium ${classes.text.secondary} uppercase tracking-wider`}
                    >
                      Condition
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium ${classes.text.secondary} uppercase tracking-wider`}
                    >
                      Purchase Price
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium ${classes.text.secondary} uppercase tracking-wider`}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`${classes.border.primary} divide-y`}>
                  {assets.map((asset) => (
                    <tr
                      key={asset.id}
                      className={`${classes.bg.hover} transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${classes.text.primary}`}
                        >
                          {asset.asset_code}
                        </div>
                        <div className={`text-sm ${classes.text.secondary}`}>
                          {asset.serial_number || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`text-sm font-medium ${classes.text.primary}`}
                        >
                          {asset.asset_name}
                        </div>
                        <div className={`text-sm ${classes.text.secondary}`}>
                          {asset.brand} {asset.model}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${classes.text.primary}`}>
                          {asset.category?.name || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${classes.text.primary}`}>
                          {asset.location?.name || "-"}
                        </div>
                        <div className={`text-sm ${classes.text.secondary}`}>
                          {asset.location?.floor &&
                            `Floor ${asset.location.floor}`}
                          {asset.location?.room && ` - ${asset.location.room}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            asset.status
                          )}`}
                        >
                          {asset.status.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getConditionColor(
                            asset.condition
                          )}`}
                        >
                          {asset.condition.toUpperCase()}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${classes.text.primary}`}
                      >
                        {formatCurrency(asset.purchase_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/assets/${asset.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            View
                          </Link>
                          <Link
                            to={`/assets/${asset.id}/edit`}
                            className={`${classes.text.secondary} hover:${classes.text.primary} transition-colors`}
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create Asset Modal */}
      {showCreateModal && (
        <CreateAssetModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchAssets();
          }}
        />
      )}
    </div>
  );
};

export default Assets;
