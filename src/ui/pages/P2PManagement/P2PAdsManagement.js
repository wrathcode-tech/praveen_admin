import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import moment from "moment";

const P2PAdsManagement = () => {
    const navigate = useNavigate();
    const [adsList, setAdsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [filters, setFilters] = useState({
        side: "",
        status: "",
        isOnline: "",
        fiatCurrency: "",
        qouteCurrency: "",
        userId: "",
        adUid: "",
        minPrice: "",
        maxPrice: ""
    });

    const handlePageChange = ({ selected }) => setCurrentPage(selected + 1);
    const pageCount = Math.ceil(totalData / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;

    useEffect(() => {
        fetchAdsList();
    }, [currentPage, filters]);

    const fetchAdsList = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
            };
            const res = await AuthService.p2pGetAdsList(params);
            if (res.success) {
                setAdsList(res.data?.ads || []);
                setTotalData(res.data?.pagination?.totalItems || 0);
            } else {
                alertErrorMessage(res.message || "Failed to fetch P2P ads");
            }
        } catch (error) {
            alertErrorMessage("Error fetching P2P ads");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleFilterChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilters({
            side: "",
            status: "",
            isOnline: "",
            fiatCurrency: "",
            qouteCurrency: "",
            userId: "",
            adUid: "",
            minPrice: "",
            maxPrice: ""
        });
        setCurrentPage(1);
    };

    const handleViewDetails = (ad) => {
        navigate("/dashboard/p2p-ad-details", {
            state: { adId: ad._id }
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
        { name: "Ad UID", selector: row => row.adUid || "N/A", width: "120px" },
        {
            name: "Side",
            selector: row => (
                <span className={`badge ${row.side === "BUY" ? "bg-success" : "bg-danger"}`}>
                    {row.side || "N/A"}
                </span>
            ),
            width: "100px"
        },
        { name: "Fiat", selector: row => row.fiatCurrency || "N/A", width: "100px" },
        { name: "Quote", selector: row => row.qouteCurrency || "N/A", width: "100px" },
        { name: "Price", selector: row => row.fixedPrice || "N/A", width: "120px" },
        { name: "Volume", selector: row => row.volume || "N/A", width: "120px" },
        { name: "Remaining", selector: row => row.remainingVolume || "N/A", width: "120px" },
        {
            name: "Status",
            selector: row => (
                <span className={`badge ${
                    row.status === "OPEN" ? "bg-success" :
                    row.status === "CLOSED" ? "bg-danger" :
                    "bg-warning"
                }`}>
                    {row.status || "N/A"}
                </span>
            ),
            width: "120px"
        },
        {
            name: "Online",
            selector: row => (
                <span className={`badge ${row.isOnline ? "bg-success" : "bg-secondary"}`}>
                    {row.isOnline ? "Yes" : "No"}
                </span>
            ),
            width: "100px"
        },
        {
            name: "User",
            selector: row => row.userInfo ? `${row.userInfo.firstName || ""} ${row.userInfo.lastName || ""}`.trim() || row.userInfo.emailId : "N/A",
            wrap: true
        },
        {
            name: "Orders",
            selector: row => `${row.activeOrders || 0}/${row.totalOrders || 0}`,
            width: "100px"
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
                <h1 className="mt-4 mb-3">P2P Ads Management</h1>

                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Filters</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
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
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange("status", e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="OPEN">OPEN</option>
                                    <option value="CLOSED">CLOSED</option>
                                    <option value="PARTIALLY_FILLED">PARTIALLY_FILLED</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Online Status</label>
                                <select
                                    className="form-select"
                                    value={filters.isOnline}
                                    onChange={(e) => handleFilterChange("isOnline", e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="true">Online</option>
                                    <option value="false">Offline</option>
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
                                <label className="form-label">User ID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={filters.userId}
                                    onChange={(e) => handleFilterChange("userId", e.target.value)}
                                    placeholder="User ID"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Ad UID</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={filters.adUid}
                                    onChange={(e) => handleFilterChange("adUid", e.target.value)}
                                    placeholder="Ad UID"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Min Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                                    placeholder="Min Price"
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Max Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                                    placeholder="Max Price"
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
                        <DataTableBase columns={columns} data={adsList} pagination={false} />
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

export default P2PAdsManagement;

