import React, { useState } from "react";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    rent: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // API call later here
  };

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6">

        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Add Property
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-gray-600 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Green Residency"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-600 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Full address"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-600 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Chennai"
            />
          </div>

          {/* Rent */}
          <div>
            <label className="block text-gray-600 mb-1">Rent Amount</label>
            <input
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 15000"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-600 mb-1">Upload Image</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProperty;