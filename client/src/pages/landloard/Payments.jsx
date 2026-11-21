import React, { useEffect, useState } from "react";
import {
  Wallet,
  Clock3,
  Receipt,
  TrendingUp,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payment/landlord-summary");
      setPayments(res.data.payments || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (year, month) => {
    if (!year || !month) return "—";

    return new Date(year, month - 1).toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  // Date and time the tenant actually paid
  const getPaidDateTime = (payment) => {
    const raw =
      payment.paidAt || (payment.status === "paid" ? payment.createdAt : null);

    if (!raw) return null;

    const date = new Date(raw);

    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN").format(Number(amount || 0));

  const getInitial = (name) => name?.trim()?.charAt(0)?.toUpperCase() || "T";

  const totalCollected = payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const totalPending = payments
    .filter((payment) => payment.status !== "paid")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const paidCount = payments.filter(
    (payment) => payment.status === "paid",
  ).length;

  const pendingCount = payments.filter(
    (payment) => payment.status !== "paid",
  ).length;

  const collectionRate = payments.length
    ? Math.round((paidCount / payments.length) * 100)
    : 0;

  const stats = [
    {
      title: "Total Collected",
      value: `₹${formatAmount(totalCollected)}`,
      subtitle: `${paidCount} successful payments`,
      icon: Wallet,
      iconBg: "bg-[#EAF1E9]",
      iconColor: "text-[#527C61]",
      accent: "border-[#A8BDA5]",
    },
    {
      title: "Pending Rent",
      value: `₹${formatAmount(totalPending)}`,
      subtitle: `${pendingCount} pending payments`,
      icon: Clock3,
      iconBg: "bg-[#F7F0E2]",
      iconColor: "text-[#B1843F]",
      accent: "border-[#D6A45D]",
    },
    {
      title: "Total Payments",
      value: payments.length,
      subtitle: "All recorded transactions",
      icon: Receipt,
      iconBg: "bg-[#EDF1EB]",
      iconColor: "text-[#527C61]",
      accent: "border-[#A8BDA5]",
    },
    {
      title: "Collection Rate",
      value: `${collectionRate}%`,
      subtitle: "Payment success rate",
      icon: TrendingUp,
      iconBg: "bg-[#F7F4EA]",
      iconColor: "text-[#B1843F]",
      accent: "border-[#D6A45D]",
    },
  ];

  if (loading) {
    return (
      <div className="bg-[#F7F8F5] p-3 sm:p-4">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-5">
            <div className="h-3 w-28 rounded bg-[#E6E3D9]" />
            <div className="mt-3 h-7 w-44 rounded bg-[#E6E3D9]" />
            <div className="mt-2 h-3 w-64 max-w-full rounded bg-[#E6E3D9]" />
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 rounded-xl border border-[#E6E3D9] bg-white"
              />
            ))}
          </div>

          <div className="mt-4 h-72 rounded-2xl border border-[#E6E3D9] bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8F5] p-3 sm:p-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#A8BDA5]/50 bg-[#EAF1E9] px-2.5 py-1 text-[10px] font-bold text-[#244B3C]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#527C61]" />
              FINANCIAL OVERVIEW
            </div>

            <h1 className="text-xl font-bold tracking-tight text-[#242B26] sm:text-2xl">
              Payments
            </h1>

            <p className="mt-0.5 text-xs text-[#68756A] sm:text-sm">
              Track your rental income and payment activity.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-[#E6E3D9] bg-white px-3.5 py-2.5 shadow-sm sm:self-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7F4EA] text-[#244B3C]">
              <Receipt size={18} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-[#68756A]">
                Total Transactions
              </p>
              <p className="text-lg font-bold leading-tight text-[#242B26]">
                {payments.length}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className={`relative overflow-hidden rounded-xl border border-[#E6E3D9] border-l-[3px] ${stat.accent} bg-white p-3.5 shadow-sm transition hover:shadow-md sm:p-4`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg} ${stat.iconColor}`}
                  >
                    <Icon size={18} />
                  </div>

                  <span className="text-[10px] font-semibold text-[#A0A99F]">
                    {stat.title === "Total Collected"
                      ? "PAID"
                      : stat.title === "Pending Rent"
                        ? "PENDING"
                        : stat.title === "Collection Rate"
                          ? "RATE"
                          : "ALL"}
                  </span>
                </div>

                <p className="mt-3 text-[11px] font-medium text-[#68756A]">
                  {stat.title}
                </p>

                <h2 className="mt-0.5 truncate text-lg font-bold tracking-tight text-[#242B26] sm:text-xl">
                  {stat.value}
                </h2>

                <p className="mt-1 text-[10px] text-[#68756A]">
                  {stat.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Payment History */}
        <div className="mt-4 overflow-hidden rounded-xl border border-[#E6E3D9] bg-white shadow-sm">
          {/* Section Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#E6E3D9] px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-[#242B26]">
                Payment History
              </h2>
              <p className="mt-0.5 text-[10px] text-[#68756A]">
                Recent rental payment records
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF1E9] px-2.5 py-1.5 text-[10px] font-bold text-[#527C61]">
              <CheckCircle2 size={12} />
              {paidCount} Paid
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E6E3D9] bg-[#F7F8F5]">
                  {[
                    "Tenant",
                    "Billing Month",
                    "Amount",
                    "Paid On",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#68756A]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment) => {
                    const tenantName = payment.tenant?.name || "Unknown Tenant";
                    const isPaid = payment.status === "paid";
                    const paidAt = getPaidDateTime(payment);

                    return (
                      <tr
                        key={payment._id}
                        className="border-b border-[#F0EFE9] transition last:border-0 hover:bg-[#F7F8F5]"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF1E9] text-sm font-bold text-[#244B3C]">
                              {getInitial(tenantName)}
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#242B26]">
                                {tenantName}
                              </p>
                              {payment.tenant?.email && (
                                <p className="mt-0.5 text-[10px] text-[#89938A]">
                                  {payment.tenant.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-xs font-medium text-[#526056]">
                            <CalendarDays
                              size={15}
                              className="text-[#A8BDA5]"
                            />
                            {formatMonth(payment.year, payment.month)}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-xs font-bold text-[#242B26]">
                            ₹{formatAmount(payment.amount)}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {paidAt ? (
                            <>
                              <p className="text-xs font-medium text-[#3C493F]">
                                {paidAt.date}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#89938A]">
                                <Clock3 size={11} />
                                {paidAt.time}
                              </p>
                            </>
                          ) : (
                            <span className="text-xs text-[#89938A]">—</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              isPaid
                                ? "bg-[#EAF1E9] text-[#527C61]"
                                : "bg-[#F7F0E2] text-[#A47735]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isPaid ? "bg-[#527C61]" : "bg-[#D6A45D]"
                              }`}
                            />
                            {isPaid ? "Paid" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-12 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7F4EA] text-[#527C61]">
                        <CreditCard size={22} />
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-[#242B26]">
                        No payments yet
                      </h3>
                      <p className="mt-1 text-xs text-[#89938A]">
                        Payment records will appear here.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-[#F0EFE9] md:hidden">
            {payments.length > 0 ? (
              payments.map((payment) => {
                const tenantName = payment.tenant?.name || "Unknown Tenant";
                const isPaid = payment.status === "paid";
                const paidAt = getPaidDateTime(payment);

                return (
                  <div key={payment._id} className="p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF1E9] text-sm font-bold text-[#244B3C]">
                          {getInitial(tenantName)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[#242B26]">
                            {tenantName}
                          </p>
                          {payment.tenant?.email && (
                            <p className="truncate text-[10px] text-[#89938A]">
                              {payment.tenant.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          isPaid
                            ? "bg-[#EAF1E9] text-[#527C61]"
                            : "bg-[#F7F0E2] text-[#A47735]"
                        }`}
                      >
                        {isPaid ? "Paid" : "Pending"}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-[#F7F8F5] p-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#89938A]">
                          Billing Month
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#526056]">
                          <CalendarDays size={13} className="text-[#527C61]" />
                          {formatMonth(payment.year, payment.month)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#89938A]">
                          Amount
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs font-bold text-[#242B26]">
                          <IndianRupee size={13} />
                          {formatAmount(payment.amount)}
                        </p>
                      </div>

                      <div className="col-span-2 border-t border-[#E6E3D9] pt-3">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#89938A]">
                          Paid On
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#526056]">
                          <Clock3 size={13} className="text-[#527C61]" />
                          {paidAt ? `${paidAt.date}, ${paidAt.time}` : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7F4EA] text-[#527C61]">
                  <CreditCard size={22} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-[#242B26]">
                  No payments yet
                </h3>
                <p className="mt-1 text-xs text-[#89938A]">
                  Payment records will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
