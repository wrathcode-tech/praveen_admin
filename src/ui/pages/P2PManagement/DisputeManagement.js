import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const DisputeManagement = () => {
    const navigate = useNavigate();
    const [disputesList, setDisputesList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [filters, setFilters] = useState({
        disputeBy: "",
        adminStatus: "PENDING",
        dateFrom: "",
        dateTo: ""
    });

    const handlePageChange = ({ selected }) => setCurrentPage(selected + 1);
    const pageCount = Math.ceil(totalData / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;

    useEffect(() => {
        fetchDisputesList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filters]);

    const fetchDisputesList = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
            };
            const res = await AuthService.p2pGetDisputesList(params);
            if (res.success) {
                setDisputesList(res.data?.orders || []);
                setTotalData(res.data?.pagination?.totalItems || 0);
            } else {
                alertErrorMessage(res.message || "Failed to fetch disputes");
            }
        } catch (error) {
            alertErrorMessage("Error fetching disputes");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            disputeBy: "",
            adminStatus: "",
            dateFrom: "",
            dateTo: ""
        });
        setCurrentPage(1);
    };

    const handleViewDetails = (order) => {
        navigate("/dashboard/dispute_Details", {
            state: {
                orderId: order._id,
                disputeData: order
            }
        });
    };

    const actionButtons = (row) => (
        <button
            className="btn btn-sm btn-primary"
            onClick={() => handleViewDetails(row)}
        >
            <i className="fa fa-eye"></i> View Details
        </button>
    );

    const columns = [
        { name: "Sr No.", selector: (row, index) => skip + index + 1, width: "80px" },
        { name: "Order ID", selector: row => row._id?.substring(0, 8) || "N/A", width: "120px" },
        { name: "Ad UID", selector: row => row.adInfo?.adUid || "N/A", width: "120px" },
        {
            name: "Side",
            selector: row => (
                <span className={`badge ${row.adInfo?.side === "BUY" ? "bg-success" : "bg-danger"}`}>
                    {row.adInfo?.side || "N/A"}
                </span>
            ),
            width: "100px"
        },
        { name: "Fiat", selector: row => row.adInfo?.fiatCurrency || "N/A", width: "80px" },
        { name: "Quote", selector: row => row.adInfo?.qouteCurrency || "N/A", width: "80px" },
        { name: "Fiat Amount", selector: row => row.fiatAmount || "N/A", width: "120px" },
        { name: "Crypto Amount", selector: row => row.cryptoAmount || "N/A", width: "120px" },
        {
            name: "Buyer",
            selector: row => row.buyerInfo ? `${row.buyerInfo.firstName || ""} ${row.buyerInfo.lastName || ""}`.trim() || row.buyerInfo.emailId : "N/A",
            wrap: true,
            width: "150px"
        },
        {
            name: "Seller",
            selector: row => row.sellerInfo ? `${row.sellerInfo.firstName || ""} ${row.sellerInfo.lastName || ""}`.trim() || row.sellerInfo.emailId : "N/A",
            wrap: true,
            width: "150px"
        },
        {
            name: "Dispute By",
            selector: row => (
                <span className={`badge ${row.disputeBy === "BUYER" ? "bg-info" : "bg-warning"}`}>
                    {row.disputeBy || "N/A"}
                </span>
            ),
            width: "120px"
        },
        {
            name: "Dispute Reason",
            selector: row => row.disputeReason || "N/A",
            wrap: true,
            width: "200px"
        },
        {
            name: "Dispute At",
            selector: row => row.disputeAt ? moment(row.disputeAt).format("MMM Do YYYY") : "N/A",
            width: "150px"
        },
        {
            name: "Admin Status",
            selector: row => (
                <span className={`badge ${
                    row.adminDisputeStatus === "RESOLVED" ? "bg-success" : 
                    row.adminDisputeStatus === "PENDING" ? "bg-warning" : 
                    "bg-secondary"
                }`}>
                    {row.adminDisputeStatus || (row.isDisputed ? "PENDING" : "N/A")}
                </span>
            ),
            width: "120px"
        },
        {
            name: "Admin Action",
            selector: row => row.adminDisputeAction || "N/A",
            width: "150px"
        },
        {
            name: "Resolved By",
            selector: row => row.adminResolvedBy ? 
                `${row.adminResolvedBy.first_name || ""} ${row.adminResolvedBy.last_name || ""}`.trim() || "Admin" : 
                "N/A",
            width: "150px"
        },
        {
            name: "Resolved At",
            selector: row => row.adminResolvedAt ? moment(row.adminResolvedAt).format("MMM Do YYYY hh:mm A") : "N/A",
            width: "180px"
        },
        {
            name: "Created At",
            selector: row => row.createdAt ? moment(row.createdAt).format("MMM Do YYYY") : "N/A",
            width: "150px"
        },
        { name: "Actions", selector: actionButtons, width: "150px" }
    ];

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <h1 className="mt-4 mb-3">P2P Dispute Management</h1>

                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Filters</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">Dispute By</label>
                                <select
                                    className="form-select"
                                    value={filters.disputeBy}
                                    onChange={(e) => handleFilterChange("disputeBy", e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="BUYER">BUYER</option>
                                    <option value="SELLER">SELLER</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Admin Status</label>
                                <select
                                    className="form-select"
                                    value={filters.adminStatus}
                                    onChange={(e) => handleFilterChange("adminStatus", e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="PENDING">Open (PENDING)</option>
                                    <option value="RESOLVED">Closed (RESOLVED)</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Date From</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Date To</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={filters.dateTo}
                                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                                />
                            </div>
                            <div className="col-md-12">
                                <button
                                    className="btn btn-secondary"
                                    onClick={handleResetFilters}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        <DataTableBase columns={columns} data={disputesList} pagination={false} />
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
            </div>
        </div>
    );
};

export default DisputeManagement;
