import { useState } from "react";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Rent Payment
        </h1>

        {/* Rent Amount */}
        <div className="bg-blue-50 rounded-lg p-5 text-center mb-6">
          <p className="text-gray-600 text-sm">Rent Amount</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            ₹15,000
          </h2>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Method
          </h3>

          <div className="space-y-3">
            {["UPI", "Card", "Net Banking", "Wallet"].map((method) => (
              <label
                key={method}
                className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-blue-600"
                />
                <span className="text-gray-700">{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Button */}
        <button
          className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;