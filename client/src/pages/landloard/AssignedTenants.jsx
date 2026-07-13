import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

const AssignedTenants = () => {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchAssignedTenants = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await api.get(
        "/property/assigned-tenants",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );


      setProperties(res.data.properties || []);

    } catch(err){
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  };


  useEffect(()=>{
    fetchAssignedTenants();
  },[]);



  if(loading)
    return <p className="p-6">Loading...</p>



  return (

    <div className="p-6">

      <div className="max-w-5xl mx-auto">


        <h1 className="text-xl font-bold text-blue-600 mb-5">
          Assigned Tenants
        </h1>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


        {
          properties.length === 0 ?

          (
            <p className="text-gray-500">
              No tenants assigned
            </p>
          )

          :

          properties.map((property)=>(


            <div
              key={property._id}
              className="bg-white shadow rounded-xl p-5"
            >


              <h2 className="font-bold text-lg">
                {property.title}
              </h2>


              <p className="text-gray-500">
                {property.address}, {property.city}
              </p>


              <p className="text-blue-600 font-bold mt-2">
                ₹{property.rent}
              </p>



              <div className="mt-4 border-t pt-3">


                <h3 className="font-semibold">
                  Tenant Details
                </h3>


                <p>
                  Name: {property.tenant?.name}
                </p>


                <p>
                  Email: {property.tenant?.email}
                </p>


                <p>
                  Phone: {property.tenant?.phone}
                </p>


                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                  Rented
                </span>


              </div>


            </div>


          ))
        }


        </div>


      </div>


    </div>

  );
};


export default AssignedTenants;