import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import moment from "moment";
import DataTableBase from "../../../customComponent/DataTable";

const P2PAdDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { adId } = location.state || {};
    const [adDetails, setAdDetails] = useState(null);
    const [orders, setOrders] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (adId) {
            fetchAdDetails();
        } else {
            alertErrorMessage("Ad ID not provided");
            navigate("/dashboard/p2p-ads");
        }
    }, [adId]);

    const fetchAdDetails = async () => {
        setLoading(true);
        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.p2pGetAdDetails(adId);
            if (res.success) {
                setAdDetails(res.data?.ad);
                setOrders(res.data?.orders || []);
                setStatistics(res.data?.statistics);
            } else {
                alertErrorMessage(res.message || "Failed to fetch ad details");
            }
        } catch (error) {
            alertErrorMessage("Error fetching ad details");
        }
        LoaderHelper.loaderStatus(false);
        setLoading(false);
    };

    const orderColumns = [
        { name: "Sr No.", selector: (row, index) => index + 1, width: "80px" },
        { name: "Order ID", selector: row => row._id?.substring(0, 8) || "N/A", width: "120px" },
        {
            name: "Buyer",
            selector: row => row.buyerId ? `${row.buyerId.firstName || ""} ${row.buyerId.lastName || ""}`.trim() || row.buyerId.emailId : "N/A",
            wrap: true
        },
        {
            name: "Seller",
            selector: row => row.sellerId ? `${row.sellerId.firstName || ""} ${row.sellerId.lastName || ""}`.trim() || row.sellerId.emailId : "N/A",
            wrap: true
        },
        { name: "Fiat Amount", selector: row => row.fiatAmount || "N/A", width: "120px" },
        { name: "Crypto Amount", selector: row => row.cryptoAmount || "N/A", width: "120px" },
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
            selector: row => row.createdAt ? moment(row.createdAt).format("MMM Do YYYY hh:mm A") : "N/A",
            width: "180px"
        }
    ];

    if (loading) {
        return (
            <div id="layoutSidenav_content">
                <div className="container-xl px-4">
                    <div className="text-center py-5">
                        <p>Loading ad details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h1>P2P Ad Details</h1>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboard/p2p-ads")}
                    >
                        <i className="fa fa-arrow-left"></i> Back to Ads List
                    </button>
                </div>

                {adDetails && (
                    <>
                        {/* Ad Information */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="mb-0">Ad Information</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <strong>Ad UID:</strong> {adDetails.adUid || "N/A"}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Side:</strong>{" "}
                                            <span className={`badge ${adDetails.side === "BUY" ? "bg-success" : "bg-danger"}`}>
                                                {adDetails.side || "N/A"}
                                            </span>
                                        </div>
                                        <div className="mb-3">
                                            <strong>Fiat Currency:</strong> {adDetails.fiatCurrency || "N/A"}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Quote Currency:</strong> {adDetails.qouteCurrency || "N/A"}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Fixed Price:</strong> {adDetails.fixedPrice || "N/A"}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <strong>Volume:</strong> {adDetails.volume || "N/A"}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Remaining Volume:</strong> {adDetails.remainingVolume || "N/A"}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Min Limit:</strong> {adDetails.minLimit || "N/A"}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Max Limit:</strong> {adDetails.maxLimit || "N/A"}
                                        </div>
                                        <div className="mb-3">
                                            <strong>Status:</strong>{" "}
                                            <span className={`badge ${
                                                adDetails.status === "OPEN" ? "bg-success" :
                                                adDetails.status === "CLOSED" ? "bg-danger" :
                                                "bg-warning"
                                            }`}>
                                                {adDetails.status || "N/A"}
                                            </span>
                                        </div>
                                        <div className="mb-3">
                                            <strong>Online:</strong>{" "}
                                            <span className={`badge ${adDetails.isOnline ? "bg-success" : "bg-secondary"}`}>
                                                {adDetails.isOnline ? "Yes" : "No"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {adDetails.userId && (
                                    <div className="mt-3 pt-3 border-top">
                                        <h6>Ad Owner</h6>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <strong>Name:</strong> {`${adDetails.userId.firstName || ""} ${adDetails.userId.lastName || ""}`.trim() || "N/A"}
                                            </div>
                                            <div className="col-md-6">
                                                <strong>Email:</strong> {adDetails.userId.emailId || "N/A"}
                                            </div>
                                            <div className="col-md-6">
                                                <strong>Phone:</strong> {adDetails.userId.mobileNumber || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statistics */}
                        {statistics && (
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h5 className="mb-0">Statistics</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="text-center p-3 border rounded">
                                                <h4>{statistics.totalOrders || 0}</h4>
                                                <p className="mb-0">Total Orders</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="text-center p-3 border rounded">
                                                <h4>{statistics.releasedOrders || 0}</h4>
                                                <p className="mb-0">Released Orders</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="text-center p-3 border rounded">
                                                <h4>{statistics.totalCryptoTraded || 0}</h4>
                                                <p className="mb-0">Total Crypto Traded</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="text-center p-3 border rounded">
                                                <h4>{statistics.totalFiatTraded || 0}</h4>
                                                <p className="mb-0">Total Fiat Traded</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders List */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h5 className="mb-0">Orders ({orders.length})</h5>
                            </div>
                            <div className="card-body">
                                <DataTableBase columns={orderColumns} data={orders} pagination={false} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default P2PAdDetails;

