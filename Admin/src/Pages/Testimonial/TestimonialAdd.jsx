import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Breadcrumb from "../../common/Breadcrumb";
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function TestimonialAdd() {

    const [imageURL, setImageUrl] = useState('');
    const [updateIdState, setUpdateIdState] = useState(false);
    const [testimonialDetails, setTestimonialDetails] = useState('');
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

            axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_TESTIMONIAL_URL}details/${params.id}`)
                .then((result) => {
                    if (result.data.status == true) {
                        setTestimonialDetails(result.data.data);
                        if (result.data.data.image != '') {
                            setImageUrl(`${result.data.image_path}${result.data.data.image}`)
                        }
                    } else {
                        setTestimonialDetails('');
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

            axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_TESTIMONIAL_URL}create`, event.target)
                .then((result) => {
                    if (result.data.status == true) {

                        toast.success(result.data.message);
                        event.target.reset();
                        navigate("/testimonial/view");
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

            axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_TESTIMONIAL_URL}update/${params.id}`, event.target)
                .then((result) => {
                    if (result.data.status == true) {
                        toast.success(result.data.message);
                        event.target.reset();
                        navigate("/testimonial/view");
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
            <Breadcrumb path={"Category"} path2={updateIdState ? "Update" : "Add"} slash={"/"} />
            <div className="w-full min-h-[610px]">
                <div className="max-w-[1220px] mx-auto py-5">
                    <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
                        {updateIdState ? "Update Testimonial" : "Add Testimonial"}
                    </h3>
                    <form onSubmit={formHandler} autoComplete="off" className="border border-t-0 p-3 rounded-b-md border-slate-400">
                        <div className="flex gap-5">
                            <div className="w-1/3">
                                <label

                                    className="block  text-md font-medium text-gray-900"
                                >
                                    Choose Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    className="dropify"
                                    data-height="250"
                                />
                            </div>
                            <div className="w-2/3">
                                <div className="mb-5">
                                    <label
                                        htmlFor="Title"
                                        className="block mb-1 text-md font-medium text-gray-900"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="Name"
                                        defaultValue={testimonialDetails.name}
                                        name="name"
                                        className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                                        placeholder="Name"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label
                                        htmlFor="Designation"
                                        className="block mb-1 text-md font-medium text-gray-900"
                                    >
                                        Designation
                                    </label>
                                    <input
                                        type="text"
                                        id="Designation"
                                        defaultValue={testimonialDetails.desigation}
                                        name="designation"
                                        className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                                        placeholder="Designation"
                                    />
                                </div>

                                <div className="mb-5">
                                    <label
                                        htmlFor="Rating"
                                        className="block mb-1 text-md font-medium text-gray-900"
                                    >
                                        Rating
                                    </label>
                                    <input
                                        type="number"
                                        id="Rating"
                                        defaultValue={testimonialDetails.rating}
                                        name="rating"
                                        className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                                        placeholder="Rating"
                                    />
                                </div>

                                <div className="mb-5">
                                    <label
                                        htmlFor="Order"
                                        className="block mb-1 text-md font-medium text-gray-900"
                                    >
                                        Order
                                    </label>
                                    <input
                                        type="number"
                                        id="Order"
                                        name="order"
                                        defaultValue={testimonialDetails.order}
                                        className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                                        placeholder="Order"
                                    />
                                </div>

                                <div className="mb-5">
                                    <label
                                        htmlFor="Message"
                                        className="block mb-1 text-md font-medium text-gray-900"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="Message"
                                        name="message"
                                        defaultValue={testimonialDetails.message}
                                        className="text-[19px] resize-none h-[100px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                                        placeholder="Message"
                                    > </textarea>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="focus:outline-none my-5 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            {updateIdState ? "Update Testimonial" : "Add Testimonial"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
