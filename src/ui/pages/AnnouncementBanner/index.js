import React, { useState, useEffect } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertSuccessMessage, alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import moment from "moment";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";

const AnnouncementBanner = () => {

    const [bannerLink, setBannerLink] = useState('');
    const [activeTab, setActiveTab] = useState("sendToBanner");
    const [allUsers, setAllUsers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [dateFormat, setDateFormat] = useState("");


    useEffect(() => {
        handleAnnouncementBannerList();
    }, []);

    const handleAnnouncementBannerList = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.getAnnouncementBannerList();
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                setAllUsers(result?.data);
                setSuggestions(result?.data?.reverse());
            } else {
                alertErrorMessage("Something went wrong while fetching Banners.");
            }
        } catch (results) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(results?.message);
        }
    };

    const DeleteNotification = async (id) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.bannerDelete(id);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handleAnnouncementBannerList();
            } else {
                alertErrorMessage("Something went wrong while deleting.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error deleting Banner.");
        }
    };
    const linkFollow = (row) => {
        return (
            <div className="d-flex gap-2">
                <button className="btn btn-danger btn-sm" onClick={() => DeleteNotification(row?._id)}>Delete</button>
                {row?.status === "ACTIVE" ?
                    <button className="btn btn-success btn-sm me-2" onClick={() => { handleStatus(row?._id, "INACTIVE") }} >Active</button>
                    : <button className="btn btn-danger btn-sm me-2" onClick={() => { handleStatus(row?._id, "ACTIVE") }}  >Inactive</button>}
            </div>
        );
    };

    const columns = [
        { name: "Sr no.", selector: (row, index) => index + 1, wrap: true, width: "80px" },
        {
            name: "Date",
            shrink: true,
            wrap: true,
            selector: row => moment(row?.createdAt).format("DD/MM/YYYY LT")
        },
        {
            name: "Banner Image",
            shrink: true,
            wrap: true,
            selector: row => (
                row?.bannerImage ? (
                    <img
                        src={`${ApiConfig?.appUrl}${row?.bannerImage}`}
                        alt="Banner"
                        style={{ maxWidth: "100px", height: "auto", borderRadius: "8px" }}
                    />
                ) : "No image"
            )
        },

        { name: "Expiry Date", shrink: true, wrap: true, selector: row => row?.isPermanent === false ? moment(row?.activeUntil).format("DD/MM/YYYY ") : "No Expiration" },
        { name: "Action", wrap: true, selector: linkFollow, },
    ];


    const handleStatus = async (id, status) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService?.updateBannerStatus(id, status);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Notification sent successfully.");
                handleAnnouncementBannerList();
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error sending notification.");
        }
    };

    const resetInput = () => {
        setBannerLink("");
        setDateFormat('');
        setBannerImage('');
    }
    const handleAnnouncementBanner = async (bannerImage, startDate, endDate, bannerLink) => {
        LoaderHelper.loaderStatus(true);
        try {
            const formData = new FormData();

            // Send displayOn as an array (no need to stringify)
            const displayOnArray = ["Landing"];  // You can add more display locations here
            formData.append("displayOn", displayOnArray);  // Directly append the array
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);

            if (bannerLink) {
                formData.append("link", bannerLink);
            }

            if (bannerImage && bannerImage instanceof File) {
                formData.append("bannerImage", bannerImage);
            } else {
                alertErrorMessage("Please upload a valid banner image.");
                LoaderHelper.loaderStatus(false);
                return;
            }

            const result = await AuthService.announcementBanner(formData);

            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handleAnnouncementBannerList();
            } else {
                alertErrorMessage("Something went wrong while fetching notifications.");
            }
        } catch (result) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage(result?.message);
        }
    };


    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD


    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                        <div className="container-xl px-4">
                            <div className="page-header-content pt-4">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-auto mt-4">
                                        <div className="d-flex align-items-center">
                                            <button
                                                className="btn p-0 page-header-icon">
                                            </button>
                                            <h1 className="page-header-title mb-0">
                                                Announcement Banner Management
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul className="nav nav-pills mb-3" role="tablist">
                                <li className="nav-item" role="presentation" onClick={resetInput}>
                                    <button
                                        className={`m-0 nav-link text-white ${activeTab === "sendToBanner" ? "active" : ""}`}
                                        type="button"
                                        role="tab"
                                        onClick={() => setActiveTab("sendToBanner")}
                                    >

                                        Send Banner
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation" onClick={resetInput}>
                                    <button
                                        className={`m-0 nav-link text-white ${activeTab === "AnnouncementBannerManagement" || activeTab === "AnnouncementBannerManagement" ? "active" : ""}`}
                                        type="button"
                                        role="tab"
                                        onClick={() => setActiveTab("AnnouncementBannerManagement")}
                                    >
                                        Banner Management
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="row">
                            <div className="col-xl-12">
                                {activeTab === "sendToBanner" && (
                                    <div className="card mb-4 bg-white border shadow-sm">
                                        <div className="card-body d-flex flex-column p-4">
                                            <h4 className="mb-4 text-dark">Send Announcement Banner</h4>

                                            {/* Banner Upload */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">
                                                    Banner Image <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setBannerImage(file);
                                                            setPreviewImage(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>

                                            {/* Start and End Date in same row with labels */}
                                            <div className="d-flex gap-3 flex-wrap">

                                                <div className="flex-grow-1">
                                                    <label className="small">Expiry Time (Optional)</label>
                                                    <input
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                        className="form-control"
                                                        min={startDate || today} // 🔒 end date should be >= start date
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Optional Link */}
                                            <div className="form-group mb-3">
                                                <label className="small mb-1">Link (optional)</label>
                                                <input
                                                    type="text"
                                                    value={bannerLink}
                                                    onChange={(e) => setBannerLink(e.target.value)}
                                                    className="form-control"
                                                    placeholder="Enter Link"
                                                />
                                            </div>

                                            {/* Preview Section */}
                                            {previewImage && (
                                                <div className="mb-4">
                                                    <label className="small mb-2 d-block">Preview:</label>
                                                    <div className="d-flex gap-4 flex-wrap">
                                                        {/* Desktop View */}
                                                        <div>
                                                            <p className="small mb-1 fw-semibold">📱 Desktop View (Web)</p>
                                                            <div
                                                                style={{
                                                                    width: "100%",
                                                                    maxWidth: "600px",
                                                                    border: "1px solid #ddd",
                                                                    borderRadius: "10px",
                                                                }}
                                                            >
                                                                <img
                                                                    src={previewImage}
                                                                    alt="Desktop Preview"
                                                                    className="img-fluid w-100"
                                                                    style={{ borderRadius: "8px" }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Mobile View */}
                                                        <div>
                                                            <p className="small mb-1 fw-semibold">📲 Mobile View (Phone)</p>
                                                            <div
                                                                style={{
                                                                    width: "300px",
                                                                    border: "1px solid #ddd",
                                                                    borderRadius: "10px",
                                                                }}
                                                            >
                                                                <img
                                                                    src={previewImage}
                                                                    alt="Mobile Preview"
                                                                    className="img-fluid w-100"
                                                                    style={{ borderRadius: "8px" }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Submit */}
                                            <button
                                                className="btn btn-primary w-100 mt-2"
                                                onClick={() => {
                                                    handleAnnouncementBanner(bannerImage, startDate, endDate, bannerLink);
                                                }}>
                                                Send Banner
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "AnnouncementBannerManagement" && (
                                    <div className="card mb-4 bg-white border shadow-sm">
                                        <div className="card-body d-flex flex-column p-4">
                                            <h4 className="mb-4 text-dark">Banner List</h4>
                                            <DataTableBase columns={columns} data={suggestions} pagination />
                                        </div>
                                    </div>

                                )}
                            </div>

                            {/* Uncomment if needed */}
                            {/* <div className="col-xl-8">
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <DataTableBase columns={columns} data={notificationList} />
          </div>
        </div>
      </div>
    </div> */}
                        </div>
                    </div>

                </main >
            </div >
        </>
    );
};

export default AnnouncementBanner;
