import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";


const RentStatus = () => {

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);


  useEffect(() => {
    getTenantProperty();
  }, []);



  const getTenantProperty = async () => {
    try {

      const { data } = await api.get("/property/tenant-property");

      setProperty(data.property);


      const status = await api.get(
        `/payment/status?propertyId=${data.property._id}`
      );

      setPaid(status.data.paid);


    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };



  const handlePayment = async () => {

    try {


      const { data } = await api.post("/payment/create-order", {
        propertyId: property._id,
      });



      const options = {

        key: data.key,

        amount: data.order.amount,

        currency: data.order.currency,

        name: "Rent Payment",

        description: "Monthly Rent",

        order_id: data.order.id,


        handler: async function (response) {

          try {


            const verify = await api.post("/payment/verify", {

              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,

            });



            if (verify.data.success) {

  alert("Payment successful");

  await getTenantProperty();

}


          } catch (error) {

            console.log(error);

            alert("Payment verification failed");

          }

        },



        prefill: {

          name: "Tenant",

        },



        theme: {

          color: "#2563eb",

        },

      };



      const razorpay = new window.Razorpay(options);

      razorpay.open();



    } catch (error) {


      console.log(error);


      alert(
        error.response?.data?.message ||
        "Payment failed"
      );


    }

  };




  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading...

      </div>

    );

  }




  if (!property) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        No property assigned

      </div>

    );

  }





  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">


      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">



        <div className="text-center border-b pb-4 mb-6">


          <h1 className="text-2xl font-bold text-blue-600">

            Current Month

          </h1>


          <p className="text-gray-500 mt-1">

            July 2026

          </p>


        </div>





        <div className="space-y-5">



          <div className="flex justify-between">

            <span className="text-gray-600 font-medium">

              Rent

            </span>


            <span className="text-xl font-bold text-green-600">

              ₹{property.rent}

            </span>


          </div>





          <div className="flex justify-between">


            <span className="text-gray-600 font-medium">

              Property

            </span>


            <span className="font-semibold">

              {property.title}

            </span>


          </div>





          <div className="flex justify-between">


            <span className="text-gray-600 font-medium">

              Status

            </span>



            <span
              className={`px-4 py-1 rounded-full font-semibold text-sm ${
                paid
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >

              {paid ? "Paid" : "Pending"}

            </span>



          </div>



        </div>





        <button

          disabled={paid}

          onClick={handlePayment}

          className={`w-full mt-8 py-3 rounded-lg transition text-white ${
            paid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}

        >

          {paid ? "Rent Paid" : "Pay Rent"}


        </button>




      </div>


    </div>

  );

};


export default RentStatus;