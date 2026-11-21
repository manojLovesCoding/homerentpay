import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../api/axios.js";

const initialFormData = { name: "", email: "", phone: "", message: "" };

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/property/available?page=${currentPage}`);
        setProperties(res.data.properties || []);
        setCurrentPage(res.data.currentPage || 1);
        setTotalPages(res.data.totalPages || 0);
        setTotalProperties(res.data.totalProperties || 0);
      } catch (err) {
        console.error("Unable to fetch properties:", err);
        toast.error(
          err.response?.data?.message || "Unable to load properties.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [currentPage]);

  useEffect(() => {
    document.body.style.overflow = selectedProperty ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProperty]);

  const openInquiryModal = (property) => {
    if (property.status === "rented") return;
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!selectedProperty) return toast.error("Please select a property.");
    const { name, email, phone, message } = formData;
    if (![name, email, phone, message].every((value) => value.trim())) {
      return toast.error("Please fill in all fields.");
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

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F7F4EA] text-[#242B26]">
      <section className="relative overflow-hidden bg-[#244B3C] px-6 py-16 text-white sm:py-20">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#A8BDA5]/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            to="/"
            className="text-sm font-medium text-[#E5EBDD] transition hover:text-white"
          >
            ← Back to Home
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-[#D6A45D]">
            Find your next home
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Rental Properties
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-white/75">
            Explore our rental properties and find a place that feels right for
            you.
          </p>
          <p className="mt-5 text-sm font-medium text-[#E5EBDD]">
            {totalProperties}{" "}
            {totalProperties === 1 ? "property" : "properties"} listed
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#E6E3D9] bg-white shadow-sm"
              >
                <div className="h-60 animate-pulse bg-[#E9E8DD]" />
                <div className="space-y-4 p-6">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#E9E8DD]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#E9E8DD]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#E9E8DD]" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D9DED3] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1F4EC] text-3xl">
              🏠
            </div>
            <h2 className="mt-5 text-xl font-bold">No properties available</h2>
            <p className="mt-2 text-[#68756A]">
              Please check back later for new rental properties.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-[#244B3C] px-6 py-3 font-semibold text-white hover:bg-[#193A2E]"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#527C61]">
                  Browse homes
                </p>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Explore rental listings
                </h2>
              </div>
              <p className="text-sm text-[#68756A]">
                Showing {(currentPage - 1) * 9 + 1}–
                {Math.min(currentPage * 9, totalProperties)} of{" "}
                {totalProperties}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => {
                const isRented = property.status === "rented";

                return (
                  <article
                    key={property._id}
                    className="group overflow-hidden rounded-2xl border border-[#E6E3D9] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-60 overflow-hidden bg-[#E9E8DD]">
                      {property.image ? (
                        <img
                          src={property.image}
                          alt={property.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#F7F4EA] to-[#E9E8DD] text-5xl">
                          🏠
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Badge: Available when vacant, Occupied when rented */}
                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-lg ${
                          isRented ? "bg-[#A47A3F]" : "bg-[#527C61]"
                        }`}
                      >
                        {isRented ? "Occupied" : "Available"}
                      </span>

                      <p className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-lg">
                        ₹{Number(property.rent || 0).toLocaleString("en-IN")}
                        <span className="text-sm font-normal text-white/80">
                          {" "}
                          / month
                        </span>
                      </p>
                    </div>
                    <div className="p-6">
                      <h3 className="line-clamp-1 text-xl font-bold">
                        {property.title}
                      </h3>
                      <div className="mt-3 flex items-start gap-2 text-sm text-[#68756A]">
                        <span>📍</span>
                        <div>
                          <p>{property.address}</p>
                          <p className="mt-1 text-[#899489]">{property.city}</p>
                        </div>
                      </div>
                      <div className="my-5 border-t border-[#EEECE4]" />
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="flex items-center gap-2 text-sm text-[#68756A]">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F4EC]">
                            🏡
                          </span>
                          Rental Property
                        </span>

                        {/* Inquiry button is hidden for rented properties */}
                        {!isRented && (
                          <button
                            type="button"
                            onClick={() => openInquiryModal(property)}
                            className="rounded-lg bg-[#244B3C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#193A2E] focus:outline-none focus:ring-2 focus:ring-[#527C61] focus:ring-offset-2"
                          >
                            Inquiry
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Property pagination"
                className="mt-12 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-[#C8D4C6] bg-white px-4 py-2.5 text-sm font-semibold text-[#244B3C] transition hover:bg-[#F1F4EC] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${currentPage === page ? "bg-[#244B3C] text-white shadow-md" : "border border-[#C8D4C6] bg-white text-[#244B3C] hover:bg-[#F1F4EC]"}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-[#C8D4C6] bg-white px-4 py-2.5 text-sm font-semibold text-[#244B3C] transition hover:bg-[#F1F4EC] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      {selectedProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#193A2E]/60 px-4 py-8 backdrop-blur-sm"
          onClick={closeInquiryModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="property-inquiry-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#244B3C]">
                  Property Inquiry
                </p>
                <h2
                  id="property-inquiry-title"
                  className="mt-2 text-2xl font-bold"
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
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F4EC] text-xl text-[#68756A] hover:bg-[#E9E8DD] disabled:opacity-50"
              >
                ×
              </button>
            </div>
            <div className="mb-6 rounded-xl border border-[#DCE6D9] bg-[#F1F4EC] p-4">
              <h3 className="font-semibold">{selectedProperty.title}</h3>
              <p className="mt-1 text-sm text-[#68756A]">
                {selectedProperty.address}, {selectedProperty.city}
              </p>
              <p className="mt-2 font-bold text-[#193A2E]">
                ₹{Number(selectedProperty.rent || 0).toLocaleString("en-IN")}
                <span className="text-sm font-normal text-[#68756A]">
                  {" "}
                  / month
                </span>
              </p>
            </div>
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="property-inquiry-name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Full Name
                </label>
                <input
                  id="property-inquiry-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  maxLength={100}
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#D9DED3] px-4 py-3 text-sm outline-none focus:border-[#527C61] focus:ring-2 focus:ring-[#A8BDA5]/40 disabled:bg-[#F7F4EA]"
                />
              </div>
              <div>
                <label
                  htmlFor="property-inquiry-email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Email Address
                </label>
                <input
                  id="property-inquiry-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  maxLength={254}
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#D9DED3] px-4 py-3 text-sm outline-none focus:border-[#527C61] focus:ring-2 focus:ring-[#A8BDA5]/40 disabled:bg-[#F7F4EA]"
                />
              </div>
              <div>
                <label
                  htmlFor="property-inquiry-phone"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Phone Number
                </label>
                <input
                  id="property-inquiry-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  maxLength={20}
                  required
                  disabled={submitting}
                  className="w-full rounded-xl border border-[#D9DED3] px-4 py-3 text-sm outline-none focus:border-[#527C61] focus:ring-2 focus:ring-[#A8BDA5]/40 disabled:bg-[#F7F4EA]"
                />
              </div>
              <div>
                <label
                  htmlFor="property-inquiry-message"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Message
                </label>
                <textarea
                  id="property-inquiry-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell the property owner what you would like to know..."
                  rows={4}
                  maxLength={2000}
                  required
                  disabled={submitting}
                  className="w-full resize-none rounded-xl border border-[#D9DED3] px-4 py-3 text-sm outline-none focus:border-[#527C61] focus:ring-2 focus:ring-[#A8BDA5]/40 disabled:bg-[#F7F4EA]"
                />
              </div>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeInquiryModal}
                  disabled={submitting}
                  className="rounded-xl border border-[#D9DED3] px-5 py-3 text-sm font-semibold hover:bg-[#F7F4EA] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-xl bg-[#244B3C] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="border-t border-[#E6E3D9] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-[#68756A] sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} HomeBridge. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/" className="transition hover:text-[#244B3C]">
              Home
            </Link>
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

export default Property;