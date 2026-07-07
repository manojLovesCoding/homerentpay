import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    rent: "",
    image: null,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get("/property");

        const property = res.data.properties.find(
          (item) => item._id === id
        );

        if (property) {
          setFormData({
            title: property.title,
            address: property.address,
            city: property.city,
            rent: property.rent,
            image: null,
          });
        }

      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchProperty();
  }, [id]);


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

      if (formData.image) {
        data.append("image", formData.image);
      }

      const token = localStorage.getItem("token");

      await api.put(`/property/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Property updated successfully");

      navigate("/landlord/properties");

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };


  if (fetching) {
    return (
      <p className="p-6">
        Loading...
      </p>
    );
  }


  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto bg-white shadow rounded-xl p-6">

        <h1 className="text-xl font-bold text-blue-600 mb-5">
          Edit Property
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

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
            type="number"
            value={formData.rent}
            onChange={handleChange}
            placeholder="Rent"
            className="w-full border p-2"
            required
          />


          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full border p-2"
          />


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Property"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default EditProperty;