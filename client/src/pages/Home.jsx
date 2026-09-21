import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-slate-950">
        {/* Background gradients */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Find your perfect rental
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Find a place you'll
              <span className="block bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                love to call home.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Discover beautiful rental properties, compare prices, and manage
              your rental journey — all from one simple platform.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 hover:-translate-y-0.5"
              >
                Get Started
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Hero stats */}
          <div className="mt-16 grid max-w-2xl grid-cols-3 gap-8 border-t border-white/10 pt-8">
            <div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="mt-1 text-sm text-slate-500">Properties</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-white">1000+</p>
              <p className="mt-1 text-sm text-slate-500">Happy Tenants</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="mt-1 text-sm text-slate-500">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROPERTY SECTION ================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* Section heading */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Explore rentals
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Available Properties
            </h2>

            <p className="mt-3 text-slate-500">
              Explore our latest rental properties and find your next home.
            </p>
          </div>

          <Link
            to="/properties"
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            View all →
          </Link>
        </div>

        {/* ================= LOADING ================= */}
        {loading ? (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="h-56 animate-pulse bg-slate-200" />

                <div className="space-y-4 p-6">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          /* ================= EMPTY STATE ================= */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              🏠
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No properties available
            </h3>

            <p className="mt-2 text-slate-500">
              Check back later for new rental properties.
            </p>
          </div>
        ) : (
          /* ================= PROPERTY CARDS ================= */
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden bg-slate-200">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-5xl">
                      🏠
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

                  {/* Availability badge */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
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
                  <h3 className="line-clamp-1 text-xl font-bold text-slate-900">
                    {property.title}
                  </h3>

                  <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                    <span className="mt-0.5">📍</span>

                    <div>
                      <p>{property.address}</p>
                      <p className="mt-1 text-slate-400">{property.city}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-5 border-t border-slate-100" />

                  {/* Bottom */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                        🏡
                      </span>
                      Rental Property
                    </div>

                    <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-14 text-center shadow-xl shadow-blue-600/20 sm:px-12">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-indigo-900/20 blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to find your next home?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-blue-100">
              Create an account and start exploring rental properties today.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
          <p>© 2026 Vayuhu - Rental Management System</p>

          <div className="flex gap-6">
            <Link to="/login" className="transition hover:text-blue-600">
              Login
            </Link>

            <Link to="/register" className="transition hover:text-blue-600">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
