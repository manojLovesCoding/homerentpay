import React from "react";

const PropertyDetails = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Property Image */}
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
          alt="Apartment"
          className="w-full h-56 object-cover"
        />

        {/* Property Details */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">
            Green Residency
          </h1>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-gray-800">
                12 MG Road, Chennai
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Owner</p>
              <p className="font-medium text-gray-800">
                Rahul Kumar
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Rent</p>
              <p className="font-semibold text-green-600 text-lg">
                ₹15,000 / month
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Move In</p>
              <p className="font-medium text-gray-800">
                01 Jan 2026
              </p>
            </div>
          </div>

          {/* Button */}
          <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;