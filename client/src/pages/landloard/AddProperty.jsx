import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const AddProperty = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    rent: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("rent", formData.rent);
      data.append("image", formData.image);

      const token = localStorage.getItem("token");

      const res = await api.post("/property/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Property added successfully");

      console.log(res.data);

      // reset form
      setFormData({
        title: "",
        address: "",
        city: "",
        rent: "",
        image: null,
      });

      // redirect
      navigate("/landlord");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2"
          required
        />

        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-2"
          required
        />

        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border p-2"
          required
        />

        <input
          name="rent"
          value={formData.rent}
          onChange={handleChange}
          type="number"
          placeholder="Rent"
          className="w-full border p-2"
          required
        />

        <input
          type="file"
          onChange={handleFileChange}
          className="w-full border p-2"
          accept="image/*"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>
    </div>
  );
};

export default AddProperty;