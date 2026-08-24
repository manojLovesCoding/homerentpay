import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const RentStatus = () => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    getTenantProperty();
  }, []);

  const getTenantProperty = async () => {
    try {
      const { data } = await api.get("/property/tenant-property");

      setProperty(data.property);

      if (data.property?._id) {
        const status = await api.get(
          `/payment/status?propertyId=${data.property._id}`,
        );

        setPaid(status.data.paid);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setPaying(true);

      const { data } = await api.post("/payment/create-order", {
        propertyId: property._id,
      });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Rent Payment",
        description: `Monthly rent for ${property.title}`,
        order_id: data.order.id,

        handler: async function (response) {
          try {
            const verify = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verify.data.success) {
              alert("Payment successful");
              await getTenantProperty();
            }
          } catch (error) {
            console.log(error);
            alert("Payment verification failed");
          } finally {
            setPaying(false);
          }
        },

        prefill: {
          name: "Tenant",
        },

        theme: {
          color: "#4f46e5",
        },

        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.log(response.error);
        setPaying(false);
        alert("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Payment failed");
      setPaying(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded-lg mb-8" />

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-white rounded-3xl" />
            <div className="h-96 bg-white rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // No property
  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-4xl">
            🏠
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            No Property Assigned
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            You don't have a rental property assigned to your account yet.
          </p>
        </div>
      </div>
    );
  }

  const currentDate = new Date();

  const currentMonth = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  const currentYear = currentDate.getFullYear();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Gradient header background */}
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600" />

      <main className="relative px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-white">
            <p className="text-sm font-medium text-blue-100">Tenant Portal</p>

            <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold">
              Monthly Rent
            </h1>

            <p className="mt-2 text-sm sm:text-base text-blue-100">
              Manage your current month's rental payment.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {/* Payment Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-900/10 overflow-hidden">
              {/* Payment header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 text-white">
                {/* Decorative circles */}
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-white/5" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-blue-100">
                        Payment for
                      </p>

                      <h2 className="mt-1 text-2xl sm:text-3xl font-bold">
                        {currentMonth} {currentYear}
                      </h2>
                    </div>

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        paid ? "bg-green-400/20" : "bg-yellow-400/20"
                      }`}
                    >
                      <span className="text-2xl">{paid ? "✓" : "₹"}</span>
                    </div>
                  </div>

                  {/* Rent amount */}
                  <div className="mt-8">
                    <p className="text-sm text-blue-100">Amount due</p>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl sm:text-5xl font-extrabold">
                        ₹{property.rent}
                      </span>

                      <span className="text-blue-100">/ month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment details */}
              <div className="p-5 sm:p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-5">
                  Payment Details
                </h3>

                <div className="space-y-3">
                  {/* Property */}
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                        🏠
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">Property</p>

                        <p className="font-semibold text-slate-800 truncate">
                          {property.title}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-medium text-slate-500 hidden sm:block">
                      Rental Property
                    </span>
                  </div>

                  {/* Month */}
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                        📅
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Billing Period</p>

                        <p className="font-semibold text-slate-800">
                          {currentMonth} {currentYear}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div
                    className={`flex items-center justify-between rounded-2xl p-4 ${
                      paid ? "bg-green-50" : "bg-amber-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          paid ? "bg-green-100" : "bg-amber-100"
                        }`}
                      >
                        {paid ? "✓" : "!"}
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Payment Status</p>

                        <p
                          className={`font-bold ${
                            paid ? "text-green-700" : "text-amber-700"
                          }`}
                        >
                          {paid ? "Paid" : "Payment Pending"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        paid
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {paid ? "COMPLETED" : "DUE"}
                    </span>
                  </div>
                </div>

                {/* Payment button */}
                <button
                  disabled={paid || paying}
                  onClick={handlePayment}
                  className={`group relative mt-7 w-full overflow-hidden rounded-2xl py-4 text-sm sm:text-base font-bold text-white shadow-lg transition-all duration-300 ${
                    paid
                      ? "bg-slate-300 cursor-not-allowed shadow-none"
                      : paying
                        ? "bg-indigo-400 cursor-wait"
                        : "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
                  }`}
                >
                  {!paid && !paying && (
                    <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-700 group-hover:translate-x-full" />
                  )}

                  <span className="relative flex items-center justify-center gap-2">
                    {paid ? (
                      <>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                          ✓
                        </span>
                        Rent Paid
                      </>
                    ) : paying ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <span>💳</span>
                        Pay Rent Securely
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}
                  </span>
                </button>

                {!paid && (
                  <p className="mt-3 text-center text-xs text-slate-400">
                    You will be redirected to the secure Razorpay payment
                    window.
                  </p>
                )}
              </div>
            </div>

            {/* Right side information */}
            <div className="space-y-5">
              {/* Status card */}
              <div
                className={`rounded-3xl p-6 shadow-xl ${
                  paid
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                    : "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/75">Current Status</p>

                    <h3 className="mt-1 text-2xl font-bold">
                      {paid ? "Payment Complete" : "Payment Due"}
                    </h3>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                    {paid ? "✓" : "₹"}
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-white/80">
                  {paid
                    ? "Your rent payment for this month has been successfully completed."
                    : "Your monthly rent payment is currently pending. Pay before your due date to keep your account up to date."}
                </p>
              </div>

              {/* Property card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/10 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Rental Property
                </p>

                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {property.title}
                </h3>

                <div className="mt-4 flex items-start gap-3">
                  <span className="text-lg">📍</span>

                  <p className="text-sm leading-6 text-slate-500">
                    {property.address}
                    {property.city && `, ${property.city}`}
                  </p>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Monthly Rent</span>

                    <span className="font-bold text-blue-600">
                      ₹{property.rent}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security card */}
              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    🔒
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-900">Secure Payments</h3>

                    <p className="mt-1 text-xs sm:text-sm leading-5 text-blue-700/70">
                      Your payment is processed securely through Razorpay. We
                      never store your card or banking information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Keep your payment confirmation for your records.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RentStatus;
