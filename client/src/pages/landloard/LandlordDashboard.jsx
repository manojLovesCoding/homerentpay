import React from "react";

const LandlordDashboard = () => {
  const stats = [
    { label: "Total Properties", value: 12 },
    { label: "Total Tenants", value: 28 },
    { label: "Monthly Income", value: "₹2,40,000" },
    { label: "Pending Rent", value: "₹35,000" },
  ];

  const payments = [
    {
      tenant: "John",
      property: "Apt 101",
      amount: "₹15,000",
      status: "Paid",
    },
    {
      tenant: "Arun",
      property: "Apt 203",
      amount: "₹12,000",
      status: "Pending",
    },
  ];

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
          {stats.map((item, index) => (
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
          <h2 className="text-xl font-semibold mb-4">
            Recent Payments
          </h2>

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
              {payments.map((p, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{p.tenant}</td>
                  <td className="p-3">{p.property}</td>
                  <td className="p-3">{p.amount}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        p.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default LandlordDashboard;