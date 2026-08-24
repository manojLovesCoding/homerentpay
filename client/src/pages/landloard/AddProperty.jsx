import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

const AddProperty = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    rent: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.rent) <= 0) {
      alert("Please enter a valid monthly rent.");
      return;
    }

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

      await api.post("/property/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Property added successfully");

      setFormData({
        title: "",
        address: "",
        city: "",
        rent: "",
        image: null,
      });

      setImagePreview(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      navigate("/landlord/properties");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-6 shadow-xl shadow-blue-900/10 sm:p-8">
          {/* Decorative circles */}
          <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-950/20 blur-3xl" />

          <div className="relative">
            <button
              type="button"
              onClick={() => navigate("/landlord/properties")}
              className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              ← Back to Properties
            </button>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Property Management
            </div>

            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Add New Property
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-blue-100/80 sm:text-base">
              Add your rental property details and make it available for
              tenants.
            </p>
          </div>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* =================================================
                LEFT — PROPERTY DETAILS
            ================================================== */}

            <div className="space-y-6 lg:col-span-2">
              {/* Basic details */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      🏠
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Property Details
                      </h2>

                      <p className="text-sm text-slate-500">
                        Enter the basic information about your property.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Property Title
                    </label>

                    <input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Modern 2BHK Apartment"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="mt-1.5 text-xs text-slate-400">
                      Give your property a clear and attractive title.
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Full Address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete property address"
                      rows={4}
                      required
                      disabled={loading}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* City + Rent */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* City */}
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        City
                      </label>

                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                          📍
                        </span>

                        <input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Bangalore"
                          required
                          disabled={loading}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {/* Rent */}
                    <div>
                      <label
                        htmlFor="rent"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Monthly Rent
                      </label>

                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
                          ₹
                        </span>

                        <input
                          id="rent"
                          name="rent"
                          value={formData.rent}
                          onChange={handleChange}
                          type="number"
                          min="1"
                          placeholder="15000"
                          required
                          disabled={loading}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  IMAGE UPLOAD
              ================================================== */}

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-xl">
                      📷
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Property Image
                      </h2>

                      <p className="text-sm text-slate-500">
                        Upload a high-quality image of your property.
                      </p>
                    </div>
                  </div>
                </div>

                {imagePreview ? (
                  /* Image preview */
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Property preview"
                      className="h-72 w-full object-cover sm:h-96"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">
                            {formData.image?.name}
                          </p>

                          <p className="mt-1 text-xs text-white/70">
                            Image preview
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={removeImage}
                          disabled={loading}
                          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Upload area */
                  <label
                    htmlFor="property-image"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl transition group-hover:scale-105">
                      📸
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                      Upload property image
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Click to browse from your device
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      PNG, JPG or JPEG • Recommended: 1200×800
                    </p>

                    <span className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition group-hover:bg-blue-500">
                      Choose Image
                    </span>

                    <input
                      id="property-image"
                      ref={fileRef}
                      type="file"
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* =================================================
                RIGHT — SUMMARY
            ================================================== */}

            <div className="space-y-6">
              {/* Preview card */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                    Property Preview
                  </p>

                  <h2 className="mt-2 text-xl font-bold text-white">
                    {formData.title || "Your Property"}
                  </h2>

                  <p className="mt-1 text-sm text-blue-100">
                    {formData.city || "City"}
                  </p>
                </div>

                <div className="p-5">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        📍
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Location</p>

                        <p className="mt-0.5 text-sm font-medium text-slate-700">
                          {formData.address || "Address will appear here"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                        💰
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Monthly Rent</p>

                        <p className="mt-0.5 text-lg font-bold text-emerald-600">
                          ₹
                          {formData.rent
                            ? Number(formData.rent).toLocaleString("en-IN")
                            : "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    💡
                  </div>

                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Listing tips
                    </h3>

                    <ul className="mt-3 space-y-2 text-sm text-blue-800/70">
                      <li className="flex gap-2">
                        <span>✓</span>
                        Use a clear property title.
                      </li>

                      <li className="flex gap-2">
                        <span>✓</span>
                        Add the complete address.
                      </li>

                      <li className="flex gap-2">
                        <span>✓</span>
                        Upload a bright, clear image.
                      </li>

                      <li className="flex gap-2">
                        <span>✓</span>
                        Enter the correct monthly rent.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              ACTION BAR
          ====================================================== */}

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/landlord/properties")}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Uploading Property...
                  </>
                ) : (
                  <>
                    Add Property
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
