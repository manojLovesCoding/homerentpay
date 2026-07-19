import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const TenantDashboard = () => {
  const [property, setProperty] = useState(null);
  const [pendingRent, setPendingRent] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchProperty();
    fetchPayments();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await api.get("/property/tenant-property");

      const propertyData = res.data.property;

      setProperty(propertyData);

      if (propertyData?._id) {
        fetchPendingRent(propertyData._id);
      }
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRent = async (propertyId) => {
    try {
      const res = await api.get(
        `/property/pending-rent?propertyId=${propertyId}`,
      );

      setPendingRent(res.data);
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to load pending rent");
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payment/history");

      setPayments(res.data.payments || []);
    } catch (err) {
      console.log(err.response?.data?.message || "Failed to load payments");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}

        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            Welcome, {user?.name} 👋
          </h1>

          <p className="text-gray-500 mt-1">
            Here's an overview of your rental details.
          </p>
        </div>

        {/* Property Details */}

        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Property Details</h2>

          {property ? (
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
                  <td className="p-3">{property.title}</td>

                  <td className="p-3">₹{property.rent}</td>

                  <td className="p-3">
                    {property.dueDate
                      ? `${property.dueDate}th of Every Month`
                      : "Not assigned"}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>No property assigned</p>
          )}
        </div>

        {/* Summary Cards */}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-red-100 border-l-4 border-red-500 rounded-lg p-5 shadow">
            <h3 className="text-gray-600">Pending Rent</h3>

            <p className="text-3xl font-bold text-red-600 mt-2">
              {pendingRent?.pending ? `₹${pendingRent.amount}` : "₹0"}
            </p>
          </div>

          <div className="bg-green-100 border-l-4 border-green-500 rounded-lg p-5 shadow">
            <h3 className="text-gray-600">Payment Status</h3>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {pendingRent?.pending ? "Pending" : "Paid"}
            </p>
          </div>
        </div>

        {/* Recent Payments */}

        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Month</th>

                <th className="p-3 text-left">Amount</th>

                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id} className="border-b hover:bg-gray-50">
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
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    No payment history found
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

export default TenantDashboard;
