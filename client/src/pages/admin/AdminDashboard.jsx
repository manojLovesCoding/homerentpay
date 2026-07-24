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
    return <p className="p-6">Loading...</p>;
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers || 0,
    },
    {
      label: "Tenants",
      value: stats.totalTenants || 0,
    },
    {
      label: "Landlords",
      value: stats.totalLandlords || 0,
    },
    {
      label: "Properties",
      value: stats.totalProperties || 0,
    },
    {
      label: "Revenue",
      value: `₹${stats.revenue || 0}`,
    },
    {
      label: "Pending Payments",
      value: stats.pendingPayments || 0,
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-xl p-5 border hover:shadow-md transition"
          >
            <p className="text-gray-500 text-sm">{item.label}</p>

            <h2 className="text-xl font-bold text-gray-800 mt-2">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Recent Activity */}

      <div className="bg-white shadow rounded-xl p-5 border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>

        <ul className="space-y-3">
          {activities.length > 0 ? (
            activities.map((item) => (
              <li
                key={item._id}
                className="text-gray-600 flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Payment received from <b>{item.tenant?.name || "Unknown"}</b>
                for <b>{item.property?.title || "Property"}</b>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No recent activity</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
