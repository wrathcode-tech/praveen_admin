import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import moment from "moment";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";

const P2POrderDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId } = location.state || {};
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        } else {
            alertErrorMessage("Order ID not provided");
            navigate("/dashboard/p2p-orders");
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.p2pGetOrderDetails(orderId);
            if (res.success) {
                setOrderDetails(res.data);
            } else {
                alertErrorMessage(res.message || "Failed to fetch order details");
            }
        } catch (error) {
            alertErrorMessage("Error fetching order details");
        }
        LoaderHelper.loaderStatus(false);
        setLoading(false);
    };

    if (loading) {
        return (
            <div id="layoutSidenav_content">
                <div className="container-xl px-4">
                    <div className="text-center py-5">
                        <p>Loading order details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div id="layoutSidenav_content">
                <div className="container-xl px-4">
                    <div className="text-center py-5">
                        <p>Order not found</p>
                        <button className="btn btn-secondary" onClick={() => navigate("/dashboard/p2p-orders")}>
                            Back to Orders List
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h1>P2P Order Details</h1>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboard/p2p-orders")}
                    >
                        <i className="fa fa-arrow-left"></i> Back to Orders List
                    </button>
                </div>

                <div className="row">
                    {/* Order Information */}
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">Order Information</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <strong>Order ID:</strong> {orderDetails._id || "N/A"}
                                </div>
                                <div className="mb-3">
                                    <strong>Status:</strong>{" "}
                                    <span className={`badge ${
                                        orderDetails.status === "RELEASED" ? "bg-success" :
                                        orderDetails.status === "PAID" ? "bg-info" :
                                        orderDetails.status === "PENDING_PAYMENT" ? "bg-warning" :
                                        orderDetails.status === "CANCELLED" ? "bg-danger" :
                                        orderDetails.status === "DISPUTE" ? "bg-danger" :
                                        "bg-secondary"
                                    }`}>
                                        {orderDetails.status || "N/A"}
                                    </span>
                                </div>
                                <div className="mb-3">
                                    <strong>Price:</strong> {orderDetails.price || "N/A"}
                                </div>
                                <div className="mb-3">
                                    <strong>Fiat Amount:</strong> {orderDetails.fiatAmount || "N/A"}
                                </div>
                                <div className="mb-3">
                                    <strong>Crypto Amount:</strong> {orderDetails.cryptoAmount || "N/A"}
                                </div>
                                <div className="mb-3">
                                    <strong>Created At:</strong> {orderDetails.createdAt ? moment(orderDetails.createdAt).format("MMM Do YYYY, hh:mm A") : "N/A"}
                                </div>
                                {orderDetails.expiresAt && (
                                    <div className="mb-3">
                                        <strong>Expires At:</strong> {moment(orderDetails.expiresAt).format("MMM Do YYYY, hh:mm A")}
                                    </div>
                                )}
                                {orderDetails.disputeBy && (
                                    <div className="mb-3">
                                        <strong>Dispute By:</strong>{" "}
                                        <span className="badge bg-danger">{orderDetails.disputeBy}</span>
                                    </div>
                                )}
                                {orderDetails.disputeReason && (
                                    <div className="mb-3">
                                        <strong>Dispute Reason:</strong> {orderDetails.disputeReason}
                                    </div>
                                )}
                                {orderDetails.cancelReason && (
                                    <div className="mb-3">
                                        <strong>Cancel Reason:</strong> {orderDetails.cancelReason}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ad Information */}
                    {orderDetails.adId && (
                        <div className="col-md-6 mb-4">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Ad Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <strong>Ad UID:</strong> {orderDetails.adId.adUid || "N/A"}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Side:</strong>{" "}
                                        <span className={`badge ${orderDetails.adId.side === "BUY" ? "bg-success" : "bg-danger"}`}>
                                            {orderDetails.adId.side || "N/A"}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <strong>Fiat Currency:</strong> {orderDetails.adId.fiatCurrency || "N/A"}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Quote Currency:</strong> {orderDetails.adId.qouteCurrency || "N/A"}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Fixed Price:</strong> {orderDetails.adId.fixedPrice || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Buyer Information */}
                    {orderDetails.buyerId && (
                        <div className="col-md-6 mb-4">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Buyer Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <strong>Name:</strong> {`${orderDetails.buyerId.firstName || ""} ${orderDetails.buyerId.lastName || ""}`.trim() || "N/A"}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Email:</strong> {orderDetails.buyerId.emailId || "N/A"}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Phone:</strong> {orderDetails.buyerId.mobileNumber || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Seller Information */}
                    {orderDetails.sellerId && (
                        <div className="col-md-6 mb-4">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Seller Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <strong>Name:</strong> {`${orderDetails.sellerId.firstName || ""} ${orderDetails.sellerId.lastName || ""}`.trim() || "N/A"}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Email:</strong> {orderDetails.sellerId.emailId || "N/A"}
                                    </div>
                                    <div className="mb-3">
                                        <strong>Phone:</strong> {orderDetails.sellerId.mobileNumber || "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Proof */}
                    {orderDetails.buyerPaymentProof && (
                        <div className="col-md-12 mb-4">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Payment Proof</h5>
                                </div>
                                <div className="card-body">
                                    {orderDetails.buyerPaymentProof && (
                                        <div className="mb-3">
                                            <strong>Payment Proof:</strong>
                                            <div className="mt-2">
                                                {typeof orderDetails.buyerPaymentProof === 'string' ? (
                                                    <img src={ApiConfig?.appUrl+orderDetails.buyerPaymentProof} alt="Payment Proof" className="img-fluid" style={{ maxWidth: '500px' }} />
                                                ) : (
                                                    <p>{JSON.stringify(orderDetails.buyerPaymentProof)}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {orderDetails.buyerMarkedAt && (
                                        <div className="mb-3">
                                            <strong>Marked as Paid At:</strong> {moment(orderDetails.buyerMarkedAt).format("MMM Do YYYY, hh:mm A")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default P2POrderDetails;

