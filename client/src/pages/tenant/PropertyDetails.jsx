import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const PropertyDetails = () => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const fetchProperty = async () => {

      try {

        const response = await api.get(
          "/property/tenant-property"
        );

        setProperty(response.data.property);

      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to load property"
        );

      } finally {

        setLoading(false);

      }

    };


    fetchProperty();

  }, []);



  if (loading) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-semibold">
          Loading property...
        </h2>
      </div>
    );
  }



  if (error) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-semibold text-red-600">
          {error}
        </h2>
      </div>
    );
  }



  if (!property) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-semibold">
          No property assigned yet
        </h2>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">


      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">


        {/* Property Image */}
        {property.image && (

          <img
            src={property.image}
            alt={property.title}
            className="w-full h-56 object-cover"
          />

        )}



        {/* Property Details */}
        <div className="p-6">


          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            {property.title}
          </h1>



          <div className="space-y-4">


            <div>
              <p className="text-sm text-gray-500">
                Address
              </p>

              <p className="font-medium text-gray-800">
                {property.address}
              </p>
            </div>




            <div>
              <p className="text-sm text-gray-500">
                City
              </p>

              <p className="font-medium text-gray-800">
                {property.city}
              </p>
            </div>




            <div>
              <p className="text-sm text-gray-500">
                Owner
              </p>

              <p className="font-medium text-gray-800">
                {property.landlord?.name}
              </p>
            </div>




            <div>
              <p className="text-sm text-gray-500">
                Owner Contact
              </p>

              <p className="font-medium text-gray-800">
                {property.landlord?.phone}
              </p>
            </div>




            <div>
              <p className="text-sm text-gray-500">
                Rent
              </p>

              <p className="font-semibold text-green-600 text-lg">
                ₹{property.rent} / month
              </p>
            </div>




            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {property.status}
              </span>
            </div>


          </div>




          <button
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Contact Owner
          </button>


        </div>


      </div>


    </div>
  );
};


export default PropertyDetails;