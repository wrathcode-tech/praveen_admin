import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import moment from "moment";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";

const OrderBook = () => {
    const [orderBookDetails, setorderBookDetails] = useState([]);
    const [allData, setAllData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [totalData, setTotalData] = useState()
    // const [dataToShow, setDataToShow] = useState([]);

    // let startIndex;
    // let endIndex;

    // useEffect(() => {
    //      startIndex = (currentPage-1) * itemsPerPage;
    //      endIndex = Math.min(startIndex + itemsPerPage, orderBookDetails.length);
    //     const newDataToShow = orderBookDetails.slice(startIndex, endIndex);  
    //     setDataToShow(newDataToShow);
    //   }, [currentPage, itemsPerPage, orderBookDetails]);



    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const pageCount = totalData / itemsPerPage

    const skip = (currentPage - 1) * itemsPerPage;

    const linkFollow = (row) => {
        return (row?.filled && parseFloat(row?.filled?.toFixed(8)));
    };


    const CancelOrder = (row) => {
        return (
            <>{(row?.status !== "FILLED" && row?.status !== "CANCELLED") ?
                <div className="d-flex">
                    <button className=" btn btn-danger btn-sm" type="button" onClick={() => HandleCancelOrder(row?._id, row?.user_id)} >
                        Cancel
                    </button>
                </div> :
                <div> ----- </div>
            }
            </>
        );
    };
    const HandleCancelOrder = async (orderID, userID) => {
        LoaderHelper.loaderStatus(true)
        await AuthService.cancelOrder(orderID, userID).then(async result => {
            LoaderHelper.loaderStatus(false)
            if (result?.success) {
                HandleOrderBook(skip, 10);
                alertSuccessMessage(result?.message)

            } else {
                alertErrorMessage(result?.message)
            }
        })
    }

    
    const userIdFollow = (row) => {
        return (
          row.user_id
        );
      };
    
    
    const columns = [
        { name: "Sr No.", wrap: true, selector: (row, index) => skip + 1 + index, },
        { name: "Date/Time", wrap: true, selector: row => moment(row?.createdAt).format("DD/MM/YYYY h:mm:ss A"), },
        { name: "Order Id", wrap: true, selector: row => row._id, },
        { name: "User Id", wrap: true, selector:userIdFollow},
        { name: "User Email", wrap: true, selector: row => row.user_email, },
        { name: "Pay Currency", selector: row => row.pay_currency, },
        { name: "Get Currency", selector: row => row.ask_currency, },
        { name: "Order Type", wrap: true, selector: row => row.order_type, },
        { name: "Filled", wrap: true, selector: linkFollow, sortable: true },
        { name: "Price", wrap: true, selector: row => parseFloat(row?.price?.toFixed(8)), sortable: true },
        { name: <div style={{ whiteSpace: "revert" }}>Remaining</div>, wrap: true, selector: row => parseFloat(row?.remaining?.toFixed(8)), sortable: true },
        { name: "Total", wrap: true, selector: row => parseFloat((row?.quantity * row?.price)?.toFixed(8)), sortable: true },
        { name: "Side", selector: row => row.side, },
        { name: "Status", selector: row => row.status, wrap: true, grow: 1.01 },
        { name: "Action", selector: CancelOrder, wrap: true },
    ]



    useEffect(() => {
        HandleOrderBook(skip, 100)
    }, [currentPage, skip]);

    const HandleOrderBook = async (skip, limit) => {
        LoaderHelper.loaderStatus(true);
        await AuthService.OrderBook(skip, limit).then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    setorderBookDetails(result?.data);
                    setTotalData(result?.totalCount)
                    setAllData(result?.data);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
            }
        });
    };
    function handleSearch(e) {
        const keysToSearch = ["_id", "user_id", "main_currency", "order_type", "status", "side",  "user_mobileNumber", "user_email"];
        const searchTerm = e.target.value?.toLowerCase();
        const matchingObjects = allData?.filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
        setorderBookDetails(matchingObjects);
    };

    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                        <div className="container-xl px-4">
                            <div className="page-header-content pt-4">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-auto mt-4">
                                        <h1 className="page-header-title">
                                            <div className="page-header-icon"><i className="far fa-user"></i></div>
                                            OrderBook
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="card mb-4">
                            <div className="card-header">
                                OrderBook Details
                                <div className="col-5">
                                    <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={handleSearch} />
                                </div>
                                {orderBookDetails.length === 0 ? "" :
                                    <div className="dropdown">
                                        <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Export{" "}
                                        </button>
                                        <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                                            <CSVLink data={orderBookDetails} className="dropdown-item">Export as CSV</CSVLink>
                                        </div>
                                    </div>}
                            </div>
                            <div className="table-responsive" width="100%">
                                <DataTableBase columns={columns} data={orderBookDetails} pagination={false} />
                            </div>

                            {totalData > 10 ? <ReactPaginate
                                pageCount={pageCount}
                                onPageChange={handlePageChange}
                                containerClassName={'customPagination'}
                                activeClassName={'active'}
                            /> : ""}
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default OrderBook;