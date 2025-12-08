import React, { useState, useEffect } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertSuccessMessage, alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import moment from "moment";

const Notification = () => {
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notification, setNotification] = useState("");
    const [notificationLink, setNotificationLink] = useState('');
    const [notificationList, setNotificationList] = useState([]);
    const [activeTab, setActiveTab] = useState("sendToUser");
    const [allUsers, setAllUsers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        handleNotification();
    }, []);

    const handleNotification = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.getNotificationList();
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                setAllUsers(result?.data);
                setSuggestions(result?.data);
                setNotificationList(result?.data?.reverse());
            } else {
                alertErrorMessage("Something went wrong while fetching notifications.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error loading notifications.");
        }
    };

    const DeleteNotification = async (id) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.deleteNotify(id);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handleNotification();
            } else {
                alertErrorMessage("Something went wrong while deleting.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error deleting notification.");
        }
    };
    const linkFollow = (row) => {
        return (
            <div className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => DeleteNotification(row?._id)}>Delete</button>
                {row?.isActive === true ?
                    <button className="btn btn-success btn-sm me-2" onClick={() => { handleStatus(row?._id, false) }} >Active</button>
                    : <button className="btn btn-danger btn-sm me-2" onClick={() => { handleStatus(row?._id, true) }}  >Inactive</button>}
            </div>
        );
    };

    const columns = [
        {
            name: "Created At",
            shrink: true,
            wrap: true,
            selector: row => moment(row?.createdAt).format("DD/MM/YYYY LT")
        },
        { name: "Notification Title", shrink: true, wrap: true, selector: row => row?.title },
        { name: " Message", shrink: true, wrap: true, selector: row => row?.message },
        { name: "Action", wrap: true, selector: linkFollow, },
    ];


    const sendSingleUserNotification = async (userIds, title, message, link) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.sendNotificationToUser(userIds, title, message, link);
            LoaderHelper.loaderStatus(false);

            if (result?.success) {
                alertSuccessMessage(result?.message || "Notification sent successfully.");
                handleNotification();
                resetInput()
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error sending notification.");
        }
    };

    const handleFindUser = async (input) => {
        if (!input) {
            setSuggestions([]);
            return;
        }
        try {
            const result = await AuthService.userFind(input);
            if (result?.success && Array.isArray(result?.data)) {
                setSuggestions(result?.data);
            } else {
                setSuggestions([]);
            }
        } catch (err) {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (user) => {
        if (selectedUsers.length > 0) return;

        setSelectedUsers([user]);
        setUserInput('');
        setSuggestions([]);
    };


    const sendBulkNotification = async (userIds, title, message, link) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService?.sendBulkNotification(userIds, title, message, link);
            LoaderHelper.loaderStatus(false);

            if (result?.success) {
                alertSuccessMessage(result?.message || "Notification sent successfully.");
                handleNotification();
                resetInput()
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error sending notification.");
        }
    };
    const handleSelectSuggestion2 = (user) => {
        const isAlreadySelected = selectedUsers.some(u => u._id === user._id);
        if (isAlreadySelected) return;
        setSelectedUsers([...selectedUsers, user]);
        setUserInput('');
        setSuggestions([]);
    };

    const sendNotificationToAll = async (title, message, link) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService?.sendAllNotification(title, message, link);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Notification sent successfully.");
                handleNotification();
                resetInput()
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error sending notification.");
        }
    };
    const handleStatus = async (id, status) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService?.updateNotificationStatus(id, status);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Notification sent successfully.");
                handleNotification();
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error sending notification.");
        }
    };

    const resetInput = () => {
        setSuggestions([]);
        setUserInput("");
        setNotificationTitle("")
        setNotification("");
        setNotificationLink("");
        setSelectedUsers([]);
    }


    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10 notification_st">
                        <div className="container-xl px-4">
                            <div className="page-header-content pt-4">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-auto mt-4">
                                        <div className="d-flex align-items-center">
                                            <button
                                                className="btn p-0 page-header-icon">
                                            </button>
                                            <h1 className="page-header-title mb-0">
                                                Notification Management
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul className="nav nav-pills mb-3" role="tablist">
                                <li className="nav-item" role="presentation" onClick={resetInput}>
                                    <button
                                        className={`m-0 nav-link text-white ${activeTab === "sendToUser" ? "active" : ""}`}
                                        type="button"
                                        role="tab"
                                        onClick={() => setActiveTab("sendToUser")}
                                    >

                                        Send to User
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation" onClick={resetInput}>
                                    <button
                                        className={`m-0 nav-link text-white ${activeTab === "bulkNotification" ? "active" : ""}`}
                                        type="button"
                                        role="tab"
                                        onClick={() => setActiveTab("bulkNotification")}
                                    >
                                        Bulk Notification
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation" onClick={resetInput}>
                                    <button
                                        className={`m-0 nav-link text-white ${activeTab === "announceToAll" ? "active" : ""}`}
                                        type="button"
                                        role="tab"
                                        onClick={() => setActiveTab("announceToAll")}
                                    >
                                        Announce To All
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation" onClick={resetInput}>
                                    <button
                                        className={`m-0 nav-link text-white ${activeTab === "managementNotification" ? "active" : ""}`}
                                        type="button"
                                        role="tab"
                                        onClick={() => setActiveTab("managementNotification")}
                                    >
                                        Management Notification
                                    </button>
                                </li>
                            </ul>

                        </div>
                    </header>

                    <div className="container-xl px-4 mt-n10">
                        <div className="row">
                            <div className="col-xl-12">
                                {activeTab === "sendToUser" && (
                                    <div className="card mb-4 bg-white border shadow-sm">
                                        <div className="card-body d-flex flex-column p-4">
                                            <h4 className="mb-4 text-dark">Send Notification to User</h4>

                                            {/* User Search Bar */}
                                            <div className="form-group mb-3 position-relative">
                                                <input
                                                    type="search"
                                                    value={userInput}
                                                    onChange={(e) => {
                                                        setUserInput(e.target.value);
                                                        handleFindUser(e.target.value);
                                                    }}
                                                    className="form-control"
                                                    placeholder="Select user by name, email, or ID"
                                                    autoComplete="off"
                                                    disabled={selectedUsers?.length > 0}
                                                />

                                                {/* Show list only if user is typing and suggestions exist */}
                                                {userInput && suggestions.length > 0 && (
                                                    <ul
                                                        className="list-group position-absolute w-100 shadow"
                                                        style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
                                                    >
                                                        {suggestions.map((user, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="list-group-item list-group-item-action"
                                                                onClick={() => handleSelectSuggestion(user)}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <div className="fw-bold">
                                                                    {user.firstName || ''} {user.lastName || ''}
                                                                </div>
                                                                <div className="text-muted small">{user.emailId}</div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            {/* Selected Users */}
                                            {selectedUsers.length > 0 && (
                                                <div className="mt-3">
                                                    {selectedUsers?.map((user, index) => (
                                                        <div
                                                            key={index}
                                                            className="rounded-2 p-3 mb-3 shadow-sm bg-white d-flex justify-content-between align-items-center"
                                                        >
                                                            <div>
                                                                <div className="fw-semibold fs-6">
                                                                    {user.firstName} {user.lastName}
                                                                </div>
                                                                <div className="text-muted small">{user.emailId}</div>
                                                            </div>
                                                            <button style={{ borderRadius: "25px" }}
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => {
                                                                    setSelectedUsers(prev =>
                                                                        prev.filter((_, idx) => idx !== index)
                                                                    );
                                                                }}
                                                            >
                                                                Remove

                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                            )}

                                            {/* Title (Required) */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Title<span className="text-danger"> *</span></label>
                                                <input
                                                    type="text"
                                                    value={notificationTitle}
                                                    onChange={(e) => setNotificationTitle(e.target.value)}
                                                    className="form-control"
                                                    placeholder="Enter Title"
                                                    required
                                                />
                                            </div>

                                            {/* Message (Required) */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Message<span className="text-danger"> *</span></label>
                                                <textarea
                                                    value={notification}
                                                    onChange={(e) => setNotification(e.target.value)}
                                                    className="form-control"
                                                    rows="5"
                                                    placeholder="Enter Message"
                                                    required
                                                ></textarea>
                                            </div>

                                            {/* Link (Optional) */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Link (optional)</label>
                                                <input
                                                    type="text"
                                                    value={notificationLink}
                                                    onChange={(e) => setNotificationLink(e.target.value)}
                                                    className="form-control"
                                                    placeholder="Enter Link"
                                                />
                                            </div>

                                            <button
                                                className="btn btn-primary w-100 mt-2"
                                                onClick={() => {
                                                    const userIds = selectedUsers?.map(user => user.id);
                                                    sendSingleUserNotification(userIds, notificationTitle, notification, notificationLink);
                                                }}
                                            >
                                                Send Notifications
                                            </button>

                                        </div>
                                    </div>
                                )}

                                {activeTab === "bulkNotification" && (
                                    <div className="card mb-4 bg-white border shadow-sm">
                                        <div className="card-body d-flex flex-column p-4">
                                            <h4 className="mb-4 text-dark">Send Bulk Notifications</h4>

                                            {/* User Search Bar */}
                                            <div className="form-group mb-3 position-relative">
                                                <input
                                                    type="search"
                                                    value={userInput}
                                                    onChange={(e) => {
                                                        setUserInput(e.target.value);
                                                        handleFindUser(e.target.value);
                                                    }}
                                                    className="form-control"
                                                    placeholder="Select user by name, email, or ID"
                                                    autoComplete="off"
                                                />

                                                {userInput && suggestions.length > 0 && (
                                                    <ul
                                                        className="list-group position-absolute w-100 shadow"
                                                        style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
                                                    >
                                                        {suggestions.map((user, idx) => (
                                                            <li
                                                                key={user._id || idx} // Use user._id if available
                                                                className="list-group-item list-group-item-action"
                                                                onClick={() => handleSelectSuggestion2(user)}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <div className="fw-bold">
                                                                    {user.firstName || ''} {user.lastName || ''}
                                                                </div>
                                                                <div className="text-muted small">{user.emailId}</div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                            </div>
                                            {/* Selected Users */}
                                            {selectedUsers.length > 0 && (
                                                <div className="mt-3">
                                                    {selectedUsers.map((user, index) => (
                                                        <div
                                                            key={index}
                                                            className="rounded-2 p-3 mb-3 shadow-sm bg-white d-flex justify-content-between align-items-center"
                                                        >
                                                            <div>
                                                                <div className="fw-semibold fs-6">
                                                                    {user.firstName} {user.lastName}
                                                                </div>
                                                                <div className="text-muted small">{user.emailId}</div>
                                                            </div>
                                                            <button style={{ borderRadius: "25px" }}
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => {
                                                                    setSelectedUsers(prev =>
                                                                        prev.filter((_, idx) => idx !== index)
                                                                    );
                                                                }}
                                                            >
                                                                Remove

                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                            )}

                                            {/* Title (Required) */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Title<span className="text-danger"> *</span></label>
                                                <input
                                                    type="text"
                                                    value={notificationTitle}
                                                    onChange={(e) => setNotificationTitle(e.target.value)}
                                                    className="form-control"
                                                    placeholder="Enter Title"
                                                    required
                                                />
                                            </div>

                                            {/* Message (Required) */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Message<span className="text-danger"> *</span></label>
                                                <textarea
                                                    value={notification}
                                                    onChange={(e) => setNotification(e.target.value)}
                                                    className="form-control"
                                                    rows="5"
                                                    placeholder="Enter Message"
                                                    required
                                                ></textarea>
                                            </div>

                                            {/* Link (Optional) */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Link (optional)</label>
                                                <input
                                                    type="text"
                                                    value={notificationLink}
                                                    onChange={(e) => setNotificationLink(e.target.value)}
                                                    className="form-control"
                                                    placeholder="Enter Link"
                                                />
                                            </div>

                                            <button
                                                className="btn btn-primary w-100 mt-2"
                                                onClick={() => {
                                                    const userIds = selectedUsers?.map(user => user.id);
                                                    sendBulkNotification(userIds, notificationTitle, notification, notificationLink);
                                                }}
                                            >
                                                Send Bulk Notifications
                                            </button>

                                        </div>
                                    </div>
                                )}
                                {activeTab === "announceToAll" && (
                                    <div className="card mb-4 bg-white border shadow-sm">
                                        <div className="card-body d-flex flex-column p-4">
                                            <h4 className="mb-4 text-dark">Send Notifications to All</h4>

                                            {/* Form */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Title<span className="text-danger"> *</span></label>
                                                <input
                                                    type="text"
                                                    value={notificationTitle}
                                                    onChange={(e) => setNotificationTitle(e.target.value)}
                                                    className="form-control"
                                                    placeholder="Enter Title"
                                                    required
                                                />
                                            </div>

                                            {/* Message (Required) */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Message<span className="text-danger"> *</span></label>
                                                <textarea
                                                    value={notification}
                                                    onChange={(e) => setNotification(e.target.value)}
                                                    className="form-control"
                                                    rows="5"
                                                    placeholder="Enter Message"
                                                    required
                                                ></textarea>
                                            </div>

                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Link (optional)</label>
                                                <input
                                                    type="text"
                                                    value={notificationLink}
                                                    onChange={(e) => setNotificationLink(e.target.value)}
                                                    className="form-control"
                                                    placeholder="Enter Link"
                                                />
                                            </div>

                                            <button className="btn btn-primary w-100 mt-2" onClick={() => sendNotificationToAll(notificationTitle, notification, notificationLink)}>
                                                Send Notifications to All
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "managementNotification" && (
                                    <div className="card mb-4 bg-white border shadow-sm">
                                        <div className="card-body d-flex flex-column p-4">
                                            <h4 className="mb-4 text-dark">Send Notifications List</h4>
                                            <DataTableBase columns={columns} data={allUsers} pagination />
                                        </div>
                                    </div>

                                )}
                            </div>
                        </div>
                    </div>
                </main >
            </div >
        </>
    );
};

export default Notification;
