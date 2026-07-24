import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeactivate = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to deactivate this user?",
    );

    if (!confirm) return;

    try {
      await api.patch(`/auth/tenant/${id}/deactivate`);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isActive: false } : user,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to deactivate user");
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Users</h1>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden border">
        <table className="w-full text-left">
          {/* Head */}
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  {/* Name */}
                  <td className="p-4 font-medium text-gray-800">{user.name}</td>

                  {/* Email */}
                  <td className="p-4 text-gray-600">{user.email}</td>

                  {/* Phone */}
                  <td className="p-4 text-gray-600">{user.phone}</td>

                  {/* Role */}
                  <td className="p-4">
                    <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-600">
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        user.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 space-x-2">
                    {user.role === "tenant" && user.isActive && (
                      <button
                        onClick={() => handleDeactivate(user._id)}
                        className="px-3 py-1 text-sm rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      >
                        Block
                      </button>
                    )}

                    <button className="px-3 py-1 text-sm rounded bg-red-100 text-red-600 hover:bg-red-200">
                      Delete
                    </button>

                    <button className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-200">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
