
import { useCallback, useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  MessageSquare,
  RefreshCw,
  Inbox,
  Home,
  IndianRupee,
  CheckCircle2,
  Clock3,
  UserRound,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const statusStyles = {
  new: "bg-[#F7F4EA] text-[#A47735] ring-[#D6A45D]/30",
  contacted: "bg-[#EDF1EB] text-[#527C61] ring-[#A8BDA5]/50",
  closed: "bg-[#EAF1E9] text-[#244B3C] ring-[#A8BDA5]/50",
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LandlordInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInquiries = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await api.get("/inquiry/landlord");
      setInquiries(res.data.inquiries || []);
    } catch (error) {
      console.error("Fetch inquiries error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch property inquiries"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const newCount = inquiries.filter(
    (inquiry) => inquiry.status === "new"
  ).length;

  const contactedCount = inquiries.filter(
    (inquiry) => inquiry.status === "contacted"
  ).length;

  const closedCount = inquiries.filter(
    (inquiry) => inquiry.status === "closed"
  ).length;

  const stats = [
    {
      label: "Total Inquiries",
      count: inquiries.length,
      icon: Inbox,
      iconBg: "bg-[#EAF1E9]",
      iconColor: "text-[#244B3C]",
      border: "border-l-[#527C61]",
    },
    {
      label: "New Inquiries",
      count: newCount,
      icon: MessageSquare,
      iconBg: "bg-[#F7F4EA]",
      iconColor: "text-[#B1843F]",
      border: "border-l-[#D6A45D]",
    },
    {
      label: "Contacted",
      count: contactedCount,
      icon: Phone,
      iconBg: "bg-[#EDF1EB]",
      iconColor: "text-[#527C61]",
      border: "border-l-[#A8BDA5]",
    },
    {
      label: "Closed",
      count: closedCount,
      icon: CheckCircle2,
      iconBg: "bg-[#EAF1E9]",
      iconColor: "text-[#244B3C]",
      border: "border-l-[#244B3C]",
    },
  ];

  return (
    <div className="bg-[#F7F8F5] p-3 sm:p-4">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#A8BDA5]/50 bg-[#EAF1E9] px-2.5 py-1 text-[10px] font-bold text-[#244B3C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#527C61]" />
              LANDLORD DASHBOARD
            </div>

            <h1 className="text-xl font-bold tracking-tight text-[#242B26] sm:text-2xl">
              Property Inquiries
            </h1>

            <p className="mt-0.5 text-xs text-[#68756A] sm:text-sm">
              Manage inquiries received from potential tenants.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchInquiries(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#E6E3D9] bg-white px-4 py-2.5 text-xs font-semibold text-[#244B3C] shadow-sm transition hover:bg-[#F7F4EA] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`rounded-xl border border-[#E6E3D9] border-l-[3px] ${stat.border} bg-white p-3.5 shadow-sm transition hover:shadow-md`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium text-[#68756A]">
                    {stat.label}
                  </p>

                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconBg} ${stat.iconColor}`}>
                    <Icon size={17} />
                  </div>
                </div>

                <h2 className="mt-2 text-2xl font-bold text-[#242B26]">
                  {stat.count}
                </h2>
              </div>
            );
          })}
        </div>

        {/* Inquiries Section */}
        <div className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white shadow-sm">

          {/* Section Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#E6E3D9] px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-[#242B26]">
                Received Inquiries
              </h2>
              <p className="mt-0.5 text-[10px] text-[#68756A]">
                {inquiries.length} inquiries received for your properties
              </p>
            </div>

            <div className="hidden items-center gap-1.5 rounded-full bg-[#EAF1E9] px-2.5 py-1.5 text-[10px] font-semibold text-[#527C61] sm:inline-flex">
              <Inbox size={12} />
              {inquiries.length} Total
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-[#E6E3D9] p-4"
                >
                  <div className="h-4 w-1/3 rounded bg-[#E6E3D9]" />
                  <div className="mt-3 h-3 w-2/3 rounded bg-[#E6E3D9]" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-[#E6E3D9]" />
                </div>
              ))}
            </div>
          ) : inquiries.length === 0 ? (
            /* Empty State */
            <div className="px-4 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1E9] text-[#527C61]">
                <Inbox size={26} />
              </div>

              <h3 className="mt-3 text-sm font-bold text-[#242B26]">
                No inquiries yet
              </h3>

              <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-[#68756A]">
                When visitors submit inquiries about your properties, they will
                appear here.
              </p>

              <button
                type="button"
                onClick={() => fetchInquiries(true)}
                disabled={refreshing}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#244B3C] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#193A2E] disabled:opacity-60"
              >
                <RefreshCw size={13} />
                Refresh inquiries
              </button>
            </div>
          ) : (
            /* Inquiry List */
            <div className="divide-y divide-[#F0EFE9]">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="p-3.5 transition hover:bg-[#F7F8F5]/70 sm:p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">

                    {/* Inquiry Information */}
                    <div className="min-w-0 flex-1">

                      {/* Name and Status */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF1E9] text-[#244B3C]">
                          <UserRound size={16} />
                        </div>

                        <h3 className="text-sm font-bold text-[#242B26]">
                          {inquiry.name || "Unknown"}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ring-1 ${
                            statusStyles[inquiry.status] ||
                            "bg-[#F7F8F5] text-[#68756A] ring-[#E6E3D9]"
                          }`}
                        >
                          {inquiry.status || "Unknown"}
                        </span>
                      </div>

                      {/* Contact Details */}
                      <div className="mt-3 flex flex-col gap-2 text-xs text-[#68756A] sm:flex-row sm:flex-wrap sm:gap-4">
                        {inquiry.email && (
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="flex items-center gap-2 transition hover:text-[#244B3C]"
                          >
                            <Mail size={14} className="shrink-0 text-[#527C61]" />
                            <span className="break-all">{inquiry.email}</span>
                          </a>
                        )}

                        {inquiry.phone && (
                          <a
                            href={`tel:${inquiry.phone}`}
                            className="flex items-center gap-2 transition hover:text-[#244B3C]"
                          >
                            <Phone size={14} className="shrink-0 text-[#527C61]" />
                            {inquiry.phone}
                          </a>
                        )}
                      </div>

                      {/* Message */}
                      <div className="mt-3 rounded-lg border border-[#E6E3D9] bg-[#F7F8F5] p-3">
                        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold text-[#244B3C]">
                          <MessageSquare size={14} />
                          Message
                        </div>

                        <p className="whitespace-pre-wrap break-words text-xs leading-5 text-[#526056]">
                          {inquiry.message || "No message provided."}
                        </p>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="w-full shrink-0 rounded-xl border border-[#E6E3D9] bg-white p-3 lg:w-64">
                      <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#89938A]">
                        <Building2 size={13} />
                        Interested Property
                      </p>

                      {inquiry.property ? (
                        <>
                          <div className="flex items-start gap-2.5">
                            {inquiry.property.image ? (
                              <img
                                src={inquiry.property.image}
                                alt={inquiry.property.title || "Property"}
                                className="h-14 w-14 shrink-0 rounded-lg border border-[#E6E3D9] object-cover"
                              />
                            ) : (
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#EAF1E9] text-[#527C61]">
                                <Home size={23} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <h4 className="line-clamp-2 text-xs font-bold text-[#242B26]">
                                {inquiry.property.title || "Untitled Property"}
                              </h4>

                              <p className="mt-1 flex items-start gap-1 text-[10px] leading-4 text-[#68756A]">
                                <MapPin size={12} className="mt-0.5 shrink-0 text-[#527C61]" />
                                <span>
                                  {[
                                    inquiry.property.address,
                                    inquiry.property.city,
                                  ]
                                    .filter(Boolean)
                                    .join(", ") || "Location unavailable"}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-1 border-t border-[#E6E3D9] pt-2.5 text-sm font-bold text-[#244B3C]">
                            <IndianRupee size={14} />
                            {Number(inquiry.property.rent || 0).toLocaleString("en-IN")}
                            <span className="text-[10px] font-normal text-[#89938A]">
                              / month
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-[#89938A]">
                          Property details are unavailable.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submission Date */}
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#89938A]">
                    <CalendarDays size={13} />
                    Received on {formatDate(inquiry.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordInquiries;
