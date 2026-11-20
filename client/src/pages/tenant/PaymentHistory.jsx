
import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  CalendarDays,
  IndianRupee,
  Clock,
} from "lucide-react";
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

  const successfulPayments = payments.filter(
    (payment) =>
      ["paid", "success", "completed"].includes(
        payment.status?.toLowerCase()
      )
  ).length;

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

  const isPaid = (status) =>
    ["paid", "success", "completed"].includes(status?.toLowerCase());

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F7F8F5]">
        <div className="flex flex-col items-center">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#A8BDA5] border-t-[#244B3C]" />
          <p className="mt-3 text-sm font-medium text-[#68756A]">
            Loading payment history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F8F5] px-3 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-6xl space-y-4">

        {/* Header */}
        <div className="rounded-2xl bg-[#244B3C] px-5 py-5 shadow-sm sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                <CreditCard size={23} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-white sm:text-2xl">
                  Payment History
                </h1>
                <p className="mt-1 text-xs text-[#DCE8DC] sm:text-sm">
                  Track your previous rental payments.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 sm:min-w-[175px]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#DCE8DC]">
                Total Paid
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                ₹{formatAmount(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between rounded-xl border border-[#E6E3D9] bg-white p-4 shadow-sm">
            <div>
              <p className="text-xs font-medium text-[#68756A]">
                Total Payments
              </p>
              <p className="mt-1 text-2xl font-bold text-[#242B26]">
                {payments.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F4EA] text-[#527C61]">
              <Receipt size={20} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#E6E3D9] bg-white p-4 shadow-sm">
            <div>
              <p className="text-xs font-medium text-[#68756A]">
                Successful
              </p>
              <p className="mt-1 text-2xl font-bold text-[#244B3C]">
                {successfulPayments}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF1E9] text-[#527C61]">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="overflow-hidden rounded-2xl border border-[#E6E3D9] bg-white shadow-sm">

          {/* Section Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#E6E3D9] px-4 py-3.5 sm:px-5">
            <div>
              <h2 className="text-base font-bold text-[#242B26]">
                Transaction History
              </h2>
              <p className="mt-0.5 text-xs text-[#68756A]">
                Your rental payment records
              </p>
            </div>

            <div className="hidden items-center gap-1.5 rounded-full bg-[#EAF1E9] px-3 py-1.5 text-xs font-medium text-[#244B3C] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#527C61]" />
              Payment records
            </div>
          </div>

          {payments.length === 0 ? (
            /* Empty State */
            <div className="px-5 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F4EA] text-[#527C61]">
                <CreditCard size={27} />
              </div>

              <h3 className="mt-3 text-base font-semibold text-[#242B26]">
                No payments yet
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs text-[#68756A]">
                Your rental payment transactions will appear here once you
                make your first payment.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F7F8F5]">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#68756A]">
                        Month
                      </th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#68756A]">
                        Amount
                      </th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#68756A]">
                        Payment Date
                      </th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#68756A]">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F0EFE9]">
                    {payments.map((payment) => (
                      <tr
                        key={payment._id}
                        className="transition-colors hover:bg-[#FAFBF8]"
                      >
                        <td className="px-5 py-3">
                          <p className="text-sm font-semibold text-[#242B26]">
                            {formatMonth(payment.createdAt)}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#879087]">
                            Monthly rent
                          </p>
                        </td>

                        <td className="px-5 py-3">
                          <span className="text-sm font-bold text-[#244B3C]">
                            ₹{formatAmount(payment.amount)}
                          </span>
                        </td>

                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 text-sm text-[#526056]">
                            <CalendarDays size={14} className="text-[#A8BDA5]" />
                            {formatDate(payment.createdAt)}
                          </div>
                        </td>

                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              isPaid(payment.status)
                                ? "bg-[#EAF1E9] text-[#244B3C]"
                                : "bg-[#F7F1E4] text-[#98712F]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isPaid(payment.status)
                                  ? "bg-[#527C61]"
                                  : "bg-[#D6A45D]"
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
              <div className="divide-y divide-[#F0EFE9] md:hidden">
                {payments.map((payment) => (
                  <div
                    key={payment._id}
                    className="px-4 py-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#242B26]">
                          {formatMonth(payment.createdAt)}
                        </p>

                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#879087]">
                          <CalendarDays size={12} />
                          {formatDate(payment.createdAt)}
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ${
                          isPaid(payment.status)
                            ? "bg-[#EAF1E9] text-[#244B3C]"
                            : "bg-[#F7F1E4] text-[#98712F]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isPaid(payment.status)
                              ? "bg-[#527C61]"
                              : "bg-[#D6A45D]"
                          }`}
                        />
                        {payment.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-[#68756A]">
                        Monthly Rent
                      </span>

                      <span className="text-base font-bold text-[#244B3C]">
                        ₹{formatAmount(payment.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Footer */}
          {payments.length > 0 && (
            <div className="flex flex-col gap-1.5 border-t border-[#E6E3D9] bg-[#F7F8F5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-[#68756A]">
                Showing{" "}
                <span className="font-semibold text-[#242B26]">
                  {payments.length}
                </span>{" "}
                transaction{payments.length !== 1 ? "s" : ""}
              </p>

              <p className="text-xs text-[#68756A]">
                Total:{" "}
                <span className="font-bold text-[#244B3C]">
                  ₹{formatAmount(totalAmount)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="flex items-center gap-2 px-1 text-[11px] text-[#879087]">
          <CheckCircle2 size={14} className="shrink-0 text-[#527C61]" />
          Your payment records are available here for reference.
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
