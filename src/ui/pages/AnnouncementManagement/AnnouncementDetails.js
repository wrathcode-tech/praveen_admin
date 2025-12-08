import React, { useState, useEffect } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertSuccessMessage, alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import moment from "moment";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AnnouncementDetails = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [activeTab, setActiveTab] = useState("form");
    const [categoryList, setCategoryList] = useState([]);
    const [announcementList, setAnnouncementList] = useState([]);

    useEffect(() => {
        handleCategoryAnnouncement();
    }, []);

    useEffect(() => {
        if (activeTab === "list") {
            handleAnnouncementList();
        }
    }, [activeTab]);

    const handleCategoryAnnouncement = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.getAnnouncementCategoryList();
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                setCategoryList(result?.data);
            } else {
                alertErrorMessage("Something went wrong while fetching announcement categories.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error loading announcement categories.");
        }
    };
    const handleAnnouncementList = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.getNewAnnouncementList();
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                setAnnouncementList(result?.data);
            } else {
                alertErrorMessage("Something went wrong while fetching announcement list.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error loading announcement list.");
        }
    };

    const handleCreateAnnouncement = async (title, description, categoryId) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.createAnnouncement(title, description, categoryId);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Announcement created successfully.");
                if (activeTab === "list") {
                    handleAnnouncementList();
                } else {
                    handleCategoryAnnouncement();
                }
                resetInput();
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error creating announcement.");
        }
    };
    const DeleteAnnouncement = async (id) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.DeleteAnnouncement(id);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message);
                if (activeTab === "list") {
                    handleAnnouncementList();
                } else {
                    handleCategoryAnnouncement();
                }
            } else {
                alertErrorMessage("Something went wrong while deleting.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error deleting announcement.");
        }
    };
    const linkFollow = (row) => {
        const isActive = row?.status === "ACTIVE";

        return (
            <div className="d-flex gap-2">
                {/* Delete Button */}
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => DeleteAnnouncement(row?._id)}
                >
                    Delete
                </button>

                {/* Status Toggle Button */}
                {isActive ? (
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleStatus(row?._id, "INACTIVE")}
                    >
                        Inactive
                    </button>
                ) : (
                    <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleStatus(row?._id, "ACTIVE")}
                    >
                        Active
                    </button>
                )}
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
        { name: "Announcement Title", shrink: true, wrap: true, selector: row => row?.title },
        { name: "Category", shrink: true, wrap: true, selector: row => (row?.announcementCategory || row?.category || row?.categoryName || row?.categoryId || "-") },
        { name: "Action", wrap: true, selector: linkFollow, },
    ];

    const handleStatus = async (id, status) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService?.updateAnnouncementStatus(id, status);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Announcement status updated.");
                handleAnnouncementList();
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error updating announcement status.");
        }
    };

    const resetInput = () => {
        setTitle("");
        setDescription("");
        setCategoryId("");
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
                                                Announcement Management
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul className="nav nav-pills mb-3" role="tablist">
                                <li className="nav-item" role="presentation" onClick={resetInput}>
                                    <button
                                        className={`m-0 nav-link text-white ${activeTab === "form" ? "active" : ""}`}
                                        type="button"
                                        role="tab"
                                        onClick={() => setActiveTab("form")}
                                    >
                                        Announcement
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation" onClick={resetInput}>
                                    <button
                                        className={`m-0 nav-link text-white ${activeTab === "list" ? "active" : ""}`}
                                        type="button"
                                        role="tab"
                                        onClick={() => setActiveTab("list")}
                                    >
                                        Announcement List
                                    </button>
                                </li>
                            </ul>

                        </div>
                    </header>

                    <div className="container-xl px-4 mt-n10">
                        <div className="row">
                            <div className="col-xl-12">
                                {activeTab === "form" && (
                                    <div className="card mb-4 bg-white border shadow-sm">
                                        <div className="card-body d-flex flex-column p-4">
                                            <h4 className="mb-4 text-dark">Create Announcement</h4>

                                            {/* Category (shows titles) */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Announcement Category (Title)</label>
                                                <select className="form-control" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                                    <option value="">Select Title</option>
                                                    {(categoryList || []).map((item) => (
                                                        <option key={item?._id} value={item?._id}>{item?.title || item?.name || "Untitled"}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Title with suggestions */}
                                            <div className="form-group mb-3 position-relative">
                                                <label className="small mb-1"> Announcement Title<span className="text-danger"> *</span></label>
                                                <input
                                                    type="text"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    className="form-control"
                                                    placeholder="Enter Announcement Title"
                                                    required
                                                />
                                                {title && ((announcementList && announcementList.length > 0 ? announcementList : categoryList) || []).filter(a => (a?.title || "").toLowerCase().includes(title.toLowerCase())).length > 0 && (
                                                    <ul
                                                        className="list-group position-absolute w-100 shadow"
                                                        style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
                                                    >
                                                        {((announcementList && announcementList.length > 0 ? announcementList : categoryList) || [])
                                                            .filter(a => (a?.title || "").toLowerCase().includes(title.toLowerCase()))
                                                            .slice(0, 10)
                                                            .map((item, idx) => (
                                                                <li
                                                                    key={item?._id || idx}
                                                                    className="list-group-item list-group-item-action"
                                                                    onClick={() => {
                                                                        setTitle(item?.title || "");
                                                                        setDescription(item?.description || item?.announcementCategory || "");
                                                                        setCategoryId(item?.categoryId || item?._id || "");
                                                                    }}
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <div className="fw-bold">{item?.title || "Untitled"}</div>
                                                                    <div className="text-muted small" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                        {(item?.description || item?.announcementCategory || "").slice(0, 80)}
                                                                    </div>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            </div>

                                            {/* Message (Required) */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Description<span className="text-danger"> *</span></label>
                                                <ReactQuill
                                                    className="quillEditor"
                                                    theme="snow"
                                                    value={description}
                                                    onChange={setDescription}
                                                    placeholder="Write your description..."
                                                />
                                            </div>



                                            <button className="btn btn-primary w-100 mt-2" onClick={() => handleCreateAnnouncement(title, description, categoryId)}>
                                                Publish Announcement
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "list" && (
                                    <div className="card mb-4 bg-white border shadow-sm">
                                        <div className="card-body d-flex flex-column p-4">
                                            <h4 className="mb-4 text-dark">Announcements List</h4>
                                            <DataTableBase columns={columns} data={announcementList} pagination />
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

export default AnnouncementDetails;
