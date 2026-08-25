import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import { formatPair, formatUsdt, getProfileImageUrl, StarRating } from "./copyTradingUtils";

const MasterList = () => {
    const navigate = useNavigate();
    const [masterList, setMasterList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [totalData, setTotalData] = useState(0);
    const [status, setStatus] = useState("");

    const skip = (currentPage - 1) * itemsPerPage;
    const pageCount = Math.ceil(totalData / itemsPerPage);

    useEffect(() => {
        fetchMasterList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, status]);

    const fetchMasterList = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const params = { skip, limit: itemsPerPage };
            if (status) params.status = status;
            const res = await AuthService.copyTradingMasterList(params);
            if (res?.success) {
                setMasterList(res.data || []);
                setTotalData(res.total || 0);
            } else {
                setMasterList([]);
                setTotalData(0);
                alertErrorMessage(res?.message || "Failed to fetch masters");
            }
        } catch (error) {
            setMasterList([]);
            alertErrorMessage("Error fetching masters");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleStatusFilter = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const actionButtons = (row) => (
        <div className="d-flex gap-2 flex-wrap">
            <button
                className="btn btn-sm btn-warning"
                onClick={() => navigate(`/dashboard/copy-trading/edit-master/${row._id}`)}
            >
                <i className="fa fa-edit"></i> Edit
            </button>
            <button
                className="btn btn-sm btn-primary"
                onClick={() => navigate(`/dashboard/copy-trading/master/${row._id}`)}
            >
                <i className="fa fa-eye"></i> View
            </button>
            <button
                className="btn btn-sm btn-success"
                disabled={row.status !== "ACTIVE"}
                onClick={() => navigate("/dashboard/copy-trading/place-trade", { state: { masterId: row._id } })}
            >
                <i className="fa fa-plus"></i> Place Trade
            </button>
        </div>
    );

    const columns = [
        { name: "Sr No.", selector: (row, index) => skip + index + 1, width: "80px" },
        {
            name: "Name",
            wrap: true,
            minWidth: "180px",
            selector: (row) => (
                <div className="d-flex align-items-center gap-2 py-1">
                    {row.profileImage ? (
                        <img
                            src={getProfileImageUrl(row.profileImage)}
                            alt={row.name}
                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                        />
                    ) : (
                        <div
                            className="d-flex align-items-center justify-content-center bg-light"
                            style={{ width: 36, height: 36, borderRadius: "50%" }}
                        >
                            <i className="fa fa-user text-muted"></i>
                        </div>
                    )}
                    <span>{row.name || "N/A"}</span>
                </div>
            )
        },
        {
            name: "Status",
            width: "110px",
            selector: (row) => (
                <span className={`badge ${row.status === "ACTIVE" ? "bg-success" : "bg-secondary"}`}>
                    {row.status || "N/A"}
                </span>
            )
        },
        { name: "Pair", selector: (row) => formatPair(row), width: "130px" },
        {
            name: "Rating",
            minWidth: "140px",
            selector: (row) => <StarRating value={row.rating} />
        },
        { name: "Followers", selector: (row) => row.realFollowerCount ?? 0, width: "110px" },
        { name: "AUM", selector: (row) => formatUsdt(row.aum), width: "140px" },
        { name: "Total Profit Given", selector: (row) => formatUsdt(row.totalProfitGiven), minWidth: "170px" },
        { name: "Total Loss", selector: (row) => formatUsdt(row.totalLossGiven), minWidth: "140px" },
        { name: "Total Trades", selector: (row) => row.totalTrades ?? 0, width: "120px" },
        { name: "Actions", selector: actionButtons, minWidth: "280px" }
    ];

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h1>Copy Trading Masters</h1>
                    <button
                        className="btn btn-indigo"
                        onClick={() => navigate("/dashboard/copy-trading/add-master")}
                    >
                        <i className="fa fa-plus"></i> Add Master
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
                                    value={status}
                                    onChange={(e) => handleStatusFilter(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </div>
                            <div className="col-md-3 d-flex align-items-end">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => handleStatusFilter("")}
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4">
                    <div className="card-body">
                        <DataTableBase columns={columns} data={masterList} pagination={false} />
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

export default MasterList;
