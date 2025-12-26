import React, { useState, useEffect } from 'react';
import { alertErrorMessage, alertSuccessMessage } from '../../../customComponent/CustomAlertMessage';
import LoaderHelper from '../../../customComponent/Loading/LoaderHelper';
import AuthService from '../../../api/services/AuthService';

function UpdateApk() {
    const [version, setVersion] = useState("");
    const [apkFile, setApkFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState("");
    const [currentApk, setCurrentApk] = useState(null);

    useEffect(() => {
        fetchCurrentApk();
    }, []);

    const fetchCurrentApk = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const res = await AuthService.getApkList();
            if (res?.success) {
                setCurrentApk(res?.data);
            }
        } catch (e) {
            console.error("Error fetching APK:", e);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if file is APK
            if (file.type === "application/vnd.android.package-archive" || file.name.endsWith('.apk')) {
                setApkFile(file);
                setFileName(file.name);
                // Display file size in MB
                const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                setFileSize(sizeInMB);
            } else {
                alertErrorMessage("Please select a valid APK file");
                e.target.value = "";
            }
        }
    };

    const handleUpdateApk = async () => {
        if (!version || !apkFile) {
            alertErrorMessage("Please enter version and select APK file");
            return;
        }

        try {
            LoaderHelper.loaderStatus(true);
            const formData = new FormData();
            formData.append('version', version);
            formData.append('apk', apkFile);

            const result = await AuthService.updateApk(formData);
            if (result?.success) {
                alertSuccessMessage("APK updated successfully");
                setVersion("");
                setApkFile(null);
                setFileName("");
                // Reset file input
                const fileInput = document.getElementById('apkFileInput');
                if (fileInput) fileInput.value = "";
                // Refresh current APK data
                fetchCurrentApk();
            } else {
                alertErrorMessage(result?.message || "Failed to update APK");
            }
        } catch (error) {
            alertErrorMessage(error?.message || "An error occurred while updating APK");
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    return (
        <div id="layoutSidenav_content">
            <main>
                <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                    <div className="container-xl px-4">
                        <div className="page-header-content pt-4">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto mt-4">
                                    <h1 className="page-header-title">
                                        <div className="page-header-icon"><i className="fa fa-mobile-alt"></i></div>
                                        Version Update
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div className="card-header">Update APK Version</div>
                        <div className="card-body">
                            <form>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="small mb-1" htmlFor="inputVersion">
                                                Version <em>*</em>
                                            </label>
                                            {currentApk && (
                                                <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>
                                                    Current: {currentApk.version || "N/A"}
                                                </span>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control form-control-solid"
                                            id="inputVersion"
                                            placeholder="Enter version (e.g., 1.0.0)"
                                            value={version}
                                            onChange={(e) => setVersion(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="small mb-1" htmlFor="apkFileInput">
                                                APK File <em>*</em>
                                            </label>
                                            {currentApk?.apkUrl && (
                                                <a
                                                    href={currentApk.apkUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600", textDecoration: "none" }}
                                                >
                                                    <i className="fas fa-download me-1"></i> Download Current
                                                </a>
                                            )}
                                        </div>
                                        <input
                                            id="apkFileInput"
                                            type="file"
                                            className="form-control form-control-solid"
                                            accept=".apk,application/vnd.android.package-archive"
                                            onChange={handleFileChange}
                                        />
                                        {fileName && (
                                            <div className="mt-2" style={{
                                                padding: "8px 12px",
                                                background: "#f0f0f0",
                                                borderRadius: "6px",
                                                fontSize: "13px",
                                                color: "#666"
                                            }}>
                                                Selected: {fileName} {fileSize && `(${fileSize} MB)`}
                                            </div>
                                        )}
                                        {currentApk?.updatedAt && (
                                            <div className="mt-1" style={{ fontSize: "11px", color: "#9ca3af" }}>
                                                Last Updated: {new Date(currentApk.updatedAt).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="btn btn-indigo"
                                    type="button"
                                    onClick={handleUpdateApk}
                                    disabled={!version || !apkFile}
                                >
                                    Update APK
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default UpdateApk;

