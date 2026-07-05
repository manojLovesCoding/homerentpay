import React from "react";

const PaymentReceipt = () => {
  const receipt = {
    tenant: "John",
    property: "Green Residency",
    amount: "₹15,000",
    month: "July 2026",
    paidOn: "05 Jul",
    transactionId: "TXN3434343",
    status: "Paid",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-5">
          <h1 className="text-2xl font-bold">Payment Receipt</h1>
        </div>

        {/* Receipt Details */}
        <div className="p-6 space-y-5">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Tenant</span>
            <span className="font-semibold">{receipt.tenant}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Property</span>
            <span className="font-semibold">{receipt.property}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Amount</span>
            <span className="font-semibold text-green-600">
              {receipt.amount}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Month</span>
            <span className="font-semibold">{receipt.month}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Paid On</span>
            <span className="font-semibold">{receipt.paidOn}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-semibold">{receipt.transactionId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Status</span>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
              {receipt.status}
            </span>
          </div>

          {/* Download Button */}
          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;