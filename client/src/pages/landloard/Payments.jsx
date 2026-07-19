import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payment/landlord-summary");

      setPayments(res.data.payments || []);
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading payments...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}

        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Payments</h1>
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
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{payment.tenant?.name}</td>

                    <td className="p-3">
                      {new Date(payment.year, payment.month - 1).toLocaleString(
                        "default",
                        {
                          month: "long",
                        },
                      )}
                    </td>

                    <td className="p-3">₹{payment.amount}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          payment.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
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
                    No payments found
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

export default Payments;
