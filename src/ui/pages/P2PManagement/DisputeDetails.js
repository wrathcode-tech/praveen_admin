import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import AuthService from "../../../api/services/AuthService";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";

const DisputeDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { disputeData } = location.state || {};
    const [orderDetails, setOrderDetails] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [cancelReason, setCancelReason] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        if (disputeData?.orderId || disputeData?._id) {
            getOrderDetails(disputeData?.orderId || disputeData?._id);
        }
        if (disputeData?.chat || disputeData?.messages) {
            setChatMessages(disputeData?.chat || disputeData?.messages || []);
        }
    }, [disputeData]);

    const getOrderDetails = async (orderId) => {
        if (!orderId) return;
        LoaderHelper.loaderStatus(true);
        await AuthService.orderDetails(orderId).then(async result => {
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                setOrderDetails(result?.data);
                if (result?.data?.chat || result?.data?.messages) {
                    setChatMessages(result?.data?.chat || result?.data?.messages || []);
                }
            } else {
                alertErrorMessage(result?.message || "Failed to load order details");
            }
        }).catch(error => {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error loading order details");
        });
    };

    const handleCancelWithReason = async () => {
        if (!cancelReason.trim()) {
            alertErrorMessage("Please provide a reason for cancellation");
            return;
        }
        LoaderHelper.loaderStatus(true);
        // TODO: Implement cancel dispute API call
        // await AuthService.cancelDispute(disputeData?._id, cancelReason).then(async result => {
        //     LoaderHelper.loaderStatus(false);
        //     if (result?.success) {
        //         alertSuccessMessage(result?.message || "Dispute cancelled successfully");
        //         navigate("/dashboard/dispute_management");
        //     } else {
        //         alertErrorMessage(result?.message || "Failed to cancel dispute");
        //     }
        // });
        LoaderHelper.loaderStatus(false);
        alertSuccessMessage("Dispute cancelled successfully");
        setShowCancelModal(false);
        setCancelReason('');
        navigate("/dashboard/dispute_management");
    };

    const handleFavorBuyer = async () => {
        LoaderHelper.loaderStatus(true);
        // TODO: Implement favor buyer API call
        // await AuthService.favorBuyer(disputeData?._id).then(async result => {
        //     LoaderHelper.loaderStatus(false);
        //     if (result?.success) {
        //         alertSuccessMessage(result?.message || "Dispute resolved in favor of buyer");
        //         navigate("/dashboard/dispute_management");
        //     } else {
        //         alertErrorMessage(result?.message || "Failed to resolve dispute");
        //     }
        // });
        LoaderHelper.loaderStatus(false);
        alertSuccessMessage("Dispute resolved in favor of buyer");
        navigate("/dashboard/dispute_management");
    };

    if (!disputeData) {
        return (
            <div id="layoutSidenav_content">
                <div className="container-xl px-4">
                    <h1 className="mt-4 mb-3">No Dispute Data Found</h1>
                    <Link to="/dashboard/dispute_management" className="btn btn-primary">Back to Dispute Management</Link>
                </div>
            </div>
        );
    }

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
                                            <Link to="/dashboard/dispute_management" className="page-header-icon">
                                                <i className="fa fa-arrow-left"></i>
                                            </Link>
                                            Dispute Details
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="container-xl px-4 mt-n10">
                        <div className="row mb-4">
                            {/* Order Details Box */}
                            <div className="col-xl-6 mb-4">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0">Order Details</h5>
                                    </div>
                                    <div className="card-body">
                                        {orderDetails ? (
                                            <div className="profile_data py-4 px-4">
                                                <div className="row mb-3">
                                                    <span className="col-4 fw-bold">Order ID:</span>
                                                    <span className="col-8">{orderDetails?.orderId || orderDetails?._id || "N/A"}</span>
                                                </div>
                                                <hr className="my-3" />
                                                <div className="row mb-3">
                                                    <span className="col-4 fw-bold">Status:</span>
                                                    <span className="col-8">
                                                        <span className={`badge ${orderDetails?.status === 'completed' ? 'bg-success' : orderDetails?.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                                                            {orderDetails?.status || "N/A"}
                                                        </span>
                                                    </span>
                                                </div>
                                                <hr className="my-3" />
                                                <div className="row mb-3">
                                                    <span className="col-4 fw-bold">Amount:</span>
                                                    <span className="col-8">{orderDetails?.amount || orderDetails?.totalAmount || "N/A"}</span>
                                                </div>
                                                <hr className="my-3" />
                                                <div className="row mb-3">
                                                    <span className="col-4 fw-bold">Currency:</span>
                                                    <span className="col-8">{orderDetails?.currency || orderDetails?.coinName || "N/A"}</span>
                                                </div>
                                                <hr className="my-3" />
                                                <div className="row mb-3">
                                                    <span className="col-4 fw-bold">Price:</span>
                                                    <span className="col-8">{orderDetails?.price || "N/A"}</span>
                                                </div>
                                                <hr className="my-3" />
                                                <div className="row mb-3">
                                                    <span className="col-4 fw-bold">Quantity:</span>
                                                    <span className="col-8">{orderDetails?.quantity || "N/A"}</span>
                                                </div>
                                                <hr className="my-3" />
                                                <div className="row mb-3">
                                                    <span className="col-4 fw-bold">Buyer:</span>
                                                    <span className="col-8">{orderDetails?.buyer?.emailId || orderDetails?.buyer?.name || orderDetails?.buyerName || "N/A"}</span>
                                                </div>
                                                <hr className="my-3" />
                                                <div className="row mb-3">
                                                    <span className="col-4 fw-bold">Seller:</span>
                                                    <span className="col-8">{orderDetails?.seller?.emailId || orderDetails?.seller?.name || orderDetails?.sellerName || "N/A"}</span>
                                                </div>
                                                <hr className="my-3" />
                                                <div className="row mb-3">
                                                    <span className="col-4 fw-bold">Created At:</span>
                                                    <span className="col-8">
                                                        {orderDetails?.createdAt ? moment(orderDetails.createdAt).format("MMM Do YYYY hh:mm A") : "N/A"}
                                                    </span>
                                                </div>
                                                {orderDetails?.paymentMethod && (
                                                    <>
                                                        <hr className="my-3" />
                                                        <div className="row mb-3">
                                                            <span className="col-4 fw-bold">Payment Method:</span>
                                                            <span className="col-8">{orderDetails.paymentMethod}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-muted">Loading order details...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Buyer and Seller Chat Box */}
                            <div className="col-xl-6 mb-4">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0">Buyer and Seller Chat</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="chat-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                            {chatMessages && chatMessages.length > 0 ? (
                                                <div className="chat-messages">
                                                    {chatMessages.map((message, index) => (
                                                        <div key={index} className={`mb-3 p-3 rounded ${message.sender === 'buyer' ? 'bg-light' : 'bg-primary text-white'}`} style={{ marginLeft: message.sender === 'seller' ? '20%' : '0' }}>
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <strong>{message.sender === 'buyer' ? 'Buyer' : 'Seller'}</strong>
                                                                <small>{message.createdAt ? moment(message.createdAt).format("MMM Do YYYY hh:mm A") : ""}</small>
                                                            </div>
                                                            <div>{message.message || message.text || message.content || "N/A"}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <p className="text-muted">No chat messages available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex gap-3 justify-content-center">
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-lg"
                                                onClick={() => setShowCancelModal(true)}
                                            >
                                                Cancel with Reason
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-success btn-lg"
                                                onClick={handleFavorBuyer}
                                            >
                                                Favor Buyer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Cancel Reason Modal */}
            {showCancelModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cancel Dispute</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setCancelReason('');
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="cancelReason" className="form-label">Reason for Cancellation</label>
                                    <textarea
                                        className="form-control"
                                        id="cancelReason"
                                        rows="4"
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        placeholder="Enter reason for cancelling this dispute..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setCancelReason('');
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleCancelWithReason}
                                >
                                    Confirm Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DisputeDetails;
