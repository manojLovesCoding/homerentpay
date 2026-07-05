import React from "react";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Users", value: 120 },
    { label: "Tenants", value: 80 },
    { label: "Landlords", value: 40 },
    { label: "Properties", value: 150 },
    { label: "Revenue", value: "₹2,50,000" },
    { label: "Pending Payments", value: 12 },
  ];

  const activities = [
    "User created",
    "Property added",
    "Payment received",
    "Tenant assigned",
    "Property updated",
  ];

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item, index) => (
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
          {activities.map((activity, index) => (
            <li
              key={index}
              className="text-gray-600 flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              {activity}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default AdminDashboard;