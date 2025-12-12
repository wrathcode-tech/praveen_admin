import React, { useState, useEffect } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import moment from "moment";
import Swal from "sweetalert2";

const FiatCurrencyManagement = () => {
    const [fiatList, setFiatList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingFiat, setEditingFiat] = useState(null);
    const [filters, setFilters] = useState({
        status: "",
        search: "",
        // sortBy: "createdAt",
        // sortOrder: "desc"
    });
    const [formData, setFormData] = useState({
        currency_name: "",
        short_name: ""
    });

    const handlePageChange = ({ selected }) => setCurrentPage(selected + 1);
    const pageCount = Math.ceil(totalData / itemsPerPage);
    const skip = (currentPage - 1) * itemsPerPage;

    useEffect(() => {
        fetchFiatList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filters]);

    const fetchFiatList = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
            };
            const res = await AuthService.p2pGetFiatList(params);
            if (res.success) {
                setFiatList(res.data?.fiatCurrencies || []);
                setTotalData(res.data?.pagination?.totalItems || 0);
            } else {
                alertErrorMessage(res.message || "Failed to fetch fiat currencies");
            }
        } catch (error) {
            alertErrorMessage("Error fetching fiat currencies");
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
            search: "",
            sortBy: "createdAt",
            sortOrder: "desc"
        });
        setCurrentPage(1);
    };

    const handleAddFiat = async (e) => {
        e.preventDefault();
        if (!formData.currency_name.trim() || !formData.short_name.trim()) {
            alertErrorMessage("Please fill all fields");
            return;
        }

        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.p2pCreateFiat({
                currency_name: formData.currency_name.trim(),
                short_name: formData.short_name.trim().toUpperCase()
            });
            if (res.success) {
                alertSuccessMessage(res.message || "Fiat currency added successfully");
                setShowAddModal(false);
                setFormData({ currency_name: "", short_name: "" });
                fetchFiatList();
            } else {
                alertErrorMessage(res.message || "Failed to add fiat currency");
            }
        } catch (error) {
            alertErrorMessage("Error adding fiat currency");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleEditClick = (fiat) => {
        setEditingFiat(fiat);
        setFormData({
            currency_name: fiat.currency_name || "",
            short_name: fiat.short_name || ""
        });
        setShowEditModal(true);
    };

    const handleEditFiat = async (e) => {
        e.preventDefault();
        if (!formData.currency_name.trim() || !formData.short_name.trim()) {
            alertErrorMessage("Please fill all fields");
            return;
        }

        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.p2pUpdateFiat(editingFiat._id, {
                currency_name: formData.currency_name.trim(),
                short_name: formData.short_name.trim().toUpperCase()
            });
            if (res.success) {
                alertSuccessMessage(res.message || "Fiat currency updated successfully");
                setShowEditModal(false);
                setEditingFiat(null);
                setFormData({ currency_name: "", short_name: "" });
                fetchFiatList();
            } else {
                alertErrorMessage(res.message || "Failed to update fiat currency");
            }
        } catch (error) {
            alertErrorMessage("Error updating fiat currency");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleStatusUpdate = async (fiat) => {
        const newStatus = fiat.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const result = await Swal.fire({
            title: "Confirm Status Change",
            text: `Are you sure you want to ${newStatus === "ACTIVE" ? "activate" : "deactivate"} this currency?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change it!"
        });

        if (result.isConfirmed) {
            LoaderHelper.loaderStatus(true);
            try {
                const res = await AuthService.p2pUpdateFiatStatus(fiat._id, newStatus);
                if (res.success) {
                    alertSuccessMessage(res.message || "Status updated successfully");
                    fetchFiatList();
                } else {
                    alertErrorMessage(res.message || "Failed to update status");
                }
            } catch (error) {
                alertErrorMessage("Error updating status");
            }
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleDelete = async (fiat) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `You want to delete ${fiat.currency_name} (${fiat.short_name})?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            LoaderHelper.loaderStatus(true);
            try {
                const res = await AuthService.p2pDeleteFiat(fiat._id);
                if (res.success) {
                    alertSuccessMessage(res.message || "Fiat currency deleted successfully");
                    fetchFiatList();
                } else {
                    alertErrorMessage(res.message || "Failed to delete fiat currency");
                }
            } catch (error) {
                alertErrorMessage("Error deleting fiat currency");
            }
            LoaderHelper.loaderStatus(false);
        }
    };

    const actionButtons = (row) => (
        <div className="d-flex gap-2">
            <button
                className="btn btn-sm btn-primary"
                onClick={() => handleEditClick(row)}
            >
                <i className="fa fa-edit"></i> Edit
            </button>
            <button
                className={`btn btn-sm ${row.status === "ACTIVE" ? "btn-warning" : "btn-success"}`}
                onClick={() => handleStatusUpdate(row)}
            >
                {row.status === "ACTIVE" ? "Deactivate" : "Activate"}
            </button>
            <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(row)}
            >
                <i className="fa fa-trash"></i> Delete
            </button>
        </div>
    );

    const columns = [
        { name: "Sr No.", selector: (row, index) => skip + index + 1, width: "80px" },
        { name: "Currency Name", selector: row => row.currency_name || "N/A", wrap: true },
        { name: "Short Name", selector: row => row.short_name || "N/A", width: "150px" },
        {
            name: "Status",
            selector: row => (
                <span className={`badge ${row.status === "ACTIVE" ? "bg-success" : "bg-secondary"}`}>
                    {row.status || "N/A"}
                </span>
            ),
            width: "120px"
        },
        {
            name: "Created At",
            selector: row => row.createdAt ? moment(row.createdAt).format("MMM Do YYYY") : "N/A",
            width: "150px"
        },
        { name: "Actions", selector: actionButtons, width: "250px" }
    ];

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h1>P2P Fiat Currency Management</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddModal(true)}
                    >
                        <i className="fa fa-plus"></i> Add New Fiat
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
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                            {/* <div className="col-md-3">
                                <label className="form-label">Search</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    placeholder="Search currency name or short name"
                                />
                            </div> */}
                            {/* <div className="col-md-3">
                                <label className="form-label">Sort By</label>
                                <select
                                    className="form-select"
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                                >
                                    <option value="createdAt">Created At</option>
                                    <option value="updatedAt">Updated At</option>
                                    <option value="currency_name">Currency Name</option>
                                    <option value="short_name">Short Name</option>
                                    <option value="status">Status</option>
                                </select>
                            </div> */}
                            {/* <div className="col-md-3">
                                <label className="form-label">Sort Order</label>
                                <select
                                    className="form-select"
                                    value={filters.sortOrder}
                                    onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div> */}
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
                        <DataTableBase columns={columns} data={fiatList} pagination={false} />
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

                {/* Add Modal */}
                {showAddModal && (
                    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Fiat Currency</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setFormData({ currency_name: "", short_name: "" });
                                        }}
                                    ></button>
                                </div>
                                <form onSubmit={handleAddFiat}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="currency_name" className="form-label">Currency Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="currency_name"
                                                value={formData.currency_name}
                                                onChange={(e) => setFormData({ ...formData, currency_name: e.target.value })}
                                                placeholder="e.g., US Dollar"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="short_name" className="form-label">Short Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="short_name"
                                                value={formData.short_name}
                                                onChange={(e) => setFormData({ ...formData, short_name: e.target.value.toUpperCase() })}
                                                placeholder="e.g., USD"
                                                maxLength={10}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowAddModal(false);
                                                setFormData({ currency_name: "", short_name: "" });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">Add Fiat</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Fiat Currency</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setEditingFiat(null);
                                            setFormData({ currency_name: "", short_name: "" });
                                        }}
                                    ></button>
                                </div>
                                <form onSubmit={handleEditFiat}>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label htmlFor="edit_currency_name" className="form-label">Currency Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="edit_currency_name"
                                                value={formData.currency_name}
                                                onChange={(e) => setFormData({ ...formData, currency_name: e.target.value })}
                                                placeholder="e.g., US Dollar"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="edit_short_name" className="form-label">Short Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="edit_short_name"
                                                value={formData.short_name}
                                                onChange={(e) => setFormData({ ...formData, short_name: e.target.value.toUpperCase() })}
                                                placeholder="e.g., USD"
                                                maxLength={10}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowEditModal(false);
                                                setEditingFiat(null);
                                                setFormData({ currency_name: "", short_name: "" });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">Update Fiat</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FiatCurrencyManagement;

