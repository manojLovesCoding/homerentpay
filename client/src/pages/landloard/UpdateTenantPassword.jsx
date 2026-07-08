import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";

const UpdateTenantPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/auth/tenant/${id}/password`,
        {
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Password updated successfully");

      navigate("/landlord/tenants");
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto bg-white shadow rounded-xl p-6">
        <h1 className="text-xl font-bold text-blue-600 mb-4">
          Update Tenant Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTenantPassword;
