import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios.js";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payment/all");
      setPayments(res.data.payments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  /* ---------------- SUMMARY ---------------- */

  const summary = useMemo(() => {
    const paid = payments.filter((payment) => payment.status === "paid");

    const pending = payments.filter((payment) => payment.status !== "paid");

    const totalRevenue = paid.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0,
    );

    const pendingAmount = pending.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0,
    );

    return {
      total: payments.length,
      paid: paid.length,
      pending: pending.length,
      revenue: totalRevenue,
      pendingAmount,
    };
  }, [payments]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-9 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-80 bg-slate-200 rounded mt-3" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse"
              />
            ))}
          </div>

          <div className="h-96 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 shadow-xl shadow-blue-100">
          <div className="absolute -right-12 -top-20 w-56 h-56 rounded-full bg-white/10" />

          <div className="absolute right-24 -bottom-24 w-48 h-48 rounded-full bg-white/10" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl">
                  💳
                </div>

                <span className="text-blue-100 text-sm font-medium">
                  Financial Management
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Payments
              </h1>

              <p className="text-blue-100 mt-2 text-sm sm:text-base">
                Monitor rental payments and transaction activity.
              </p>
            </div>

            <div className="self-start sm:self-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 text-white">
              <p className="text-xs text-blue-100">Transactions</p>

              <p className="text-2xl font-bold mt-1">{summary.total}</p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Total */}
          <div className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">
                  Total Payments
                </p>

                <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
                  {summary.total}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                💳
              </div>
            </div>
          </div>

          {/* Paid */}
          <div className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">Paid</p>

                <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
                  {summary.paid}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                ✓
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-slate-500">Pending</p>

                <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
                  {summary.pending}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                ⏳
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-500">
                  Total Revenue
                </p>

                <p className="text-xl sm:text-2xl font-bold text-violet-600 mt-1 truncate">
                  ₹{summary.revenue.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="w-10 h-10 shrink-0 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                ₹
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* PAYMENT CONTENT */}
        {/* ================================================= */}

        {payments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 flex items-center justify-center text-4xl">
              💳
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-5">
              No payments found
            </h2>

            <p className="text-slate-500 mt-2">
              There are currently no payment transactions to display.
            </p>
          </div>
        ) : (
          <>
            {/* ================================================= */}
            {/* MOBILE / TABLET PAYMENT CARDS */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:hidden gap-5">
              {payments.map((pay) => {
                const isPaid = pay.status === "paid";

                const paymentDate = pay.paidAt
                  ? new Date(pay.paidAt)
                  : new Date(pay.createdAt);

                return (
                  <div
                    key={pay._id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 shrink-0 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                          {pay.tenant?.name?.charAt(0)?.toUpperCase() || "T"}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">
                            {pay.tenant?.name || "N/A"}
                          </p>

                          <p className="text-xs text-slate-400 truncate">
                            {pay.tenant?.email || "No email"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPaid ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />

                        {pay.status}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="mt-5 p-4 rounded-2xl bg-slate-50">
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Payment Amount
                      </p>

                      <p className="text-2xl font-bold text-slate-800 mt-1">
                        ₹{Number(pay.amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mt-5">
                      <div>
                        <p className="text-xs text-slate-400">Property</p>

                        <p className="text-sm font-semibold text-slate-700 mt-1 truncate">
                          {pay.property?.title || "N/A"}
                        </p>

                        <p className="text-xs text-slate-400">
                          {pay.property?.city || ""}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Landlord</p>

                        <p className="text-sm font-semibold text-slate-700 mt-1 truncate">
                          {pay.landlord?.name || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-400">Transaction Date</p>

                      <p className="text-sm font-medium text-slate-700 mt-1">
                        {paymentDate.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-5">
                      <button className="flex-1 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-100 transition">
                        View
                      </button>

                      <button className="flex-1 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-semibold text-sm hover:bg-emerald-100 transition">
                        Receipt
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================================================= */}
            {/* DESKTOP TABLE */}
            {/* ================================================= */}

            <div className="hidden xl:block bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Payment Transactions
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Complete transaction history
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    ₹{summary.revenue.toLocaleString("en-IN")} collected
                  </div>

                  {summary.pendingAmount > 0 && (
                    <div className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                      ₹{summary.pendingAmount.toLocaleString("en-IN")} pending
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Tenant
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Property
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Landlord
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Date
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {payments.map((pay) => {
                      const isPaid = pay.status === "paid";

                      const paymentDate = pay.paidAt
                        ? new Date(pay.paidAt)
                        : new Date(pay.createdAt);

                      return (
                        <tr
                          key={pay._id}
                          className="group hover:bg-blue-50/40 transition"
                        >
                          {/* Tenant */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                {pay.tenant?.name?.charAt(0)?.toUpperCase() ||
                                  "T"}
                              </div>

                              <div>
                                <p className="font-semibold text-slate-800">
                                  {pay.tenant?.name || "N/A"}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {pay.tenant?.email || ""}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Property */}
                          <td className="px-6 py-5">
                            <p className="font-semibold text-slate-700">
                              {pay.property?.title || "N/A"}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              📍 {pay.property?.city || "Unknown"}
                            </p>
                          </td>

                          {/* Landlord */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-bold">
                                {pay.landlord?.name?.charAt(0)?.toUpperCase() ||
                                  "L"}
                              </div>

                              <span className="font-medium text-slate-700">
                                {pay.landlord?.name || "N/A"}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-5">
                            <p className="font-bold text-slate-800">
                              ₹{Number(pay.amount || 0).toLocaleString("en-IN")}
                            </p>

                            <p className="text-xs text-slate-400">
                              rental payment
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                isPaid
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isPaid ? "bg-emerald-500" : "bg-amber-500"
                                }`}
                              />

                              {pay.status}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-5">
                            <p className="text-sm font-medium text-slate-700">
                              {paymentDate.toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              {paymentDate.toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <button className="px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition">
                                View
                              </button>

                              <button className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-semibold hover:bg-emerald-100 transition">
                                Receipt
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Payments;
