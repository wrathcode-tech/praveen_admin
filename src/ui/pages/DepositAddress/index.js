import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Swal from "sweetalert2";
import copy from "copy-to-clipboard";
import QRCode from "react-qr-code";

const CHAIN_OPTIONS = ["BEP20", "ERC20", "TRC20", "POLYGON"];

const emptyForm = {
    address: "",
    chain: "",
    status: "ACTIVE"
};

const DepositAddress = () => {
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(50);
    const [totalData, setTotalData] = useState(0);
    const [filters, setFilters] = useState({ status: "", chain: "" });
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [viewRow, setViewRow] = useState(null);

    const skip = (currentPage - 1) * itemsPerPage;
    const pageCount = Math.ceil(totalData / itemsPerPage);

    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filters]);

    const fetchList = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const params = { skip, limit: itemsPerPage };
            if (filters.status) params.status = filters.status;
            if (filters.chain) params.chain = filters.chain;
            const res = await AuthService.depositAddressList(params);
            if (res?.success) {
                setList(res.data || []);
                setTotalData(res.total || 0);
            } else {
                setList([]);
                setTotalData(0);
                alertErrorMessage(res?.message || "Failed to fetch deposit addresses");
            }
        } catch (error) {
            setList([]);
            alertErrorMessage("Error fetching deposit addresses");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setFilters({ status: "", chain: "" });
        setCurrentPage(1);
    };

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setShowModal(true);
    };

    const openEditModal = (row) => {
        setEditingId(row._id);
        setFormData({
            address: row.address || "",
            chain: row.chain || "",
            status: row.status || "ACTIVE"
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData(emptyForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.address.trim()) {
            alertErrorMessage("address is required");
            return;
        }
        if (!formData.chain.trim()) {
            alertErrorMessage("chain is required");
            return;
        }

        LoaderHelper.loaderStatus(true);
        try {
            let res;
            if (editingId) {
                const payload = { id: editingId };
                if (formData.address.trim()) payload.address = formData.address.trim();
                if (formData.chain.trim()) payload.chain = formData.chain.trim();
                res = await AuthService.depositAddressUpdate(payload);
            } else {
                const payload = {
                    address: formData.address.trim(),
                    chain: formData.chain.trim(),
                    status: formData.status || "ACTIVE"
                };
                res = await AuthService.depositAddressAdd(payload);
            }

            if (res?.success) {
                alertSuccessMessage(res.message || (editingId ? "Deposit address updated successfully" : "Deposit address added successfully"));
                closeModal();
                fetchList();
            } else {
                alertErrorMessage(res?.message || "Failed to save deposit address");
            }
        } catch (error) {
            alertErrorMessage("Error saving deposit address");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleStatusToggle = async (row) => {
        const nextStatus = row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const result = await Swal.fire({
            title: "Confirm Status Change",
            text: `Are you sure you want to set this address as ${nextStatus}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change it"
        });

        if (!result.isConfirmed) return;

        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.depositAddressUpdateStatus({
                id: row._id,
                status: nextStatus
            });
            if (res?.success) {
                alertSuccessMessage(res.message || "Status updated successfully");
                fetchList();
            } else {
                alertErrorMessage(res?.message || "Failed to update status");
            }
        } catch (error) {
            alertErrorMessage("Error updating status");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleDelete = async (row) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Delete address ${row.address}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it"
        });

        if (!result.isConfirmed) return;

        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.depositAddressDelete({ id: row._id });
            if (res?.success) {
                alertSuccessMessage(res.message || "Deposit address deleted successfully");
                fetchList();
            } else {
                alertErrorMessage(res?.message || "Failed to delete deposit address");
            }
        } catch (error) {
            alertErrorMessage("Error deleting deposit address");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleCopy = (address) => {
        if (!address) return;
        copy(address);
        alertSuccessMessage("Address copied");
    };

    const truncateAddress = (address) => {
        if (!address) return "N/A";
        if (address.length <= 16) return address;
        return `${address.slice(0, 8)}...${address.slice(-6)}`;
    };

    const formatDateTime = (value) => (
        value ? moment(value).format("DD MMM YYYY, hh:mm A") : "N/A"
    );

    const actionButtons = (row) => (
        <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-sm btn-primary" onClick={() => setViewRow(row)}>
                <i className="fa fa-eye"></i> View
            </button>
            <button className="btn btn-sm btn-warning" onClick={() => openEditModal(row)}>
                <i className="fa fa-edit"></i> Edit
            </button>
            <button
                className={`btn btn-sm ${row.status === "ACTIVE" ? "btn-success" : "btn-secondary"}`}
                onClick={() => handleStatusToggle(row)}
            >
                {row.status === "ACTIVE" ? "Active" : "Inactive"}
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row)}>
                <i className="fa fa-trash"></i> Delete
            </button>
        </div>
    );

    const columns = [
        { name: "Sr No.", selector: (row, index) => skip + index + 1, width: "80px" },
        {
            name: "Address",
            minWidth: "220px",
            wrap: true,
            selector: (row) => (
                <div className="d-flex align-items-center gap-2">
                    <span title={row.address}>{truncateAddress(row.address)}</span>
                    {row.address && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleCopy(row.address)}
                        >
                            <i className="fa fa-copy"></i>
                        </button>
                    )}
                </div>
            )
        },
        { name: "Chain", selector: (row) => row.chain || "N/A", width: "120px" },
        {
            name: "Status",
            width: "120px",
            selector: (row) => (
                <span className={`badge ${row.status === "ACTIVE" ? "bg-success" : "bg-danger"}`}>
                    {row.status || "N/A"}
                </span>
            )
        },
        {
            name: "Created",
            wrap: true,
            minWidth: "150px",
            grow: 0,
            selector: (row) => row.createdAt ? (
                <div>
                    <div>{moment(row.createdAt).format("DD MMM YYYY")}</div>
                    <small>{moment(row.createdAt).format("hh:mm A")}</small>
                </div>
            ) : "N/A"
        },
        { name: "Actions", selector: actionButtons, minWidth: "340px", wrap: true }
    ];

    return (
        <>
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h1>Manage Deposit Address</h1>
                    <button className="btn btn-indigo" onClick={openAddModal}>
                        <i className="fa fa-plus"></i> Add Deposit Address
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
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Chain</label>
                                <select
                                    className="form-select"
                                    value={filters.chain}
                                    onChange={(e) => handleFilterChange("chain", e.target.value)}
                                >
                                    <option value="">All</option>
                                    {CHAIN_OPTIONS.map((chain) => (
                                        <option key={chain} value={chain}>{chain}</option>
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

        </div>

        {showModal && (
            <div
                className="modal fade show"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                style={{ display: "block" }}
                onClick={closeModal}
            >
                <div className="modal-dialog modal-dialog-centered alert_modal" role="document">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {editingId ? "Edit Deposit Address" : "Add Deposit Address"}
                            </h5>
                            <button
                                className="btn-close"
                                type="button"
                                aria-label="Close"
                                onClick={closeModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3 position-relative">
                                    <label className="small mb-1">
                                        Deposit Address <em>*</em>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-solid input-copy"
                                        value={formData.address}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                        placeholder="Enter deposit address"
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3 position-relative">
                                    <label className="small mb-1">
                                        Chain <em>*</em>
                                    </label>
                                    <select
                                        className="form-control form-control-solid form-select"
                                        value={formData.chain}
                                        onChange={(e) => handleChange("chain", e.target.value)}
                                        required
                                    >
                                        <option value="">Select Chain</option>
                                        {CHAIN_OPTIONS.map((chain) => (
                                            <option key={chain} value={chain}>{chain}</option>
                                        ))}
                                    </select>
                                </div>
                                {!editingId && (
                                    <div className="form-group mb-3 position-relative">
                                        <label className="small mb-1">Status</label>
                                        <select
                                            className="form-control form-control-solid form-select"
                                            value={formData.status}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                        </select>
                                    </div>
                                )}
                                <div className="form-group mb-0 position-relative">
                                    <button className="btn btn-primary btn-block w-100" type="submit">
                                        {editingId ? "Update" : "Add Address"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {viewRow && (
            <div
                className="modal fade show"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                style={{ display: "block" }}
                onClick={() => setViewRow(null)}
            >
                <div className="modal-dialog modal-dialog-centered alert_modal" role="document">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="modal-title">Deposit Address Details</h5>
                            <button
                                className="btn-close"
                                type="button"
                                aria-label="Close"
                                onClick={() => setViewRow(null)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="text-center mb-4">
                                {viewRow.address ? (
                                    <div
                                        className="d-inline-block p-3"
                                        style={{ background: "#fff", borderRadius: 12 }}
                                    >
                                        <QRCode value={viewRow.address} size={180} />
                                    </div>
                                ) : (
                                    <p className="mb-0">No address available for QR</p>
                                )}
                            </div>
                            <div className="form-group mb-3">
                                <label className="small mb-1">Deposit Address</label>
                                <div className="d-flex gap-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-solid"
                                        value={viewRow.address || "N/A"}
                                        readOnly
                                    />
                                    {viewRow.address && (
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => handleCopy(viewRow.address)}
                                        >
                                            <i className="fa fa-copy"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="row gx-3">
                                <div className="col-md-6 mb-3">
                                    <label className="small mb-1">Chain</label>
                                    <div className="form-control form-control-solid">{viewRow.chain || "N/A"}</div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="small mb-1">Status</label>
                                    <div>
                                        <span className={`badge ${viewRow.status === "ACTIVE" ? "bg-success" : "bg-danger"}`}>
                                            {viewRow.status || "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="small mb-1">Created</label>
                                    <div className="form-control form-control-solid">{formatDateTime(viewRow.createdAt)}</div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="small mb-1">Updated</label>
                                    <div className="form-control form-control-solid">{formatDateTime(viewRow.updatedAt)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default DepositAddress;
