import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payment/all");
      setPayments(res.data.payments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Payments</h1>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden border">
        <table className="w-full text-left">
          {/* Head */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Tenant</th>
              <th className="p-4">Property</th>
              <th className="p-4">Landlord</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {payments.length > 0 ? (
              payments.map((pay) => (
                <tr key={pay._id} className="border-t hover:bg-gray-50">
                  {/* Tenant */}
                  <td className="p-4 font-medium text-gray-800">
                    <p>{pay.tenant?.name || "N/A"}</p>

                    <p className="text-xs text-gray-400">{pay.tenant?.email}</p>
                  </td>

                  {/* Property */}
                  <td className="p-4 text-gray-600">
                    <p>{pay.property?.title || "N/A"}</p>

                    <p className="text-xs text-gray-400">
                      {pay.property?.city}
                    </p>
                  </td>

                  {/* Landlord */}
                  <td className="p-4 text-gray-600">
                    {pay.landlord?.name || "N/A"}
                  </td>

                  {/* Amount */}
                  <td className="p-4 font-semibold text-gray-800">
                    ₹{pay.amount}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        pay.status === "paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="p-4 text-gray-600">
                    {pay.paidAt
                      ? new Date(pay.paidAt).toLocaleDateString()
                      : new Date(pay.createdAt).toLocaleDateString()}
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
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
