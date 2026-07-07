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
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">Rental Management System</h1>
          <p className="mt-4 text-lg">
            Find rental properties and manage everything in one place.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="border border-white px-6 py-3 rounded-lg"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">Available Properties</h2>

        {loading ? (
          <p>Loading...</p>
        ) : properties.length === 0 ? (
          <p>No properties available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                {property.image && (
                 <img
  src={property.image}
  alt={property.title}
  className="w-full h-52 object-cover"
/>
                )}

                <div className="p-5">
                  <h3 className="text-xl font-semibold">
                    {property.title}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    {property.address}
                  </p>

                  <p className="text-gray-500">{property.city}</p>

                  <p className="text-blue-600 font-bold text-lg mt-3">
                    ₹{property.rent}/month
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;