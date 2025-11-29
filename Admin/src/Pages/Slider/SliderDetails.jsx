import React, { useEffect, useState } from "react";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function SliderDetails() {

  const [imageURL, setImageUrl] = useState('');
  const [updateIdState, setUpdateIdState] = useState(false);
  const [sliderDetails, setSliderDetails] = useState('');
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const dropifyElement = $("#image");

    if (dropifyElement.data("dropify")) {
      dropifyElement.data("dropify").destroy();
      dropifyElement.removeData("dropify");
    }

    // **Force Update Dropify Input**
    dropifyElement.replaceWith(
      `<input type="file" accept="image/*" name="image" id="image"
            class="dropify" data-height="250" data-default-file="${imageURL}"/>`
    );

    // **Reinitialize Dropify**
    $("#image").dropify();

  }, [imageURL]); // ✅ Runs when `defaultImage` updates

  useEffect(() => {
    if (params.id != '' && params.id != undefined) {
      setUpdateIdState(params.id);

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SLIDER_URL}details/${params.id}`)
        .then((result) => {
          if (result.data.status == true) {
            setSliderDetails(result.data.data);
            if (result.data.data.image != '') {
              setImageUrl(`${result.data.image_path}${result.data.data.image}`)
            }
          } else {
            setSliderDetails('');
          }
        })
        .catch(() => {
          toast.error("Something went wrong!!")
        });
    }
  }, [params])

  const formHandler = (event) => {
    event.preventDefault();

    if (!updateIdState) {
      //Add Slider

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SLIDER_URL}create`, event.target)
        .then((result) => {
          if (result.data.status == true) {

            toast.success(result.data.message);
            event.target.reset();
            navigate("/slider/view");
          }
          else {
            toast.error(result.data.message);
          }
        })
        .catch(() => {
          toast.error("Something went wrong!!");
        })

    } else {
      //Update Parent Slider

      axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SLIDER_URL}update/${params.id}`, event.target)
        .then((result) => {
          if (result.data.status == true) {
            toast.success(result.data.message);
            event.target.reset();
            navigate("/slider/view");
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
              <Link to={"/slider/view"} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Slider</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              /
              <span className="ms-1 text-md font-medium text-gray-500 md:ms-2">Add</span>
            </div>
          </li>
        </ol>
      </nav>


      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateIdState ? "Update Silder" : "Add Slider"}
          </h3>
          <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">
            <div className="flex gap-5">
              <div className="w-1/3">
                <label className="block mb-2 text-md font-medium text-gray-900">
                  Choose Image
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="dropify"
                  data-height="250"
                />
              </div>
              <div className="w-2/3">
                <div className="mb-5">
                  <label
                    htmlFor="Title"
                    className="block mb-2 text-md font-medium text-gray-900"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="Title"
                    defaultValue={sliderDetails.name}
                    name="name"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Title"
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
                    defaultValue={sliderDetails.order}
                    name="order"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Order"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {updateIdState ? "Update Slider" : "Add Slider"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
