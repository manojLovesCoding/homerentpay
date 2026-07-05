import React from "react";

const Reports = () => {
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">
        Reports
      </h1>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Total Revenue Graph */}
        <div className="bg-white border shadow rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Total Revenue Graph
          </h2>

          <div className="h-64 flex items-center justify-center text-gray-400 border rounded-lg">
            Revenue Chart Placeholder
          </div>
        </div>

        {/* Monthly Collection */}
        <div className="bg-white border shadow rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Monthly Collection
          </h2>

          <div className="h-64 flex items-center justify-center text-gray-400 border rounded-lg">
            Monthly Collection Chart Placeholder
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white border shadow rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            User Growth
          </h2>

          <div className="h-64 flex items-center justify-center text-gray-400 border rounded-lg">
            User Growth Chart Placeholder
          </div>
        </div>

        {/* Payment Trends */}
        <div className="bg-white border shadow rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Payment Trends
          </h2>

          <div className="h-64 flex items-center justify-center text-gray-400 border rounded-lg">
            Payment Trends Chart Placeholder
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;