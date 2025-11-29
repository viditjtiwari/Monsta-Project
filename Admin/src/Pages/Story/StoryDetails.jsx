
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Breadcrumb from "../../common/Breadcrumb";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function StoryDetails() {

  const [imageURL, setImageUrl] = useState('');
  const [updateIdState, setUpdateIdState] = useState(false);
  const [whyChooseUsDetails, setWhyChooseUsDetails] = useState('');
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
    if (params.id != '') {
      setUpdateIdState(params.id);

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_WHYCHOOSEUS_URL}details/${params.id}`)
        .then((result) => {
          if (result.data.status == true) {
            setWhyChooseUsDetails(result.data.data);
            if (result.data.data.image != '') {
              setImageUrl(`${result.data.image_path}${result.data.data.image}`)
            }
          } else {
            setWhyChooseUsDetails('');
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

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_WHYCHOOSEUS_URL}create`, event.target)
        .then((result) => {
          if (result.data.status == true) {

            toast.success(result.data.message);
            event.target.reset();
            navigate("/why-choose-us/view");
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

      axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_WHYCHOOSEUS_URL}update/${params.id}`, event.target)
        .then((result) => {
          if (result.data.status == true) {
            toast.success(result.data.message);
            event.target.reset();
            navigate("/why-choose-us/view");
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
            <Link href={"/home"} className="inline-flex items-center text-md font-medium text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              /
              <Link to={"/why-choose-us/view"} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Why Choose Us</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              / {updateIdState ? "Update" : "Add"}
            </div>
          </li>
        </ol>
      </nav>
      {/* <Breadcrumb path={"Why Choose Us"} path2={updateIdState ? "Update" : "Add"} link={"/why-choose-us/view"} slash={"/"} /> */}

      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateIdState ? "Update Why Choose Us" : "Add Why Choose Us"}
          </h3>
          <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">
            <div className="flex gap-5">
              <div className="w-1/3">
                <label

                  className="block mb-0 text-md font-medium text-gray-900"
                >
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
                    className="block  text-md font-medium text-gray-900"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={whyChooseUsDetails.name}
                    id="Title"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Title"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="order"
                    className="block mb-0 text-md font-medium text-gray-900"
                  >
                    Order
                  </label>
                  <input
                    type="number"
                    id="order"
                    defaultValue={whyChooseUsDetails.order}
                    name="order"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Order"
                  />
                </div>


                <div className="mb-5">
                  <label
                    htmlFor="Description"
                    className="block mb-0 text-md font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="Description"
                    defaultValue={whyChooseUsDetails.description}
                    className="text-[19px] resize-none h-[100px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Description"
                  > </textarea>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {updateIdState ? "Update Why Choose Us" : "Add Why Choose Us"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
