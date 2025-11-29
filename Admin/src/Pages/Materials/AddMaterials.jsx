
import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Addmaterials() {

  const [materialDetails, setMaterialDetails] = useState('')
  const [updateId, setUpdateId] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.id != '' && params.id != undefined) {
      setUpdateId(params.id);

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_MATERIAL_URL}details/${params.id}`)
        .then((result) => {
          if (result.data.status == true) {
            setMaterialDetails(result.data.data);
          } else {
            setMaterialDetails('');
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

    if (!updateId) {
      //Add Materials

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_MATERIAL_URL}create`, formData)
        .then((result) => {
          if (result.data.status == true) {

            toast.success(result.data.message);
            event.target.reset();
            navigate("/material/view");
          }
          else {
            toast.error(result.data.message);
          }
        })
        .catch(() => {
          toast.error("Something went wrong!!");
        })

    } else {
      //Update Materials

      axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_MATERIAL_URL}update/${params.id}`, formData)
        .then((result) => {
          if (result.data.status == true) {
            toast.success(result.data.message);
            event.target.reset();
            navigate("/material/view");
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
      <Breadcrumb path={"Material"} path2={updateId ? "Update" : "Add"} slash={"/"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateId ? "Update Material" : "Add Material"}
          </h3>
          <form onSubmit={formHandler } autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">

            <div className="">
              <div className="mb-5">
                <label
                  htmlFor="Name"
                  className="block  text-md font-medium text-gray-900"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="Name"
                  name="name"
                  defaultValue={materialDetails.name}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="Material Name"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="order"
                  className="block  text-md font-medium text-gray-900"
                >
                  Order
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  defaultValue={materialDetails.order}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="Order"
                />
              </div>
            </div>

            <button
              type="submit"
              className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {updateId ? "Update Material" : "Add Material"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
