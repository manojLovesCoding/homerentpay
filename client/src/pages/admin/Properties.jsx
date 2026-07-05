import React from "react";

const Properties = () => {
  const properties = [
    {
      title: "Apt 101",
      owner: "Rahul",
      rent: "₹15K",
      status: "Active",
    },
    {
      title: "Apt 202",
      owner: "Anil",
      rent: "₹12K",
      status: "Pending",
    },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">
        Properties
      </h1>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden border">
        <table className="w-full text-left">

          {/* Head */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Owner</th>
              <th className="p-4">Rent</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {properties.map((property, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">

                {/* Title */}
                <td className="p-4 font-medium text-gray-800">
                  {property.title}
                </td>

                {/* Owner */}
                <td className="p-4 text-gray-600">
                  {property.owner}
                </td>

                {/* Rent */}
                <td className="p-4 text-gray-800 font-semibold">
                  {property.rent}
                </td>

                {/* Status */}
                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      property.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {property.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 space-x-2">
                  <button className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-200">
                    View
                  </button>

                  <button className="px-3 py-1 text-sm rounded bg-red-100 text-red-600 hover:bg-red-200">
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Properties;