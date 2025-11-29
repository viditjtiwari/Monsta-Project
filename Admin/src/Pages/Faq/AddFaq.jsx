import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Breadcrumb from "../../common/Breadcrumb";

import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddFaq() {

  const params = useParams();
  const [updatedId, setUpdatedId] = useState('');
  const [faqDetails, setFaqDetails] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id != '' && params.id != undefined) {
      setUpdatedId(params.id);

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_FAQ_URL}details/${params.id}`)
        .then((result) => {
          if (result.data.status == true) {
            setFaqDetails(result.data.data);
          } else {
            setFaqDetails('');
          }
        })
        .catch(() => {
          toast.error("Something went wrong!!")
        });
    }
  }, [params])

  const formHandler = (event) => {
    event.preventDefault();

    if (!updatedId) {
      //Add FAQ

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_FAQ_URL}create`, event.target)
        .then((result) => {
          if (result.data.status == true) {

            toast.success(result.data.message);
            event.target.reset();
            navigate("/faq/view");
          }
          else {

            toast.error(result.data.message);
          }
        })
        .catch(() => {
          toast.error("Something went wrong!!");
        })

    } else {
      //Update FAQ

      axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_FAQ_URL}update/${params.id}`, event.target)
        .then((result) => {
          if (result.data.status == true) {

            toast.success(result.data.message);
            event.target.reset();
            navigate("/faq/view");
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
              <Link to={"/faq/view"} className="ms-1 text-md font-medium text-gray-700 hover:text-blue-600 md:ms-2">Faq</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              /
              <span className="ms-1 text-md font-medium text-gray-500 md:ms-2">{updatedId ? "Update" : "Add"}</span>
            </div>
          </li>
        </ol>
      </nav>
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updatedId ? "Update Faq" : "Add Faq"}
          </h3>
          <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">

            <div className="">
              <div className="mb-5">
                <label
                  htmlFor="Question"
                  className="block mb-2 text-md font-medium text-gray-900"
                >
                  Question
                </label>
                <input
                  type="text"
                  defaultValue={faqDetails.question}
                  name="question"
                  id="Question"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="Question"
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="Answer"
                  className="block mb-2 text-md font-medium text-gray-900"
                >
                  Answer
                </label>
                <textarea
                  name="answer"
                  id="Answer"
                  defaultValue={faqDetails.answer}
                  className="text-[19px] h-[150px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="Answer"
                ></textarea>
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
                  name="order"
                  defaultValue={faqDetails.order}
                  id="order"
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="Order"
                />
              </div>
            </div>

            <button
              type="submit"
              className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {updatedId ? "Update Faq" : "Add Faq"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
