import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";

const TenantList = () => {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/auth/tenants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTenants(res.data.tenants || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleDeactivate = async (id) => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this tenant?",
    );

    if (!confirmDeactivate) return;

    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/auth/tenant/${id}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTenants((prev) =>
        prev.map((tenant) =>
          tenant._id === id
            ? {
                ...tenant,
                isActive: false,
              }
            : tenant,
        ),
      );

      alert("Tenant deactivated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Deactivate failed");
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}

        <div className="flex justify-between items-center bg-white shadow rounded-xl p-5 mb-5">
          <h1 className="text-xl font-bold text-blue-600">Tenant List</h1>

          <button
            onClick={() => navigate("/landlord/add-tenant")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Tenant
          </button>
        </div>

        {/* Table */}

        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Name</th>

                <th className="p-3 text-left">Email</th>

                <th className="p-3 text-left">Phone</th>

                <th className="p-3 text-left">Status</th>

                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-5 text-center text-gray-500">
                    No tenants found
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{tenant.name}</td>

                    <td className="p-3">{tenant.email}</td>

                    <td className="p-3">{tenant.phone}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          tenant.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tenant.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/landlord/tenant/edit/${tenant._id}`)
                          }
                          className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>

                        {tenant.isActive && (
                          <button
                            onClick={() => handleDeactivate(tenant._id)}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm"
                          >
                            Deactivate
                          </button>
                        )}

                        <button
  onClick={() =>
    navigate(`/landlord/tenant/password/${tenant._id}`)
  }
  className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
>
  Password
</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantList;
