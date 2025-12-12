import React, { useState, useEffect } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import moment from "moment";

const UserPaymentMethods = () => {
    const [userId, setUserId] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [loading, setLoading] = useState(false);

    const handlePageChange = ({ selected }) => setCurrentPage(selected + 1);
    const pageCount = Math.ceil(totalData / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;

    const fetchUserPaymentMethods = async () => {
        if (!userId.trim()) {
            alertErrorMessage("Please enter a User ID");
            return;
        }

        setLoading(true);
        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.p2pGetUserPaymentMethods(userId, {
                page: currentPage,
                limit: itemsPerPage
            });
            if (res.success) {
                setUserInfo(res.data?.user);
                setPaymentMethods(res.data?.paymentMethods || []);
                setTotalData(res.data?.pagination?.totalItems || 0);
            } else {
                alertErrorMessage(res.message || "Failed to fetch payment methods");
                setUserInfo(null);
                setPaymentMethods([]);
                setTotalData(0);
            }
        } catch (error) {
            alertErrorMessage("Error fetching payment methods");
            setUserInfo(null);
            setPaymentMethods([]);
            setTotalData(0);
        }
        LoaderHelper.loaderStatus(false);
        setLoading(false);
    };

    useEffect(() => {
        if (userId.trim()) {
            fetchUserPaymentMethods();
        }
    }, [currentPage]);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchUserPaymentMethods();
    };

    const columns = [
        { name: "Sr No.", selector: (row, index) => skip + index + 1, width: "80px" },
        { name: "Payment Method", selector: row => row.paymentMethod || row.type || "N/A", width: "150px" },
        { name: "Account Name", selector: row => row.accountName || row.name || "N/A", wrap: true },
        { name: "Account Number", selector: row => row.accountNumber || row.number || "N/A", wrap: true },
        { name: "Bank Name", selector: row => row.bankName || row.bank || "N/A", wrap: true },
        { name: "IFSC Code", selector: row => row.ifscCode || row.ifsc || "N/A", width: "120px" },
        { name: "UPI ID", selector: row => row.upiId || row.upi || "N/A", wrap: true },
        { name: "Phone Number", selector: row => row.phoneNumber || row.phone || "N/A", width: "150px" },
        {
            name: "Status",
            selector: row => (
                <span className={`badge ${row.status === "ACTIVE" ? "bg-success" : "bg-secondary"}`}>
                    {row.status || "N/A"}
                </span>
            ),
            width: "100px"
        },
        {
            name: "Created At",
            selector: row => row.createdAt ? moment(row.createdAt).format("MMM Do YYYY") : "N/A",
            width: "150px"
        }
    ];

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <h1 className="mt-4 mb-3">User Payment Methods</h1>

                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Search User</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-8">
                                <label className="form-label">User ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="Enter User ID"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                />
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={handleSearch}
                                    disabled={loading}
                                >
                                    {loading ? "Searching..." : "Search"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {userInfo && (
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">User Information</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <strong>Name:</strong> {`${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() || "N/A"}
                                </div>
                                <div className="col-md-3">
                                    <strong>Email:</strong> {userInfo.emailId || "N/A"}
                                </div>
                                <div className="col-md-3">
                                    <strong>Phone:</strong> {userInfo.mobileNumber || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {paymentMethods.length > 0 && (
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">Payment Methods ({totalData})</h5>
                        </div>
                        <div className="card-body">
                            <DataTableBase columns={columns} data={paymentMethods} pagination={false} />
                            {pageCount > 1 && (
                                <ReactPaginate
                                    pageCount={pageCount}
                                    onPageChange={handlePageChange}
                                    containerClassName="customPagination"
                                    activeClassName="active"
                                />
                            )}
                        </div>
                    </div>
                )}

                {userInfo && paymentMethods.length === 0 && !loading && (
                    <div className="card mb-4">
                        <div className="card-body text-center py-5">
                            <p className="text-muted">No payment methods found for this user</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPaymentMethods;

