import React from "react";

const Profile = () => {
  const user = {
    name: "Landlord Name",
    email: "landlord@email.com",
    phone: "+91 XXXXX",
  };

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">

          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="text-lg font-semibold">{user.phone}</p>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Edit Profile
            </button>

            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
              Change Password
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;