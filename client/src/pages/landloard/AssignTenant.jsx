import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const AssignTenant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/auth/tenants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const activeTenants = res.data.tenants.filter(
        (t) => t.isActive
      );

      setTenants(activeTenants);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssign = async () => {
    if (!tenantId) {
      return alert("Select a tenant");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.put(
        `/property/${id}/assign-tenant`,
        { tenantId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Tenant assigned successfully");

      navigate("/landlord/properties");
    } catch (err) {
      alert(err.response?.data?.message || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">

      <div className="max-w-lg mx-auto bg-white shadow rounded-xl p-6">

        <h1 className="text-2xl font-bold mb-6">
          Assign Tenant
        </h1>

        <select
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          className="w-full border rounded p-2 mb-5"
        >
          <option value="">Select Tenant</option>

          {tenants.map((tenant) => (
            <option
              key={tenant._id}
              value={tenant._id}
            >
              {tenant.name} ({tenant.email})
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Assigning..." : "Assign Tenant"}
        </button>

      </div>

    </div>
  );
};

export default AssignTenant;