import React, { useState, useEffect } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertSuccessMessage, alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";
import moment from "moment";

const UpdateApk = () => {
    const [apkList, setApkList] = useState([]);
    const [apkFile, setApkFile] = useState(null);
    const [versionName, setVersionName] = useState("");
    const [showUploadModal, setShowUploadModal] = useState(false);

    const userType = sessionStorage.getItem("userType");

    useEffect(() => {
        handleApkList();
    }, []);

    const handleApkList = async () => {
        LoaderHelper.loaderStatus(true);
        await AuthService.getApkList().then(async (result) => {
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                try {
                    // Handle different response structures
                    let apkData = [];
                    if (Array.isArray(result?.data)) {
                        apkData = result.data;
                    } else if (result?.data && typeof result.data === 'object') {
                        // If data is a single object, convert to array
                        if (result.data.apk || result.data.version) {
                            apkData = [result.data];
                        } else {
                            // If data contains an array property
                            apkData = result.data.data || result.data.list || [];
                        }
                    }
                    setApkList(apkData);
                } catch (error) {
                    console.error('Error processing APK list:', error);
                    alertErrorMessage(error);
                }
            } else {
                alertErrorMessage(result?.message || "Failed to fetch APK list");
            }
        }).catch((error) => {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error fetching APK list");
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === "application/vnd.android.package-archive" || file.name.endsWith('.apk')) {
                if (file.size <= 100 * 1024 * 1024) { // 100MB limit
                    setApkFile(file);
                } else {
                    alertErrorMessage("APK file size should be less than 100MB");
                    event.target.value = "";
                }
            } else {
                alertErrorMessage("Please select a valid APK file");
                event.target.value = "";
            }
        }
    };

    const resetForm = () => {
        setApkFile(null);
        setVersionName("");
        if (document.getElementById("apkFile")) {
            document.getElementById("apkFile").value = "";
        }
    };

    const handleUploadApk = async () => {
        if (!apkFile) {
            alertErrorMessage("Please select an APK file");
            return;
        }
        if (!versionName) {
            alertErrorMessage("Please enter version name");
            return;
        }

        const formData = new FormData();
        formData.append("apk", apkFile);
        formData.append("version", versionName);

        LoaderHelper.loaderStatus(true);
        await AuthService.uploadApk(formData).then(async (result) => {
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "APK uploaded successfully");
                setShowUploadModal(false);
                resetForm();
                handleApkList();
            } else {
                alertErrorMessage(result?.message || "Failed to upload APK");
            }
        }).catch((error) => {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error uploading APK");
        });
    };






    const downloadApk = (apkPath) => {
        if (apkPath) {
            window.open(ApiConfig.appUrl + apkPath, "_blank");
        }
    };

    const columns = [
        { name: "Sr No.", selector: (row, index) => index + 1, width: "80px" },
        {
            name: "APK File",
            selector: (row) => (
                <button
                    className="btn btn-link btn-sm p-0"
                    onClick={() => downloadApk(row?.apk)}
                >
                    Download APK
                </button>
            ),
            width: "150px"
        },
        { name: "Version", selector: (row) => row?.version || "-----", width: "150px" },
    ];

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h1>APK Management</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowUploadModal(true)}
                    >
                        <i className="fa fa-upload me-2"></i>Upload New APK
                    </button>
                </div>

                <DataTableBase columns={columns} data={apkList} pagination={false} />
            </div>

            {/* Upload APK Modal */}
            {showUploadModal && (
                <div className="modal uploadApkModal show d-block" id="uploadApkModal" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Upload New APK</h5>
                                <button type="button" className="btn-close" onClick={() => { setShowUploadModal(false); resetForm(); }} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">APK File <span className="text-danger">*</span></label>
                                        <input type="file" id="apkFile" className="form-control"
                                            accept=".apk" onChange={handleFileChange} required />
                                        <small className="form-text text-muted">Maximum file size: 100MB</small>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Version Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={versionName}
                                            onChange={(e) => setVersionName(e.target.value)}
                                            placeholder="e.g., 1.0.0"
                                            required
                                        />
                                    </div>

                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowUploadModal(false); resetForm(); }}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleUploadApk}>
                                    Upload APK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateApk;

