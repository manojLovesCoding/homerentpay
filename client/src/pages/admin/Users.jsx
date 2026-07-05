import React from "react";

const Users = () => {
  const users = [
    {
      name: "John",
      email: "j@x.com",
      role: "Tenant",
      status: "Active",
    },
    {
      name: "Sara",
      email: "s@x.com",
      role: "Landlord",
      status: "Active",
    },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">
        Users
      </h1>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden border">
        <table className="w-full text-left">

          {/* Head */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">

                <td className="p-4 font-medium text-gray-800">
                  {user.name}
                </td>

                <td className="p-4 text-gray-600">
                  {user.email}
                </td>

                <td className="p-4">
                  <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-600">
                    {user.role}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 space-x-2">
                  <button className="px-3 py-1 text-sm rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                    Block
                  </button>

                  <button className="px-3 py-1 text-sm rounded bg-red-100 text-red-600 hover:bg-red-200">
                    Delete
                  </button>

                  <button className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-200">
                    View
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

export default Users;