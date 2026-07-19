import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const LandlordDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalTenants: 0,
    monthlyIncome: 0,
    pendingRent: 0,
  });

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/payment/landlord-summary");

      setStats(res.data.stats);

      setPayments(res.data.payments || []);
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      label: "Total Properties",
      value: stats.totalProperties,
    },
    {
      label: "Total Tenants",
      value: stats.totalTenants,
    },
    {
      label: "Monthly Income",
      value: `₹${stats.monthlyIncome}`,
    },
    {
      label: "Pending Rent",
      value: `₹${stats.pendingRent}`,
    },
  ];

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Welcome, Landlord 👋
          </h1>
        </div>

        {/* Stats Cards */}

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {statsData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-5 border-l-4 border-blue-500"
            >
              <p className="text-gray-500">{item.label}</p>

              <h2 className="text-2xl font-bold text-gray-800 mt-2">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Recent Payments Table */}

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Tenant</th>

                <th className="p-3">Property</th>

                <th className="p-3">Amount</th>

                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{payment.tenant?.name}</td>

                    <td className="p-3">{payment.property?.title}</td>

                    <td className="p-3">₹{payment.amount}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          payment.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No payment records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
