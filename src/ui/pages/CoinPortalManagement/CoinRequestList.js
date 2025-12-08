import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";

const CoinRequestList = () => {
    const [allData, setAllData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalData, setTotalData] = useState(0);
    const [exportData, setExportData] = useState([]);
    const [coins, setCoins] = useState([]);

    const pageCount = Math.ceil(totalData / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;

    const statuslinkFollow = (row) => {
        return (
            <div className="d-flex gap-3">
                <button className="btn btn-sm btn-success" onClick={() => handleStatus(row._id, "APPROVED")}>Approve</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleStatus(row._id, "REJECTED")}>Reject</button>
            </div>
        );
    };

    const columns = [
        { name: 'Created At', width: "200px", wrap: true, selector: row => moment(row?.createdAt).format('MM-DD- YYYY LT') || "-------" },
        { name: 'Project Name', wrap: true, sort: true, selector: row => row?.projectName || "-------" },
        { name: 'Email Id', width: "200px", wrap: true, sort: true, selector: row => row?.emailId || "-------" },
        { name: 'Mobile Number', wrap: true, sort: true, selector: row => row?.phoneNumber || "-------" },
        { name: 'Status', wrap: true, sort: true, selector: row => row?.status || "-------" },
        { name: 'Action', width: "200px", wrap: true, cell: statuslinkFollow },
    ];

    const handleStatus = async (id, status) => {
        try {
            const result = await AuthService.coinStatus(id, status);
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handlePackageList();
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage('An unexpected error occurred while updating the status.');
        }
    };


    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected + 1);
    };

    const handlePackageList = async (skip = 0, limit = itemsPerPage) => {
        LoaderHelper.loaderStatus(true);
        await AuthService.getCoinPackageList(skip, limit).then(result => {
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
        handlePackageList(skip, itemsPerPage);
    }, [currentPage, skip, itemsPerPage])

    useEffect(() => {
        const handleCoinList = async () => {
            try {
                const result = await AuthService.getCoinList();
                if (result?.success) {
                    setCoins(result?.data);
                } else {
                    alertErrorMessage(result?.message || 'Failed to load coin list.');
                }
            } catch (error) {
                console.error('Error in handleCoinList:', error);
                alertErrorMessage('An unexpected error occurred while fetching coin list.');
            }
        };
        handleCoinList();
    }, []);


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
                    {/* Approved modal Open */}
                    {/* <div className="modal" id="approveModal" tabindex="-1" role="dialog" aria-labelledby="funds_modal_modalTitle" aria-hidden="true">
                        <div className="modal-dialog  alert_modal" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" ></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group mb-3 position-relative">
                                            <label className="small mb-1">Select Coin</label>
                                            <select
                                                className="form-control form-control-solid"
                                                value={selectedCoin}
                                                onChange={(e) => setSelectedCoin(e.target.value)}
                                            >
                                                <option value="">-- Select a Coin --</option>
                                                {coins.map((coin) => (
                                                    <option key={coin.id} value={coin.id}>
                                                        {coin.name}
                                                        ({coin.symbol})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group mt-3 position-relative">
                                            <button
                                                className="btn btn-success btn-block w-100"
                                                type="button"
                                                onClick={handleApprove}
                                                disabled={!selectedCoin}
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div > */}
                    {/* approved Modal End */}
                </main>
            </div>
        </>
    );
};

export default CoinRequestList;
