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

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");

  // Billing month the rent is FOR (not when the payment was made)
  const getRentMonth = (pay) => {
    const date =
      pay.month && pay.year
        ? new Date(Number(pay.year), Number(pay.month) - 1)
        : new Date(pay.createdAt); // fallback for very old records

    return date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Date the transaction happened
  const getPaymentDate = (pay) =>
    pay.paidAt ? new Date(pay.paidAt) : new Date(pay.createdAt);

  const getStatusStyle = (isPaid) =>
    isPaid
      ? "bg-[#EAF2E9] text-[#3F7050]"
      : "bg-[#F8F0E3] text-[#A47735]";

  const Avatar = ({ name, fallback = "T", landlord = false }) => (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
        landlord
          ? "bg-[#F5EDDF] text-[#A47735]"
          : "bg-[#E8EEE8] text-[#244B3C]"
      }`}
    >
      {name?.charAt(0)?.toUpperCase() || fallback}
    </div>
  );

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="bg-[#F7F8F5] p-3 sm:p-4 lg:p-5">
        <div className="max-w-7xl mx-auto space-y-4 animate-pulse">
          <div>
            <div className="h-6 w-40 bg-[#E6E3D9] rounded-md" />
            <div className="h-3 w-64 bg-[#E6E3D9] rounded mt-2" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 bg-white rounded-xl border border-[#E6E3D9]"
              />
            ))}
          </div>

          <div className="h-64 bg-white rounded-xl border border-[#E6E3D9]" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8F5] p-3 sm:p-4 lg:p-5">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* HEADER */}
        <div className="bg-[#244B3C] rounded-xl px-4 py-4 sm:px-5 sm:py-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[#C6D8C8] text-xs font-medium mb-1">
                <span>💳</span>
                <span>Financial Management</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Payments
              </h1>

              <p className="text-xs sm:text-sm text-[#D6E2D7] mt-1">
                Monitor rental payments and see which month each one covers.
              </p>
            </div>

            <div className="shrink-0 bg-white/10 border border-white/15 rounded-lg px-3 py-2.5 text-right">
              <p className="text-[10px] sm:text-xs text-[#D6E2D7]">
                Transactions
              </p>
              <p className="text-xl font-bold text-white">
                {summary.total}
              </p>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-[#E6E3D9] rounded-xl p-3 shadow-sm">
            <p className="text-xs text-[#68756A]">Total Payments</p>
            <p className="text-xl font-bold text-[#244B3C] mt-1">
              {summary.total}
            </p>
          </div>

          <div className="bg-white border border-[#E6E3D9] rounded-xl p-3 shadow-sm">
            <p className="text-xs text-[#68756A]">Paid</p>
            <p className="text-xl font-bold text-[#527C61] mt-1">
              {summary.paid}
            </p>
          </div>

          <div className="bg-white border border-[#E6E3D9] rounded-xl p-3 shadow-sm">
            <p className="text-xs text-[#68756A]">Pending</p>
            <p className="text-xl font-bold text-[#B18442] mt-1">
              {summary.pending}
            </p>
          </div>

          <div className="bg-white border border-[#E6E3D9] rounded-xl p-3 shadow-sm">
            <p className="text-xs text-[#68756A]">Total Revenue</p>
            <p className="text-xl font-bold text-[#244B3C] mt-1 truncate">
              ₹{formatAmount(summary.revenue)}
            </p>
          </div>
        </div>

        {/* PAYMENT CONTENT */}
        {payments.length === 0 ? (
          <div className="bg-white border border-[#E6E3D9] rounded-xl shadow-sm p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-xl bg-[#EAF0E8] flex items-center justify-center text-3xl">
              💳
            </div>

            <h2 className="text-lg font-bold text-[#242B26] mt-3">
              No payments found
            </h2>

            <p className="text-sm text-[#68756A] mt-1">
              There are currently no payment transactions to display.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE / TABLET PAYMENT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:hidden gap-3">
              {payments.map((pay) => {
                const isPaid = pay.status === "paid";
                const paymentDate = getPaymentDate(pay);

                return (
                  <div
                    key={pay._id}
                    className="bg-white border border-[#E6E3D9] rounded-xl p-3 shadow-sm"
                  >
                    {/* TENANT AND STATUS */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={pay.tenant?.name} fallback="T" />

                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#303B32] truncate">
                            {pay.tenant?.name || "N/A"}
                          </p>
                          <p className="text-[10px] text-[#8A958B] truncate">
                            {pay.tenant?.email || "No email"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${getStatusStyle(
                          isPaid,
                        )}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {pay.status || "Unknown"}
                      </span>
                    </div>

                    {/* AMOUNT + RENT MONTH */}
                    <div className="mt-3 px-3 py-2.5 rounded-lg bg-[#F7F8F5] flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-[#8A958B]">
                          Payment Amount
                        </p>

                        <p className="text-xl font-bold text-[#244B3C] mt-0.5">
                          ₹{formatAmount(pay.amount)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-[#8A958B]">
                          Rent For
                        </p>

                        <p className="text-sm font-bold text-[#303B32] mt-0.5">
                          {getRentMonth(pay)}
                        </p>
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="min-w-0">
                        <p className="text-[10px] text-[#8A958B]">
                          Property
                        </p>
                        <p className="text-xs font-semibold text-[#3C493F] mt-1 truncate">
                          {pay.property?.title || "N/A"}
                        </p>
                        <p className="text-[10px] text-[#8A958B] truncate">
                          {pay.property?.city || ""}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] text-[#8A958B]">
                          Landlord
                        </p>
                        <p className="text-xs font-semibold text-[#3C493F] mt-1 truncate">
                          {pay.landlord?.name || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* DATE */}
                    <div className="mt-3 pt-2.5 border-t border-[#EEEDE7] flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#8A958B]">
                        {isPaid ? "Paid On" : "Initiated On"}
                      </span>

                      <span className="text-xs font-medium text-[#526056]">
                        {paymentDate.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden xl:block bg-white border border-[#E6E3D9] rounded-xl shadow-sm overflow-hidden">
              {/* TABLE HEADER */}
              <div className="px-4 py-3 border-b border-[#EAE9E2] flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-[#242B26]">
                    Payment Transactions
                  </h2>
                  <p className="text-xs text-[#68756A] mt-0.5">
                    Complete transaction history
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <div className="px-2.5 py-1 rounded-full bg-[#EAF2E9] text-[#3F7050] text-[10px] font-semibold">
                    ₹{formatAmount(summary.revenue)} collected
                  </div>

                  {summary.pendingAmount > 0 && (
                    <div className="px-2.5 py-1 rounded-full bg-[#F8F0E3] text-[#A47735] text-[10px] font-semibold">
                      ₹{formatAmount(summary.pendingAmount)} pending
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F7F8F5] border-b border-[#E6E3D9]">
                      {[
                        "Tenant",
                        "Property",
                        "Landlord",
                        "Rent For",
                        "Amount",
                        "Status",
                        "Date",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-4 py-3 text-[10px] font-semibold text-[#68756A] uppercase tracking-wider"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F0EFE9]">
                    {payments.map((pay) => {
                      const isPaid = pay.status === "paid";
                      const paymentDate = getPaymentDate(pay);

                      return (
                        <tr
                          key={pay._id}
                          className="hover:bg-[#F8FAF6] transition"
                        >
                          {/* TENANT */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar name={pay.tenant?.name} fallback="T" />

                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#303B32]">
                                  {pay.tenant?.name || "N/A"}
                                </p>
                                <p className="text-[10px] text-[#8A958B] truncate max-w-[140px]">
                                  {pay.tenant?.email || ""}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* PROPERTY */}
                          <td className="px-4 py-3">
                            <p className="text-xs font-semibold text-[#3C493F] max-w-[150px] truncate">
                              {pay.property?.title || "N/A"}
                            </p>
                            <p className="text-[10px] text-[#8A958B] mt-0.5">
                              📍 {pay.property?.city || "Unknown"}
                            </p>
                          </td>

                          {/* LANDLORD */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar
                                name={pay.landlord?.name}
                                fallback="L"
                                landlord
                              />
                              <span className="text-xs font-medium text-[#3C493F]">
                                {pay.landlord?.name || "N/A"}
                              </span>
                            </div>
                          </td>

                          {/* RENT FOR (BILLING MONTH) */}
                          <td className="px-4 py-3">
                            <p className="text-xs font-bold text-[#303B32] whitespace-nowrap">
                              {getRentMonth(pay)}
                            </p>
                            <p className="text-[10px] text-[#8A958B] mt-0.5">
                              Monthly rent
                            </p>
                          </td>

                          {/* AMOUNT */}
                          <td className="px-4 py-3">
                            <p className="text-xs font-bold text-[#244B3C]">
                              ₹{formatAmount(pay.amount)}
                            </p>
                            <p className="text-[10px] text-[#8A958B]">
                              Rental payment
                            </p>
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize ${getStatusStyle(
                                isPaid,
                              )}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {pay.status || "Unknown"}
                            </span>
                          </td>

                          {/* DATE */}
                          <td className="px-4 py-3">
                            <p className="text-xs font-medium text-[#3C493F]">
                              {paymentDate.toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-[10px] text-[#8A958B] mt-0.5">
                              {isPaid ? "Paid" : "Initiated"} ·{" "}
                              {paymentDate.toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
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