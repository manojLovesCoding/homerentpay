import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const LandlordDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalTenants: 0,
    monthlyIncome: 0,
    pendingRent: 0,
  });

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/payment/landlord-summary");

      setStats(res.data.stats);
      setPayments(res.data.payments || []);
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  // Billing month the rent is FOR
  const formatRentMonth = (payment) => {
    if (!payment.month || !payment.year) return "—";

    return new Date(
      Number(payment.year),
      Number(payment.month) - 1,
    ).toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  // Date and time the tenant actually paid
  const getPaidDateTime = (payment) => {
    const raw = payment.paidAt || payment.createdAt;

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

  const statsData = [
    {
      label: "Total Properties",
      value: stats.totalProperties,
      icon: "🏠",
      description: "Properties listed",
      iconBg: "bg-[#EAF0E8]",
      iconColor: "text-[#244B3C]",
      dotColor: "bg-[#527C61]",
    },
    {
      label: "Total Tenants",
      value: stats.totalTenants,
      icon: "👥",
      description: "Active tenants",
      iconBg: "bg-[#EEF1E9]",
      iconColor: "text-[#527C61]",
      dotColor: "bg-[#527C61]",
    },
    {
      label: "Monthly Income",
      value: formatCurrency(stats.monthlyIncome),
      icon: "💰",
      description: "Paid this month",
      iconBg: "bg-[#F5EDDF]",
      iconColor: "text-[#A47735]",
      dotColor: "bg-[#D6A45D]",
    },
    {
      label: "Pending Rent",
      value: formatCurrency(stats.pendingRent),
      icon: "⏳",
      description: "Unpaid months, all tenants",
      iconBg: "bg-[#F8F0E3]",
      iconColor: "text-[#A47735]",
      dotColor: "bg-[#D6A45D]",
    },
  ];

  const getPaymentStatusStyle = (status) =>
    status === "paid"
      ? "bg-[#EAF2E9] text-[#3F7050]"
      : "bg-[#F8F0E3] text-[#A47735]";

  /* ---------------- LOADING STATE ---------------- */

  if (loading) {
    return (
      <div className="bg-[#F7F8F5] p-3 sm:p-4 lg:p-5">
        <div className="mx-auto max-w-7xl space-y-4 animate-pulse">
          <div className="h-28 rounded-xl bg-[#E6E3D9]" />

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-24 rounded-xl border border-[#E6E3D9] bg-white"
              />
            ))}
          </div>

          <div className="h-64 rounded-xl bg-[#E6E3D9]" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8F5] p-3 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* HEADER */}
        <div className="rounded-xl bg-[#244B3C] px-4 py-4 shadow-sm sm:px-5 sm:py-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-[#D6E2D7]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A8BDA5]" />
                Landlord Dashboard
              </div>

              <h1 className="text-xl font-bold text-white sm:text-2xl">
                Welcome back, Landlord 👋
              </h1>

              <p className="mt-1 text-xs text-[#D6E2D7] sm:text-sm">
                Here's what's happening with your properties and rental income.
              </p>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 px-3 py-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-lg">
                📈
              </div>

              <div>
                <p className="text-[10px] text-[#D6E2D7]">Rental overview</p>
                <p className="text-xs font-semibold text-white">
                  {stats.pendingRent > 0
                    ? `${formatCurrency(stats.pendingRent)} rent pending`
                    : "All rent collected"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {statsData.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[#E6E3D9] bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${item.iconBg}`}
                >
                  {item.icon}
                </div>

                <span className="hidden rounded-full bg-[#F7F8F5] px-2 py-1 text-[9px] font-medium text-[#8A958B] sm:inline-block">
                  Overview
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium text-[#68756A]">
                  {item.label}
                </p>

                <h2 className="mt-1 break-words text-xl font-bold tracking-tight text-[#242B26] sm:text-2xl">
                  {item.value}
                </h2>

                <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#8A958B]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${item.dotColor}`}
                  />
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RECENT PAYMENTS */}
        <div className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white shadow-sm">
          {/* SECTION HEADER */}
          <div className="flex flex-col justify-between gap-2 border-b border-[#EAE9E2] px-4 py-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#527C61]">
                Transactions
              </p>

              <h2 className="mt-0.5 text-base font-bold text-[#242B26]">
                Recent Payments
              </h2>

              <p className="mt-0.5 text-xs text-[#68756A]">
                Track your latest rental payments.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-lg bg-[#F7F8F5] px-3 py-2 text-xs text-[#526056]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#527C61]" />
              {payments.length} transactions
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E6E3D9] bg-[#F7F8F5]">
                  {[
                    "Tenant",
                    "Property",
                    "Rent For",
                    "Amount",
                    "Paid On",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#68756A]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EFE9]">
                {payments.length > 0 ? (
                  payments.map((payment) => {
                    const paidAt = getPaidDateTime(payment);

                    return (
                      <tr
                        key={payment._id}
                        className="transition hover:bg-[#F8FAF6]"
                      >
                        {/* TENANT */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8EEE8] text-xs font-bold text-[#244B3C]">
                              {payment.tenant?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "T"}
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-[#303B32]">
                                {payment.tenant?.name || "Unknown Tenant"}
                              </p>

                              <p className="text-[10px] text-[#8A958B]">
                                Tenant
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* PROPERTY */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-sm">
                              🏠
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-xs truncate text-xs font-medium text-[#3C493F]">
                                {payment.property?.title ||
                                  "Unknown Property"}
                              </p>

                              <p className="text-[10px] text-[#8A958B]">
                                Rental Property
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* RENT FOR */}
                        <td className="px-4 py-3">
                          <p className="whitespace-nowrap text-xs font-bold text-[#303B32]">
                            {formatRentMonth(payment)}
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#8A958B]">
                            Monthly rent
                          </p>
                        </td>

                        {/* AMOUNT */}
                        <td className="px-4 py-3">
                          <p className="text-xs font-bold text-[#244B3C]">
                            {formatCurrency(payment.amount)}
                          </p>
                        </td>

                        {/* PAID ON */}
                        <td className="px-4 py-3">
                          {paidAt ? (
                            <>
                              <p className="whitespace-nowrap text-xs font-medium text-[#3C493F]">
                                {paidAt.date}
                              </p>
                              <p className="mt-0.5 text-[10px] text-[#8A958B]">
                                {paidAt.time}
                              </p>
                            </>
                          ) : (
                            <span className="text-xs text-[#8A958B]">—</span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${getPaymentStatusStyle(
                              payment.status,
                            )}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {payment.status === "paid"
                              ? "Paid"
                              : payment.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-10 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF0E8] text-xl">
                        💳
                      </div>

                      <h3 className="mt-3 text-sm font-semibold text-[#303B32]">
                        No payment records
                      </h3>

                      <p className="mt-1 text-xs text-[#68756A]">
                        Your recent payment activity will appear here.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE PAYMENT CARDS */}
          <div className="divide-y divide-[#F0EFE9] md:hidden">
            {payments.length > 0 ? (
              payments.map((payment) => {
                const paidAt = getPaidDateTime(payment);

                return (
                  <div
                    key={payment._id}
                    className="p-3 transition hover:bg-[#F8FAF6]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8EEE8] text-xs font-bold text-[#244B3C]">
                          {payment.tenant?.name?.charAt(0)?.toUpperCase() ||
                            "T"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[#303B32]">
                            {payment.tenant?.name || "Unknown Tenant"}
                          </p>

                          <p className="text-[10px] text-[#8A958B]">Tenant</p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${getPaymentStatusStyle(
                          payment.status,
                        )}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {payment.status === "paid"
                          ? "Paid"
                          : payment.status || "Unknown"}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-[#F7F8F5] p-2.5">
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-[#8A958B]">
                          Property
                        </p>

                        <p className="mt-1 truncate text-xs font-medium text-[#3C493F]">
                          {payment.property?.title || "Unknown Property"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-[#8A958B]">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#244B3C]">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>

                      <div className="border-t border-[#E6E3D9] pt-2.5">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-[#8A958B]">
                          Rent For
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#303B32]">
                          {formatRentMonth(payment)}
                        </p>
                      </div>

                      <div className="border-t border-[#E6E3D9] pt-2.5 text-right">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-[#8A958B]">
                          Paid On
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#526056]">
                          {paidAt ? `${paidAt.date}, ${paidAt.time}` : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF0E8] text-xl">
                  💳
                </div>

                <h3 className="mt-3 text-sm font-semibold text-[#303B32]">
                  No payment records
                </h3>

                <p className="mt-1 text-xs text-[#68756A]">
                  Your recent payment activity will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;