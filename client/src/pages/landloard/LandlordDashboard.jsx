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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const statsData = [
    {
      label: "Total Properties",
      value: stats.totalProperties,
      icon: "🏠",
      description: "Properties listed",
      color: "blue",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Tenants",
      value: stats.totalTenants,
      icon: "👥",
      description: "Active tenants",
      color: "violet",
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      label: "Monthly Income",
      value: formatCurrency(stats.monthlyIncome),
      icon: "💰",
      description: "Current month",
      color: "emerald",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Pending Rent",
      value: formatCurrency(stats.pendingRent),
      icon: "⏳",
      description: "Awaiting payment",
      color: "orange",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  /* ============================================================
     LOADING STATE
  ============================================================ */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header skeleton */}
          <div className="mb-8 h-48 animate-pulse rounded-3xl bg-slate-200" />

          {/* Stats skeleton */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>

          {/* Table skeleton */}
          <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-6 shadow-xl shadow-blue-900/10 sm:p-8">
          {/* Decorative background */}
          <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-950/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            {/* Welcome */}
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Landlord Dashboard
              </div>

              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Welcome back, Landlord 👋
              </h1>

              <p className="mt-2 max-w-xl text-sm text-blue-100/80 sm:text-base">
                Here's what's happening with your properties and rental income
                today.
              </p>
            </div>

            {/* Quick status */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/20 text-xl">
                📈
              </div>

              <div>
                <p className="text-xs text-blue-100/60">Rental overview</p>

                <p className="font-semibold text-white">
                  Everything looks good
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            STATS
        ====================================================== */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statsData.map((item) => (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg} text-xl`}
                >
                  {item.icon}
                </div>

                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-400">
                  Overview
                </span>
              </div>

              {/* Text */}
              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {item.value}
                </h2>

                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${item.iconColor.replace(
                      "text-",
                      "bg-",
                    )}`}
                  />

                  {item.description}
                </p>
              </div>

              {/* Hover decoration */}
              <div
                className={`absolute -bottom-10 -right-10 h-28 w-28 rounded-full ${item.bg} opacity-0 transition group-hover:opacity-100`}
              />
            </div>
          ))}
        </div>

        {/* =====================================================
            PAYMENTS
        ====================================================== */}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Section header */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Transactions
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Recent Payments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep track of your latest rental payments.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {payments.length} transactions
            </div>
          </div>

          {/* =================================================
              DESKTOP TABLE
          ================================================== */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Tenant
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Property
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="border-b border-slate-100 transition hover:bg-slate-50/70"
                    >
                      {/* Tenant */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                            {payment.tenant?.name?.charAt(0)?.toUpperCase() ||
                              "T"}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {payment.tenant?.name || "Unknown Tenant"}
                            </p>

                            <p className="text-xs text-slate-400">Tenant</p>
                          </div>
                        </div>
                      </td>

                      {/* Property */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                            🏠
                          </div>

                          <div>
                            <p className="max-w-xs truncate font-medium text-slate-700">
                              {payment.property?.title || "Unknown Property"}
                            </p>

                            <p className="text-xs text-slate-400">
                              Rental Property
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-900">
                          {formatCurrency(payment.amount)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            payment.status === "paid"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              payment.status === "paid"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          />

                          {payment.status === "paid" ? "Paid" : payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                        💳
                      </div>

                      <h3 className="mt-4 font-semibold text-slate-900">
                        No payment records
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Your recent payment activity will appear here.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE PAYMENT CARDS
          ================================================== */}

          <div className="divide-y divide-slate-100 md:hidden">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <div
                  key={payment._id}
                  className="p-5 transition hover:bg-slate-50"
                >
                  {/* Top */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">
                        {payment.tenant?.name?.charAt(0)?.toUpperCase() || "T"}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {payment.tenant?.name || "Unknown Tenant"}
                        </p>

                        <p className="text-xs text-slate-400">Tenant</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        payment.status === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          payment.status === "paid"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />

                      {payment.status === "paid" ? "Paid" : payment.status}
                    </span>
                  </div>

                  {/* Property */}
                  <div className="mt-4 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Property
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {payment.property?.title || "Unknown Property"}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-slate-500">Amount</span>

                    <span className="text-lg font-bold text-slate-900">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  💳
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  No payment records
                </h3>

                <p className="mt-1 text-sm text-slate-500">
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
