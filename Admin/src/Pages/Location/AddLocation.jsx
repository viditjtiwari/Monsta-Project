

import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddLocation() {
  // useEffect(() => {
  //   $(".dropify").dropify({
  //     messages: {
  //       default: "Drag and drop ",
  //       replace: "Drag and drop ",
  //       remove: "Remove",
  //       error: "Oops, something went wrong"
  //     }
  //   });
  // }, []);

  const [updateIdState, setUpdateIdState] = useState(false)
  const [countryDetails, setCountryDetails] = useState('')
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(params.id != '' && params.id != undefined){
      setUpdateIdState(params.id);

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_COUNTRY_URL}details/${params.id}`)
        .then((result) => {
          if (result.data.status == true) {
            setCountryDetails(result.data.data);
          } else {
            setCountryDetails('');
          }
        })
        .catch(() => {
          toast.error("Something went wrong!!")
        });
    }
  }, [params]);

  const formHandler = (event) => {
    event.preventDefault();

    const formData = {
      name: event.target.name.value,
      order: event.target.order.value,
    }

    if (!updateIdState) {
      //Add Country

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_COUNTRY_URL}create`, formData)
        .then((result) => {
          if (result.data.status == true) {
            toast.success(result.data.message);
            event.target.reset();
            navigate("/country/view");
          }
          else {
            toast.error(result.data.message);
          }
        })
        .catch(() => {
          toast.error("Something went wrong!!");
        })

    } else {
      //Update Country

      axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_COUNTRY_URL}update/${params.id}`, formData)
        .then((result) => {
          if (result.data.status == true) {
            toast.success(result.data.message);
            event.target.reset();
            navigate("/country/view");
          }
          else {
            toast.error(result.data.message);
          }
        })
        .catch(() => {
          toast.error("Something went wrong!!");
        })
    }
  }

  return (
    <section className="w-full">
      <nav className="flex border-b-2" aria-label="Breadcrumb">
        <ol className="p-3 px-6 inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center ">
            <Link to={"/home"} className="inline-flex items-center text-md font-medium text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              /
              <Link to={"/country/view"} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Country</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              /
              <span className="ms-1 text-md font-medium text-gray-500 md:ms-2"> {updateIdState ? "Update" : "Add"}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateIdState ? "Update Country" : "Add Country"}
          </h3>
          <form autoComplete="off" onSubmit={formHandler} className="border border-t-0 p-3 rounded-b-md border-slate-400">

            <div className="">
              <div className="mb-5">
                <label
                  htmlFor="Country"
                  className="block mb-2 text-md font-medium text-gray-900">
                  Country Name
                </label>
                <input
                  type="text"
                  id="Country"
                  name="name"
                  defaultValue={countryDetails.name}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="Country Name"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="order"
                  className="block mb-2 text-md font-medium text-gray-900"
                >
                  Order
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  defaultValue={countryDetails.order}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="Order"
                />
              </div>
            </div>

            <button
              type="submit"
              className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {updateIdState ? "Update Country" : "Add Country"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
