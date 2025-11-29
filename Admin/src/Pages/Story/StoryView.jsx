
import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import { Link } from 'react-router-dom';
import { MdFilterAltOff, MdModeEdit, MdModeEditOutline } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic-light-dark.css';

export default function StoryView() {

    let [activeFilter, setactiveFilter] = useState(true);
    const [whyChooseUs, setWhyChooseUs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchName, setSearchName] = useState('');
    const [checkbox, setCheckbox] = useState([]);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [APIStatus, setAPIStatus] = useState(true);
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        axios.post(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_WHYCHOOSEUS_URL}view`, {
            page: currentPage,
            limit: 10,
            name: searchName,
        })
            .then((result) => {
                if (result.data.status == true) {
                    setWhyChooseUs(result.data.data)
                    setImageUrl(result.data.image_path)
                    setTotalPages(result.data.paginate.total_pages);
                } else {
                    setWhyChooseUs([]);
                }
            })
            .catch(() => {
                toast.error("Something went wrong!!")
                setTotalPages(1);
            })
    }, [currentPage, searchName, APIStatus]);

    const searchHandler = (e) => {
        setCurrentPage(1);
        e.preventDefault();
        setSearchName(e.target.name.value);
    }

    const filterName = (e) => {
        setSearchName(e.target.value);
    }

    const singleCheckBox = (v) => {
        const checkValue = checkbox.filter((value, index) => {
            if (value == v) {
                return v
            }
        })

        if (checkValue.length > 0) {
            const finalValue = checkbox.filter((value, index) => {
                if (v != value) {
                    return v
                }
            });
            setCheckbox([...finalValue]);

            if (finalValue.length > 0) {
                setBtnDisabled(false);
            } else {
                setBtnDisabled(true)
            }

        } else {
            var data = [...checkbox, v];
            setCheckbox(data);

            if (data.length > 0) {
                setBtnDisabled(false);
            } else {
                setBtnDisabled(true)
            }
        }
    };

    const allCheckBox = () => {
        if (checkbox.length == whyChooseUs.length) {
            setCheckbox([])
            setBtnDisabled(true)
        } else {
            setCheckbox([]);

            const finalData = whyChooseUs.map((v) => {
                return v._id;
            });
            setCheckbox([...finalData]);
            setBtnDisabled(false)
        }
    }
    const changeStatus = () => {
        axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_WHYCHOOSEUS_URL}change-status`, {
            ids: checkbox
        })
            .then((result) => {
                if (result.data.status == true) {
                    toast.success(result.data.message);
                    setAPIStatus(!APIStatus);
                    setCheckbox([]);
                    setBtnDisabled(true);
                } else {
                    toast.error(result.data.message);
                }
            })
            .catch(() => {
                toast.error("Something went wrong!!")
            })
    }

    const deleteRecord = () => {
        axios.put(`${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_WHYCHOOSEUS_URL}delete`, {
            ids: checkbox
        })
            .then((result) => {
                if (result.data.status == true) {
                    toast.success(result.data.message);
                    setAPIStatus(!APIStatus);
                    setCheckbox([]);
                    setBtnDisabled(true);
                } else {
                    toast.error(result.data.message);
                }
            })
            .catch(() => {
                toast.error("Something went wrong!!");
            })
    }


    return (
        <section className="w-full">

            <Breadcrumb path={"Why Choose Us"} link={'/why-choose-us/view'} path2={"View"} slash={"/"} />

            <div className={` rounded-lg border border-gray-300 px-5 py-5 max-w-[1220px] mx-auto mt-10 ${activeFilter ? "hidden" : "block"}`}>

                <form className="flex max-w-sm" onSubmit={searchHandler}>
                    <div className="relative w-full">
                        <input
                            type="text"
                            id="simple-search"
                            onKeyUp={filterName}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-2 p-2.5"
                            placeholder="Search Name"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </form>


            </div>
            <div className="w-full min-h-[610px]">
                <div className="max-w-[1220px] mx-auto py-5">
                    <div className='flex item-center justify-between bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400'>
                        <h3 className="text-[26px] font-semibold" >
                            View Why Choose Us
                        </h3>
                        <div className='flex justify-between '>
                            <div onClick={() => setactiveFilter(!activeFilter)} className="cursor-pointer text-[white] mx-3 rounded-[50%] w-[40px] h-[40px]  mx-3 rounded-[50%] w-[40px] h-[40px] flex items-center justify-center  text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                {activeFilter ? <FaFilter className='text-[18px]' /> : <MdFilterAltOff className='text-[18px]' />}
                            </div>
                            <button
                                disabled={btnDisabled == true ? "disabled" : ""}
                                onClick={changeStatus}
                                type="button"
                                className={btnDisabled == true ? "text-white bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" : "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"}> Change Status</button>

                            <button
                                disabled={btnDisabled == true ? "disabled" : ""}
                                onClick={deleteRecord}
                                type="button"
                                className={btnDisabled == true ? "text-white bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2" : "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"}>Delete </button>
                        </div>
                    </div>
                    <div className="border border-t-0 rounded-b-md border-slate-400">
                        {/* border-2 border-[red] */}
                        <div className="relative overflow-x-auto">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="p-4">
                                                <div className="flex items-center">
                                                    <input
                                                        onClick={allCheckBox}
                                                        checked={checkbox.length == whyChooseUs.length ? 'checked' : ""}
                                                        readOnly
                                                        id="checkbox-all-search"
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2" />
                                                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                                </div>
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Title
                                            </th>
                                            <th scope="col" className=" w-[10%] ">
                                                Image
                                            </th>
                                            <th scope="col" className=" w-[20%] ">
                                                Description
                                            </th>
                                            <th scope="col" className=" w-[8%] ">
                                                Order
                                            </th>
                                            <th scope="col" className="w-[11%]">
                                                Status
                                            </th>
                                            <th scope="col" className="w-[6%]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            whyChooseUs.length > 0
                                                ?

                                                whyChooseUs.map((v, i) => {
                                                    return (
                                                        <tr className="bg-white border-gray-200 hover:bg-gray-50" key={i}>
                                                            <td className="w-4 p-4">
                                                                <div className="flex items-center">
                                                                    <input
                                                                        id="checkbox-table-search-1"
                                                                        onClick={() => singleCheckBox(v._id)}
                                                                        checked={checkbox.includes(v._id) ? "checked" : ""}
                                                                        readOnly
                                                                        type="checkbox"
                                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2" />
                                                                    <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                                                </div>
                                                            </td>
                                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                                                <div className="py-4">
                                                                    <div className="text-base font-semibold">{v.name}</div>
                                                                </div>
                                                            </th>
                                                            <td className=" py-4">
                                                                <img className="w-10 h-10 rounded-full" src={`${imageUrl}${v.image}`} alt="Jese image" />
                                                            </td>
                                                            <td className=" py-4">
                                                                {v.description}
                                                            </td>
                                                            <td className=" py-4">
                                                                {v.order}
                                                            </td>
                                                            <td className=" py-4">
                                                                {
                                                                    v.status == 1
                                                                        ?
                                                                        <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">Active</button>
                                                                        :
                                                                        <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center me-2 mb-2">Deactive</button>
                                                                }
                                                            </td>
                                                            <td className=" py-4">

                                                                <Link to={`/why-choose-us/update/${v._id}`} >
                                                                    <div className="rounded-[50%] w-[40px] h-[40px] flex items-center justify-center text-white bg-blue-700  border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                                                        <MdModeEdit className='text-[18px]' />
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                })

                                                :
                                                <tr className="bg-white border-gray-200 hover:bg-gray-50">
                                                    <th colSpan={7} className="text-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                                        <div className="py-4">
                                                            <div className="text-base font-semibold">No Record Found!!</div>
                                                        </div>
                                                    </th>
                                                </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <ResponsivePagination
                    current={currentPage}
                    total={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </section >
    )
}
