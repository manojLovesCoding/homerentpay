
import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Home,
  IndianRupee,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
          `/payment/status?propertyId=${data.property._id}`
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
    if (!property?._id || paying || paid) return;

    try {
      setPaying(true);

      const { data } = await api.post("/payment/create-order", {
        propertyId: property._id,
      });

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay is not available. Please refresh the page and try again."
        );
      }

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
              toast.success("Rent payment successful!", {
                autoClose: 3000,
              });

              setPaid(true);
              await getTenantProperty();
            } else {
              toast.error(
                verify.data.message || "Payment verification failed."
              );
            }
          } catch (error) {
            console.log(error);

            toast.error(
              error.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
          } finally {
            setPaying(false);
          }
        },

        prefill: {
          name: "Tenant",
        },

        theme: {
          color: "#244B3C",
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

        toast.error(
          response.error?.description ||
            "Payment failed. Please try again."
        );
      });

      razorpay.open();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to initiate payment. Please try again."
      );

      setPaying(false);
    }
  };

  const currentDate = new Date();

  const currentMonth = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  const currentYear = currentDate.getFullYear();

  if (loading) {
    return (
      <div className="bg-[#F7F8F5] px-3 py-4 sm:px-5">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-4 h-7 w-44 rounded bg-[#E6E9E1]" />

          <div className="grid gap-3 lg:grid-cols-3">
            <div className="h-64 rounded-2xl bg-white lg:col-span-2" />
            <div className="h-64 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center bg-[#F7F8F5] px-4 py-6">
        <div className="w-full max-w-sm rounded-2xl border border-[#E6E3D9] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#EAF0E8] text-[#244B3C]">
            <Home size={30} />
          </div>

          <h2 className="text-xl font-bold text-[#242B26]">
            No Property Assigned
          </h2>

          <p className="mt-2 text-sm text-[#68756A]">
            You don't have a rental property assigned to your account yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8F5] px-3 py-3 sm:px-5 sm:py-4">
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastStyle={{
          borderRadius: "12px",
          fontSize: "13px",
          fontWeight: "500",
        }}
      />

      <main className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#527C61]">
              Tenant Portal
            </p>

            <h1 className="text-xl font-bold leading-tight text-[#242B26] sm:text-2xl">
              Monthly Rent
            </h1>

            <p className="mt-1 text-xs text-[#68756A]">
              Manage your current month's rental payment.
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              paid
                ? "border-[#DCE7DA] bg-[#EAF0E8] text-[#244B3C]"
                : "border-[#EBDDBB] bg-[#FBF4E5] text-[#946B25]"
            }`}
          >
            {paid ? (
              <CheckCircle2 size={14} />
            ) : (
              <Clock3 size={14} />
            )}

            {paid ? "Paid" : "Payment Due"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Main Payment Card */}
          <section className="overflow-hidden rounded-2xl border border-[#E6E3D9] bg-white shadow-sm lg:col-span-2">
            {/* Rent Banner */}
            <div className="relative overflow-hidden bg-[#244B3C] px-4 py-4 text-white sm:px-5">
              <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/[0.06]" />
              <div className="absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-white/[0.05]" />

              <div className="relative flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-white/70">
                    Payment for
                  </p>

                  <h2 className="mt-0.5 text-xl font-bold sm:text-2xl">
                    {currentMonth} {currentYear}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-xs text-white/70">Monthly Rent</p>

                  <div className="mt-0.5 flex items-center justify-end gap-1">
                    <IndianRupee size={21} />

                    <span className="text-3xl font-extrabold">
                      {Number(property.rent || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#242B26]">
                  Payment Details
                </h3>

                <span className="text-[11px] text-[#879187]">
                  Current billing period
                </span>
              </div>

              {/* Payment Information */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-[#E6E3D9] bg-[#FAFBF8] p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-[#244B3C]">
                    <Home size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-[#879187]">
                      Property
                    </p>

                    <p className="truncate text-xs font-semibold text-[#344239]">
                      {property.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-[#E6E3D9] bg-[#FAFBF8] p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-[#244B3C]">
                    <CalendarDays size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#879187]">
                      Billing Period
                    </p>

                    <p className="text-xs font-semibold text-[#344239]">
                      {currentMonth} {currentYear}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2.5 rounded-xl border p-3 ${
                    paid
                      ? "border-[#DCE7DA] bg-[#F2F6F0]"
                      : "border-[#EBDDBB] bg-[#FBF7ED]"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      paid
                        ? "bg-[#E0EBDD] text-[#244B3C]"
                        : "bg-[#F5EACD] text-[#946B25]"
                    }`}
                  >
                    {paid ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <Clock3 size={17} />
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] text-[#879187]">
                      Status
                    </p>

                    <p
                      className={`text-xs font-bold ${
                        paid ? "text-[#244B3C]" : "text-[#946B25]"
                      }`}
                    >
                      {paid ? "Completed" : "Payment Pending"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                disabled={paid || paying}
                onClick={handlePayment}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition ${
                  paid
                    ? "cursor-not-allowed bg-[#A8BDA5]"
                    : paying
                      ? "cursor-wait bg-[#527C61]"
                      : "bg-[#244B3C] hover:bg-[#193A2E] active:scale-[0.99]"
                }`}
              >
                {paid ? (
                  <>
                    <CheckCircle2 size={17} />
                    Rent Paid Successfully
                  </>
                ) : paying ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard size={17} />
                    Pay Rent Securely
                  </>
                )}
              </button>

              {!paid && (
                <p className="mt-2 text-center text-[10px] text-[#879187]">
                  Secure payment powered by Razorpay.
                </p>
              )}
            </div>
          </section>

          {/* Side Information */}
          <aside className="flex flex-col gap-3">
            {/* Payment Status */}
            <div
              className={`rounded-2xl border p-4 ${
                paid
                  ? "border-[#DCE7DA] bg-[#EAF0E8]"
                  : "border-[#EBDDBB] bg-[#FBF4E5]"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    paid
                      ? "bg-white text-[#244B3C]"
                      : "bg-white text-[#946B25]"
                  }`}
                >
                  {paid ? (
                    <CheckCircle2 size={19} />
                  ) : (
                    <Wallet size={19} />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7B887D]">
                    Current Status
                  </p>

                  <h3
                    className={`text-sm font-bold ${
                      paid ? "text-[#244B3C]" : "text-[#946B25]"
                    }`}
                  >
                    {paid ? "Payment Complete" : "Payment Due"}
                  </h3>
                </div>
              </div>

              <p className="mt-2 text-xs leading-5 text-[#68756A]">
                {paid
                  ? "Your rent payment for this month has been successfully completed."
                  : "Your monthly rent payment is pending. Please complete it before your due date."}
              </p>
            </div>

            {/* Property Summary */}
            <div className="rounded-2xl border border-[#E6E3D9] bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#879187]">
                Rental Property
              </p>

              <h3 className="mt-1 text-sm font-bold text-[#242B26]">
                {property.title}
              </h3>

              <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-[#68756A]">
                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-[#527C61]"
                />

                <p>
                  {property.address}
                  {property.city && `, ${property.city}`}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[#E6E3D9] pt-3">
                <span className="text-xs text-[#68756A]">
                  Monthly Rent
                </span>

                <span className="flex items-center text-sm font-bold text-[#244B3C]">
                  <IndianRupee size={14} />
                  {Number(property.rent || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#E6E3D9] bg-white p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-[#244B3C]">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h3 className="text-xs font-bold text-[#344239]">
                  Secure Payments
                </h3>

                <p className="mt-1 text-[11px] leading-4 text-[#68756A]">
                  Payments are securely processed through Razorpay. Your
                  banking details are not stored here.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <p className="mt-3 text-center text-[10px] text-[#879187]">
          Keep your payment confirmation for your records.
        </p>
      </main>
    </div>
  );
};

export default RentStatus;
