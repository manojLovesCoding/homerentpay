
import { useEffect, useState } from "react";
import {
  MapPin,
  Building2,
  UserRound,
  Phone,
  Home,
  AlertCircle,
  RefreshCw,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";
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

  if (loading) {
    return (
      <div className="bg-[#F7F8F5] px-3 py-4 sm:px-5">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-3 h-3 w-24 rounded bg-[#E6E9E1]" />
          <div className="mb-4 h-7 w-44 rounded bg-[#E6E9E1]" />

          <div className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white">
            <div className="flex flex-col sm:flex-row">
              <div className="h-40 bg-[#E6E9E1] sm:w-[30%] sm:shrink-0" />
              <div className="flex-1 space-y-3 p-4">
                <div className="h-5 w-40 rounded bg-[#E6E9E1]" />
                <div className="h-3 w-28 rounded bg-[#E6E9E1]" />
                <div className="h-7 w-32 rounded bg-[#E6E9E1]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-16 rounded-lg bg-[#F0F1EC]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#F7F8F5] px-4 py-6">
        <div className="w-full max-w-sm rounded-xl border border-[#E6E3D9] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F8EDEA] text-[#A64B3C]">
            <AlertCircle size={24} />
          </div>

          <h2 className="text-lg font-bold text-[#242B26]">
            Unable to load property
          </h2>

          <p className="mt-1 text-sm text-[#68756A]">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#244B3C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#193A2E]"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#F7F8F5] px-4 py-6">
        <div className="w-full max-w-sm rounded-xl border border-[#E6E3D9] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#EAF0E8] text-[#244B3C]">
            <Home size={28} />
          </div>

          <h2 className="text-xl font-bold text-[#242B26]">
            No Property Assigned
          </h2>

          <p className="mt-2 text-sm leading-5 text-[#68756A]">
            You don't have a rental property assigned to your account yet.
          </p>
        </div>
      </div>
    );
  }

  const propertyStatus = property.status || "Rented";

  const detailItems = [
    {
      label: "Address",
      value: property.address || "Not available",
      icon: MapPin,
    },
    {
      label: "City",
      value: property.city || "Not available",
      icon: Building2,
    },
    {
      label: "Property Owner",
      value: property.landlord?.name || "Not available",
      icon: UserRound,
    },
    {
      label: "Owner Contact",
      value: property.landlord?.phone || "Not available",
      icon: Phone,
    },
  ];

  return (
    <div className="min-h-0 bg-[#F7F8F5]">
      <main className="px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
        <div className="mx-auto max-w-6xl">

          {/* Page heading */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#527C61]">
                Tenant Portal
              </p>

              <h1 className="text-xl font-bold tracking-tight text-[#242B26] sm:text-2xl">
                My Property
              </h1>

              <p className="mt-0.5 text-xs text-[#68756A]">
                Your rental home and landlord information.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE7DA] bg-[#EAF0E8] px-3 py-1.5 text-xs font-semibold capitalize text-[#244B3C]">
              <span className="h-2 w-2 rounded-full bg-[#527C61]" />
              {propertyStatus}
            </div>
          </div>

          {/* Main property card */}
          <section className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white shadow-sm">

            {/* Compact property overview */}
            <div className="flex flex-col sm:flex-row">

              {/* Smaller property image */}
              <div className="relative h-40 w-full shrink-0 overflow-hidden bg-[#EAF0E8] sm:h-auto sm:min-h-[190px] sm:w-[30%] lg:w-[27%]">
                {property.image ? (
                  <img
                    src={property.image}
                    alt={property.title || "Rental property"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[150px] items-center justify-center">
                    <Home
                      size={48}
                      className="text-[#527C61]"
                      strokeWidth={1.3}
                    />
                  </div>
                )}

                <div className="absolute left-3 top-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold capitalize text-[#244B3C] shadow-sm">
                    <CheckCircle2 size={12} className="text-[#527C61]" />
                    {propertyStatus}
                  </span>
                </div>
              </div>

              {/* Property details beside image */}
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 sm:p-5">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#527C61]">
                    Your Current Residence
                  </p>

                  <h2 className="mt-1 text-xl font-bold leading-tight text-[#242B26] sm:text-2xl">
                    {property.title || "Your Rental Property"}
                  </h2>

                  <p className="mt-2 flex items-center gap-1.5 text-xs text-[#68756A] sm:text-sm">
                    <MapPin size={15} className="shrink-0 text-[#527C61]" />
                    {property.city || "Location not available"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-5 border-t border-[#E6E3D9] pt-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#879187]">
                      Monthly Rent
                    </p>

                    <div className="mt-0.5 flex items-center gap-1">
                      <IndianRupee
                        size={18}
                        className="text-[#244B3C]"
                        strokeWidth={2.5}
                      />

                      <span className="text-2xl font-extrabold tracking-tight text-[#244B3C]">
                        {property.rent ?? "—"}
                      </span>

                      <span className="text-xs text-[#68756A]">/ month</span>
                    </div>
                  </div>

                  <div className="border-l border-[#E6E3D9] pl-5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#879187]">
                      Rental Status
                    </p>
                    <p className="mt-1 text-sm font-bold capitalize text-[#244B3C]">
                      {propertyStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Property information */}
            <div className="border-t border-[#E6E3D9] p-3 sm:p-4">

              <div className="mb-2">
                <h3 className="text-sm font-bold text-[#242B26]">
                  Property Information
                </h3>
                <p className="mt-0.5 text-[11px] text-[#68756A]">
                  Your home and owner details.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {detailItems.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex min-w-0 items-center gap-2.5 rounded-lg border border-[#E6E3D9] bg-[#FCFCFA] px-3 py-2.5 transition hover:border-[#A8BDA5]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF0E8] text-[#244B3C]">
                      <Icon size={16} strokeWidth={1.9} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#879187]">
                        {label}
                      </p>

                      <p className="mt-0.5 break-words text-xs font-semibold leading-4 text-[#344239]">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact landlord */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#E6E3D9] pt-3">
                <div>
                  <h3 className="text-sm font-bold text-[#242B26]">
                    Need help with your property?
                  </h3>
                  <p className="mt-0.5 text-xs text-[#68756A]">
                    Contact your landlord for assistance.
                  </p>
                </div>

                {property.landlord?.phone ? (
                  <a
                    href={`tel:${property.landlord.phone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#244B3C] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#193A2E] active:scale-[0.98]"
                  >
                    <Phone size={14} />
                    Contact Owner
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-[#E9ECE6] px-4 py-2 text-xs font-semibold text-[#879187]"
                  >
                    <Phone size={14} />
                    Contact Unavailable
                  </button>
                )}
              </div>
            </div>
          </section>

          <p className="mt-2 text-center text-[10px] text-[#879187]">
            Property information is provided by your landlord.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetails;
