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
  User,
  IndianRupee,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../api/axios.js";

const statusStyles = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  contacted: "bg-amber-50 text-amber-700 ring-amber-200",
  closed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
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

  // Fetch landlord inquiries
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
        error.response?.data?.message || "Failed to fetch property inquiries",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Calculate inquiry counts
  const newCount = inquiries.filter(
    (inquiry) => inquiry.status === "new",
  ).length;

  const contactedCount = inquiries.filter(
    (inquiry) => inquiry.status === "contacted",
  ).length;

  const closedCount = inquiries.filter(
    (inquiry) => inquiry.status === "closed",
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Landlord Dashboard
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Property Inquiries
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage and review inquiries received from potential tenants.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchInquiries(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ================= STATISTICS ================= */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Inquiries
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {inquiries.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Inbox size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  New Inquiries
                </p>
                <h2 className="mt-2 text-3xl font-bold text-blue-600">
                  {newCount}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MessageSquare size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Contacted</p>
                <h2 className="mt-2 text-3xl font-bold text-amber-600">
                  {contactedCount}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Phone size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Closed</p>
                <h2 className="mt-2 text-3xl font-bold text-emerald-600">
                  {closedCount}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Inbox size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= INQUIRIES ================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Received Inquiries
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {inquiries.length} inquiries received for your properties
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="space-y-5 p-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl border border-slate-100 p-5"
                >
                  <div className="h-5 w-1/3 rounded bg-slate-200" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : inquiries.length === 0 ? (
            /* Empty State */
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Inbox size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No inquiries yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                When visitors submit inquiries about your properties, they will
                appear here.
              </p>
            </div>
          ) : (
            /* Inquiry List */
            <div className="divide-y divide-slate-100">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="p-5 transition hover:bg-slate-50/70 sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-4 lg:flex-row">
                    {/* Inquiry Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900">
                          {inquiry.name}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${
                            statusStyles[inquiry.status] ||
                            "bg-slate-100 text-slate-600 ring-slate-200"
                          }`}
                        >
                          {inquiry.status || "Unknown"}
                        </span>
                      </div>

                      {/* Contact details */}
                      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-5">
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="flex items-center gap-2 transition hover:text-blue-600"
                        >
                          <Mail size={16} className="shrink-0" />
                          {inquiry.email}
                        </a>

                        <a
                          href={`tel:${inquiry.phone}`}
                          className="flex items-center gap-2 transition hover:text-blue-600"
                        >
                          <Phone size={16} className="shrink-0" />
                          {inquiry.phone}
                        </a>
                      </div>

                      {/* Message */}
                      <div className="mt-5 rounded-xl bg-slate-50 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <MessageSquare size={16} />
                          Message
                        </div>

                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                          {inquiry.message}
                        </p>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="w-full shrink-0 rounded-xl border border-slate-200 bg-white p-4 lg:w-72">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Interested Property
                      </p>

                      {inquiry.property ? (
                        <>
                          <div className="flex items-start gap-3">
                            {inquiry.property.image ? (
                              <img
                                src={inquiry.property.image}
                                alt={inquiry.property.title}
                                className="h-16 w-16 shrink-0 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <Home size={25} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <h4 className="line-clamp-2 font-semibold text-slate-900">
                                {inquiry.property.title}
                              </h4>

                              <p className="mt-1 flex items-start gap-1 text-xs text-slate-500">
                                <MapPin size={13} className="mt-0.5 shrink-0" />
                                {inquiry.property.address},{" "}
                                {inquiry.property.city}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-3 text-sm font-bold text-blue-700">
                            <IndianRupee size={15} />
                            {inquiry.property.rent}
                            <span className="font-normal text-slate-400">
                              / month
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-slate-500">
                          Property details are unavailable.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submission Date */}
                  <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
                    <CalendarDays size={14} />
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
