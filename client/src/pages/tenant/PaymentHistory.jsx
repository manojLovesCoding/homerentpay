import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const { data } = await api.get("/payment/history");

      setPayments(data.payments || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const formatMonth = (date) => {
    return new Date(date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading payment history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 p-6 sm:p-8 mb-6 shadow-xl shadow-indigo-100">

          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-20 w-64 h-64 rounded-full bg-white/5" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur mb-4">
                <span className="text-2xl">💳</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Payment History
              </h1>

              <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-lg">
                View and track all your previous rental payments in one place.
              </p>
            </div>

            {/* Total */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 min-w-[180px]">
              <p className="text-xs font-medium uppercase tracking-wider text-blue-100">
                Total Paid
              </p>

              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
                ₹{totalAmount.toLocaleString("en-IN")}
              </p>
            </div>

          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

          {/* Payments Count */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Payments
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {payments.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                <span className="text-xl">🧾</span>
              </div>

            </div>
          </div>

          {/* Successful Payments */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Successful Payments
                </p>

                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {payments.filter(
                    (payment) => payment.status === "paid"
                  ).length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>

            </div>
          </div>

        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Section Header */}
          <div className="px-5 sm:px-6 py-5 border-b border-slate-100">

            <div className="flex items-center justify-between gap-4">

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Transaction History
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Your recent rental payment transactions
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Payment records
              </div>

            </div>
          </div>

          {payments.length === 0 ? (

            /* Empty State */
            <div className="px-6 py-16 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
                <span className="text-3xl">💳</span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No payments yet
              </h3>

              <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
                Your rental payment transactions will appear here once you
                make your first payment.
              </p>

            </div>

          ) : (

            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Month
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Payment Date
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {payments.map((payment) => (

                      <tr
                        key={payment._id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >

                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">
                            {formatMonth(payment.createdAt)}
                          </div>

                          <div className="text-xs text-slate-400 mt-1">
                            Monthly rent
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900">
                            ₹{Number(payment.amount).toLocaleString("en-IN")}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(payment.createdAt)}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                              payment.status === "paid"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                payment.status === "paid"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />

                            {payment.status}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-slate-100">

                {payments.map((payment) => (

                  <div
                    key={payment._id}
                    className="p-5 hover:bg-slate-50 transition-colors"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="font-semibold text-slate-900">
                          {formatMonth(payment.createdAt)}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(payment.createdAt)}
                        </p>

                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          payment.status === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            payment.status === "paid"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />

                        {payment.status}
                      </span>

                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-sm text-slate-500">
                        Monthly Rent
                      </span>

                      <span className="text-lg font-bold text-slate-900">
                        ₹{Number(payment.amount).toLocaleString("en-IN")}
                      </span>

                    </div>

                  </div>

                ))}

              </div>
            </>

          )}

          {/* Footer */}
          {payments.length > 0 && (
            <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {payments.length}
                </span>{" "}
                transaction{payments.length !== 1 ? "s" : ""}
              </p>

              <p className="text-sm text-slate-500">
                Total:{" "}
                <span className="font-bold text-slate-900">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default PaymentHistory;