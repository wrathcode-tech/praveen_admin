import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { formatPair, getPairId, isActivePair, isUsdtQuotePair } from "./copyTradingUtils";

const PlaceTrade = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const preselectedMasterId = location.state?.masterId || "";

    const [masters, setMasters] = useState([]);
    const [pairList, setPairList] = useState([]);
    const [priceLoading, setPriceLoading] = useState(false);
    const [formData, setFormData] = useState({
        master_id: preselectedMasterId,
        pair_id: "",
        side: "BUY",
        amount: "",
        price: "",
        resultType: "PROFIT",
        pnlPercent: "",
        status: "OPEN"
    });

    useEffect(() => {
        fetchMasters();
        fetchPairList();
    }, []);

    const fetchMasters = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.copyTradingMasterList({ skip: 0, limit: 100, status: "ACTIVE" });
            if (res?.success) {
                setMasters(res.data || []);
            } else {
                alertErrorMessage(res?.message || "Failed to load masters");
            }
        } catch (error) {
            alertErrorMessage("Error loading masters");
        }
        LoaderHelper.loaderStatus(false);
    };

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

    const fetchLivePrice = async (pairId, side) => {
        if (!pairId) return;
        setPriceLoading(true);
        try {
            const res = await AuthService.copyTradingPairLivePrice(pairId, side);
            if (res?.success && res.data) {
                const data = res.data;
                const autoPrice = data.price ?? (side === "BUY" ? data.sell_price : side === "SELL" ? data.buy_price : data.livePrice);
                if (autoPrice !== undefined && autoPrice !== null && autoPrice !== "" && Number(autoPrice) > 0) {
                    setFormData((prev) => ({ ...prev, price: autoPrice }));
                }
            } else {
                alertErrorMessage(res?.message || "Failed to fetch live price");
            }
        } catch (error) {
            alertErrorMessage("Failed to fetch live price");
        }
        setPriceLoading(false);
    };

    const handleChange = (key, value) => {
        if (key === "amount" || key === "price") {
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

    const selectedMaster = masters.find((m) => m._id === formData.master_id);

    useEffect(() => {
        if (!selectedMaster || formData.pair_id) return;
        const masterPairId = selectedMaster.pair_id?._id || selectedMaster.pair_id;
        if (masterPairId) {
            setFormData((prev) => ({ ...prev, pair_id: masterPairId }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMaster]);

    useEffect(() => {
        if (formData.pair_id) {
            fetchLivePrice(formData.pair_id, formData.side);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.pair_id, formData.side]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.master_id) {
            alertErrorMessage("Please select a master");
            return;
        }
        if (!formData.pair_id) {
            alertErrorMessage("Please select a trading pair");
            return;
        }
        if (!formData.side || !formData.resultType) {
            alertErrorMessage("side and resultType are required");
            return;
        }

        const amount = Number(formData.amount);
        const price = Number(formData.price);

        if (formData.amount === "" || formData.amount === null || formData.amount === undefined || Number.isNaN(amount)) {
            alertErrorMessage("Amount is required");
            return;
        }
        if (amount <= 0) {
            alertErrorMessage("Amount must be greater than 0. Negative or zero trades are not allowed");
            return;
        }
        if (formData.price === "" || formData.price === null || formData.price === undefined || Number.isNaN(price)) {
            alertErrorMessage("Price is required. Trade cannot be placed without price");
            return;
        }
        if (price <= 0) {
            alertErrorMessage("Price must be greater than 0. Negative or zero price is not allowed");
            return;
        }

        const payload = {
            master_id: formData.master_id,
            pair_id: formData.pair_id,
            side: formData.side,
            amount,
            price,
            resultType: formData.resultType,
            status: formData.status || "OPEN"
        };
        if (formData.pnlPercent !== "") {
            const pnl = Number(formData.pnlPercent);
            if (Number.isNaN(pnl) || pnl < 0) {
                alertErrorMessage("PnL percent must be 0 or greater");
                return;
            }
            payload.pnlPercent = pnl;
        }

        LoaderHelper.loaderStatus(true);
        try {
            const res = await AuthService.copyTradingPlaceTrade(payload);
            if (res?.success) {
                const copied = res.data?.copiedUsers ?? res.data?.trade?.copiedUsersCount ?? 0;
                alertSuccessMessage(res.message || `Trade placed successfully. Copied users: ${copied}`);
                navigate("/dashboard/copy-trading/trades");
            } else {
                alertErrorMessage(res?.message || "Failed to place trade");
            }
        } catch (error) {
            alertErrorMessage("Error placing trade");
        }
        LoaderHelper.loaderStatus(false);
    };

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <h1>Place Trade</h1>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboard/copy-trading/trades")}
                    >
                        <i className="fa fa-arrow-left"></i> Back to Trades
                    </button>
                </div>

                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="mb-0">Place a fake copy trade for followers</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Master *</label>
                                    <select
                                        className="form-select"
                                        value={formData.master_id}
                                        onChange={(e) => handleChange("master_id", e.target.value)}
                                        required
                                    >
                                        <option value="">Select Master</option>
                                        {masters.map((master) => (
                                            <option key={master._id} value={master._id}>
                                                {master.name} ({formatPair(master)})
                                            </option>
                                        ))}
                                    </select>
                                    {selectedMaster && (
                                        <small className="text-muted">
                                            Default profit {selectedMaster.profitPercent ?? 0}% / loss {selectedMaster.lossPercent ?? 0}% · uses {selectedMaster.useBalancePercent ?? 0}% of spot balance
                                        </small>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Trading Pair *</label>
                                    <select
                                        className="form-select"
                                        value={formData.pair_id}
                                        onChange={(e) => handleChange("pair_id", e.target.value)}
                                        required
                                    >
                                        <option value="">Select Pair</option>
                                        {pairList.map((pair) => (
                                            <option key={getPairId(pair)} value={getPairId(pair)}>
                                                {formatPair(pair)}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="text-muted">USDT quote pairs only (BTC/USDT, ETH/USDT).</small>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Side *</label>
                                    <select
                                        className="form-select"
                                        value={formData.side}
                                        onChange={(e) => handleChange("side", e.target.value)}
                                    >
                                        <option value="BUY">BUY</option>
                                        <option value="SELL">SELL</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Result Type *</label>
                                    <select
                                        className="form-select"
                                        value={formData.resultType}
                                        onChange={(e) => handleChange("resultType", e.target.value)}
                                    >
                                        <option value="PROFIT">PROFIT</option>
                                        <option value="LOSS">LOSS</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Amount *</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0.00000001"
                                        step="any"
                                        value={formData.amount}
                                        onChange={(e) => handleChange("amount", e.target.value)}
                                        placeholder="100"
                                        required
                                    />
                                    <small className="text-muted">Positive amount only.</small>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Price *</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0.00000001"
                                        step="any"
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                        placeholder={priceLoading ? "Fetching live price..." : "65000"}
                                        required
                                    />
                                    <small className="text-muted">
                                        {priceLoading
                                            ? "Fetching live price..."
                                            : formData.side === "BUY"
                                                ? "Auto-filled from sell_price (ask). Editable."
                                                : "Auto-filled from buy_price (bid). Editable."}
                                    </small>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">PnL Percent</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min={0}
                                        step="any"
                                        value={formData.pnlPercent}
                                        onChange={(e) => handleChange("pnlPercent", e.target.value)}
                                        placeholder={selectedMaster ? `Default ${formData.resultType === "LOSS" ? selectedMaster.lossPercent : selectedMaster.profitPercent}` : "Uses master default if empty"}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={formData.status}
                                        onChange={(e) => handleChange("status", e.target.value)}
                                    >
                                        <option value="OPEN">OPEN (default — auto-executes in ~1 sec)</option>
                                        <option value="EXECUTED">EXECUTED (settle now)</option>
                                        <option value="CANCELLED">CANCELLED (no copy to users)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4 d-flex gap-2">
                                <button type="submit" className="btn btn-indigo">Place Trade</button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate("/dashboard/copy-trading/trades")}
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

export default PlaceTrade;
