import React, { useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";

const AddTenant = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.post(
        "/auth/create-tenant",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      alert("Tenant created successfully");

      navigate("/landlord/tenants");

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to create tenant"
      );
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-6">

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">

        <h1 className="text-xl font-bold text-blue-600 mb-5">
          Add Tenant
        </h1>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />


          <input
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />


          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />


          <input
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />


          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Creating..." : "Create Tenant"}
          </button>


        </form>

      </div>

    </div>
  );
};


export default AddTenant;