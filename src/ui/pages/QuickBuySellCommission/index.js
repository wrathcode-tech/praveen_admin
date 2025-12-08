
import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import { Link } from "react-router-dom";

const QuickBuySellCommission = () => {
    const [TradingCommission, setTradingCommission] = useState([]);
    const [allData, setallData] = useState([]);

    const userIdFollow = (row) => {
        return (
          row.userId
        );
      };
    
    
    const columns = [
        { name: "Sr No.", wrap: true, selector: (row, index) => 1 + index, },
        { name: "Date", selector: row => moment(row?.createdAt).format("MMM Do YYYY hh:mm "), wrap: true },
        { name: "User ID", wrap: true, selector: userIdFollow },
        { name: "Pay Amount", wrap: true, selector: row => `${row.pay_amount} ${row.from} `, },
        { name: "Get Amount", wrap: true, selector: row => `${row.get_amount} ${row.to} `, },
        { name: "Fee", wrap: true, selector: row => row.fee, },
        { name: "Percentage", wrap: true, selector: row => row.fee_percentage, },
    ];

    function handleSearch(e) {
        const keysToSearch = ["userId", "pay_amount", "get_amount", "from", "to", "fee"];
        const searchTerm = e.target.value?.toLowerCase();
        const matchingObjects = allData?.filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
        setTradingCommission(matchingObjects);
    };

    useEffect(() => {
        tradingCommission();
    }, []);

    const tradingCommission = async () => {
        LoaderHelper.loaderStatus(true);
        await AuthService.qbshistory().then(async (result) => {
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                try {
                    setTradingCommission(result?.data);
                    setallData(result?.data);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage("Something Went Wrong");
            }
        });
    };


    return (
        <div id="layoutSidenav_content">
            <main>
                <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                    <div className="container-xl px-4">
                        <div className="page-header-content pt-4">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto mt-4">
                                    <h1 className="page-header-title">
                                        <div className="page-header-icon">
                                            <i className="fa fa-dollar-sign"></i>
                                        </div>
                                        Quick Buy Sell Commission
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                {/* Main page content */}
                <div className="container-xl px-4 mt-n10">
                    <div className="filter_bar">

                    </div>
                    <div className="card mb-4">
                        <div className="card-header">
                            Quick Buy Sell Commission
                            <div className="col-5">
                                <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={handleSearch} />
                            </div>
                            {TradingCommission.length === 0 ? "" :
                                <div className="dropdown">
                                    <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false"                >
                                        Export{" "}
                                    </button>
                                    <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp"                >
                                        <CSVLink data={TradingCommission} className="dropdown-item">
                                            Export as CSV
                                        </CSVLink>
                                    </div>
                                </div>}
                        </div>
                        <div className="table-responsive" width="100%">
                            <DataTableBase columns={columns} data={TradingCommission} pagination={true} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuickBuySellCommission;
