import React, { useEffect, useState } from "react";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="h-44 bg-slate-200 rounded-3xl" />

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-32 bg-white rounded-2xl border border-slate-100"
              />
            ))}
          </div>

          {/* Activity Skeleton */}
          <div className="h-80 bg-white rounded-3xl border border-slate-100" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers || 0,
      icon: "♙",
      color: "indigo",
      description: "Registered users",
    },
    {
      label: "Tenants",
      value: stats.totalTenants || 0,
      icon: "♟",
      color: "blue",
      description: "Active tenants",
    },
    {
      label: "Landlords",
      value: stats.totalLandlords || 0,
      icon: "♙",
      color: "violet",
      description: "Property owners",
    },
    {
      label: "Properties",
      value: stats.totalProperties || 0,
      icon: "⌂",
      color: "cyan",
      description: "Total listings",
    },
    {
      label: "Revenue",
      value: `₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`,
      icon: "₹",
      color: "emerald",
      description: "Total collected",
    },
    {
      label: "Pending Payments",
      value: stats.pendingPayments || 0,
      icon: "!",
      color: "amber",
      description: "Awaiting payment",
    },
  ];

  const colorStyles = {
    indigo: {
      icon: "bg-indigo-50 text-indigo-600",
      accent: "bg-indigo-500",
    },
    blue: {
      icon: "bg-blue-50 text-blue-600",
      accent: "bg-blue-500",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600",
      accent: "bg-violet-500",
    },
    cyan: {
      icon: "bg-cyan-50 text-cyan-600",
      accent: "bg-cyan-500",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      accent: "bg-emerald-500",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600",
      accent: "bg-amber-500",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* =====================================================
            HERO HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 p-6 sm:p-8 lg:p-10 shadow-xl shadow-indigo-100">
          {/* Decorative background */}
          <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-32 right-32 w-96 h-96 rounded-full bg-white/5" />

          <div className="absolute top-1/2 -left-20 w-48 h-48 rounded-full bg-violet-400/10" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                <span className="text-xs font-medium text-blue-50">
                  System is running
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Admin Dashboard
              </h1>

              <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed max-w-xl">
                Monitor users, properties, payments and rental activity from one
                centralized dashboard.
              </p>
            </div>

            {/* Quick Overview */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 min-w-full sm:min-w-[230px] lg:min-w-[250px]">
              <p className="text-xs uppercase tracking-wider font-semibold text-blue-100">
                Total Revenue
              </p>

              <p className="text-3xl font-bold text-white mt-2">
                ₹{Number(stats.revenue || 0).toLocaleString("en-IN")}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-400/20 text-emerald-200 text-xs">
                  ↗
                </span>

                <span className="text-xs text-blue-100">
                  Overall collected revenue
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SECTION TITLE
        ====================================================== */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Platform Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Key metrics from your rental platform
            </p>
          </div>
        </div>

        {/* =====================================================
            STATS GRID
        ====================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {statCards.map((item) => {
            const colors = colorStyles[item.color];

            return (
              <div
                key={item.label}
                className="
                  group relative
                  bg-white
                  border border-slate-100
                  rounded-2xl
                  p-5
                  sm:p-6
                  shadow-sm
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all duration-300
                  overflow-hidden
                "
              >
                {/* Accent */}
                <div
                  className={`
                    absolute top-0 left-0 right-0 h-1
                    ${colors.accent}
                  `}
                />

                <div className="flex items-start justify-between gap-4">
                  {/* Text */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                      {item.label}
                    </p>

                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 truncate">
                      {item.value}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Icon */}
                  <div
                    className={`
                      flex-shrink-0
                      w-12 h-12
                      rounded-2xl
                      flex items-center justify-center
                      text-xl font-bold
                      ${colors.icon}
                      group-hover:scale-110
                      transition-transform duration-300
                    `}
                  >
                    {item.icon}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            BOTTOM GRID
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* =================================================
              ACTIVITY
          ================================================== */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 sm:px-6 py-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Recent Activity
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Latest payment activity across the platform
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Live activity
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="p-5 sm:p-6">
              {activities.length > 0 ? (
                <div className="space-y-2">
                  {activities.map((item, index) => (
                    <div
                      key={item._id}
                      className="
                        group
                        flex items-start gap-4
                        p-4
                        rounded-2xl
                        hover:bg-slate-50
                        transition-colors
                      "
                    >
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div
                          className="
                          w-10 h-10
                          rounded-xl
                          bg-indigo-50
                          text-indigo-600
                          flex items-center justify-center
                          font-bold
                        "
                        >
                          ₹
                        </div>

                        {index !== activities.length - 1 && (
                          <div className="w-px h-6 bg-slate-200 mt-2" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Payment received from{" "}
                          <span className="font-semibold text-slate-900">
                            {item.tenant?.name || "Unknown"}
                          </span>{" "}
                          for{" "}
                          <span className="font-semibold text-slate-900">
                            {item.property?.title || "Property"}
                          </span>
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs text-slate-400">
                            Payment received
                          </span>

                          {item.amount && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />

                              <span className="text-xs font-semibold text-emerald-600">
                                ₹{Number(item.amount).toLocaleString("en-IN")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <span
                        className="
                        hidden sm:inline-flex
                        flex-shrink-0
                        items-center gap-1.5
                        px-2.5 py-1
                        rounded-full
                        bg-emerald-50
                        text-emerald-700
                        text-xs
                        font-semibold
                      "
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Paid
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="py-14 text-center">
                  <div
                    className="
                    w-16 h-16
                    mx-auto
                    rounded-2xl
                    bg-slate-100
                    flex items-center justify-center
                    text-2xl
                  "
                  >
                    📊
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    No recent activity
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Payment activity will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              QUICK SUMMARY
          ================================================== */}
          <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Quick Summary</h2>

            <p className="text-sm text-slate-500 mt-1">Platform statistics</p>

            <div className="mt-6 space-y-5">
              {/* Users */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    Users
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {stats.totalUsers || 0}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{
                      width: "75%",
                    }}
                  />
                </div>
              </div>

              {/* Tenants */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    Tenants
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {stats.totalTenants || 0}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: "60%",
                    }}
                  />
                </div>
              </div>

              {/* Landlords */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    Landlords
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {stats.totalLandlords || 0}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{
                      width: "45%",
                    }}
                  />
                </div>
              </div>

              {/* Properties */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    Properties
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {stats.totalProperties || 0}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-500"
                    style={{
                      width: "55%",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Pending payments */}
            <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-3">
                <div
                  className="
                  w-10 h-10
                  rounded-xl
                  bg-amber-100
                  text-amber-600
                  flex items-center justify-center
                  font-bold
                "
                >
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Pending Payments
                  </p>

                  <p className="text-xs text-amber-700 mt-0.5">
                    {stats.pendingPayments || 0} payment
                    {stats.pendingPayments !== 1 ? "s" : ""} awaiting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
