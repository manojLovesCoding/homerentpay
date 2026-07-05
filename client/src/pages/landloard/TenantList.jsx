import React from "react";

const TenantList = () => {
  const tenants = [
    {
      name: "John",
      property: "Apt 101",
      rent: "₹15K",
      status: "Active",
    },
    {
      name: "Sara",
      property: "Apt 202",
      rent: "₹12K",
      status: "Pending",
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Tenant List
          </h1>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-xl overflow-x-auto">
          <table className="w-full border-collapse">

            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Property</th>
                <th className="p-3">Rent</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {tenants.map((tenant, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{tenant.name}</td>
                  <td className="p-3">{tenant.property}</td>
                  <td className="p-3">{tenant.rent}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        tenant.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
};

export default TenantList;