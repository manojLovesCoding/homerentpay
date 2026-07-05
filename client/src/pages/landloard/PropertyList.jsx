import React from "react";

const PropertyList = () => {
  const properties = [
    {
      name: "Green Residency",
      rent: "₹15,000",
      location: "Chennai",
    },
    {
      name: "Skyline Apartments",
      rent: "₹18,000",
      location: "Bangalore",
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Property List
          </h1>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Add Property
          </button>
        </div>

        {/* Property Cards */}
        <div className="space-y-4">
          {properties.map((property, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-5 border-l-4 border-blue-500"
            >
              {/* Info */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {property.name} | {property.rent}
                  </h2>
                  <p className="text-gray-500">{property.location}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-3">
                <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md">
                  View
                </button>
                <button className="px-3 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-md">
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PropertyList;