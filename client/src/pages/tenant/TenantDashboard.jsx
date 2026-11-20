import React, { useEffect, useState } from "react";
import {
  Home,
  Wallet,
  Clock3,
  CheckCircle2,
  AlertCircle,
  MapPin,
  CalendarDays,
  CreditCard,
  Building2,
  ReceiptText,
} from "lucide-react";
import api from "../../api/axios";

const TenantDashboard = () => {
  const [property, setProperty] = useState(null);
  const [pendingRent, setPendingRent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isPending = Boolean(pendingRent?.pending);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      await Promise.all([fetchProperty(), fetchPayments()]);
      setLoading(false);
    };

    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await api.get("/property/tenant-property");
      const propertyData = res.data.property || null;

      setProperty(propertyData);

      if (propertyData?._id) {
        await fetchPendingRent(propertyData._id);
      } else {
        setPendingRent(null);
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to load property");
      setProperty(null);
      setPendingRent(null);
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
      setPendingRent(null);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payment/history");
      setPayments(res.data.payments || []);
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to load payments");
      setPayments([]);
    }
  };

  const getOrdinal = (value) => {
    const number = Number(value);

    if (!number) return "Not assigned";

    const remainder = number % 100;

    if (remainder >= 11 && remainder <= 13) {
      return `${number}th`;
    }

    switch (number % 10) {
      case 1:
        return `${number}st`;
      case 2:
        return `${number}nd`;
      case 3:
        return `${number}rd`;
      default:
        return `${number}th`;
    }
  };

  const formatMonth = (month, year) => {
    if (!month || !year) return "—";

    return new Date(Number(year), Number(month) - 1).toLocaleString("en", {
      month: "long",
    });
  };

  const isPaymentSuccessful = (status) =>
    ["paid", "success", "completed"].includes(
      String(status || "").toLowerCase(),
    );

  if (loading) {
    return (
      <div className="bg-[#F7F8F5] px-3 py-4 sm:px-5">
        <div className="mx-auto max-w-6xl animate-pulse space-y-4">
          <div className="h-28 rounded-xl bg-[#E5EAE2]" />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-24 rounded-xl bg-[#E5EAE2]" />
            ))}
          </div>

          <div className="h-56 rounded-xl bg-[#E5EAE2]" />
          <div className="h-48 rounded-xl bg-[#E5EAE2]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 bg-[#F7F8F5]">
      <div className="mx-auto max-w-6xl space-y-4 px-3 py-3 sm:px-5 sm:py-4">
        {/* Compact welcome section */}
        <section className="rounded-xl bg-[#244B3C] px-4 py-4 text-white sm:px-5 sm:py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#F7F4EA]">
                <Home size={21} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#DCE8DC]">
                  Tenant Dashboard
                </p>

                <h1 className="mt-0.5 truncate text-xl font-bold tracking-tight sm:text-2xl">
                  Welcome, {user?.name || "Tenant"}
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-[#A8BDA5]" />
                Account Active
              </span>

              {property && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white">
                  <Home size={12} />
                  Property Assigned
                </span>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs leading-5 text-[#E1EAE0]">
            Manage your rental home, monthly rent and payment details in one
            place.
          </p>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Monthly rent */}
          <div className="rounded-xl border border-[#E6E3D9] bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-[#68756A]">
                  Monthly Rent
                </p>

                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#242B26]">
                  ₹{property?.rent ?? 0}
                </h2>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8EDE5] text-[#244B3C]">
                <Wallet size={19} />
              </div>
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-[10px] text-[#879187]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#527C61]" />
              Monthly payment
            </p>
          </div>

          {/* Pending rent */}
          <div
            className={`rounded-xl border bg-white p-3.5 shadow-sm ${
              isPending ? "border-[#F0D7D1]" : "border-[#DCE7DA]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-[#68756A]">
                  Pending Rent
                </p>

                <h2
                  className={`mt-1 text-2xl font-extrabold tracking-tight ${
                    isPending ? "text-[#A64B43]" : "text-[#527C61]"
                  }`}
                >
                  ₹{isPending ? pendingRent.amount : 0}
                </h2>
              </div>

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  isPending
                    ? "bg-[#F8EAE6] text-[#A64B43]"
                    : "bg-[#E8EDE5] text-[#527C61]"
                }`}
              >
                {isPending ? (
                  <AlertCircle size={19} />
                ) : (
                  <CheckCircle2 size={19} />
                )}
              </div>
            </div>

            <p
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ${
                isPending
                  ? "bg-[#F8EAE6] text-[#A64B43]"
                  : "bg-[#E8EDE5] text-[#527C61]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isPending ? "bg-[#A64B43]" : "bg-[#527C61]"
                }`}
              />
              {isPending ? "Payment Pending" : "All Paid"}
            </p>
          </div>

          {/* Payment status */}
          <div className="rounded-xl border border-[#E6E3D9] bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-[#68756A]">
                  Payment Status
                </p>

                <h2
                  className={`mt-1 text-2xl font-extrabold ${
                    isPending ? "text-[#B47A36]" : "text-[#527C61]"
                  }`}
                >
                  {isPending ? "Pending" : "Paid"}
                </h2>
              </div>

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  isPending
                    ? "bg-[#F7EFE1] text-[#B47A36]"
                    : "bg-[#E8EDE5] text-[#527C61]"
                }`}
              >
                {isPending ? <Clock3 size={19} /> : <CheckCircle2 size={19} />}
              </div>
            </div>

            <p className="mt-2 text-[10px] text-[#879187]">
              Current rental payment status
            </p>
          </div>
        </section>

        {/* Property section */}
        <section className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEECE5] px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#527C61]">
                Your Rental
              </p>

              <h2 className="mt-0.5 text-base font-bold text-[#242B26]">
                My Property
              </h2>
            </div>

            {property && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8EDE5] px-2.5 py-1 text-[10px] font-semibold text-[#527C61]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#527C61]" />
                Currently Rented
              </span>
            )}
          </div>

          {property ? (
            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr] lg:grid-cols-[210px_1fr]">
                {/* Smaller property image */}
                <div className="h-36 overflow-hidden rounded-lg bg-[#E8EDE5] sm:h-40">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title || "Rental property"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#EAF0E8] text-[#527C61]">
                      <Building2 size={42} strokeWidth={1.3} />
                    </div>
                  )}
                </div>

                {/* Property information */}
                <div className="flex min-w-0 flex-col justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#242B26]">
                      {property.title || "Your Rental Property"}
                    </h3>

                    <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-[#68756A]">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-[#527C61]"
                      />

                      <span>
                        {property.address}
                        {property.city && `, ${property.city}`}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-[#E6E3D9] bg-[#F7F8F5] px-3 py-2">
                      <p className="flex items-center gap-1.5 text-[10px] font-medium text-[#879187]">
                        <Wallet size={12} />
                        Monthly Rent
                      </p>

                      <p className="mt-1 text-base font-bold text-[#244B3C]">
                        ₹{property.rent ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#E6E3D9] bg-[#F7F8F5] px-3 py-2">
                      <p className="flex items-center gap-1.5 text-[10px] font-medium text-[#879187]">
                        <CalendarDays size={12} />
                        Rent Due Date
                      </p>

                      <p className="mt-1 text-base font-bold text-[#242B26]">
                        {getOrdinal(property.dueDate)}
                      </p>
                    </div>
                  </div>

                  {property.dueDate && (
                    <p className="flex items-center gap-1.5 text-[11px] text-[#527C61]">
                      <CalendarDays size={13} className="shrink-0" />
                      Rent is due on the{" "}
                      <strong>{getOrdinal(property.dueDate)}</strong> of every
                      month.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8EDE5] text-[#527C61]">
                <Home size={25} />
              </div>

              <h3 className="mt-3 text-sm font-bold text-[#242B26]">
                No property assigned
              </h3>

              <p className="mx-auto mt-1 max-w-md text-xs text-[#68756A]">
                You don't currently have a rental property assigned to your
                account.
              </p>
            </div>
          )}
        </section>

        {/* Recent payments */}
        <section className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#EEECE5] px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#527C61]">
                Transactions
              </p>

              <h2 className="mt-0.5 text-base font-bold text-[#242B26]">
                Recent Payments
              </h2>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8EDE5] text-[#244B3C]">
              <ReceiptText size={17} />
            </div>
          </div>

          {payments.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#EEECE5] bg-[#F7F8F5]">
                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#879187]">
                        Month
                      </th>

                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#879187]">
                        Amount
                      </th>

                      <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-[#879187]">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map((payment) => {
                      const successful = isPaymentSuccessful(payment.status);

                      return (
                        <tr
                          key={payment._id}
                          className="border-b border-[#F0EFE9] transition hover:bg-[#FAFBF8]"
                        >
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8EDE5] text-[#527C61]">
                                <CalendarDays size={15} />
                              </div>

                              <span className="text-xs font-semibold text-[#526056]">
                                {formatMonth(payment.month, payment.year)}{" "}
                                {payment.year}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-2.5 text-xs font-bold text-[#242B26]">
                            ₹{payment.amount}
                          </td>

                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                                successful
                                  ? "bg-[#E8EDE5] text-[#527C61]"
                                  : "bg-[#F8EAE6] text-[#A64B43]"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  successful ? "bg-[#527C61]" : "bg-[#A64B43]"
                                }`}
                              />
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile payment cards */}
              <div className="space-y-2 p-3 md:hidden">
                {payments.map((payment) => {
                  const successful = isPaymentSuccessful(payment.status);

                  return (
                    <div
                      key={payment._id}
                      className="rounded-lg border border-[#E6E3D9] bg-[#FAFBF8] p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8EDE5] text-[#527C61]">
                            <CreditCard size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-[#242B26]">
                              {formatMonth(payment.month, payment.year)}
                            </p>

                            <p className="text-[10px] text-[#879187]">
                              {payment.year}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-[#242B26]">
                            ₹{payment.amount}
                          </p>

                          <span
                            className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold capitalize ${
                              successful
                                ? "bg-[#E8EDE5] text-[#527C61]"
                                : "bg-[#F8EAE6] text-[#A64B43]"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                successful ? "bg-[#527C61]" : "bg-[#A64B43]"
                              }`}
                            />
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="px-4 py-7 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8EDE5] text-[#527C61]">
                <ReceiptText size={24} />
              </div>

              <h3 className="mt-3 text-sm font-bold text-[#242B26]">
                No payment history
              </h3>

              <p className="mt-1 text-xs text-[#68756A]">
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
