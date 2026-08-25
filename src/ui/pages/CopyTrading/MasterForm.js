import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { formatPair, getPairId, getProfileImageUrl, isActivePair, isUsdtQuotePair, StarRating } from "./copyTradingUtils";

const emptyForm = {
    name: "",
    bio: "",
    pair_id: "",
    useBalancePercent: 50,
    profitPercent: 20,
    lossPercent: 100,
    status: "ACTIVE",
    displayBalance: "",
    displayTotalProfit: "",
    displayWinRate: "",
    displayFollowers: "",
    rating: 0
};

const numericFields = [
    "useBalancePercent",
    "profitPercent",
    "lossPercent",
    "displayBalance",
    "displayTotalProfit",
    "displayWinRate",
    "displayFollowers",
    "rating"
];

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];

const MasterForm = () => {
    const navigate = useNavigate();
    const { masterId } = useParams();
    const isEdit = Boolean(masterId);
    const [formData, setFormData] = useState(emptyForm);
    const [pairList, setPairList] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [existingImage, setExistingImage] = useState("");

    useEffect(() => {
        fetchPairList();
        if (isEdit) fetchMasterDetail();
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [masterId]);

    const fetchPairList = async () => {
        try {
            const res = await AuthService.getCurrencyPairList();
            if (res?.success) {
                const pairs = Array.isArray(res.data) ? res.data : [];
                setPairList(pairs.filter((pair) => isActivePair(pair) && isUsdtQuotePair(pair)));
            } else {
                alertErrorMessage(res?.message || "Failed to load trading pairs");
            }
        } catch (error) {
            alertErrorMessage("Failed to load trading pairs");
        }
    };

    const fetchMasterDetail = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.copyTradingMasterDetail(masterId);
            if (res?.success && res.data) {
                const master = res.data;
                setFormData({
                    name: master.name || "",
                    bio: master.bio || "",
                    pair_id: master.pair_id?._id || master.pair_id || "",
                    useBalancePercent: master.useBalancePercent ?? 50,
                    profitPercent: master.profitPercent ?? 20,
                    lossPercent: master.lossPercent ?? 100,
                    status: master.status || "ACTIVE",
                    displayBalance: master.displayBalance ?? "",
                    displayTotalProfit: master.displayTotalProfit ?? "",
                    displayWinRate: master.displayWinRate ?? "",
                    displayFollowers: master.displayFollowers ?? "",
                    rating: master.rating ?? 0
                });
                setExistingImage(master.profileImage || "");
                setImageFile(null);
                setImagePreview("");
            } else {
                alertErrorMessage(res?.message || "Master not found");
                navigate("/dashboard/copy-trading/masters");
            }
        } catch (error) {
            alertErrorMessage("Error fetching master details");
            navigate("/dashboard/copy-trading/masters");
        }
        LoaderHelper.loaderStatus(false);
    };

    const handleChange = (key, value) => {
        if (numericFields.includes(key)) {
            if (value === "") {
                setFormData((prev) => ({ ...prev, [key]: "" }));
                return;
            }
            const num = Number(value);
            if (Number.isNaN(num) || num < 0) return;
            setFormData((prev) => ({ ...prev, [key]: value }));
            return;
        }
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const typeOk = allowedImageTypes.includes(file.type) || /\.(jpe?g|png)$/i.test(file.name);
        if (!typeOk) {
            alertErrorMessage("Only jpg, jpeg, png images are allowed");
            e.target.value = "";
            return;
        }

        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleClearImage = () => {
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview("");
    };

    const buildFormData = () => {
        const payload = new FormData();
        payload.append("name", formData.name.trim());
        payload.append("pair_id", formData.pair_id);
        payload.append("useBalancePercent", String(formData.useBalancePercent));
        payload.append("rating", String(formData.rating === "" || formData.rating == null ? 0 : formData.rating));

        if (isEdit) payload.append("masterId", masterId);
        if (isEdit && formData.status) payload.append("status", formData.status);
        if (formData.bio) payload.append("bio", formData.bio.trim());

        numericFields.forEach((key) => {
            if (key === "useBalancePercent" || key === "rating") return;
            if (formData[key] !== "" && formData[key] !== undefined && formData[key] !== null) {
                payload.append(key, String(formData[key]));
            }
        });

        if (imageFile) {
            payload.append("profileImage", imageFile);
        }

        return payload;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alertErrorMessage("name is required");
            return;
        }
        if (!formData.pair_id) {
            alertErrorMessage("pair_id is required");
            return;
        }
        const usePercent = Number(formData.useBalancePercent);
        if (formData.useBalancePercent === "" || Number.isNaN(usePercent) || usePercent < 1 || usePercent > 100) {
            alertErrorMessage("useBalancePercent must be 1-100. Negative values are not allowed");
            return;
        }
        const rating = Number(formData.rating);
        if (Number.isNaN(rating) || rating < 0 || rating > 5) {
            alertErrorMessage("rating must be 0-5. Negative values are not allowed");
            return;
        }

        const percentChecks = [
            { key: "profitPercent", label: "Profit percent", max: null },
            { key: "lossPercent", label: "Loss percent", max: 100 },
            { key: "displayWinRate", label: "Display win rate", max: 100 }
        ];
        for (const field of percentChecks) {
            if (formData[field.key] === "" || formData[field.key] === undefined || formData[field.key] === null) continue;
            const num = Number(formData[field.key]);
            if (Number.isNaN(num) || num < 0) {
                alertErrorMessage(`${field.label} cannot be negative`);
                return;
            }
            if (field.max != null && num > field.max) {
                alertErrorMessage(`${field.label} cannot be more than ${field.max}`);
                return;
            }
        }

        const positiveOrZeroFields = [
            { key: "displayBalance", label: "Display balance" },
            { key: "displayTotalProfit", label: "Display total profit" },
            { key: "displayFollowers", label: "Display followers" }
        ];
        for (const field of positiveOrZeroFields) {
            if (formData[field.key] === "" || formData[field.key] === undefined || formData[field.key] === null) continue;
            const num = Number(formData[field.key]);
            if (Number.isNaN(num) || num < 0) {
                alertErrorMessage(`${field.label} cannot be negative`);
                return;
            }
        }

        LoaderHelper.loaderStatus(true);
        try {
            const payload = buildFormData();
            const res = isEdit
                ? await AuthService.copyTradingUpdateMaster(payload)
                : await AuthService.copyTradingCreateMaster(payload);

            if (res?.success) {
                alertSuccessMessage(res.message || (isEdit ? "Master updated successfully" : "Master created successfully"));
                navigate("/dashboard/copy-trading/masters");
            } else {
                alertErrorMessage(res?.message || "Failed to save master");
            }
        } catch (error) {
            alertErrorMessage("Error saving master");
        }
        LoaderHelper.loaderStatus(false);
    };

    const previewSrc = imagePreview || getProfileImageUrl(existingImage);

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h1>{isEdit ? "Edit Master" : "Add Master"}</h1>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboard/copy-trading/masters")}
                    >
                        <i className="fa fa-arrow-left"></i> Back to Masters
                    </button>
                </div>

                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">{isEdit ? "Update copy trading master" : "Create a new copy trading master"}</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="Crypto King"
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Trading Pair *</label>
                                    <select
                                        className="form-select"
                                        value={formData.pair_id}
                                        onChange={(e) => handleChange("pair_id", e.target.value)}
                                        required
                                    >
                                        <option value="">Select Trading Pair</option>
                                        {pairList.map((pair) => (
                                            <option key={getPairId(pair)} value={getPairId(pair)}>
                                                {formatPair(pair)}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="text-muted">USDT quote pairs only (BTC/USDT, ETH/USDT).</small>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Rating</label>
                                    <StarRating
                                        value={formData.rating}
                                        editable
                                        onChange={(val) => handleChange("rating", val)}
                                    />
                                    <input
                                        type="number"
                                        className="form-control mt-2"
                                        min={0}
                                        max={5}
                                        step={0.5}
                                        value={formData.rating}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === "") {
                                                handleChange("rating", 0);
                                                return;
                                            }
                                            const num = Number(val);
                                            if (Number.isNaN(num)) return;
                                            handleChange("rating", Math.min(5, Math.max(0, num)));
                                        }}
                                    />
                                    <small className="text-muted">0 to 5, half stars allowed (e.g. 4.5). Default 0.</small>
                                </div>
                                {isEdit && (
                                    <div className="col-md-6">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-select"
                                            value={formData.status}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                        </select>
                                    </div>
                                )}
                                <div className="col-md-6">
                                    <label className="form-label">Profile Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={handleImageChange}
                                    />
                                    <small className="text-muted">jpg, jpeg, png only. Leave empty on edit to keep current image.</small>
                                    {previewSrc && (
                                        <div className="mt-3 d-flex align-items-center gap-3">
                                            <img
                                                src={previewSrc}
                                                alt="Profile preview"
                                                style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "1px solid #e5e7eb" }}
                                            />
                                            {imageFile && (
                                                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleClearImage}>
                                                    Remove selected file
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label">Bio</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={formData.bio}
                                        onChange={(e) => handleChange("bio", e.target.value)}
                                        placeholder="Professional copy trading master"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Use Balance Percent * (1–100)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min={1}
                                        max={100}
                                        value={formData.useBalancePercent}
                                        onChange={(e) => handleChange("useBalancePercent", e.target.value)}
                                        required
                                    />
                                    <small className="text-muted">% of follower spot USDT balance used per trade</small>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Profit Percent</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min={0}
                                        value={formData.profitPercent}
                                        onChange={(e) => handleChange("profitPercent", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Loss Percent</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min={0}
                                        max={100}
                                        value={formData.lossPercent}
                                        onChange={(e) => handleChange("lossPercent", e.target.value)}
                                    />
                                    <small className="text-muted">100 = full locked amount is lost</small>
                                </div>
                                <div className="col-12">
                                    <hr />
                                    <h6 className="mb-0">Display / Marketing Stats (USDT)</h6>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Display Balance (USDT)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min={0}
                                        value={formData.displayBalance}
                                        onChange={(e) => handleChange("displayBalance", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Display Total Profit (USDT)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min={0}
                                        value={formData.displayTotalProfit}
                                        onChange={(e) => handleChange("displayTotalProfit", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Display Win Rate %</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min={0}
                                        max={100}
                                        value={formData.displayWinRate}
                                        onChange={(e) => handleChange("displayWinRate", e.target.value)}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Display Followers</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min={0}
                                        value={formData.displayFollowers}
                                        onChange={(e) => handleChange("displayFollowers", e.target.value)}
                                    />
                                    <small className="text-muted">0 = use real follower count</small>
                                </div>
                            </div>
                            <div className="mt-4 d-flex gap-2">
                                <button type="submit" className="btn btn-indigo">
                                    {isEdit ? "Update Master" : "Create Master"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate("/dashboard/copy-trading/masters")}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterForm;
