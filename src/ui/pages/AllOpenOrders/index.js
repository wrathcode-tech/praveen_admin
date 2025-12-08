import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage} from "../../../customComponent/CustomAlertMessage";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import moment from "moment";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from 'react-paginate';

const AllOpenOrders = () => {
    const [openOrderDetails, setOpenOrderDetails] = useState([])
    const [allData, setAllData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [totalData,setTotalData] = useState()
    const [dataToShow, setDataToShow] = useState([]);

    let startIndex;
    let endIndex;

    useEffect(() => {
         startIndex = (currentPage-1) * itemsPerPage;
         endIndex = Math.min(startIndex + itemsPerPage, openOrderDetails.length);
        const newDataToShow = openOrderDetails.slice(startIndex, endIndex);  
        setDataToShow(newDataToShow);
      }, [currentPage, itemsPerPage, openOrderDetails]);

   

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const pageCount = Math.ceil(openOrderDetails.length/itemsPerPage)

    const handleItemsPerPageChange = (e) => { 
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); 
    };
    const linkFollow = (row) => {
        return (row?.filled && parseFloat(row?.filled?.toFixed(8)));
    };

    const statuslinkFollow = (row) => {
        return (
            <div>
                    <button className="btn btn-danger btn-sm me-2" onClick={() => { handleStatus(row?._id, row?.user_id) }}>Cancel Order</button>
            </div>
        );
    };

   
    const columns = [
        { name: "Sr No.", wrap: true, selector: (row, index) => 1 + index, },
        { name: "Date/Time", wrap: true, selector: row => moment(row?.updatedAt).format("DD/MM/YYYY h:mm:ss A"), },
        { name: "Order Id", wrap: true, selector: row => row._id, },
        { name: "User Email", wrap: true, selector: row => row.user_email, },
        { name: <div style={{whiteSpace:"revert"}}>User Contact No.</div>, wrap: true, selector: row => row.user_mobileNumber, },
        { name: "Ask Currency", selector: row => row.ask_currency, },
        { name: "Pay Currency", selector: row => row.pay_currency, },
        { name: "Order Type", wrap: true, selector: row => row.order_type, },
        { name: "Filled", wrap: true, selector: linkFollow, sortable: true },
        { name: <div style={{whiteSpace:"revert"}}>Maker Fee</div>, wrap: true, selector: row => row.maker_fee,sortable: true },
        { name: "Taker Fee", wrap: true, selector: row => row.taker_fee,sortable: true },
        { name: "Price", wrap: true, selector: row =>  parseFloat(row?.price?.toFixed(8)),sortable: true },
        { name: <div style={{whiteSpace:"revert"}}>Remaining</div>, wrap: true, selector: row => parseFloat(row?.remaining?.toFixed(8)) ,sortable: true},
        { name: "Total", wrap: true, selector: row => parseFloat((row?.quantity * row?.price)?.toFixed(8)),sortable: true },
        { name: "Side", selector: row => row.side, },
        { name: 'Action', selector: statuslinkFollow, wrap: true, grow:1.5},
    ]



    useEffect(() => {
        HandleOpenOrder()
    }, []);

    const HandleOpenOrder = async () => {
        LoaderHelper.loaderStatus(true);
        await AuthService.OpenOrder().then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    setOpenOrderDetails(result?.data);
                    setTotalData(result?.total_count)
                    setAllData(result?.data);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
            }
        });
    };

    const handleStatus = async (id, user_id) => {
        await AuthService.OpenOrderStatus(id, user_id).then(async result => {
            if (result?.success) {
                alertSuccessMessage(result?.message);
                HandleOpenOrder();
            } else {
                alertErrorMessage(result?.message)
            }
        })
    }
    function handleSearch(e) {
        const keysToSearch = ["_id","user_id", "main_currency", "order_type", "status", "side", , "user_mobileNumber", "user_email"];
        const searchTerm = e.target.value?.toLowerCase();
        const matchingObjects = allData?.filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
        setOpenOrderDetails(matchingObjects);
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
                                            Open Orders
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="card mb-4">
                            <div className="card-header">
                                Open Order Details
                                <div className="col-5">
                                    <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={handleSearch} />
                                </div>
                                {openOrderDetails.length === 0 ? "" :
                                <div className="dropdown">
                                    <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Export{" "}
                                    </button>
                                    <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                                        <CSVLink data={openOrderDetails} className="dropdown-item">Export as CSV</CSVLink>
                                    </div>
                                </div>}
                            </div>
                            <div className="table-responsive" width="100%">
                            <DataTableBase columns={columns} data={openOrderDetails} pagination={true} />
                        </div>
                        <div className="d-flex justify-content-between">
            
                        {/* {totalData > 10 ? <ReactPaginate
                            pageCount={pageCount - 1}
                            onPageChange={handlePageChange}
                            containerClassName={'customPagination'}
                            activeClassName={'active'}
                            forcePage={currentPage - 1}
                        /> : ""} */}
                        </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default AllOpenOrders;