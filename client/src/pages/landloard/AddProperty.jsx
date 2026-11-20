
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  IndianRupee,
  ImagePlus,
  Upload,
  X,
  CheckCircle2,
  Lightbulb,
  Home,
} from "lucide-react";
import toast from "react-hot-toast";
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

  // Clean up image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Image selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // Remove selected image
  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData((prev) => ({
      ...prev,
      image: null,
    }));

    setImagePreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // Submit property
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.rent) <= 0) {
      toast.error("Please enter a valid monthly rent.");
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

      toast.success("Property added successfully!");

      setFormData({
        title: "",
        address: "",
        city: "",
        rent: "",
        image: null,
      });

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImagePreview(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      navigate("/landlord/properties");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to add property"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatRent = () =>
    formData.rent
      ? Number(formData.rent).toLocaleString("en-IN")
      : "0";

  const inputClass =
    "w-full rounded-lg border border-[#E6E3D9] bg-[#F8F9F6] px-3 py-2.5 text-sm text-[#242B26] outline-none transition placeholder:text-[#A0A99F] focus:border-[#527C61] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "mb-1.5 block text-xs font-semibold text-[#39483D]";

  return (
    <div className="bg-[#F7F8F5] p-3 sm:p-5">
      <div className="mx-auto max-w-6xl space-y-4">

        {/* Header */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl bg-[#244B3C] px-4 py-4 sm:flex-row sm:items-center sm:px-5">
          <div>
            <button
              type="button"
              onClick={() => navigate("/landlord/properties")}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#DCE8DC] transition hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to Properties
            </button>

            <div className="flex items-center gap-2">
              <Building2 size={19} className="text-[#D6A45D]" />
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                Add New Property
              </h1>
            </div>

            <p className="mt-1 text-xs text-[#DCE8DC]">
              Enter property information and publish your rental listing.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#A8BDA5]" />
            New Listing
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

            {/* Property details */}
            <div className="space-y-4 lg:col-span-2">

              <div className="rounded-xl border border-[#E6E3D9] bg-white p-4">
                <div className="mb-4 flex items-center gap-2.5 border-b border-[#F0EEE7] pb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF0E9] text-[#527C61]">
                    <Home size={19} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-[#242B26]">
                      Property Details
                    </h2>
                    <p className="text-[11px] text-[#849084]">
                      Basic information about your rental property
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className={labelClass}>
                      Property Title <span className="text-red-500">*</span>
                    </label>

                    <input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Modern 2BHK Apartment"
                      required
                      disabled={loading}
                      className={inputClass}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className={labelClass}>
                      Full Address <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete property address"
                      rows={2}
                      required
                      disabled={loading}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* City and Rent */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <div>
                      <label htmlFor="city" className={labelClass}>
                        City <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <MapPin
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#849084]"
                        />

                        <input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="e.g. Bangalore"
                          required
                          disabled={loading}
                          className={`${inputClass} pl-9`}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="rent" className={labelClass}>
                        Monthly Rent <span className="text-red-500">*</span>
                      </label>

                      <div className="relative">
                        <IndianRupee
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#849084]"
                        />

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
                          className={`${inputClass} pl-9`}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="rounded-xl border border-[#E6E3D9] bg-white p-4">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5EFE3] text-[#A47A3F]">
                    <ImagePlus size={19} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-[#242B26]">
                      Property Image
                    </h2>
                    <p className="text-[11px] text-[#849084]">
                      Add a clear photo of your property
                    </p>
                  </div>
                </div>

                {imagePreview ? (
                  <div className="relative overflow-hidden rounded-lg border border-[#E6E3D9]">
                    <img
                      src={imagePreview}
                      alt="Property preview"
                      className="h-40 w-full object-cover sm:h-48"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">
                          {formData.image?.name}
                        </p>
                        <p className="text-[10px] text-white/70">
                          Image preview
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={removeImage}
                        disabled={loading}
                        className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#B45D50] hover:bg-white"
                      >
                        <X size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="property-image"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#C9D4C8] bg-[#F8F9F6] px-4 py-6 text-center transition hover:border-[#527C61] hover:bg-[#F1F5F0]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0E9] text-[#527C61]">
                      <Upload size={20} />
                    </div>

                    <p className="mt-2 text-xs font-semibold text-[#39483D]">
                      Click to upload property image
                    </p>

                    <p className="mt-1 text-[10px] text-[#929B91]">
                      PNG, JPG or JPEG
                    </p>

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

            {/* Right Sidebar */}
            <div className="space-y-4">

              {/* Live Preview */}
              <div className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white">
                <div className="bg-[#244B3C] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#D6A45D]">
                    Live Preview
                  </p>

                  <h2 className="mt-1 truncate text-base font-bold text-white">
                    {formData.title || "Your Property"}
                  </h2>

                  <p className="mt-0.5 text-xs text-[#DCE8DC]">
                    {formData.city || "City"}
                  </p>
                </div>

                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Property"
                    className="h-28 w-full object-cover"
                  />
                )}

                <div className="space-y-3 p-4">
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0 text-[#527C61]"
                    />

                    <div className="min-w-0">
                      <p className="text-[10px] text-[#929B91]">
                        Location
                      </p>

                      <p className="break-words text-xs font-medium text-[#39483D]">
                        {formData.address || "Address will appear here"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <IndianRupee size={15} className="text-[#527C61]" />

                    <div>
                      <p className="text-[10px] text-[#929B91]">
                        Monthly Rent
                      </p>

                      <p className="text-base font-bold text-[#244B3C]">
                        ₹{formatRent()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 border-t border-[#F0EEE7] pt-3 text-[10px] font-medium text-[#527C61]">
                    <CheckCircle2 size={13} />
                    Ready to create your listing
                  </div>
                </div>
              </div>

              {/* Listing Tips */}
              <div className="rounded-xl border border-[#E9DFC9] bg-[#FBF7EE] p-4">
                <div className="flex items-center gap-2">
                  <Lightbulb size={17} className="text-[#A47A3F]" />

                  <h3 className="text-xs font-bold text-[#6F542D]">
                    Listing Tips
                  </h3>
                </div>

                <ul className="mt-3 space-y-2">
                  {[
                    "Use a clear property title.",
                    "Enter the complete address.",
                    "Upload a bright, clear image.",
                    "Set the correct monthly rent.",
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2 text-[11px] text-[#796A50]"
                    >
                      <CheckCircle2
                        size={13}
                        className="mt-0.5 shrink-0 text-[#527C61]"
                      />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-4 flex flex-col-reverse gap-2 rounded-xl border border-[#E6E3D9] bg-white p-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/landlord/properties")}
              disabled={loading}
              className="rounded-lg border border-[#DCE4DB] px-5 py-2.5 text-xs font-semibold text-[#526056] transition hover:bg-[#F1F3EF] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#244B3C] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Adding Property...
                </>
              ) : (
                <>
                  Add Property
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
