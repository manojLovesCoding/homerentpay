import React from "react";

const Payments = () => {
  const payments = [
    {
      tenant: "John",
      property: "Apt 101",
      amount: "₹15K",
      status: "Paid",
      date: "5 Jul",
    },
    {
      tenant: "Sara",
      property: "Apt 202",
      amount: "₹12K",
      status: "Pending",
      date: "6 Jul",
    },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">
        Payments
      </h1>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden border">
        <table className="w-full text-left">

          {/* Head */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Tenant</th>
              <th className="p-4">Property</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {payments.map((pay, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">

                {/* Tenant */}
                <td className="p-4 font-medium text-gray-800">
                  {pay.tenant}
                </td>

                {/* Property */}
                <td className="p-4 text-gray-600">
                  {pay.property}
                </td>

                {/* Amount */}
                <td className="p-4 font-semibold text-gray-800">
                  {pay.amount}
                </td>

                {/* Status */}
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      pay.status === "Paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {pay.status}
                  </span>
                </td>

                {/* Date */}
                <td className="p-4 text-gray-600">
                  {pay.date}
                </td>

                {/* Actions */}
                <td className="p-4 space-x-2">
                  <button className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-200">
                    View
                  </button>

                  <button className="px-3 py-1 text-sm rounded bg-green-100 text-green-600 hover:bg-green-200">
                    Receipt
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Payments;