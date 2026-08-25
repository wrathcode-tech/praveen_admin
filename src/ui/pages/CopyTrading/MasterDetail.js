import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Swal from "sweetalert2";
import { formatPair, formatUsdt, getProfileImageUrl, StarRating } from "./copyTradingUtils";

const MasterDetail = () => {
    const { masterId } = useParams();
    const navigate = useNavigate();
    const [master, setMaster] = useState(null);
    const [trades, setTrades] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [status, setStatus] = useState("");

    const skip = (currentPage - 1) * itemsPerPage;
    const pageCount = Math.ceil(totalData / itemsPerPage);

    useEffect(() => {
        if (!masterId) {
            alertErrorMessage("Master ID not provided");
            navigate("/dashboard/copy-trading/masters");
            return;
        }
        fetchMasterDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [masterId]);

    useEffect(() => {
        if (masterId) fetchTrades();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [masterId, currentPage, status]);

    const fetchMasterDetail = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.copyTradingMasterDetail(masterId);
            if (res?.success) {
                setMaster(res.data || null);
            } else {
                alertErrorMessage(res?.message || "Failed to fetch master detail");
                navigate("/dashboard/copy-trading/masters");
            }
        } catch (error) {
            alertErrorMessage("Error fetching master detail");
            navigate("/dashboard/copy-trading/masters");
        }
        LoaderHelper.loaderStatus(false);
    };

    const fetchTrades = async () => {
        try {
            const params = { skip, limit: itemsPerPage, master_id: masterId };
            if (status) params.status = status;
            const res = await AuthService.copyTradingTradeList(params);
            if (res?.success) {
                setTrades(res.data || []);
                setTotalData(res.total || 0);
            } else {
                setTrades([]);
                setTotalData(0);
            }
        } catch (error) {
            setTrades([]);
        }
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
                fetchMasterDetail();
            } else {
                alertErrorMessage(res?.message || "Failed to update trade status");
            }
        } catch (error) {
            alertErrorMessage("Error updating trade status");
        }
        LoaderHelper.loaderStatus(false);
    };

    const statCard = (label, value) => (
        <div className="col-md-3">
            <div className="text-center p-3 border rounded">
                <h4>{value ?? 0}</h4>
                <p className="mb-0">{label}</p>
            </div>
        </div>
    );

    const tradeColumns = [
        { name: "Sr No.", selector: (row, index) => skip + index + 1, width: "80px" },
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
                    {row.resultType || "N/A"} {row.pnlPercent != null ? `${row.pnlPercent}%` : ""}
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
            name: "Created",
            width: "160px",
            selector: (row) => row.createdAt ? moment(row.createdAt).format("DD MMM YYYY hh:mm A") : "N/A"
        },
        {
            name: "Actions",
            minWidth: "180px",
            selector: (row) => row.status === "OPEN" ? (
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-success" onClick={() => handleTradeStatus(row, "EXECUTED")}>
                        Execute
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleTradeStatus(row, "CANCELLED")}>
                        Cancel
                    </button>
                </div>
            ) : "—"
        }
    ];

    if (!master) {
        return (
            <div id="layoutSidenav_content">
                <div className="container-xl px-4">
                    <div className="text-center py-5">
                        <p>Loading master details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h1>Master Detail</h1>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-warning"
                            onClick={() => navigate(`/dashboard/copy-trading/edit-master/${master._id}`)}
                        >
                            <i className="fa fa-edit"></i> Edit
                        </button>
                        <button
                            className="btn btn-success"
                            disabled={master.status !== "ACTIVE"}
                            onClick={() => navigate("/dashboard/copy-trading/place-trade", { state: { masterId: master._id } })}
                        >
                            <i className="fa fa-plus"></i> Place Trade
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate("/dashboard/copy-trading/masters")}
                        >
                            <i className="fa fa-arrow-left"></i> Back
                        </button>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header d-flex align-items-center gap-3">
                        {master.profileImage ? (
                            <img
                                src={getProfileImageUrl(master.profileImage)}
                                alt={master.name}
                                style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                            />
                        ) : null}
                        <div>
                            <h5 className="mb-0">{master.name}</h5>
                            <small className="text-muted">{master.bio || "No bio"}</small>
                        </div>
                        <span className={`badge ms-auto ${master.status === "ACTIVE" ? "bg-success" : "bg-secondary"}`}>
                            {master.status}
                        </span>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3"><strong>Pair:</strong> {formatPair(master)}</div>
                                <div className="mb-3 d-flex align-items-center gap-2"><strong>Rating:</strong> <StarRating value={master.rating} /></div>
                                <div className="mb-3"><strong>Use Balance %:</strong> {master.useBalancePercent ?? 0}%</div>
                                <div className="mb-3"><strong>Profit %:</strong> {master.profitPercent ?? 0}%</div>
                                <div className="mb-3"><strong>Loss %:</strong> {master.lossPercent ?? 0}%</div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3"><strong>Display Balance:</strong> {formatUsdt(master.displayBalance)}</div>
                                <div className="mb-3"><strong>Display Win Rate:</strong> {master.displayWinRate ?? 0}%</div>
                                <div className="mb-3"><strong>Followers:</strong> {master.realFollowerCount ?? 0}</div>
                                <div className="mb-3"><strong>Created:</strong> {master.createdAt ? moment(master.createdAt).format("DD MMM YYYY hh:mm A") : "N/A"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Statistics</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            {statCard("AUM / Funds Managed", formatUsdt(master.aum))}
                            {statCard("Total Profit Given", formatUsdt(master.totalProfitGiven))}
                            {statCard("Total Loss Given", formatUsdt(master.totalLossGiven))}
                            {statCard("Total Trades", master.totalTrades || 0)}
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Recent Trades</h5>
                        <select
                            className="form-select"
                            style={{ width: 200 }}
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All Status</option>
                            <option value="OPEN">OPEN</option>
                            <option value="EXECUTED">EXECUTED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>
                    </div>
                    <div className="card-body">
                        <DataTableBase columns={tradeColumns} data={trades} pagination={false} />
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

export default MasterDetail;
