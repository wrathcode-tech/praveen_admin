import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";

const RejectedCoinList = () => {
    const [allData, setAllData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [exportData, setExportData] = useState([]);

    const pageCount = Math.ceil(totalData / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;



    const columns = [
        { name: 'Created At', width: "200px", wrap: true, selector: row => moment(row?.createdAt).format('MM-DD- YYYY LT') || "-------" },
        { name: 'Project Name', wrap: true, sort: true, selector: row => row?.projectName || "-------" },
        { name: 'Email Id', width: "200px", wrap: true, sort: true, selector: row => row?.emailId || "-------" },
        { name: 'Mobile Number', wrap: true, sort: true, selector: row => row?.phoneNumber || "-------" },
        { name: 'Status', wrap: true, sort: true, selector: row => row?.status || "-------" },
    ];



    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handleRejectedCoinList = async (skip = 0, limit = itemsPerPage) => {
        LoaderHelper.loaderStatus(true);
        await AuthService.RejectedCoinList(skip, limit).then(result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                setTotalData(result?.total);
                setExportData(result?.data);
                setAllData(result?.data);
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result?.message || 'Failed to load data.');
            }
        }).catch(error => {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage('An error occurred while fetching data.');
        });
    };

    const searchObjects = (e) => {
        const keysToSearch = ["projectName", "emailId", "phoneNumber", "createdAt"];
        const userInput = e.target.value;
        const searchTerm = userInput?.toLowerCase();
        const matchingObjects = allData.filter(obj => {
            return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm));
        });
        setExportData(matchingObjects);
    };

    useEffect(() => {
        handleRejectedCoinList(skip, itemsPerPage);
    }, [currentPage, skip, itemsPerPage]);

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
                                            Coin Request List
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="table-responsive" width="100%">
                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        placeholder="Search..."
                                        onChange={searchObjects}
                                    />
                                    <DataTableBase columns={columns} data={exportData} pagination={false} />
                                </div>
                                <div className="align-items-center mt-3 d-flex justify-content-between">
                                    <div className="pl_row d-flex justify-content-start gap-3 align-items-center">
                                        <label htmlFor="rowsPerPage">Rows per page: </label>
                                        <select className="form-select form-select-sm my-0" id="rowsPerPage" value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)}>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                    </div>
                                    <ReactPaginate
                                        pageCount={pageCount}
                                        onPageChange={handlePageChange}
                                        containerClassName={'customPagination'}
                                        activeClassName={'active'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default RejectedCoinList;
