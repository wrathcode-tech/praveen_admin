import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import moment from "moment";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";


const FundsDManagement = () => {
    const [fundsDeposit, setFundsDeposit] = useState([]);
    const [allData, setAllData] = useState([]);
    const [totalAmount, setTotalAmount] = useState({});
    // const [currentPage, setCurrentPage] = useState(1);
    // const [itemsPerPage, setItemsPerPage] = useState(10);
    // const [totalData,setTotalData] = useState()


    // const handlePageChange = ({ selected }) => {
    //     setCurrentPage(selected + 1);
    // };


    // const pageCount = totalData/itemsPerPage

    // const skip = (currentPage - 1) * itemsPerPage;


    function statusFormatter(row) {
        return <strong className="text-success">{row.status}</strong>
    };

    const userIdFollow = (row) => {
        return (
            row.user_id
        );
    };


    const columns = [
        { name: "Sr No.", wrap: true, selector: (row, index) => row?.index, },
        { name: "Date", selector: row => moment(row?.createdAt).format("MMM Do YYYY, h:mm:ss a"), wrap: true },
        { name: "User Id",width:"150px", wrap: true, selector: userIdFollow },
        { name: "Contact",width:"150px",  wrap: true, selector: row => row.emailId || row.mobileNumber, },
        { name: "Chain", selector: row => row.chain, },
        { name: "Currency", wrap: true, selector: row => row.currency, },
        { name: "Amount", sortable: true, wrap: true, selector: row => row.amount, },
        { name: <div style={{ whiteSpace: "revert" }}>From Address</div>,width:"200px",  wrap: true, selector: row => row.from_address || "---", },
        { name: <div style={{ whiteSpace: "revert" }}>To Wallet Address</div>,width:"200px",  wrap: true, selector: row => row.to_address || "---", },
        { name: <div style={{ whiteSpace: "revert" }}>Transaction Hash</div>, wrap: true, width:"200px", selector: row => row.transaction_hash || "---", },
        { name: "Status", selector: statusFormatter, },
    ];

    useEffect(() => {
        handleFundDeposit()
    }, []);

    const handleFundDeposit = async () => {
        LoaderHelper.loaderStatus(true);
        await AuthService.completeDepositRequest().then(async result => {
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                try {
                    let filteredData = result?.data?.map((item, index) => ({ ...item, index: index + 1 }))
                    setFundsDeposit(filteredData);
                    // setTotalData(result?.totalCount)
                    setAllData(filteredData);

                    const currencyTotals = {};
                    result?.data.forEach(transaction => {
                        const { short_name, amount } = transaction;
                        if (currencyTotals[short_name]) {
                            currencyTotals[short_name] += amount;
                        } else {
                            currencyTotals[short_name] = amount;
                        }
                    });
                    setTotalAmount(currencyTotals)
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
            }
        });
    };

    function searchObjects(e) {
        const keysToSearch = ["chain", "currency", "emailId", "firstName", "from_address", "to_address", "transaction_hash", "amount", "mobileNumber", "user_id"];
        const searchTerm = e.target.value?.toLowerCase();
        const matchingObjects = allData?.filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
        setFundsDeposit(matchingObjects);
    };


    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const filterDate = () => {
        const filteredData = allData.filter((item) => {
            const createdAtDate = new Date(item.createdAt);

            // Parse fromDate and toDate and include full day for toDate
            const startDate = fromDate ? new Date(fromDate) : null;
            let endDate = toDate ? new Date(toDate) : null;

            if (startDate) {
                startDate.setHours(0, 0, 0, 0); // Start of the day in IST
            }
            // Adjust toDate to include the entire day (23:59:59 of that day)
            if (endDate) {
                endDate.setHours(23, 59, 59, 999); // Set to the end of the selected day
            }

            return (
                (!startDate || createdAtDate >= startDate) &&
                (!endDate || createdAtDate <= endDate)
            );
        });

        const currencyTotals = {};
        filteredData.forEach(transaction => {
            const { short_name, amount } = transaction;
            if (currencyTotals[short_name]) {
                currencyTotals[short_name] += amount;
            } else {
                currencyTotals[short_name] = amount;
            }
        });
        setTotalAmount(currencyTotals)

        setFundsDeposit(filteredData); // Reverse the filtered data if necessary
    }

    const ResetfilterDate = () => {
        setFromDate('')
        setToDate('')
        setFundsDeposit(allData)
        const currencyTotals = {};
        allData.forEach(transaction => {
            const { short_name, amount } = transaction;
            if (currencyTotals[short_name]) {
                currencyTotals[short_name] += amount;
            } else {
                currencyTotals[short_name] = amount;
            }
        });
        setTotalAmount(currencyTotals)
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
                                        <div className="page-header-icon"><i className="fa fa-dollar-sign"></i></div>
                                        Completed Deposit
                                    </h1>
                                    <div>
                                        Total Amount  {Object.entries(totalAmount).map(([currency, total]) => {
                                            return (
                                                <>

                                                    <span className="mx-2 text-warning" key={currency}>
                                                        {currency}: {total?.toFixed(4)}
                                                    </span>
                                                </>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container-xl px-4 mt-n10 withdrawal_tbs">
                    <div className="card mb-4">
                        <div className="card-header row center">
                            <div className="col-2">
                                <input
                                    type="date"
                                    className="form-control form-control-solid"
                                    data-provide="datepicker"
                                    id="litepickerRangePlugin"
                                    name="dateFrom"
                                    value={fromDate}
                                    onChange={(e) => { setFromDate(e.target.value); }}
                                />
                            </div>
                            <div className="col-2">
                                <input
                                    type="date"
                                    className="form-control form-control-solid"
                                    data-provide="datepicker"
                                    id="litepickerRangePlugin"
                                    name="dateTo"
                                    value={toDate}
                                    onChange={(e) => { setToDate(e.target.value); }}
                                />
                            </div>
                            <div className="col-4">
                                <div className="row">
                                    <div className="col">
                                        <button
                                            className="btn btn-indigo btn-block w-100"
                                            type="button"
                                            onClick={filterDate}
                                            disabled={!fromDate || !toDate}
                                        >
                                            Search
                                        </button>
                                    </div>
                                    <div className="col">
                                        <button
                                            className="btn btn-indigo btn-block w-100"
                                            type="button"
                                            onClick={ResetfilterDate}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-2 mx-1">
                                <input className="form-control form-control-solid" id="inputLastName" type="search" placeholder="Search here..." name="search" onChange={searchObjects} />
                            </div>
                            <div className="col-1  mx-1">
                                <div className="dropdown">
                                    <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Export{" "}
                                    </button>
                                    <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                                        <CSVLink data={fundsDeposit} className="dropdown-item">Export as CSV</CSVLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body mt-3">
                            <div className="table-responsive" width="100%">
                                <DataTableBase columns={columns} data={fundsDeposit} />
                            </div>
                            {/* {totalData > 5 ? <ReactPaginate
                            pageCount={pageCount}
                            onPageChange={handlePageChange}
                            containerClassName={'customPagination'}
                            activeClassName={'active'}
                        /> : ""} */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default FundsDManagement;