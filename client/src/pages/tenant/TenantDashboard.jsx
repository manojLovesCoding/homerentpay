import React from "react";

const TenantDashboard = () => {
  const payments = [
    {
      month: "June",
      amount: "₹15,000",
      status: "Paid",
    },
    {
      month: "May",
      amount: "₹15,000",
      status: "Paid",
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Welcome, John 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here's an overview of your rental details.
          </p>
        </div>

        {/* Property Info */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Property Details</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">My Property</th>
                <th className="p-3 text-left">Monthly Rent</th>
                <th className="p-3 text-left">Due Date</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">Sunrise Apartment</td>
                <td className="p-3">₹15,000</td>
                <td className="p-3">5th of Every Month</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-red-100 border-l-4 border-red-500 rounded-lg p-5 shadow">
            <h3 className="text-gray-600">Pending Rent</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              ₹15,000
            </p>
          </div>

          <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-5 shadow">
            <h3 className="text-gray-600">Last Payment</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              Paid
            </p>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Recent Payments
          </h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{payment.month}</td>
                  <td className="p-3">{payment.amount}</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {payment.status}
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

export default TenantDashboard;