import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const TenantDashboard = () => {
  const [property, setProperty] = useState(null);
  const [pendingRent, setPendingRent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProperty();
    fetchPayments();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await api.get("/property/tenant-property");

      const propertyData = res.data.property;

      setProperty(propertyData);

      if (propertyData?._id) {
        fetchPendingRent(propertyData._id);
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRent = async (propertyId) => {
    try {
      const res = await api.get(
        `/property/pending-rent?propertyId=${propertyId}`,
      );

      setPendingRent(res.data);
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to load pending rent");
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payment/history");

      setPayments(res.data.payments || []);
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to load payments");
    }
  };

  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-48 rounded-3xl bg-slate-200" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-32 rounded-2xl bg-slate-200" />
            <div className="h-32 rounded-2xl bg-slate-200" />
          </div>

          <div className="h-72 rounded-2xl bg-slate-200" />

          <div className="h-64 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  const isPending = pendingRent?.pending;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        {/* =================================================
            WELCOME HERO
        ================================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-xl shadow-blue-600/20 sm:p-8 lg:p-10">
          {/* Decorative circles */}

          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl shadow-lg backdrop-blur-sm">
                🏠
              </div>

              <div>
                <p className="text-sm font-medium text-blue-100">
                  Tenant Dashboard
                </p>

                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                  Welcome, {user?.name || "Tenant"} 👋
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
              Keep track of your property, monthly rent and payment history —
              all from one place.
            </p>

            {/* Quick status */}

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Account Active
              </div>

              {property && (
                <div className="rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                  🏠 Property Assigned
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =================================================
            SUMMARY CARDS
        ================================================== */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Rent */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Monthly Rent
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                  ₹{property?.rent || 0}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                ₹
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Monthly payment
            </div>
          </div>

          {/* Pending Rent */}

          <div
            className={`group rounded-2xl border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
              isPending ? "border-red-100" : "border-emerald-100"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Rent
                </p>

                <h2
                  className={`mt-2 text-3xl font-extrabold tracking-tight ${
                    isPending ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  ₹{isPending ? pendingRent.amount : 0}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                  isPending
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {isPending ? "!" : "✓"}
              </div>
            </div>

            <div className="mt-4">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  isPending
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isPending ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />

                {isPending ? "Payment Pending" : "All Paid"}
              </span>
            </div>
          </div>

          {/* Payment Status */}

          <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Payment Status
                </p>

                <h2
                  className={`mt-2 text-2xl font-extrabold ${
                    isPending ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  {isPending ? "Pending" : "Paid"}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                  isPending
                    ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {isPending ? "◷" : "✓"}
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Current rental payment status
            </p>
          </div>
        </section>

        {/* =================================================
            PROPERTY
        ================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Rental
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                My Property
              </h2>
            </div>

            {property && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Currently Rented
              </span>
            )}
          </div>

          {property ? (
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
                {/* Property Image */}

                <div className="overflow-hidden rounded-2xl">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-48 w-full object-cover transition duration-500 hover:scale-105 lg:h-full"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-5xl lg:h-full">
                      🏠
                    </div>
                  )}
                </div>

                {/* Property Info */}

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {property.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    📍 {property.address}
                    {property.city && `, ${property.city}`}
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-400">
                        Monthly Rent
                      </p>

                      <p className="mt-1 text-lg font-bold text-blue-600">
                        ₹{property.rent}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium text-slate-400">
                        Rent Due Date
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-800">
                        {property.dueDate
                          ? `${property.dueDate}th`
                          : "Not assigned"}
                      </p>
                    </div>
                  </div>

                  {property.dueDate && (
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                      <p className="text-sm text-blue-700">
                        💡 Your rent is due on the{" "}
                        <strong>{property.dueDate}th</strong> of every month.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                🏠
              </div>

              <h3 className="mt-4 font-bold text-slate-800">
                No property assigned
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                You don't currently have a rental property assigned to your
                account.
              </p>
            </div>
          )}
        </section>

        {/* =================================================
            RECENT PAYMENTS
        ================================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Transactions
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Recent Payments
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              ₹
            </div>
          </div>

          {payments.length > 0 ? (
            <>
              {/* Desktop table */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                        Month
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
                    {payments.map((payment) => (
                      <tr
                        key={payment._id}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm text-blue-600">
                              📅
                            </div>

                            <span className="font-semibold text-slate-700">
                              {new Date(
                                payment.year,
                                payment.month - 1,
                              ).toLocaleString("default", {
                                month: "long",
                              })}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-bold text-slate-800">
                          ₹{payment.amount}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold capitalize text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}

              <div className="space-y-3 p-4 md:hidden">
                {payments.map((payment) => (
                  <div
                    key={payment._id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                          📅
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {new Date(
                              payment.year,
                              payment.month - 1,
                            ).toLocaleString("default", {
                              month: "long",
                            })}
                          </p>

                          <p className="text-xs text-slate-400">
                            {payment.year}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-slate-800">
                          ₹{payment.amount}
                        </p>

                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold capitalize text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center sm:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                ₹
              </div>

              <h3 className="mt-4 font-bold text-slate-800">
                No payment history
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your completed rent payments will appear here.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TenantDashboard;
