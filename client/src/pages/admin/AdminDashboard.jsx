
import React, { useEffect, useState } from "react";
import {
  Users,
  UserRound,
  Building2,
  IndianRupee,
  Clock3,
  Activity,
  Wallet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api from "../../api/axios.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/payment/admin-summary");

      setStats(res.data.stats || {});
      setActivities(res.data.activities || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers || 0,
      description: "Registered users",
      icon: Users,
    },
    {
      label: "Tenants",
      value: stats.totalTenants || 0,
      description: "Active tenants",
      icon: UserRound,
    },
    {
      label: "Landlords",
      value: stats.totalLandlords || 0,
      description: "Property owners",
      icon: Building2,
    },
    {
      label: "Properties",
      value: stats.totalProperties || 0,
      description: "Total listings",
      icon: Building2,
    },
    {
      label: "Revenue",
      value: `₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`,
      description: "Total collected",
      icon: Wallet,
    },
    {
      label: "Pending Payments",
      value: stats.pendingPayments || 0,
      description: "Awaiting payment",
      icon: Clock3,
    },
  ];

  const summaryItems = [
    {
      label: "Users",
      value: stats.totalUsers || 0,
      percentage: 75,
    },
    {
      label: "Tenants",
      value: stats.totalTenants || 0,
      percentage: 60,
    },
    {
      label: "Landlords",
      value: stats.totalLandlords || 0,
      percentage: 45,
    },
    {
      label: "Properties",
      value: stats.totalProperties || 0,
      percentage: 55,
    },
  ];

  if (loading) {
    return (
      <div className="bg-[#F7F8F5] p-4 sm:p-5">
        <div className="mx-auto max-w-7xl animate-pulse space-y-4">
          <div className="h-20 rounded-xl bg-[#E6E9E1]" />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-xl border border-[#E6E3D9] bg-white"
              />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="h-72 rounded-xl bg-white lg:col-span-2" />
            <div className="h-72 rounded-xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F8F5] p-3 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-7xl space-y-4">

        {/* Page Header */}
        <section className="flex flex-col gap-3 rounded-xl border border-[#E6E3D9] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#527C61]">
              Administration
            </p>

            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-[#242B26] sm:text-2xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-xs text-[#68756A] sm:text-sm">
              Monitor users, properties, payments and platform activity.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-[#DCE7DA] bg-[#EAF0E8] px-3 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#527C61]" />
            <span className="text-xs font-semibold text-[#244B3C]">
              System is running
            </span>
          </div>
        </section>

        {/* Revenue Overview */}
        <section className="flex flex-col justify-between gap-2 rounded-xl bg-[#244B3C] px-4 py-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-medium text-[#DCE7DA]">
              Total Collected Revenue
            </p>

            <h2 className="mt-0.5 text-2xl font-bold text-white">
              ₹{Number(stats.revenue || 0).toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#DCE7DA]">
            <Wallet size={16} />
            <span>Overall platform collection</span>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#242B26]">
                Platform Overview
              </h2>
              <p className="text-xs text-[#68756A]">
                Key platform statistics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {statCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#E6E3D9] bg-white p-3 shadow-sm transition hover:border-[#A8BDA5] hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 text-xs font-medium text-[#68756A]">
                      {item.label}
                    </p>

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-[#244B3C]">
                      <Icon size={16} strokeWidth={2} />
                    </div>
                  </div>

                  <h3 className="mt-2 truncate text-xl font-bold text-[#244B3C]">
                    {item.value}
                  </h3>

                  <p className="mt-0.5 text-[10px] text-[#879187]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Activity and Summary */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">

          {/* Recent Activity */}
          <div className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-[#E6E3D9] px-4 py-3">
              <div>
                <h2 className="text-sm font-bold text-[#242B26]">
                  Recent Activity
                </h2>
                <p className="mt-0.5 text-xs text-[#879187]">
                  Latest payment activity across the platform
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#527C61]">
                <Activity size={13} />
                Live activity
              </div>
            </div>

            <div className="p-3">
              {activities.length > 0 ? (
                <div className="space-y-1">
                  {activities.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-[#F7F8F5]"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-[#244B3C]">
                        <IndianRupee size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs leading-5 text-[#526056]">
                          Payment received from{" "}
                          <span className="font-semibold text-[#242B26]">
                            {item.tenant?.name || "Unknown"}
                          </span>{" "}
                          for{" "}
                          <span className="font-semibold text-[#242B26]">
                            {item.property?.title || "Property"}
                          </span>
                        </p>

                        <div className="mt-0.5 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] text-[#879187]">
                            Payment received
                          </span>

                          {item.amount && (
                            <span className="text-[10px] font-bold text-[#527C61]">
                              ₹{Number(item.amount).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="hidden shrink-0 items-center gap-1 rounded-full bg-[#EAF0E8] px-2 py-1 text-[10px] font-semibold text-[#244B3C] sm:inline-flex">
                        <CheckCircle2 size={11} />
                        Paid
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-9 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0E8] text-[#527C61]">
                    <Activity size={21} />
                  </div>

                  <h3 className="mt-2 text-sm font-semibold text-[#242B26]">
                    No recent activity
                  </h3>

                  <p className="mt-1 text-xs text-[#879187]">
                    Payment activity will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Summary */}
          <div className="rounded-xl border border-[#E6E3D9] bg-white p-4 shadow-sm">
            <div>
              <h2 className="text-sm font-bold text-[#242B26]">
                Quick Summary
              </h2>
              <p className="mt-0.5 text-xs text-[#879187]">
                Platform statistics
              </p>
            </div>

            <div className="mt-4 space-y-4">
              {summaryItems.map((item) => (
                <div key={item.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#68756A]">
                      {item.label}
                    </span>

                    <span className="text-xs font-bold text-[#242B26]">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF0EB]">
                    <div
                      className="h-full rounded-full bg-[#527C61]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Payments */}
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#E8E1CC] bg-[#FBF7EB] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F1E8CD] text-[#9A7435]">
                <AlertCircle size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#66512D]">
                  Pending Payments
                </p>

                <p className="mt-0.5 text-[11px] text-[#8B7448]">
                  {stats.pendingPayments || 0} payment
                  {stats.pendingPayments !== 1 ? "s" : ""} awaiting
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
