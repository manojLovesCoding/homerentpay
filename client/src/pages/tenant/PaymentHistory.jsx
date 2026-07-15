import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const { data } = await api.get("/payment/history");

      setPayments(data.payments);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Payment History
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-3 text-left">Month</th>

                <th className="px-4 py-3 text-left">Amount</th>

                <th className="px-4 py-3 text-left">Date</th>

                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {new Date(payment.createdAt).toLocaleString("default", {
                      month: "long",
                    })}
                  </td>

                  <td className="px-4 py-3 font-medium">₹{payment.amount}</td>

                  <td className="px-4 py-3">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="bg-blue-50 px-5 py-3 rounded-lg">
            <p className="text-gray-600">
              Total Payments:{" "}
              <span className="font-semibold">{payments.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
