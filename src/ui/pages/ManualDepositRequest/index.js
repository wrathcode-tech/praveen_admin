import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Swal from "sweetalert2";
import copy from "copy-to-clipboard";

const CHAIN_OPTIONS = ["BEP20", "ERC20", "TRC20", "POLYGON"];
const STATUS_TABS = [
    { key: "PENDING", label: "Pending" },
    { key: "SUCCESS", label: "Approved" },
    { key: "REJECTED", label: "Rejected" }
];

const getDepositSlipUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    const cleaned = String(path).replace(/^public\//, "").replace(/^\//, "");
    return `${ApiConfig.appUrl}${cleaned}`;
};

const truncateText = (value, start = 8, end = 6) => {
    if (!value) return "---";
    if (value.length <= start + end + 3) return value;
    return `${value.slice(0, start)}...${value.slice(-end)}`;
};

const ManualDepositRequest = () => {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(50);
    const [totalData, setTotalData] = useState(0);
    const [activeStatus, setActiveStatus] = useState("PENDING");
    const [filters, setFilters] = useState({ chain: "", short_name: "" });
    const [filterInputs, setFilterInputs] = useState({ chain: "", short_name: "" });
    const [rejectRow, setRejectRow] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const skip = (currentPage - 1) * itemsPerPage;
    const pageCount = Math.ceil(totalData / itemsPerPage) || 0;
    const adminId = sessionStorage.getItem("userId") || sessionStorage.getItem("emailId") || "";

    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, activeStatus, filters]);

    const fetchList = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const params = {
                skip,
                limit: itemsPerPage,
                status: activeStatus
            };
            if (filters.chain) params.chain = filters.chain;
            if (filters.short_name.trim()) params.short_name = filters.short_name.trim().toUpperCase();

            const res = await AuthService.manualDepositRequestList(params);
            if (res?.success) {
                setList(res.data || []);
                setTotalData(res.totalCount || res.total || 0);
            } else {
                setList([]);
                setTotalData(0);
                alertErrorMessage(res?.message || "Failed to fetch deposit requests");
            }
        } catch (error) {
            setList([]);
            setTotalData(0);
            alertErrorMessage("Error fetching deposit requests");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleTabChange = (status) => {
        setActiveStatus(status);
        setCurrentPage(1);
    };

    const handleFilterInput = (key, value) => {
        setFilterInputs((prev) => ({ ...prev, [key]: value }));
    };

    const handleSearchFilters = () => {
        setFilters({
            chain: filterInputs.chain,
            short_name: filterInputs.short_name.trim().toUpperCase()
        });
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilterInputs({ chain: "", short_name: "" });
        setFilters({ chain: "", short_name: "" });
        setCurrentPage(1);
    };

    const handleCopy = (value, label = "Copied") => {
        if (!value) return;
        copy(value);
        alertSuccessMessage(label);
    };

    const handleApprove = async (row) => {
        const result = await Swal.fire({
            title: "Approve Deposit?",
            text: `Approve ${row.amount} ${row.short_name || ""} for ${row.emailId || row.uuid || "this user"}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#198754",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, approve"
        });
        if (!result.isConfirmed) return;
        await updateStatus(row._id, "SUCCESS");
    };

    const handleRejectSubmit = async (e) => {
        e.preventDefault();
        if (!rejectRow?._id) return;
        await updateStatus(rejectRow._id, "REJECTED", rejectReason.trim());
        setRejectRow(null);
        setRejectReason("");
    };

    const updateStatus = async (id, status, reason = "") => {
        LoaderHelper.loaderStatus(true);
        try {
            const payload = { _id: id, status };
            if (adminId) payload.adminId = adminId;
            if (status === "REJECTED" && reason) payload.reject_reason = reason;

            const res = await AuthService.manualDepositRequestUpdateStatus(payload);
            if (res?.success) {
                alertSuccessMessage(res.message || (status === "SUCCESS" ? "Deposit approved successfully" : "Deposit rejected successfully"));
                fetchList();
            } else {
                alertErrorMessage(res?.message || "Failed to update deposit status");
            }
        } catch (error) {
            alertErrorMessage("Error updating deposit status");
        }
        LoaderHelper.loaderStatus(false);
    };

    const userCell = (row) => (
        <div style={{ whiteSpace: "normal" }}>
            <div>{[row.firstName, row.lastName].filter(Boolean).join(" ") || row.uuid || "---"}</div>
            <small>{row.emailId || row.mobileNumber || row.user_id || "---"}</small>
        </div>
    );

    const copyCell = (value) => (
        <div className="d-flex align-items-center gap-2">
            <span title={value}>{truncateText(value)}</span>
            {value && (
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => handleCopy(value)}>
                    <i className="fa fa-copy"></i>
                </button>
            )}
        </div>
    );

    const proofCell = (row) => {
        const url = getDepositSlipUrl(row.deposit_slip);
        if (!url) return "---";
        return (
            <img
                src={url}
                alt="Payment proof"
                className="table-img cursor_pointer"
                style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, cursor: "pointer" }}
                onClick={() => setPreviewImage(url)}
            />
        );
    };

    const actionCell = (row) => (
        <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-sm btn-success" onClick={() => handleApprove(row)}>
                Approve
            </button>
            <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                    setRejectRow(row);
                    setRejectReason("");
                }}
            >
                Reject
            </button>
        </div>
    );

    const columns = [
        { name: "Sr No.", width: "80px", selector: (row, index) => skip + index + 1 },
        { name: "User", wrap: true, minWidth: "180px", selector: userCell },
        { name: "Coin", width: "100px", selector: (row) => row.short_name || row.currency || "---" },
        { name: "Chain", width: "110px", selector: (row) => row.chain || "---" },
        { name: "Amount", width: "110px", selector: (row) => row.amount ?? "---" },
        { name: "Tx Hash", wrap: true, minWidth: "180px", selector: (row) => copyCell(row.transaction_hash) },
        { name: "To Address", wrap: true, minWidth: "180px", selector: (row) => copyCell(row.to_address) },
        { name: "Payment Proof", width: "130px", selector: proofCell },
        {
            name: "Date",
            wrap: true,
            minWidth: "150px",
            selector: (row) => row.createdAt ? (
                <div>
                    <div>{moment(row.createdAt).format("DD MMM YYYY")}</div>
                    <small>{moment(row.createdAt).format("hh:mm A")}</small>
                </div>
            ) : "---"
        },
        ...(activeStatus === "PENDING"
            ? [{ name: "Actions", minWidth: "180px", wrap: true, selector: actionCell }]
            : []),
        ...(activeStatus === "REJECTED"
            ? [{ name: "Reject Reason", wrap: true, minWidth: "180px", selector: (row) => row.reject_reason || "---" }]
            : []),
        ...(activeStatus !== "PENDING"
            ? [{
                name: "Status",
                width: "120px",
                selector: (row) => (
                    <span className={`badge ${row.status === "SUCCESS" ? "bg-success" : row.status === "REJECTED" ? "bg-danger" : "bg-warning"}`}>
                        {row.status === "SUCCESS" ? "APPROVED" : row.status || "---"}
                    </span>
                )
            }]
            : [])
    ];

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
                                            <div className="page-header-icon"><i className="fa fa-dollar-sign"></i></div>
                                            Manual Deposit Requests
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="container-xl px-4 mt-n10">
                        <div className="card mb-4">
                            <div className="card-header">
                                <ul className="nav nav-pills">
                                    {STATUS_TABS.map((tab) => (
                                        <li className="nav-item" key={tab.key}>
                                            <button
                                                type="button"
                                                className={`nav-link ${activeStatus === tab.key ? "active" : ""}`}
                                                onClick={() => handleTabChange(tab.key)}
                                            >
                                                {tab.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="card-body">
                                <div className="row g-3 mb-4">
                                    <div className="col-md-3">
                                        <label className="form-label">Chain</label>
                                        <select
                                            className="form-select form-control form-control-solid"
                                            value={filterInputs.chain}
                                            onChange={(e) => handleFilterInput("chain", e.target.value)}
                                        >
                                            <option value="">All</option>
                                            {CHAIN_OPTIONS.map((chain) => (
                                                <option key={chain} value={chain}>{chain}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Coin (Short Name)</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-solid"
                                            placeholder="USDT"
                                            value={filterInputs.short_name}
                                            onChange={(e) => handleFilterInput("short_name", e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <div className="col-md-4 d-flex align-items-end gap-2">
                                        <button className="btn btn-indigo" type="button" onClick={handleSearchFilters}>
                                            Search
                                        </button>
                                        <button className="btn btn-secondary" type="button" onClick={handleResetFilters}>
                                            Reset Filters
                                        </button>
                                    </div>
                                </div>

                                <DataTableBase columns={columns} data={list} pagination={false} />
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
                </main>
            </div>

            {rejectRow && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    style={{ display: "block" }}
                    onClick={() => { setRejectRow(null); setRejectReason(""); }}
                >
                    <div className="modal-dialog modal-dialog-centered alert_modal" role="document">
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h5 className="modal-title">Reject Deposit Request</h5>
                                <button
                                    className="btn-close"
                                    type="button"
                                    aria-label="Close"
                                    onClick={() => { setRejectRow(null); setRejectReason(""); }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleRejectSubmit}>
                                    <p className="mb-3">
                                        Reject {rejectRow.amount} {rejectRow.short_name} for {rejectRow.emailId || rejectRow.uuid || "this user"}?
                                    </p>
                                    <div className="form-group mb-3">
                                        <label className="small mb-1">Reject Reason (optional)</label>
                                        <textarea
                                            className="form-control form-control-solid"
                                            rows="3"
                                            placeholder="Transaction hash does not match blockchain records"
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn btn-danger btn-block w-100" type="submit">
                                        Reject Deposit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {previewImage && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    style={{ display: "block" }}
                    onClick={() => setPreviewImage("")}
                >
                    <div className="modal-dialog modal-dialog-centered alert_modal modal-lg" role="document">
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h5 className="modal-title">Payment Proof</h5>
                                <button className="btn-close" type="button" aria-label="Close" onClick={() => setPreviewImage("")}></button>
                            </div>
                            <div className="modal-body text-center">
                                <img src={previewImage} alt="Payment proof" className="img-fluid" style={{ maxHeight: "70vh", borderRadius: 8 }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManualDepositRequest;
