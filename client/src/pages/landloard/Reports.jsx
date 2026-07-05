import React from "react";

const Reports = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Reports
          </h1>
          <p className="text-gray-500 mt-1">
            Analytics overview of your rental business
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Monthly Income Graph */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              Monthly Income
            </h2>

            <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
              📊 Income Graph (Chart Placeholder)
            </div>
          </div>

          {/* Pending Payments Chart */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              Pending Payments
            </h2>

            <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
              📉 Pending Chart (Chart Placeholder)
            </div>
          </div>

          {/* Tenant Growth Chart (full width) */}
          <div className="bg-white shadow-md rounded-xl p-6 md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">
              Tenant Growth
            </h2>

            <div className="h-72 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
              📈 Growth Chart (Chart Placeholder)
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Reports;