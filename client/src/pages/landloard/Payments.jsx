import React, { useEffect, useState } from "react";
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
      console.log(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     HELPERS
  ============================================================ */

  const formatMonth = (year, month) => {
    if (!year || !month) return "—";

    return new Date(year, month - 1).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN").format(Number(amount || 0));
  };

  const getInitial = (name) => {
    return name?.trim()?.charAt(0)?.toUpperCase() || "T";
  };

  /* ============================================================
     STATS
  ============================================================ */

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

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header skeleton */}

          <div className="mb-6">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

            <div className="mt-4 h-9 w-48 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
          </div>

          {/* Stats skeleton */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>

          {/* Table skeleton */}

          <div className="mt-6 h-96 animate-pulse rounded-3xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Financial Overview
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Payments
              </h1>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Track your rental income and payment activity.
              </p>
            </div>

            {/* Transaction count */}

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-slate-400">
                Total Transactions
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {payments.length}
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Collected */}

          <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-50 transition group-hover:scale-125" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                  💰
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                  PAID
                </span>
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                Total Collected
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                ₹{formatAmount(totalCollected)}
              </h2>

              <p className="mt-2 text-xs text-emerald-600">
                {paidCount} successful payments
              </p>
            </div>
          </div>

          {/* Pending */}

          <div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-50 transition group-hover:scale-125" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
                  ⏳
                </div>

                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">
                  PENDING
                </span>
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                Pending Rent
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                ₹{formatAmount(totalPending)}
              </h2>

              <p className="mt-2 text-xs text-amber-600">
                {pendingCount} pending payments
              </p>
            </div>
          </div>

          {/* Payment count */}

          <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 transition group-hover:scale-125" />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                📊
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                Total Payments
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {payments.length}
              </h2>

              <p className="mt-2 text-xs text-blue-600">
                All recorded transactions
              </p>
            </div>
          </div>

          {/* Success rate */}

          <div className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-50 transition group-hover:scale-125" />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-xl">
                ✓
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                Collection Rate
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                {payments.length
                  ? Math.round((paidCount / payments.length) * 100)
                  : 0}
                %
              </h2>

              <p className="mt-2 text-xs text-violet-600">
                Payment success rate
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            PAYMENT LIST
        ====================================================== */}

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Section Header */}

          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Payment History
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Recent rental payment records
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {paidCount} Paid
            </div>
          </div>

          {/* ===================================================
              DESKTOP TABLE
          ==================================================== */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tenant
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Billing Month
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment) => {
                    const tenantName = payment.tenant?.name || "Unknown Tenant";

                    const isPaid = payment.status === "paid";

                    return (
                      <tr
                        key={payment._id}
                        className="group border-b border-slate-100 transition last:border-0 hover:bg-slate-50/70"
                      >
                        {/* Tenant */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                              {getInitial(tenantName)}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {tenantName}
                              </p>

                              {payment.tenant?.email && (
                                <p className="mt-0.5 text-xs text-slate-400">
                                  {payment.tenant.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Month */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm">
                              📅
                            </div>

                            <span className="text-sm font-medium text-slate-600">
                              {formatMonth(payment.year, payment.month)}
                            </span>
                          </div>
                        </td>

                        {/* Amount */}

                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-900">
                            ₹{formatAmount(payment.amount)}
                          </span>
                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                              isPaid
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isPaid ? "bg-emerald-500" : "bg-amber-500"
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
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                        💳
                      </div>

                      <h3 className="mt-4 font-bold text-slate-800">
                        No payments yet
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Payment records will appear here.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ===================================================
              MOBILE CARDS
          ==================================================== */}

          <div className="divide-y divide-slate-100 md:hidden">
            {payments.length > 0 ? (
              payments.map((payment) => {
                const tenantName = payment.tenant?.name || "Unknown Tenant";

                const isPaid = payment.status === "paid";

                return (
                  <div
                    key={payment._id}
                    className="p-4 transition active:bg-slate-50"
                  >
                    {/* Top */}

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                          {getInitial(tenantName)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">
                            {tenantName}
                          </p>

                          {payment.tenant?.email && (
                            <p className="truncate text-xs text-slate-400">
                              {payment.tenant.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {isPaid ? "Paid" : "Pending"}
                      </span>
                    </div>

                    {/* Details */}

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Billing Month
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatMonth(payment.year, payment.month)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Amount
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-900">
                          ₹{formatAmount(payment.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                  💳
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  No payments yet
                </h3>

                <p className="mt-1 text-sm text-slate-400">
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
