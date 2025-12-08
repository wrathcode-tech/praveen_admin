import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";

const PackageList = () => {
    const [allData, setAllData] = useState([]);
    const [packageList, setPackageList] = useState([]);

    const handleStatus = async (packageId, status) => {
        try {
            const result = await AuthService.packageStatus(packageId, status);
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handlePackageList();
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage("An error occurred while updating status.");
        }
    };

    const handleDelete = async (packageId) => {
        try {
            const result = await AuthService.packageDelete(packageId);
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handlePackageList();
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage("An error occurred while deleting the package.");

        }
    };

    const renderStatusAction = (row) => {
        return (
            <div>
                <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleStatus(row?._id, 'ACTIVE')}
                    disabled={row?.status === "ACTIVE"}
                >
                    Activate
                </button>
                <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => handleStatus(row?._id, 'INACTIVE')}
                    disabled={row?.status === "INACTIVE"}
                >
                    Deactivate
                </button>
                <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleDelete(row?._id)}
                >
                    Delete
                </button>
            </div>
        );
    };


    const columns = [
        { name: 'Sr No.', width: "70px", selector: (row, index) => index + 1, wrap: true },
        { name: 'Package Name', width: "120px", selector: row => row?.name, wrap: true },
        { name: 'Price', width: "70px", selector: row => row?.price, wrap: true },
        { name: 'Validity Days', width: "120px", selector: row => row?.validityDays, wrap: true },
        { name: 'Lock Days', width: "100px", selector: row => row?.lockDays, wrap: true },
        { name: 'Max Trade Limit', width: "130px", wrap: true, selector: row => row?.maxTradeLimit },
        { name: 'Min Trade Limit', width: "130px", wrap: true, selector: row => row?.minTradeLimit },
        { name: 'Monthly Return Max', width: "150px", wrap: true, selector: row => row?.monthlyReturnMax },
        { name: 'Monthly Return Min', width: "150px", wrap: true, selector: row => row?.monthlyReturnMin },
        { name: 'Status', selector: row => row?.status, wrap: true },
        { name: 'Action', width: "300px", selector: renderStatusAction, wrap: true, grow: 1.5 },
    ];

    const searchPackages = (e) => {
        const term = e.target.value.toLowerCase();
        const keysToSearch = ["name", "status", "admin_approval", "price", "validityDays", "lockDays", "maxTradeLimit", "minTradeLimit", "monthlyReturnMax", "monthlyReturnMin"];
        const filtered = allData.filter(obj =>
            keysToSearch.some(key =>
                obj[key]?.toString().toLowerCase().includes(term)
            )
        );
        setPackageList(filtered);
    };


    const handlePackageList = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getPackageList();
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                const data = result?.data.reverse();
                setAllData(data);
                setPackageList(data);
            } else {
                alertErrorMessage(result?.message || "Failed to fetch package list.");
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error fetching package list.");
        }
    };

    useEffect(() => {
        handlePackageList();
    }, []);

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
                                        Packages List
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>Package Details</span>
                            <div className="col-5">
                                <input style={{ border: "1px solid #ccc" }}
                                    className="form-control form-control-solid"
                                    type="text"
                                    placeholder="Search here..."
                                    onChange={searchPackages}
                                />
                            </div>
                        </div>
                        <div className="card-body mt-3">
                            {packageList.length === 0 ? (
                                <h6 className="ifnoData">
                                    <img alt="No data" src="/assets/img/no-data.png" /> <br />
                                    No Data Available
                                </h6>
                            ) : (
                                <div className="table-responsive">
                                    <DataTableBase columns={columns} data={packageList} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PackageList;
