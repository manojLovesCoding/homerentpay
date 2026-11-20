import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios.js";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/property/home");
        setProperties(res.data.properties || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProperty]);

  const openInquiryModal = (property) => {
    setSelectedProperty(property);
    setFormData(initialFormData);
  };

  const closeInquiryModal = () => {
    if (submitting) return;

    setSelectedProperty(null);
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();

    if (!selectedProperty) {
      toast.error("Please select a property.");
      return;
    }

    const { name, email, phone, message } = formData;

    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await api.post("/inquiry/add", {
        propertyId: selectedProperty._id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });

      toast.success(res.data.message || "Inquiry submitted successfully!");

      setSelectedProperty(null);
      setFormData(initialFormData);
    } catch (err) {
      console.error("Inquiry submission error:", err);

      toast.error(
        err.response?.data?.message ||
          "Unable to submit your inquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EA] text-[#242B26]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#F7F4EA]">
        <div className="absolute -left-32 -top-28 h-80 w-80 rounded-full bg-[#A8BDA5]/30 blur-3xl" />
        <div className="absolute -bottom-32 right-1/3 h-80 w-80 rounded-full bg-[#D6A45D]/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-0 sm:gap-12 sm:pb-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-24 lg:pt-0">
          <div className="max-w-2xl">
            <img
              src="/logo.jpg"
              alt="HomeBridge Housing"
              className="mb-4 h-20 w-56 object-contain object-left sm:h-24 sm:w-64"
              fetchPriority="high"
            />

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCE6D9] bg-white/80 px-4 py-2 text-sm font-medium text-[#527C61] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#527C61]" />A simpler
              way to rent and manage homes
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-[#242B26] sm:text-5xl lg:text-6xl">
              Find a place to call
              <span className="mt-1 block text-[#244B3C]">home.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#68756A] sm:text-lg">
              Discover rental properties, connect with landlords, and manage
              your rental journey with confidence — all in one place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/properties"
                className="group inline-flex items-center justify-center rounded-xl bg-[#244B3C] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#244B3C]/20 transition hover:-translate-y-0.5 hover:bg-[#193A2E] focus:outline-none focus:ring-2 focus:ring-[#527C61] focus:ring-offset-2"
              >
                Explore Properties
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl border border-[#C8D4C6] bg-white px-7 py-3.5 font-semibold text-[#244B3C] transition hover:-translate-y-0.5 hover:border-[#527C61] hover:bg-[#F1F4EC]"
              >
                Get Started
              </Link>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t border-[#DCE3D8] pt-7">
              <div>
                <p className="text-2xl font-extrabold text-[#244B3C]">500+</p>
                <p className="mt-1 text-xs font-medium text-[#68756A] sm:text-sm">
                  Properties
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#244B3C]">1000+</p>
                <p className="mt-1 text-xs font-medium text-[#68756A] sm:text-sm">
                  Happy Tenants
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#244B3C]">24/7</p>
                <p className="mt-1 text-xs font-medium text-[#68756A] sm:text-sm">
                  Support
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-4 rounded-[2rem] bg-[#A8BDA5]/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border-[6px] border-white bg-white shadow-2xl shadow-[#244B3C]/15">
              <img
                src="https://images.unsplash.com/photo-1783125127278-e931d864f23c?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=85&w=1800"
                alt="Modern house with a green lawn under a sunny sky"
                className="h-[340px] w-full object-cover sm:h-[440px]"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#193A2E]/45 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/50 bg-white/90 p-4 shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#527C61]">
                  Your next chapter
                </p>
                <p className="mt-1 text-lg font-bold text-[#242B26] sm:text-xl">
                  A home that feels right.
                </p>
                <p className="mt-1 text-sm text-[#68756A]">
                  Browse spaces and take the next step with confidence.
                </p>
              </div>
            </div>
            <div className="absolute -right-3 -top-4 hidden rounded-2xl border border-[#E6E3D9] bg-white px-4 py-3 shadow-xl sm:block">
              <p className="text-xs font-medium text-[#68756A]">Made for</p>
              <p className="mt-1 text-sm font-bold text-[#244B3C]">
                Landlords & Tenants
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROPERTY SECTION ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#244B3C]">
              Explore rentals
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-[#242B26] sm:text-4xl">
              Available Properties
            </h2>

            <p className="mt-3 text-[#68756A]">
              Explore our latest rental properties and find your next home.
            </p>
          </div>

          <Link
            to="/properties"
            className="font-semibold text-[#244B3C] transition hover:text-[#193A2E]"
          >
            View all →
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-[#E6E3D9] bg-white shadow-sm"
              >
                <div className="h-56 animate-pulse bg-[#E9E8DD]" />

                <div className="space-y-4 p-6">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#E9E8DD]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#E9E8DD]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#E9E8DD]" />
                  <div className="h-6 w-1/3 animate-pulse rounded bg-[#E9E8DD]" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl border border-dashed border-[#D9DED3] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1F4EC] text-3xl">
              🏠
            </div>

            <h3 className="mt-5 text-xl font-bold text-[#242B26]">
              No properties available
            </h3>

            <p className="mt-2 text-[#68756A]">
              Check back later for new rental properties.
            </p>
          </div>
        ) : (
          /* Property Cards */
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property._id}
                className="group overflow-hidden rounded-2xl border border-[#E6E3D9] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D9DED3] hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden bg-[#E9E8DD]">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#F7F4EA] to-[#E9E8DD] text-5xl">
                      🏠
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

                  {/* Availability badge */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-[#527C61] px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                      Available
                    </span>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-4 left-4">
                    <p className="text-2xl font-bold text-white drop-shadow-lg">
                      ₹{property.rent}
                      <span className="text-sm font-normal text-white/80">
                        {" "}
                        / month
                      </span>
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="line-clamp-1 text-xl font-bold text-[#242B26]">
                    {property.title}
                  </h3>

                  <div className="mt-3 flex items-start gap-2 text-sm text-[#68756A]">
                    <span className="mt-0.5">📍</span>

                    <div>
                      <p>{property.address}</p>
                      <p className="mt-1 text-[#899489]">{property.city}</p>
                    </div>
                  </div>

                  <div className="my-5 border-t border-[#EEECE4]" />

                  {/* Bottom */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm text-[#68756A]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F4EC]">
                        🏡
                      </span>
                      Rental Property
                    </div>

                    <button
                      type="button"
                      onClick={() => openInquiryModal(property)}
                      className="rounded-lg bg-[#244B3C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#193A2E] focus:outline-none focus:ring-2 focus:ring-[#527C61] focus:ring-offset-2"
                    >
                      Inquiry
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= INQUIRY MODAL ================= */}
      {selectedProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#193A2E]/60 px-4 py-8 backdrop-blur-sm"
          onClick={closeInquiryModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inquiry-modal-title"
            className="relative my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#244B3C]">
                  Property Inquiry
                </p>

                <h2
                  id="inquiry-modal-title"
                  className="mt-2 text-2xl font-bold text-[#242B26]"
                >
                  Interested in this property?
                </h2>

                <p className="mt-2 text-sm text-[#68756A]">
                  Send your details to the property owner.
                </p>
              </div>

              <button
                type="button"
                onClick={closeInquiryModal}
                disabled={submitting}
                aria-label="Close inquiry modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F4EC] text-xl text-[#68756A] transition hover:bg-[#E9E8DD] hover:text-[#242B26] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* Selected property */}
            <div className="mb-6 rounded-xl border border-[#DCE6D9] bg-[#F1F4EC] p-4">
              <h3 className="font-semibold text-[#242B26]">
                {selectedProperty.title}
              </h3>

              <p className="mt-1 text-sm text-[#68756A]">
                {selectedProperty.address}, {selectedProperty.city}
              </p>

              <p className="mt-2 font-bold text-[#193A2E]">
                ₹{selectedProperty.rent}
                <span className="text-sm font-normal text-[#68756A]">
                  {" "}
                  / month
                </span>
              </p>
            </div>

            {/* Inquiry form */}
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="inquiry-name"
                  className="mb-1.5 block text-sm font-medium text-[#37443A]"
                >
                  Full Name
                </label>

                <input
                  id="inquiry-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  maxLength={100}
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#D9DED3] px-4 py-3 text-sm outline-none transition placeholder:text-[#899489] focus:border-[#527C61] focus:ring-2 focus:ring-[#A8BDA5]/40 disabled:bg-[#F7F4EA]"
                />
              </div>

              <div>
                <label
                  htmlFor="inquiry-email"
                  className="mb-1.5 block text-sm font-medium text-[#37443A]"
                >
                  Email Address
                </label>

                <input
                  id="inquiry-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  maxLength={254}
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#D9DED3] px-4 py-3 text-sm outline-none transition placeholder:text-[#899489] focus:border-[#527C61] focus:ring-2 focus:ring-[#A8BDA5]/40 disabled:bg-[#F7F4EA]"
                />
              </div>

              <div>
                <label
                  htmlFor="inquiry-phone"
                  className="mb-1.5 block text-sm font-medium text-[#37443A]"
                >
                  Phone Number
                </label>

                <input
                  id="inquiry-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  maxLength={20}
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#D9DED3] px-4 py-3 text-sm outline-none transition placeholder:text-[#899489] focus:border-[#527C61] focus:ring-2 focus:ring-[#A8BDA5]/40 disabled:bg-[#F7F4EA]"
                />
              </div>

              <div>
                <label
                  htmlFor="inquiry-message"
                  className="mb-1.5 block text-sm font-medium text-[#37443A]"
                >
                  Message
                </label>

                <textarea
                  id="inquiry-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell the property owner what you would like to know..."
                  rows={4}
                  maxLength={2000}
                  required
                  disabled={submitting}
                  className="w-full resize-none rounded-xl border border-[#D9DED3] px-4 py-3 text-sm outline-none transition placeholder:text-[#899489] focus:border-[#527C61] focus:ring-2 focus:ring-[#A8BDA5]/40 disabled:bg-[#F7F4EA]"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeInquiryModal}
                  disabled={submitting}
                  className="rounded-xl border border-[#D9DED3] px-5 py-3 text-sm font-semibold text-[#37443A] transition hover:bg-[#F7F4EA] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-xl bg-[#244B3C] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#244B3C]/20 transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Inquiry"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#244B3C] to-[#527C61] px-8 py-14 text-center shadow-xl shadow-[#244B3C]/20 sm:px-12">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#193A2E]/25 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to find your next home?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[#E5EBDD]">
              Create an account and start exploring rental properties today.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 font-semibold text-[#244B3C] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#F1F4EC]"
            >
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#E6E3D9] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-[#68756A] sm:flex-row lg:px-8">
          <div className="space-y-2 text-center sm:text-left">
            <p>© 2026 HomeBridge. All rights reserved.</p>

            <p>
              Designed and Developed by{" "}
              <span className="font-bold text-[#37443A]">Manoj Kumar P V</span>
            </p>
          </div>

          <div className="flex gap-6">
            <Link to="/login" className="transition hover:text-[#244B3C]">
              Login
            </Link>

            <Link to="/register" className="transition hover:text-[#244B3C]">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
