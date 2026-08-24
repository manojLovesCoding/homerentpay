import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const PropertyDetails = () => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get("/property/tenant-property");
        setProperty(response.data.property);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded-lg mb-8" />

          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="h-64 sm:h-80 lg:h-96 bg-slate-200" />

            <div className="p-6 sm:p-8">
              <div className="h-8 w-2/3 bg-slate-200 rounded mb-4" />
              <div className="h-4 w-full bg-slate-200 rounded mb-3" />
              <div className="h-4 w-1/2 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-red-100 p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
            ⚠️
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Unable to load property
          </h2>

          <p className="mt-2 text-sm text-slate-500">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 active:scale-[0.98]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No property
  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-4xl">
            🏠
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            No Property Assigned
          </h2>

          <p className="mt-2 text-slate-500">
            You don't have a rental property assigned to your account yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Background decoration */}
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600" />

      <main className="relative px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8 text-white">
            <p className="text-sm font-medium text-blue-100 mb-1">
              Tenant Portal
            </p>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              My Property
            </h1>

            <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-xl">
              View your rental property, owner information and monthly rent
              details.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 overflow-hidden border border-white/50">
            {/* Property Image */}
            <div className="relative h-64 sm:h-80 lg:h-[420px] bg-slate-200 overflow-hidden">
              {property.image ? (
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover transition duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                  <span className="text-7xl">🏠</span>
                </div>
              )}

              {/* Image gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Status */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur px-4 py-2 text-sm font-semibold text-green-700 shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  {property.status || "Rented"}
                </span>
              </div>

              {/* Property title on image */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 text-white">
                <p className="text-sm text-white/80 mb-1">
                  Your current residence
                </p>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  {property.title}
                </h2>

                <p className="mt-2 flex items-center gap-2 text-sm sm:text-base text-white/90">
                  <span>📍</span>
                  {property.city}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8 lg:p-10">
              {/* Rent highlight */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Monthly Rent
                  </p>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-blue-600">
                      ₹{property.rent}
                    </span>

                    <span className="text-sm text-slate-500">/ month</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-blue-50 px-5 py-3">
                  <p className="text-xs font-medium text-blue-500">
                    Rental Status
                  </p>

                  <p className="mt-1 font-bold text-blue-700 capitalize">
                    {property.status || "Active"}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Address */}
                <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-blue-100 hover:bg-blue-50/50">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-xl">
                      📍
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Address
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-semibold text-slate-800 break-words">
                        {property.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* City */}
                <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-blue-100 hover:bg-blue-50/50">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-xl">
                      🏙️
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        City
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-semibold text-slate-800">
                        {property.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Owner */}
                <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-blue-100 hover:bg-blue-50/50">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-xl">
                      👤
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Property Owner
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-semibold text-slate-800">
                        {property.landlord?.name || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-blue-100 hover:bg-blue-50/50">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-xl">
                      📞
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Owner Contact
                      </p>

                      <p className="mt-1 text-sm sm:text-base font-semibold text-slate-800 break-all">
                        {property.landlord?.phone || "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Owner */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Need help with your property?
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Contact your landlord for any rental-related questions.
                    </p>
                  </div>

                  {property.landlord?.phone ? (
                    <a
                      href={`tel:${property.landlord.phone}`}
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
                    >
                      <span>📞</span>
                      Contact Owner
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full sm:w-auto rounded-xl bg-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-500 cursor-not-allowed"
                    >
                      Contact Unavailable
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom info */}
          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-slate-400">
              Property information is provided by your landlord.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
