// ========================= FULL FILE STARTS HERE ===============================

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import AuthService from "../../../api/services/AuthService";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import Swal from "sweetalert2";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";
const DisputeDetails = () => {
    const location = useLocation();
    const { disputeData } = location.state || {};
    console.log(disputeData,"disputeData");
    
    const [orderDetails, setOrderDetails] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    console.log(chatMessages, "chatMessages");

    // FIX #1 — Stable memoized messages without creating new objects each render
    const validChatMessages = useMemo(() => {
        if (!chatMessages || !Array.isArray(chatMessages)) return [];
        return chatMessages.filter(msg => msg && msg._id);
    }, [chatMessages]);

    const [cancelReason, setCancelReason] = useState('');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailData, setEmailData] = useState({
        recipientType: "BUYER",
        subject: "",
        message: "",
        replyToEmail: ""
    });

    const [emailTemplates] = useState({
        paymentProof: {
            subject: "Request for Payment Proof - P2P Order",
            message: `Dear User,

We are reviewing your P2P order and require additional payment proof to proceed with the transaction.

Please provide:
- Clear screenshot or photo of the payment transaction
- Transaction reference number
- Bank statement or payment receipt showing the transaction

Order ID: {ORDER_ID}
Amount: {AMOUNT}

Please respond at your earliest convenience.

Thank you,
Support Team`
        },
        additionalInfo: {
            subject: "Additional Information Required - P2P Order",
            message: `Dear User,

We need some additional information regarding your P2P order to complete the verification process.

Please provide:
- Additional details about the transaction
- Any relevant documentation
- Clarification on the payment method used

Order ID: {ORDER_ID}
Amount: {AMOUNT}

Your prompt response will help us resolve this matter quickly.

Thank you,
Support Team`
        },
        verification: {
            subject: "Account Verification Required - P2P Order",
            message: `Dear User,

To proceed with your P2P order, we need to verify some account details.

Please provide:
- Valid government-issued ID
- Proof of address
- Additional verification documents if required

Order ID: {ORDER_ID}
Amount: {AMOUNT}

This verification is required for security purposes.

Thank you,
Support Team`
        }
    });

    const getOrderDetails = useCallback(async (orderId) => {
        if (!orderId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.p2pGetDisputeDetails(orderId);
            if (result?.success) {
                const messages = result.data?.chat?.messages || result.data?.messages || [];
                const validMessages = Array.isArray(messages)
                    ? messages.filter(msg => msg && msg._id)
                    : [];

                setChatMessages(validMessages);
                setOrderDetails(result.data);
            } else {
                alertErrorMessage(result?.message || "Failed to load order details");
            }
        } catch (error) {
            alertErrorMessage("Error loading order details");
        } finally {
            LoaderHelper.loaderStatus(false);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const orderId = location.state?.orderId || disputeData?.orderId || disputeData?._id;
        if (orderId) getOrderDetails(orderId);
    }, [location.state?.orderId, disputeData, getOrderDetails]);

    const handleCancelWithReason = async () => {
        if (!cancelReason.trim()) {
            alertErrorMessage("Please provide a reason for cancellation");
            return;
        }

        const orderId = location.state?.orderId || disputeData?.orderId || disputeData?._id;
        if (!orderId) {
            alertErrorMessage("Order ID not found");
            return;
        }

        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.p2pResolveDispute(orderId, {
                action: "CANCEL_ORDER",
                adminNote: cancelReason.trim()
            });

            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                alertSuccessMessage(result?.message || "Dispute cancelled successfully");
                setShowCancelModal(false);
                setCancelReason('');
                // Refresh order details instead of navigating away
                getOrderDetails(orderId);
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result?.message || "Failed to cancel dispute");
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error cancelling dispute");
        }
    };

    const handleFavorBuyer = async () => {
        const orderId = location.state?.orderId || disputeData?.orderId || disputeData?._id;
        if (!orderId) {
            alertErrorMessage("Order ID not found");
            return;
        }

        const result = await Swal.fire({
            title: "Confirm Resolution",
            html: `
                <p>Are you sure you want to resolve this dispute in favor of the buyer?</p>
                <p class="text-danger"><strong>This action will release the crypto to the buyer and cannot be undone.</strong></p>
                ${orderDetails ? `
                    <div class="text-start mt-3">
                        <p><strong>Order Details:</strong></p>
                        <ul class="text-start">
                            <li>Order ID: ${orderDetails._id || "N/A"}</li>
                            <li>Crypto Amount: ${orderDetails.cryptoAmount || "N/A"}</li>
                            <li>Fiat Amount: ${orderDetails.fiatAmount || "N/A"}</li>
                        </ul>
                    </div>
                ` : ""}
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#dc3545",
            confirmButtonText: "Yes, Release to Buyer",
            cancelButtonText: "Cancel",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        LoaderHelper.loaderStatus(true);
        try {
            const apiResult = await AuthService.p2pResolveDispute(orderId, {
                action: "RELEASE_TO_BUYER",
                adminNote: "Dispute resolved in favor of buyer"
            });
            console.log(apiResult, "apiResult");
            
            if (apiResult?.success) {
                LoaderHelper.loaderStatus(false);
                await Swal.fire({
                    title: "Success!",
                    text: apiResult?.message || "Dispute resolved in favor of buyer",
                    icon: "success",
                });

                // Refresh order details instead of navigating away
                const orderId = location.state?.orderId || disputeData?.orderId || disputeData?._id;
                if (orderId) {
                    getOrderDetails(orderId);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(apiResult?.message || "Failed to resolve dispute");
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error resolving dispute");
        }
    };

    const handleOpenEmailModal = (templateType = null) => {
        const orderId = location.state?.orderId || disputeData?.orderId || disputeData?._id;
        const orderAmount = orderDetails?.fiatAmount || orderDetails?.cryptoAmount || "N/A";

        if (templateType && emailTemplates[templateType]) {
            const template = emailTemplates[templateType];

            setEmailData({
                recipientType: "BUYER",
                subject: template.subject,
                message: template.message
                    .replace("{ORDER_ID}", orderId)
                    .replace("{AMOUNT}", orderAmount),
                replyToEmail: ""
            });
        } else {
            setEmailData({
                recipientType: "BUYER",
                subject: "",
                message: "",
                replyToEmail: ""
            });
        }

        setShowEmailModal(true);
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();

        const orderId = location.state?.orderId || disputeData?.orderId || disputeData?._id;
        if (!orderId) return alertErrorMessage("Order ID not found");

        if (!emailData.subject.trim() || !emailData.message.trim())
            return alertErrorMessage("Please fill in subject and message");

        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.p2pSendEmailToUser({
                orderId,
                recipientType: emailData.recipientType,
                subject: emailData.subject.trim(),
                message: emailData.message.trim(),
                replyToEmail: emailData.replyToEmail.trim() || undefined
            });

            if (result?.success) {
                alertSuccessMessage("Email sent successfully");
                setShowEmailModal(false);
                setEmailData({ recipientType: "BUYER", subject: "", message: "", replyToEmail: "" });
            } else {
                alertErrorMessage(result?.message || "Failed to send email");
            }
        } catch {
            alertErrorMessage("Error sending email");
        }

        LoaderHelper.loaderStatus(false);
    };

    if (!disputeData && !location.state?.orderId) {
        return (
            <div id="layoutSidenav_content">
                <div className="container-xl px-4">
                    <h1 className="mt-4 mb-3">No Dispute Data Found</h1>
                    <Link to="/dashboard/dispute_management" className="btn btn-primary">
                        Back to Dispute Management
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div id="layoutSidenav_content">
                <main>
                    <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                        <div className="container-xl px-4">
                            <div className="page-header-content pt-4">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-auto mt-4">
                                        <h1 className="page-header-title">
                                            <Link to="/dashboard/dispute_management" className="page-header-icon">
                                                <span className="fa fa-arrow-left"></span>
                                            </Link>
                                            Dispute Details
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="card">
                            <div className="card-body text-center py-5">
                                <p className="text-muted mb-0">Loading dispute details...</p>
                            </div>
                        </div>
                    </div>
                </main>
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
                                                <span className="fa fa-arrow-left"></span>
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
                                <div className="card" style={{ height: "450px" }}>
                                    <div className="card-header">
                                        <h5 className="mb-0">Order Details</h5>
                                    </div>
                                    <div className="card-body" style={{ overflowY: "auto" }}>
                                        <table className="table table-borderless table-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="text-muted" style={{ width: "40%" }}>Order ID:</td>
                                                    <td><strong>{orderDetails?._id || "N/A"}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Status:</td>
                                                    <td>
                                                        <span className={`badge ${orderDetails?.status === "DISPUTE" ? "bg-danger" : "bg-secondary"}`}>
                                                            {orderDetails?.status || "N/A"}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Dispute By:</td>
                                                    <td>
                                                        <span className={`badge ${orderDetails?.disputeBy === "BUYER" ? "bg-info" : "bg-success"}`}>
                                                            {orderDetails?.disputeBy || "N/A"}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Dispute Reason:</td>
                                                    <td>{orderDetails?.disputeReason || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Crypto Amount:</td>
                                                    <td><strong>{orderDetails?.cryptoAmount || "N/A"} {orderDetails?.adId?.qouteCurrency || ""}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Fiat Amount:</td>
                                                    <td><strong>{orderDetails?.fiatAmount || "N/A"} {orderDetails?.adId?.fiatCurrency || ""}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Price:</td>
                                                    <td>{orderDetails?.price || "N/A"} {orderDetails?.adId?.fiatCurrency || ""}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Buyer:</td>
                                                    <td>{orderDetails?.buyerId?.emailId || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Seller:</td>
                                                    <td>{orderDetails?.sellerId?.emailId || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Ad ID:</td>
                                                    <td>{orderDetails?.adId?.adUid || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Created At:</td>
                                                    <td>{orderDetails?.createdAt ? moment(orderDetails.createdAt).format("MMM Do YYYY hh:mm A") : "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-muted">Dispute At:</td>
                                                    <td>{orderDetails?.disputeAt ? moment(orderDetails.disputeAt).format("MMM Do YYYY hh:mm A") : "N/A"}</td>
                                                </tr>
                                                {orderDetails?.paymentMethodType && orderDetails.paymentMethodType.length > 0 && (
                                                    <tr>
                                                        <td className="text-muted">Payment Method:</td>
                                                        <td>{orderDetails.paymentMethodType.join(", ")}</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Proof Box */}
                            <div className="col-xl-6 mb-4">
                                <div className="card" style={{ height: "450px" }}>
                                    <div className="card-header">
                                        <h5 className="mb-0">Payment Proof</h5>
                                    </div>
                                    <div className="card-body d-flex align-items-center justify-content-center" style={{ overflowY: "auto" }}>
                                        {orderDetails?.buyerPaymentProof ? (
                                            <div className="text-center">
                                                {typeof orderDetails.buyerPaymentProof === "string" ? (
                                                    <div>
                                                        <img
                                                            src={`${ApiConfig.appUrl}/${orderDetails.buyerPaymentProof}`}
                                                            alt="Payment Proof"
                                                            className="img-fluid"
                                                            style={{ maxWidth: "100%", maxHeight: "350px", borderRadius: "8px", objectFit: "contain" }}
                                                        />

                                                        {orderDetails.buyerMarkedAt && (
                                                            <div className="mt-2">
                                                                <small className="text-muted">
                                                                    Marked as paid at:{" "}
                                                                    {moment(orderDetails.buyerMarkedAt).format(
                                                                        "MMM Do YYYY hh:mm A"
                                                                    )}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p>{JSON.stringify(orderDetails.buyerPaymentProof)}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-5">
                                                <span className="fa fa-file-image fa-3x text-muted mb-3 d-block"></span>
                                                <p className="text-muted">No payment proof uploaded</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat Section */}
                        <div className="row mb-4">
                            <div className="col-12 mb-4">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Buyer and Seller Chat</h5>
                                        {orderDetails?.chat && (
                                            <span className="badge bg-info">
                                                {orderDetails.chat.messageCount || chatMessages.length} messages
                                            </span>
                                        )}
                                    </div>

                                    <div className="card-body">
                                        <div className="chat-container" style={{ maxHeight: "600px", overflowY: "auto" }}>
                                            {validChatMessages.length === 0 ? (
                                                <div className="text-center py-4">
                                                    <span className="fa fa-comments fa-3x text-muted mb-3 d-block"></span>
                                                    <p className="text-muted">No chat messages available</p>
                                                </div>
                                            ) : (
                                                <div className="chat-messages">
                                                    {validChatMessages.map((message) => {

                                                        const isBuyer =
                                                            message.senderId === orderDetails?.buyerId?._id;
                                                        const isSeller =
                                                            message.senderId === orderDetails?.sellerId?._id;
                                                        const isSystem = message.messageType === "SYSTEM";

                                                        const senderName = isSystem
                                                            ? "System"
                                                            : isBuyer
                                                            ? message.senderInfo?.emailId || "Buyer"
                                                            : message.senderInfo?.emailId || "Seller";

                                                        // FIX #2 — Stable key
                                                        const messageKey = message._id;

                                                        return (
                                                            <div
                                                                key={messageKey}
                                                                className={`mb-3 p-3 rounded ${
                                                                    isSystem ? "bg-dark text-white" : ""
                                                                }`}
                                                                style={{
                                                                    marginLeft:
                                                                        isSeller && !isSystem ? "20%" : "0",
                                                                    marginRight:
                                                                        isBuyer && !isSystem ? "20%" : "0",
                                                                    backgroundColor: isSystem
                                                                        ? ""
                                                                        : "rgb(124 124 124)",
                                                                }}
                                                            >
                                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        {!isSystem && (
                                                                            <span
                                                                                className={`badge ${
                                                                                    isBuyer
                                                                                        ? "bg-info"
                                                                                        : "bg-success"
                                                                                }`}
                                                                            >
                                                                                {isBuyer ? "Buyer" : "Seller"}
                                                                            </span>
                                                                        )}
                                                                        {isSystem && (
                                                                            <span className="badge bg-secondary">
                                                                                System
                                                                            </span>
                                                                        )}
                                                                        <strong>{senderName}</strong>
                                                                    </div>
                                                                    <small>
                                                                        {message.createdAt
                                                                            ? moment(message.createdAt).format(
                                                                                  "MMM Do YYYY hh:mm A"
                                                                              )
                                                                            : ""}
                                                                    </small>
                                                                </div>

                                                                {message.messageType === "IMAGE" &&
                                                                message.imageUrl ? (
                                                                    <div>
                                                                        <img
                                                                            src={
                                                                                message.imageUrl.startsWith(
                                                                                    "http"
                                                                                )
                                                                                    ? message.imageUrl
                                                                                    : `${ApiConfig.appUrl}${message.imageUrl}`
                                                                            }
                                                                            alt={
                                                                                message.originalFileName ||
                                                                                "Chat Image"
                                                                            }
                                                                            className="img-fluid"
                                                                            style={{
                                                                                maxWidth: "300px",
                                                                                borderRadius: "8px",
                                                                            }}
                                                                            onError={(e) =>
                                                                                (e.target.style.display =
                                                                                    "none")
                                                                            }
                                                                        />

                                                                        {message.originalFileName && (
                                                                            <div className="mt-1">
                                                                                <small>
                                                                                    {message.originalFileName}
                                                                                </small>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div>{message.message || "N/A"}</div>
                                                                )}

                                                                {message.systemMeta && (
                                                                    <div className="mt-2">
                                                                        <small className="opacity-75">
                                                                            Action:{" "}
                                                                            {message.systemMeta.action ||
                                                                                "N/A"}
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Email Buttons */}
                        {orderDetails && orderDetails.adminDisputeStatus !== "RESOLVED" && (
                            <div className="row mb-4">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="mb-0">Send Email to User</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="d-flex flex-wrap gap-2 mb-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={() => handleOpenEmailModal("paymentProof")}
                                                >
                                                    <span className="fa fa-envelope"></span> Request Payment Proof
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={() => handleOpenEmailModal("additionalInfo")}
                                                >
                                                    <span className="fa fa-envelope"></span> Request Additional Info
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={() => handleOpenEmailModal("verification")}
                                                >
                                                    <span className="fa fa-envelope"></span> Request Verification
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => handleOpenEmailModal()}
                                                >
                                                    <span className="fa fa-envelope"></span> Custom Email
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {orderDetails && orderDetails.adminDisputeStatus !== "RESOLVED" && (
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
                        )}

                        {orderDetails && orderDetails.adminDisputeStatus === "RESOLVED" && (
                            <div className="row mb-4">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="alert alert-info text-center mb-0">
                                                <span className="fa fa-info-circle"></span> This dispute has been
                                                resolved and cannot be modified.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Cancel Reason Modal */}
            {showCancelModal && (
                <div
                    className="custom-modal-overlay"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1050,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowCancelModal(false);
                            setCancelReason("");
                        }
                    }}
                >
                    <div 
                        className="card" 
                        style={{ maxWidth: "500px", width: "100%", margin: "1rem" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Cancel Dispute</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason("");
                                }}
                            ></button>
                        </div>

                        <div className="card-body">
                            <div className="mb-3">
                                <label htmlFor="cancelReason" className="form-label">
                                    Reason for Cancellation
                                </label>
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

                        <div className="card-footer d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason("");
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
            )}

            {/* Email Modal */}
            {showEmailModal && (
                <div
                    className="custom-modal-overlay"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1050,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "auto",
                        padding: "1rem",
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowEmailModal(false);
                            setEmailData({
                                recipientType: "BUYER",
                                subject: "",
                                message: "",
                                replyToEmail: "",
                            });
                        }
                    }}
                >
                    <div
                        className="card"
                        style={{ maxWidth: "800px", width: "100%" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Send Email to User</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => {
                                    setShowEmailModal(false);
                                    setEmailData({
                                        recipientType: "BUYER",
                                        subject: "",
                                        message: "",
                                        replyToEmail: "",
                                    });
                                }}
                            ></button>
                        </div>

                        <form onSubmit={handleSendEmail}>
                            <div className="card-body">
                                    <div className="mb-3">
                                        <label className="form-label">Recipient *</label>

                                        <select
                                            className="form-select"
                                            value={emailData.recipientType}
                                            onChange={(e) =>
                                                setEmailData({
                                                    ...emailData,
                                                    recipientType: e.target.value,
                                                })
                                            }
                                            required
                                        >
                                            <option value="BUYER">Buyer</option>
                                            <option value="SELLER">Seller</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Subject * (5–200 characters)
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={emailData.subject}
                                            onChange={(e) =>
                                                setEmailData({
                                                    ...emailData,
                                                    subject: e.target.value,
                                                })
                                            }
                                            minLength={5}
                                            maxLength={200}
                                            required
                                        />
                                        <small className="text-muted">
                                            {emailData.subject.length}/200 characters
                                        </small>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Message * (10–2000 characters)
                                        </label>

                                        <textarea
                                            className="form-control"
                                            rows="8"
                                            value={emailData.message}
                                            onChange={(e) =>
                                                setEmailData({
                                                    ...emailData,
                                                    message: e.target.value,
                                                })
                                            }
                                            minLength={10}
                                            maxLength={2000}
                                            required
                                        ></textarea>

                                        <small className="text-muted">
                                            {emailData.message.length}/2000 characters
                                        </small>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Reply-To Email (Optional)</label>

                                        <input
                                            type="email"
                                            className="form-control"
                                            value={emailData.replyToEmail}
                                            onChange={(e) =>
                                                setEmailData({
                                                    ...emailData,
                                                    replyToEmail: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                {orderDetails && (
                                    <div className="alert alert-info">
                                        <strong>Order Information:</strong>
                                        <br />
                                        Order ID: {orderDetails._id}
                                        <br />
                                        Fiat Amount: {orderDetails.fiatAmount}
                                        <br />
                                        Crypto Amount: {orderDetails.cryptoAmount}
                                    </div>
                                )}
                            </div>

                            <div className="card-footer d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowEmailModal(false);
                                        setEmailData({
                                            recipientType: "BUYER",
                                            subject: "",
                                            message: "",
                                            replyToEmail: "",
                                        });
                                    }}
                                >
                                    Close
                                </button>

                                <button type="submit" className="btn btn-primary">
                                    <span className="fa fa-paper-plane"></span> Send Email
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default DisputeDetails;
// ========================= FULL FILE ENDS HERE ===============================

