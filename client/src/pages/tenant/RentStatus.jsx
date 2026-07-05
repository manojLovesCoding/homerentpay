import React from "react";

const RentStatus = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Current Month</h1>
          <p className="text-gray-500 mt-1">July 2026</p>
        </div>

        {/* Rent Details */}
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Rent</span>
            <span className="text-xl font-bold text-green-600">
              ₹15,000
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Due Date</span>
            <span className="font-semibold text-gray-800">
              5 July
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Late Fee</span>
            <span className="font-semibold text-gray-800">
              ₹0
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Status</span>

            <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
              Pending
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
          Pay Rent
        </button>
      </div>
    </div>
  );
};

export default RentStatus;