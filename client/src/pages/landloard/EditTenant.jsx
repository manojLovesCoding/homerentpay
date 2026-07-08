import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";

const EditTenant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/auth/tenants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tenant = res.data.tenants.find((t) => t._id === id);

        setFormData({
          name: tenant.name,
          email: tenant.email,
          phone: tenant.phone,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchTenant();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.put(`/auth/tenant/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Tenant updated");

      navigate("/landlord/tenants");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold text-blue-600 mb-4">Edit Tenant</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Name"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Email"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Phone"
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTenant;
