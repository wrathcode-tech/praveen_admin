import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import moment from "moment";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

const TradingReport = () => {
    const [tradingReport, setTradingReport] = useState([]);
    const [allData, setAllData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [totalData,setTotalData] = useState()


    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const pageCount = totalData/itemsPerPage

    const skip = (currentPage - 1) * itemsPerPage;

    const userIdFollow = (row) => {
        return (
          row.userId
        );
      };
    
    

    const columns = [
        { name: "Sr No.", wrap: true, selector: (row, index) => skip + 1 + index, },
        { name: "Date/Time",wrap: true,  selector: row => moment(row?.updatedAt).format("DD/MM/YYYY, h:mm:ss A"), },
        { name: "Order Id", wrap: true, selector: row => row?.order_id },
        { name: "User Id", wrap: true, selector: userIdFollow },
        { name: "User Email", wrap: true, selector: row => row?.user_email, },
        { name: <div style={{whiteSpace:"revert"}}>User Contact No.</div>, wrap: true, selector: row => row?.user_mobileNumber, },
        { name: "Currency", selector: row => row?.main_currency, },
        { name: "Order Type", selector: row => row?.order_type, },
        { name: "Fee", wrap: true, selector: row => parseFloat(row?.fee?.toFixed(8)),sortable: true },
        { name: "Price", wrap: true, selector: row => row?.price ,sortable: true },
        { name: "Quantity", wrap: true, selector: row => parseFloat(row?.quantity?.toFixed(8)),sortable: true },
        { name: "Total", wrap: true, selector: row => parseFloat((row?.quantity * row?.price)?.toFixed(8)),sortable: true },
        { name: "Side", selector: row => row?.side, },
        { name: "TDS", wrap: true, selector: row => row?.tds,sortable: true },
    ];

    useEffect(() => {
        handleTradingReport(skip, 100)
    }, [currentPage, skip]);

    const handleTradingReport = async (skip, limit) => {
        LoaderHelper.loaderStatus(true);
        await AuthService.tradeHistory(skip, limit).then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    setTradingReport(result?.data);
                    setTotalData(result?.totalCount)
                    setAllData(result?.data);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result?.message);
            }
        });
    };
    function handleSearch(e) {
        const keysToSearch = ["order_id", "main_currency", "order_type", "fee", "price", "quantity", "user_mobileNumber", "user_email" ];
        const searchTerm = e.target.value?.toLowerCase();
        const matchingObjects = allData?.filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
        setTradingReport(matchingObjects);
    }

        return (
        <div id="layoutSidenav_content">
            <main>
                <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                    <div className="container-xl px-4">
                        <div className="page-header-content pt-4">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto mt-4">
                                    <h1 className="page-header-title">
                                        <div className="page-header-icon"><i className="far fa-user"></i></div>
                                        Trading History
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div className="card-header">
                            Trading Details
                            <div className="col-5">
                                <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={handleSearch} />
                            </div>
                            {tradingReport.length === 0 ? "" :
                            <div className="dropdown">
                                <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Export{" "}
                                </button>
                                <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                                    <CSVLink data={tradingReport} className="dropdown-item">Export as CSV</CSVLink>
                                </div>
                            </div>}
                        </div>
                        <div className="table-responsive" width="100%">
                            <DataTableBase columns={columns} data={tradingReport} pagination={false} />
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
    )
}

export default TradingReport;