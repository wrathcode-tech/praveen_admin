import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import moment from "moment";

const UserPackageList = () => {
    const [allData, setAllData] = useState([]);
    const [userPackageData, setUserPackageData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const columns = [
        { name: 'Sr No.', width: "70px", selector: (row, index) => (page - 1) * limit + index + 1, wrap: true },
        { name: 'Name', selector: row => row?.userInfo?.firstName + " " + row?.userInfo?.lastName, wrap: true },
        { name: 'Email', width: "200px", selector: row => row?.userInfo?.emailId, wrap: true },
        { name: 'Package Name', selector: row => row?.packageDetails?.name, wrap: true },
        { name: 'Price', selector: row => row?.packageDetails?.price, wrap: true },
        { name: 'Purchase Date', selector: row => moment(row?.purchaseDate).format("DD-MM-YYYY LT"), wrap: true },
        { name: 'Expiry Date', selector: row => moment(row?.expiryDate).format("DD-MM-YYYY LT"), wrap: true },
        { name: 'Status', selector: row => row?.status, wrap: true },
    ];

    const searchPackages = (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allData.filter(obj =>
            obj?.userInfo?.firstName?.toLowerCase()?.includes(term) ||
            obj?.userInfo?.lastName?.toLowerCase()?.includes(term) ||
            obj?.userInfo?.emailId?.toLowerCase()?.includes(term) ||
            obj?.packageDetails?.name?.toLowerCase()?.includes(term) ||
            obj?.packageDetails?.price?.toString()?.toLowerCase()?.includes(term) ||
            obj?.status?.toLowerCase()?.includes(term)
        );
        setUserPackageData(filtered);
    };

    const handleUserPackageList = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getUserPackageList(page, limit);
            LoaderHelper.loaderStatus(false);

            if (result?.success) {
                const data = result?.data;
                setAllData(data);
                setUserPackageData(data);
                setTotalCount(result?.totalCount || data.length);
            } else {
                alertErrorMessage(result?.message || "Failed to fetch package list.");
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error fetching package list.");
        }
    };

    useEffect(() => {
        handleUserPackageList(page, limit);
    }, [page, limit]);

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
                                            <i className="far fa-user"></i>
                                        </div>
                                        User Package List
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>User Package List</span>
                            <div className="col-5">
                                <input
                                    style={{ border: "1px solid #ccc" }}
                                    className="form-control form-control-solid"
                                    type="text"
                                    placeholder="Search here..."
                                    onChange={searchPackages}
                                />
                            </div>
                        </div>

                        <div className="card-body mt-3">
                            {userPackageData.length === 0 ? (
                                <h6 className="ifnoData">
                                    <img alt="No data" src="/assets/img/no-data.png" /> <br />
                                    No Data Available
                                </h6>
                            ) : (
                                <div className="table-responsive">
                                    <DataTableBase columns={columns} data={userPackageData} pagination={true} />
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {/* <div className="d-flex justify-content-between align-items-center mt-3">
                                <div>
                                    Showing page {page} of {Math.ceil(totalCount / limit)}
                                </div>
                                <div>
                                    <button
                                        className="btn btn-secondary btn-sm me-2"
                                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setPage(prev => prev + 1)}
                                        disabled={page >= Math.ceil(totalCount / limit)}
                                    >
                                        Next
                                    </button>
                                </div>
                                <div>
                                    <select
                                        className="form-select form-select-sm ms-2"
                                        value={limit}
                                        onChange={(e) => {
                                            setLimit(Number(e.target.value));
                                            setPage(1); // reset to first page on limit change
                                        }}
                                    >
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                    </select>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserPackageList;
