
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
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
  Pencil,
  Save,
} from "lucide-react";
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

  // Fetch property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setFetching(true);
        setNotFound(false);

        const res = await api.get("/property");

        const property = res.data.properties?.find(
          (item) => item._id === id
        );

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
        toast.error(
          err.response?.data?.message || "Failed to load property"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Clean up image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
  };

  // Remove newly selected image
  const removeNewImage = () => {
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

  // Submit updated property
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a property title.");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Please enter the property address.");
      return;
    }

    if (!formData.city.trim()) {
      toast.error("Please enter the city.");
      return;
    }

    if (!formData.rent || Number(formData.rent) <= 0) {
      toast.error("Please enter a valid monthly rent.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("address", formData.address.trim());
      data.append("city", formData.city.trim());
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

      toast.success("Property updated successfully!");

      navigate("/landlord/properties");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update property"
      );
    } finally {
      setLoading(false);
    }
  };

  const formattedRent = formData.rent
    ? Number(formData.rent).toLocaleString("en-IN")
    : "0";

  const inputClass =
    "w-full rounded-lg border border-[#E6E3D9] bg-[#F8F9F6] px-3 py-2.5 text-sm text-[#242B26] outline-none transition placeholder:text-[#A0A99F] focus:border-[#527C61] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60";

  const labelClass =
    "mb-1.5 block text-xs font-semibold text-[#39483D]";

  // Loading skeleton
  if (fetching) {
    return (
      <div className="bg-[#F7F8F5] p-3 sm:p-5">
        <div className="mx-auto max-w-6xl animate-pulse space-y-4">
          <div className="h-24 rounded-2xl bg-[#E8EDE7]" />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="h-64 rounded-xl bg-white" />
              <div className="h-48 rounded-xl bg-white" />
            </div>

            <div className="h-72 rounded-xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  // Property not found
  if (notFound) {
    return (
      <div className="bg-[#F7F8F5] p-3 sm:p-5">
        <div className="mx-auto flex min-h-[55vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-2xl border border-[#E6E3D9] bg-white p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#EAF0E9] text-[#527C61]">
              <Home size={30} />
            </div>

            <h1 className="mt-4 text-xl font-bold text-[#242B26]">
              Property not found
            </h1>

            <p className="mt-2 text-xs leading-5 text-[#68756A]">
              The property you're trying to edit may have been removed
              or you don't have access to it.
            </p>

            <button
              onClick={() => navigate("/landlord/properties")}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#244B3C] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#193A2E]"
            >
              <ArrowLeft size={14} />
              Back to Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <Pencil size={18} className="text-[#D6A45D]" />

              <h1 className="text-xl font-bold text-white sm:text-2xl">
                Edit Property
              </h1>
            </div>

            <p className="mt-1 text-xs text-[#DCE8DC]">
              Update your property details, rent, address, and image.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#D6A45D]" />
            Editing Listing
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

            {/* Left section */}
            <div className="space-y-4 lg:col-span-2">

              {/* Property details */}
              <div className="rounded-xl border border-[#E6E3D9] bg-white p-4">
                <div className="mb-4 flex items-center gap-2.5 border-b border-[#F0EEE7] pb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF0E9] text-[#527C61]">
                    <Building2 size={19} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-[#242B26]">
                      Property Details
                    </h2>

                    <p className="text-[11px] text-[#849084]">
                      Update your property information
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

                  {/* City and rent */}
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
                          type="number"
                          min="1"
                          value={formData.rent}
                          onChange={handleChange}
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

              {/* Property image */}
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
                      Keep the current image or upload a new one
                    </p>
                  </div>
                </div>

                {(imagePreview || currentImage) && (
                  <div className="relative mb-3 overflow-hidden rounded-lg border border-[#E6E3D9]">
                    <img
                      src={imagePreview || currentImage}
                      alt="Property"
                      className="h-40 w-full object-cover sm:h-48"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white">
                          {imagePreview ? "New Image" : "Current Image"}
                        </p>

                        {imagePreview && (
                          <p className="truncate text-[10px] text-white/70">
                            {formData.image?.name}
                          </p>
                        )}
                      </div>

                      {imagePreview && (
                        <button
                          type="button"
                          onClick={removeNewImage}
                          disabled={loading}
                          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#B45D50] transition hover:bg-white"
                        >
                          <X size={13} />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <label
                  htmlFor="property-image"
                  className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-[#C9D4C8] bg-[#F8F9F6] p-4 transition hover:border-[#527C61] hover:bg-[#F1F5F0]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E9] text-[#527C61]">
                    <Upload size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#39483D]">
                      {imagePreview
                        ? "Choose another image"
                        : "Upload a new image"}
                    </p>

                    <p className="mt-1 text-[10px] text-[#929B91]">
                      PNG, JPG or JPEG
                    </p>
                  </div>

                  <span className="ml-auto hidden rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-[#527C61] shadow-sm sm:block">
                    Browse
                  </span>

                  <input
                    id="property-image"
                    ref={fileRef}
                    type="file"
                    onChange={handleFileChange}
                    accept="image/png,image/jpeg,image/jpg"
                    disabled={loading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Right section */}
            <div className="space-y-4">

              {/* Live preview */}
              <div className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white">
                <div className="bg-[#244B3C] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#D6A45D]">
                    Live Preview
                  </p>

                  <h2 className="mt-1 line-clamp-2 text-base font-bold text-white">
                    {formData.title || "Your Property"}
                  </h2>

                  <p className="mt-0.5 text-xs text-[#DCE8DC]">
                    {formData.city || "City"}
                  </p>
                </div>

                <div className="h-28 overflow-hidden bg-[#E8EDE7]">
                  {imagePreview || currentImage ? (
                    <img
                      src={imagePreview || currentImage}
                      alt="Property preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#A8BDA5]">
                      <Home size={40} strokeWidth={1.3} />
                    </div>
                  )}
                </div>

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
                        {formData.address || "Property address"}
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
                        ₹{formattedRent}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 border-t border-[#F0EEE7] pt-3 text-[10px] font-medium text-[#527C61]">
                    <CheckCircle2 size={13} />
                    Property details ready to update
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="rounded-xl border border-[#E9DFC9] bg-[#FBF7EE] p-4">
                <div className="flex items-center gap-2">
                  <Lightbulb size={17} className="text-[#A47A3F]" />

                  <h3 className="text-xs font-bold text-[#6F542D]">
                    Before Updating
                  </h3>
                </div>

                <ul className="mt-3 space-y-2">
                  {[
                    "Check the property address.",
                    "Verify the monthly rent.",
                    "Use a clear property image.",
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

          {/* Action bar */}
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
                  Updating...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save Changes
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
