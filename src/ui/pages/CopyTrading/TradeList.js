import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Swal from "sweetalert2";
import { formatPair, formatUsdt } from "./copyTradingUtils";

const TradeList = () => {
    const navigate = useNavigate();
    const [trades, setTrades] = useState([]);
    const [masters, setMasters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [filters, setFilters] = useState({
        status: "",
        master_id: ""
    });

    const skip = (currentPage - 1) * itemsPerPage;
    const pageCount = Math.ceil(totalData / itemsPerPage);

    useEffect(() => {
        fetchMasters();
    }, []);

    useEffect(() => {
        fetchTrades();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filters]);

    const fetchMasters = async () => {
        try {
            const res = await AuthService.copyTradingMasterList({ skip: 0, limit: 100 });
            if (res?.success) {
                setMasters(res.data || []);
            }
        } catch (error) {
            setMasters([]);
        }
    };

    const fetchTrades = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const params = { skip, limit: itemsPerPage };
            if (filters.status) params.status = filters.status;
            if (filters.master_id) params.master_id = filters.master_id;
            const res = await AuthService.copyTradingTradeList(params);
            if (res?.success) {
                setTrades(res.data || []);
                setTotalData(res.total || 0);
            } else {
                setTrades([]);
                setTotalData(0);
                alertErrorMessage(res?.message || "Failed to fetch trades");
            }
        } catch (error) {
            setTrades([]);
            alertErrorMessage("Error fetching trades");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilters({ status: "", master_id: "" });
        setCurrentPage(1);
    };

    const handleTradeStatus = async (trade, nextStatus) => {
        const result = await Swal.fire({
            title: `${nextStatus === "EXECUTED" ? "Execute" : "Cancel"} Trade?`,
            text: nextStatus === "EXECUTED"
                ? "This will settle all follower copies (profit/loss applied)."
                : "This will unlock all follower funds with no profit/loss.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: nextStatus === "EXECUTED" ? "#198754" : "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: `Yes, ${nextStatus === "EXECUTED" ? "execute" : "cancel"}`
        });

        if (!result.isConfirmed) return;

        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.copyTradingUpdateTradeStatus({
                tradeId: trade._id,
                status: nextStatus
            });
            if (res?.success) {
                alertSuccessMessage(res.message || `Trade ${nextStatus.toLowerCase()} successfully`);
                fetchTrades();
            } else {
                alertErrorMessage(res?.message || "Failed to update trade status");
            }
        } catch (error) {
            alertErrorMessage("Error updating trade status");
        }
        LoaderHelper.loaderStatus(false);
    };

    const actionButtons = (row) => {
        if (row.status !== "OPEN") return "—";
        return (
            <div className="d-flex gap-2">
                <button className="btn btn-sm btn-success" onClick={() => handleTradeStatus(row, "EXECUTED")}>
                    Execute
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleTradeStatus(row, "CANCELLED")}>
                    Cancel
                </button>
            </div>
        );
    };

    const columns = [
        { name: "Sr No.", selector: (row, index) => skip + index + 1, width: "80px" },
        {
            name: "Master",
            wrap: true,
            minWidth: "150px",
            selector: (row) => row.masterName || "N/A"
        },
        { name: "Pair", selector: (row) => formatPair(row), width: "130px" },
        {
            name: "Side",
            width: "90px",
            selector: (row) => (
                <span className={`badge ${row.side === "BUY" ? "bg-success" : "bg-danger"}`}>
                    {row.side || "N/A"}
                </span>
            )
        },
        { name: "Amount", selector: (row) => row.amount ?? "N/A", width: "110px" },
        { name: "Price", selector: (row) => row.price ?? "N/A", width: "110px" },
        {
            name: "Result",
            minWidth: "150px",
            selector: (row) => (
                <span className={`badge ${row.resultType === "PROFIT" ? "bg-success" : "bg-danger"}`}>
                    {row.resultType || "N/A"} {row.pnlPercent != null ? `+ ${row.pnlPercent}%` : ""}
                </span>
            )
        },
        {
            name: "Status",
            width: "120px",
            selector: (row) => (
                <span className={`badge ${
                    row.status === "OPEN" ? "bg-warning text-dark" :
                    row.status === "EXECUTED" ? "bg-success" :
                    "bg-secondary"
                }`}>
                    {row.status || "N/A"}
                </span>
            )
        },
        { name: "Copied Users", selector: (row) => row.copiedUsersCount ?? 0, width: "130px" },
        { name: "Total Locked", selector: (row) => formatUsdt(row.totalLockedAmount), minWidth: "150px" },
        {
            name: "Settled",
            width: "160px",
            selector: (row) => row.settledAt ? moment(row.settledAt).format("DD MMM YYYY hh:mm A") : "—"
        },
        {
            name: "Created",
            width: "160px",
            selector: (row) => row.createdAt ? moment(row.createdAt).format("DD MMM YYYY hh:mm A") : "N/A"
        },
        { name: "Actions", selector: actionButtons, minWidth: "180px" }
    ];

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h1>Copy Trading Trades</h1>
                    <button
                        className="btn btn-indigo"
                        onClick={() => navigate("/dashboard/copy-trading/place-trade")}
                    >
                        <i className="fa fa-plus"></i> Place Trade
                    </button>
                </div>

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
                                    <option value="OPEN">OPEN</option>
                                    <option value="EXECUTED">EXECUTED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Master</label>
                                <select
                                    className="form-select"
                                    value={filters.master_id}
                                    onChange={(e) => handleFilterChange("master_id", e.target.value)}
                                >
                                    <option value="">All Masters</option>
                                    {masters.map((master) => (
                                        <option key={master._id} value={master._id}>
                                            {master.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 d-flex align-items-end">
                                <button className="btn btn-secondary" onClick={handleResetFilters}>
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        <DataTableBase columns={columns} data={trades} pagination={false} />
                        {pageCount > 1 && (
                            <ReactPaginate
                                pageCount={pageCount}
                                forcePage={currentPage - 1}
                                onPageChange={({ selected }) => setCurrentPage(selected + 1)}
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

export default TradeList;
