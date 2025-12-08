import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import moment from "moment";
import ReactPaginate from "react-paginate";


const HomePage = () => {
    const userType = sessionStorage.getItem('userType');
    const myPermission = sessionStorage.getItem('permissions');
    let permissions = Array.isArray(JSON.parse(myPermission)) ? JSON.parse(myPermission)?.map(x => x.value) : [];
    const [totalUser, setTotalUser] = useState("");

    const [activity, setActivity] = useState([]);
    // custom pagination /
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalData, setTotalData] = useState()


    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const pageCount = totalData / itemsPerPage

    const skip = (currentPage - 1) * itemsPerPage;

    useEffect(() => {
        activityLogs(skip, itemsPerPage);
    }, [currentPage, skip]);



    const totaluserData = async () => {
        LoaderHelper.loaderStatus(true)
        await AuthService.getstats().then(async result => {
            if (result?.success) {
                setTotalUser(result?.data);
            } else {
                alertErrorMessage(result);
            }
        })
        LoaderHelper.loaderStatus(false)
    }




    const activityLogs = async (startIndex, endIndex) => {
        LoaderHelper.loaderStatus(true)
        await AuthService.getMyActivityLogs(startIndex, endIndex).then(async result => {
            if (result?.success) {
                setActivity(result?.data)
                setTotalData(result.total_count)
            } else {
                alertErrorMessage(result?.message);
            }
        });
        LoaderHelper.loaderStatus(false)
    };



    useEffect(() => {
        totaluserData();
    }, []);


    const settings = {
        dots: true,
        arrow: false,
        infinite: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };


    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <header className="page-header dark_yellow page-header-dark bg-gradient-primary-to-secondary pb-10">
                        <div className="container-xl px-4">
                            <div className="page-header-content pt-4">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-auto mt-4">
                                        <h1 className="page-header-title">
                                            <div className="page-header-icon"><i className="fa fa-th" ></i></div>
                                            Dashboard
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-0 mt-n10">
                        <div className="row">
                            <div className="ag-format-container">
                                <Slider {...settings}>


                                    {(userType === '1' || permissions?.includes(2)) && (
                                        <div className="ag-courses_item">
                                            <Link to="/dashboard/todayRegistration" className="ag-courses-item_link">
                                                {/* <div className="ag-courses-item_bg"></div> */}
                                                <div className="totaluser_icon">
                                                    <img src="/assets/img/timer_icon.svg" className="img-fluid" alt="" />
                                                </div>
                                                <div className="ag-courses-item_title">Today's New Registrations</div>
                                                <div className="ag-courses-item_date-box">
                                                    <span className="ag-courses-item_date font-xl">
                                                        {totalUser?.userStats?.todayNewUsers}
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {(userType === '1' || permissions?.includes(3)) && (
                                        <div className="ag-courses_item">
                                            <Link to={userType === '1' ? "/dashboard/pendingkyc" : ""} className="ag-courses-item_link">
                                                {/* <div className="ag-courses-item_bg"></div> */}
                                                <div className="totaluser_icon">
                                                    <img src="/assets/img/timer_icon.svg" className="img-fluid" alt="" />
                                                </div>
                                                <div className="ag-courses-item_title">Total Pending Kyc's</div>
                                                <div className="ag-courses-item_date-box">
                                                    <span className="ag-courses-item_date font-xl">
                                                        {totalUser?.userStats?.pendingKYC}
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {(userType === '1' || permissions?.includes(3)) && (
                                        <div className="ag-courses_item">
                                            <Link to={userType === '1' ? "/dashboard/approvedkyc" : ""} className="ag-courses-item_link">
                                                {/* <div className="ag-courses-item_bg"></div> */}
                                                <div className="totaluser_icon">
                                                    <img src="/assets/img/timer_icon.svg" className="img-fluid" alt="" />
                                                </div>
                                                <div className="ag-courses-item_title">Total Verified Users</div>
                                                <div className="ag-courses-item_date-box">
                                                    <h4 className="ag-courses-item_date font-xl">
                                                        {totalUser?.userStats?.approvedKYC}
                                                    </h4>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {(userType === '1' || permissions?.includes(2)) && (
                                        <div className="ag-courses_item">
                                            <Link to="/dashboard/tradelist" className="ag-courses-item_link">
                                                {/* <div className="ag-courses-item_bg"></div> */}
                                                <div className="totaluser_icon">
                                                    <img src="/assets/img/timer_icon.svg" className="img-fluid" alt="" />
                                                </div>
                                                <div className="ag-courses-item_title">Total Users</div>
                                                <div className="ag-courses-item_date-box">
                                                    <h4 className="ag-courses-item_date font-xl">
                                                        {totalUser?.userStats?.totalUsers}
                                                    </h4>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                  
                               
                                </Slider>
                            </div>
                        </div>



                        <div className="dashboard_summary mt-5">
                            <h2>Recent Login</h2>

                            <div className="table-container">
                                <div class="table-wrapper">
                                    <table class="custom-table">
                                        <thead>
                                            <tr>
                                                <th>Sr no.</th>
                                                <th>Login Time</th>
                                                <th>IP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activity?.length > 0 ? activity?.map((activityItem, index) => {
                                                return (
                                                    <tr>

                                                        <td>{skip+index + 1}</td>
                                                        <td> {moment(activityItem?.date).format(
                                                            "MMMM Do YYYY, h:mm:ss a"
                                                        )}</td>
                                                        <td>{activityItem?.adminIP}</td>

                                                    </tr>
                                                )
                                            }) : ""}


                                        </tbody>
                                    </table>
                                    {totalData > 5 ?
                                        <ReactPaginate
                                            pageCount={pageCount}
                                            onPageChange={handlePageChange}
                                            containerClassName={'customPagination'}
                                            activeClassName={'active'}
                                        />
                                        : ""}

                                </div>
                            </div>


                        </div>

                    </div>
                </main>
            </div >
        </>
    )
}
export default HomePage;