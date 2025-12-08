import React, { useState, useEffect } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertSuccessMessage, alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import moment from "moment";

const InverstorUpdates = () => {
    const [text, setText] = useState('');
    const [content, setContent] = useState("");
    const [allData, setAllData] = useState([]);
    const [announcementId, setAnnouncementId] = useState("");
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    const handleUpdate = async (text, content) => {
        try {
            const result = await AuthService?.updateAnnouncement(text, content);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Update successful");
                setText('');
                setContent('');
                handleAnnouncementList();
            } else {
                alertErrorMessage(result?.message || "Update failed");
            }
        } catch (error) {
            alertErrorMessage("Update failed: " + (error.message || "Unknown error"));
        }
    };

    const handleAnnouncementList = async () => {
        try {
            const result = await AuthService?.getAnnouncementList();
            if (result?.success) {
                setAllData(result?.data);
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage("Fetch failed: " + (error.message || "Unknown error"));
        }
    };

    const deleteAnnouncement = async (userId) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService?.deleteAnnouncement(userId);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handleAnnouncementList();
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Failed to delete: " + (error.message || "Unknown error"));
        }
    };

    const handleStatus = async (userId, status) => {
        try {
            const result = await AuthService.announcementStatus(userId, status);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Status updated");
                handleAnnouncementList();
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage("Failed to update status");
        }
    };

    const linkFollow = (row) => (
        <div>
            <button
                type="button"
                className="btn btn-sm btn-dark me-2"
                data-bs-toggle="modal"
                data-bs-target="#view_announcement"
                onClick={() => setAnnouncementId(row?._id)}
            >
                View
            </button>
            <button
                className="btn btn-danger btn-sm"
                type="button"
                onClick={() => deleteAnnouncement(row?._id)}
            >
                Delete
            </button>
        </div>
    );

    const statuslinkFollow = (row) => (
        <button
            type="button"
            className={row?.status === "ACTIVE" ? "btn btn-sm btn-primary" : "btn btn-sm btn-danger"}
            onClick={() => handleStatus(row?._id, row?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
        >
            {row?.status}
        </button>
    );

    const columns = [
        { name: "Date / Time", shrink: true, selector: row => moment(row.createdAt).format("DD-MM-YYYY LT") },
        { name: "Title", shrink: true, wrap: true, selector: row => row.title },
        { name: "Status", shrink: true, selector: statuslinkFollow },
        { name: "Action", shrink: true, selector: linkFollow },
    ];
    const viewModal = [
        { name: "Title", shrink: true, wrap: true, selector: row => row.title },
        { name: "Description", shrink: true, selector: row => row.description },
        { name: "Status", shrink: true, selector: statuslinkFollow },
    ];

    useEffect(() => {
        handleAnnouncementList();
    }, []);

    useEffect(() => {
        if (announcementId) {
            const selected = allData.find(item => item._id === announcementId);
            setSelectedAnnouncement(selected || null);
        }
    }, [announcementId, allData]);
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
                                            <div className="page-header-icon"><i className="fa fa-image"></i></div>
                                            Announcement for Investors
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="container-xl px-4 mt-n10">
                        <div className="row">
                            <div className="col-xl-4">
                                <div className="card mb-4 mb-xl-0">
                                    <div className="card-body d-flex justify-content-center flex-column p-5">
                                        <div className="d-flex align-items-center justify-content-start mb-4">
                                            <h5 className="mb-0">Add New Update for Investors</h5>
                                        </div>
                                        <form>
                                            <div className="form-group mb-4">
                                                <label className="small mb-1">Update Title</label>
                                                <input
                                                    className="form-control form-control-solid"
                                                    type="text"
                                                    placeholder="Enter Title"
                                                    value={text}
                                                    onChange={(e) => setText(e.target.value)}
                                                />
                                            </div>
                                            <div className="form-group mb-5">
                                                <label className="small mb-1">Update Content</label>
                                                <input
                                                    className="form-control form-control-solid"
                                                    type="text"
                                                    placeholder="Enter Content"
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                />
                                            </div>
                                            <button
                                                className="btn btn-indigo btn-block w-100 mt-2"
                                                type="button"
                                                onClick={() => handleUpdate(text, content)}
                                                disabled={!text || !content}
                                            >
                                                Submit
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-8">
                                <div className="card">
                                    <div className="card-header">Announcements List</div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <DataTableBase columns={columns} data={allData} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal for View */}
            {/* Modal for View */}
            <div className="modal fade" id="view_announcement" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="viewModalLabel">Announcement Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                            {selectedAnnouncement ? (
                                <>
                                    <p><strong>Title :  </strong>{selectedAnnouncement?.title}</p>
                                    <p><strong>Status :  </strong> {selectedAnnouncement?.status}</p>
                                    <p><strong>Description : </strong> {selectedAnnouncement?.description}</p>
                                </>
                            ) : (
                                <p>No data found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default InverstorUpdates;
