import React from "react";

const Payments = () => {
  const payments = [
    {
      tenant: "John",
      month: "July",
      amount: "₹15K",
      status: "Paid",
    },
    {
      tenant: "Sara",
      month: "June",
      amount: "₹12K",
      status: "Pending",
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Payments
          </h1>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl overflow-x-auto">
          <table className="w-full border-collapse">

            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Tenant</th>
                <th className="p-3">Month</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">

                  <td className="p-3 font-medium">
                    {payment.tenant}
                  </td>

                  <td className="p-3">{payment.month}</td>

                  <td className="p-3">{payment.amount}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        payment.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
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

export default Payments;