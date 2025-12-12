import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import moment from "moment";

const P2POrdersManagement = () => {
    const navigate = useNavigate();
    const [ordersList, setOrdersList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [filters, setFilters] = useState({
        status: "",
        side: "",
        buyerId: "",
        sellerId: "",
        adId: "",
        orderId: "",
        fiatCurrency: "",
        qouteCurrency: "",
        minAmount: "",
        maxAmount: "",
        disputeBy: "",
        dateFrom: "",
        dateTo: ""
    });

    const handlePageChange = ({ selected }) => setCurrentPage(selected + 1);
    const pageCount = Math.ceil(totalData / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;

    useEffect(() => {
        fetchOrdersList();
    }, [currentPage, filters]);

    const fetchOrdersList = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
            };
            const res = await AuthService.p2pGetOrdersList(params);
            if (res.success) {
                setOrdersList(res.data?.orders || []);
                setTotalData(res.data?.pagination?.totalItems || 0);
            } else {
                alertErrorMessage(res.message || "Failed to fetch P2P orders");
            }
        } catch (error) {
            alertErrorMessage("Error fetching P2P orders");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            status: "",
            side: "",
            buyerId: "",
            sellerId: "",
            adId: "",
            orderId: "",
            fiatCurrency: "",
            qouteCurrency: "",
            minAmount: "",
            maxAmount: "",
            disputeBy: "",
            dateFrom: "",
            dateTo: ""
        });
        setCurrentPage(1);
    };

    const handleViewDetails = (order) => {
        navigate("/dashboard/p2p-order-details", {
            state: { orderId: order._id }
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
        { name: "Price", selector: row => row.price || row.adInfo?.fixedPrice || "N/A", width: "120px" },
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
            name: "Status",
            selector: row => (
                <span className={`badge ${
                    row.status === "RELEASED" ? "bg-success" :
                    row.status === "PAID" ? "bg-info" :
                    row.status === "PENDING_PAYMENT" ? "bg-warning" :
                    row.status === "CANCELLED" ? "bg-danger" :
                    row.status === "DISPUTE" ? "bg-danger" :
                    "bg-secondary"
                }`}>
                    {row.status || "N/A"}
                </span>
            ),
            width: "150px"
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
                <h1 className="mt-4 mb-3">P2P Orders Management</h1>

                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Filters</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                                    <option value="PAID">PAID</option>
                                    <option value="RELEASED">RELEASED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                    <option value="DISPUTE">DISPUTE</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Side</label>
                                <select
                                    className="form-select"
                                    value={filters.side}
                                    onChange={(e) => handleFilterChange("side", e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="BUY">BUY</option>
                                    <option value="SELL">SELL</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Fiat Currency</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={filters.fiatCurrency}
                                    onChange={(e) => handleFilterChange("fiatCurrency", e.target.value.toUpperCase())}
                                    placeholder="e.g., USD"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Quote Currency</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={filters.qouteCurrency}
                                    onChange={(e) => handleFilterChange("qouteCurrency", e.target.value.toUpperCase())}
                                    placeholder="e.g., BTC"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Buyer ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={filters.buyerId}
                                    onChange={(e) => handleFilterChange("buyerId", e.target.value)}
                                    placeholder="Buyer ID"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Seller ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={filters.sellerId}
                                    onChange={(e) => handleFilterChange("sellerId", e.target.value)}
                                    placeholder="Seller ID"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Ad ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={filters.adId}
                                    onChange={(e) => handleFilterChange("adId", e.target.value)}
                                    placeholder="Ad ID"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Order ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={filters.orderId}
                                    onChange={(e) => handleFilterChange("orderId", e.target.value)}
                                    placeholder="Order ID"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Min Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={filters.minAmount}
                                    onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                                    placeholder="Min Amount"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Max Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={filters.maxAmount}
                                    onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                                    placeholder="Max Amount"
                                />
                            </div>
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
                        <DataTableBase columns={columns} data={ordersList} pagination={false} />
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

export default P2POrdersManagement;

