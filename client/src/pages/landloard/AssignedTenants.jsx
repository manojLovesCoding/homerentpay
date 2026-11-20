
import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  MapPin,
  IndianRupee,
  Mail,
  Phone,
  CalendarDays,
  RefreshCw,
  UserRound,
} from "lucide-react";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

const AssignedTenants = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedTenants = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get("/property/assigned-tenants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProperties(res.data.properties || []);
    } catch (error) {
      console.error("Error fetching assigned tenants:", error);
      toast.error(
        error.response?.data?.message || "Failed to load assigned tenants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedTenants();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getOrdinal = (day) => {
    const number = Number(day);

    if (!number) return "—";

    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return `${number}th`;
    }

    switch (number % 10) {
      case 1:
        return `${number}st`;
      case 2:
        return `${number}nd`;
      case 3:
        return `${number}rd`;
      default:
        return `${number}th`;
    }
  };

  return (
    <div className="space-y-5 text-[#242B26]">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF0E8] text-[#244B3C]">
              <Users size={19} />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-[#242B26]">
              Assigned Tenants
            </h1>
          </div>

          <p className="mt-1 text-sm text-[#68756A]">
            View properties and their currently assigned tenants.
          </p>
        </div>

        <button
          onClick={fetchAssignedTenants}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#E6E3D9] bg-white px-3 py-2 text-sm font-medium text-[#244B3C] transition hover:bg-[#F7F4EA] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[#E6E3D9] bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#68756A]">
                Assigned Properties
              </p>
              <p className="mt-1 text-2xl font-bold text-[#244B3C]">
                {loading ? "—" : properties.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0E8] text-[#244B3C]">
              <Building2 size={20} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E6E3D9] bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#68756A]">
                Active Tenants
              </p>
              <p className="mt-1 text-2xl font-bold text-[#244B3C]">
                {loading ? "—" : properties.filter((p) => p.tenant).length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F4EA] text-[#B17D35]">
              <UserRound size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white">
        <div className="flex items-center justify-between border-b border-[#E6E3D9] px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-[#242B26]">
              Tenant Details
            </h2>
            <p className="mt-0.5 text-xs text-[#68756A]">
              {loading
                ? "Loading tenant information..."
                : `${properties.length} assigned ${
                    properties.length === 1 ? "property" : "properties"
                  }`}
            </p>
          </div>

          <Users size={18} className="text-[#527C61]" />
        </div>

        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-lg bg-[#F1F2ED]"
              />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF0E8] text-[#527C61]">
              <Users size={25} />
            </div>

            <h3 className="text-base font-semibold text-[#242B26]">
              No Assigned Tenants
            </h3>

            <p className="mt-1 max-w-sm text-sm text-[#68756A]">
              You haven't assigned any tenants to your properties yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-[#F7F4EA]">
                <tr className="text-[11px] font-semibold uppercase tracking-wide text-[#526056]">
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Monthly Rent</th>
                  <th className="px-4 py-3">Tenant</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Due Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EEECE4]">
                {properties.map((property) => (
                  <tr
                    key={property._id || property.id}
                    className="transition hover:bg-[#FAFAF6]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-[#244B3C]">
                          <Building2 size={16} />
                        </div>

                        <span className="max-w-[170px] truncate text-sm font-semibold text-[#242B26]">
                          {property.title || "Untitled Property"}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex max-w-[180px] items-start gap-1.5 text-xs text-[#68756A]">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0 text-[#527C61]"
                        />
                        <span>
                          {property.address || property.city || "—"}
                          {property.address && property.city
                            ? `, ${property.city}`
                            : ""}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm font-semibold text-[#244B3C]">
                        <IndianRupee size={14} />
                        {Number(property.rent || 0).toLocaleString("en-IN")}
                      </div>
                      <span className="text-[10px] text-[#89928A]">
                        Per month
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {property.tenant ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F4EA] text-xs font-bold text-[#244B3C]">
                            {property.tenant.name?.charAt(0)?.toUpperCase() ||
                              "T"}
                          </div>
                          <span className="text-sm font-medium text-[#242B26]">
                            {property.tenant.name || "—"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#89928A]">
                          No tenant
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {property.tenant?.email ? (
                        <div className="flex items-center gap-1.5 text-xs text-[#526056]">
                          <Mail
                            size={13}
                            className="shrink-0 text-[#527C61]"
                          />
                          <span>{property.tenant.email}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#89928A]">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {property.tenant?.phone ? (
                        <div className="flex items-center gap-1.5 text-xs text-[#526056]">
                          <Phone
                            size={13}
                            className="shrink-0 text-[#527C61]"
                          />
                          <span>{property.tenant.phone}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#89928A]">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
  <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#F7F4EA] px-2.5 py-1.5 text-xs font-semibold text-[#8B642F]">
    <CalendarDays size={13} />
    {property.dueDate
      ? getOrdinal(property.dueDate)
      : "Not set"}
  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile hint */}
      {!loading && properties.length > 0 && (
        <p className="text-xs text-[#89928A] sm:hidden">
          Swipe horizontally to view all tenant details.
        </p>
      )}
    </div>
  );
};

export default AssignedTenants;
