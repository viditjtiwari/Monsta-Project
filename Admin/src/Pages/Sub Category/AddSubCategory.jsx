import React, { useEffect, useState } from "react";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import Breadcrumb from "../../common/Breadcrumb";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddSubCategory() {

  const [categories, setCategories] = useState([]);
  const [imageURL, setImageUrl] = useState('');
  const [updateIdState, setUpdateIdState] = useState(false);
  const [subCategoryDetails, setSubCategoryDetails] = useState('')
  const [parentCategoryId, setParentCategoryId] = useState('')
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SUB_CATEGORY_URL}view-category`,{
      id : parentCategoryId,
    })
      .then((result) => {
        if (result.data.status == true) {
          setCategories(result.data.data)
        } else {
          setCategories([]);
        }
      })
      .catch(() => {
        toast.error("Something went wrong!!")
        setTotalPages(1);
      })
  }, [parentCategoryId]);

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

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SUB_CATEGORY_URL}details/${params.id}`)
        .then((result) => {
          if (result.data.status == true) {
            setSubCategoryDetails(result.data.data);
            setParentCategoryId(result.data.data.parent_category)
            if (result.data.data.image != '') {
              setImageUrl(`${result.data.image_path}${result.data.data.image}`)
            }
          } else {
            setSubCategoryDetails('');
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
      //Add Sub Category

      axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SUB_CATEGORY_URL}create`, event.target)
        .then((result) => {
          if (result.data.status == true) {

            toast.success(result.data.message);
            event.target.reset();
            navigate("/category/sub-category/view");
          }
          else {
            toast.error(result.data.message);
          }
        })
        .catch(() => {
          toast.error("Something went wrong!!");
        })

    } else {
      //Update Sub Category

      axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_SUB_CATEGORY_URL}update/${params.id}`, event.target)
        .then((result) => {
          if (result.data.status == true) {
            toast.success(result.data.message);
            event.target.reset();
            navigate("/category/sub-category/view");
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

  console.log(categories)
  console.log(parentCategoryId)

  return (
    <section className="w-full">
      <Breadcrumb path={"Sub Category"} link={'/category/sub-category/view'} path2={"Add"} slash={"/"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1220px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {updateIdState ? "Update Sub Category" : "Add Sub Category"}
          </h3>
          <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">
            <div className="flex gap-5">
              <div className="w-1/3">
                <label
                  htmlFor="categoryImage"
                  className="block  text-md font-medium text-gray-900"
                >
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="image"
                  className="dropify"
                  data-height="230"
                />
              </div>

              <div className="w-2/3">
                {/* Parent Category Dropdown */}
                <div className="mb-5">
                  <label className="block  text-md font-medium text-gray-900">
                    Parent Category Name
                  </label>
                  <select
                    name="parent_category"
                    className="border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  >
                    <option value="">Select Category</option>
                    {
                      categories.map((v, i) => {
                        return (
                          <option key={i} selected={v._id == subCategoryDetails.parent_category ? "selected" : ""} value={v._id}>{v.name}</option>
                        )
                      })
                    }
                  </select>
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="categoryName"
                    className="block  text-md font-medium text-gray-900"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    defaultValue={subCategoryDetails.name}
                    name="name"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Category Name"
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="categoryName"
                    className="block  text-md font-medium text-gray-900"
                  >
                    Order
                  </label>
                  <input
                    type="text"
                    id="categoryOrder"
                    defaultValue={subCategoryDetails.order}
                    name="order"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                    placeholder="Category Order"
                  />
                </div>

              </div>


            </div>
            <button
              type="submit"
              className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              {updateIdState ? "Update Sub Category" : "Add Sub Category"}
            </button>
          </form>


        </div>
      </div>
    </section>
  );
}
