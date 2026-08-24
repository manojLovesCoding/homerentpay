import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [currentImage, setCurrentImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    rent: "",
    image: null,
  });

  /* ============================================================
     FETCH PROPERTY
  ============================================================ */

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setFetching(true);

        const res = await api.get("/property");

        const property = res.data.properties?.find((item) => item._id === id);

        if (!property) {
          setNotFound(true);
          return;
        }

        setFormData({
          title: property.title || "",
          address: property.address || "",
          city: property.city || "",
          rent: property.rent || "",
          image: null,
        });

        setCurrentImage(property.image || null);
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setFetching(false);
      }
    };

    fetchProperty();
  }, [id]);

  /* ============================================================
     HANDLE INPUT
  ============================================================ */

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ============================================================
     IMAGE CHANGE
  ============================================================ */

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

  /* ============================================================
     REMOVE NEW IMAGE
  ============================================================ */

  const removeNewImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  /* ============================================================
     SUBMIT
  ============================================================ */

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

      await api.put(`/property/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Property updated successfully");

      navigate("/landlord/properties");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update property");
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     FORMAT CURRENCY
  ============================================================ */

  const formattedRent = formData.rent
    ? Number(formData.rent).toLocaleString("en-IN")
    : "0";

  /* ============================================================
     LOADING SKELETON
  ============================================================ */

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 h-44 animate-pulse rounded-3xl bg-slate-200" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-[500px] animate-pulse rounded-3xl bg-slate-200" />

              <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />
            </div>

            <div className="h-96 animate-pulse rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     NOT FOUND
  ============================================================ */

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-4xl">
              🏠
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Property not found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              The property you're trying to edit may have been removed or you
              don't have access to it.
            </p>

            <button
              onClick={() => navigate("/landlord/properties")}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
            >
              ← Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-6 shadow-xl shadow-blue-900/10 sm:p-8">
          {/* Decorative background */}
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
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              Editing Property
            </div>

            <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Edit Property
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-blue-100/80 sm:text-base">
              Update your property information, rental price, address, or
              listing image.
            </p>
          </div>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* =================================================
                LEFT SIDE
            ================================================== */}

            <div className="space-y-6 lg:col-span-2">
              {/* =================================================
                  PROPERTY DETAILS
              ================================================== */}

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    ✏️
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Property Details
                    </h2>

                    <p className="text-sm text-slate-500">
                      Update the basic information about your property.
                    </p>
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
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          ₹
                        </span>

                        <input
                          id="rent"
                          name="rent"
                          type="number"
                          min="1"
                          value={formData.rent}
                          onChange={handleChange}
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
                  IMAGE
              ================================================== */}

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-xl">
                    📷
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Property Image
                    </h2>

                    <p className="text-sm text-slate-500">
                      Keep the current image or upload a new one.
                    </p>
                  </div>
                </div>

                {/* Current / new image */}
                {(imagePreview || currentImage) && (
                  <div className="relative mb-5 overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={imagePreview || currentImage}
                      alt="Property"
                      className="h-72 w-full object-cover sm:h-96"
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                            {imagePreview ? "New Image" : "Current Image"}
                          </span>

                          {imagePreview && (
                            <p className="mt-2 max-w-[220px] truncate text-xs text-white/70">
                              {formData.image?.name}
                            </p>
                          )}
                        </div>

                        {imagePreview && (
                          <button
                            type="button"
                            onClick={removeNewImage}
                            disabled={loading}
                            className="shrink-0 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload */}
                <label
                  htmlFor="property-image"
                  className="group flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 transition hover:border-blue-400 hover:bg-blue-50/50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl transition group-hover:scale-105">
                    📤
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {imagePreview
                        ? "Choose a different image"
                        : "Upload a new image"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      JPG, JPEG or PNG • Recommended 1200×800
                    </p>
                  </div>

                  <span className="ml-auto hidden rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-600 shadow-sm sm:block">
                    Browse
                  </span>

                  <input
                    id="property-image"
                    ref={fileRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={loading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}

            <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              {/* Live preview */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                        Live Preview
                      </p>

                      <h2 className="mt-2 line-clamp-2 text-xl font-bold text-white">
                        {formData.title || "Your Property"}
                      </h2>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl backdrop-blur">
                      🏠
                    </div>
                  </div>
                </div>

                {/* Preview image */}
                <div className="h-44 overflow-hidden bg-slate-100">
                  {imagePreview || currentImage ? (
                    <img
                      src={imagePreview || currentImage}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">
                      🏠
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      📍
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-slate-400">Location</p>

                      <p className="mt-0.5 font-medium text-slate-700">
                        {formData.city || "City"}
                      </p>

                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">
                        {formData.address || "Property address"}
                      </p>
                    </div>
                  </div>

                  <div className="my-5 border-t border-slate-100" />

                  {/* Rent */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Monthly Rent</p>

                      <p className="mt-1 text-2xl font-bold text-blue-600">
                        ₹{formattedRent}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Update information */}
              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                    💡
                  </div>

                  <div>
                    <h3 className="font-semibold text-amber-900">
                      Before updating
                    </h3>

                    <ul className="mt-3 space-y-2 text-sm text-amber-800/70">
                      <li className="flex gap-2">
                        <span>✓</span>
                        Check the property address.
                      </li>

                      <li className="flex gap-2">
                        <span>✓</span>
                        Make sure the rent is correct.
                      </li>

                      <li className="flex gap-2">
                        <span>✓</span>
                        Use a clear property image.
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
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="hidden text-sm text-slate-400 sm:block">
                Changes will be saved to your property listing.
              </p>

              <div className="flex w-full flex-col-reverse gap-3 sm:w-auto sm:flex-row">
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
                      Updating...
                    </>
                  ) : (
                    <>
                      Save Changes
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
