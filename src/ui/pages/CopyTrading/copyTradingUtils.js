import React from "react";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";

export const formatUsdt = (value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return "0 USDT";
    return `${num.toLocaleString()} USDT`;
};

export const formatPair = (item) => {
    if (!item) return "N/A";
    if (item.pair) return item.pair;
    const base = item.base_currency || item.baseCurrency;
    const quote = item.quote_currency || item.quoteCurrency;
    if (base && quote) return `${base}/${quote}`;
    return item.short_name || "N/A";
};

export const getPairId = (pair) => pair?._id || pair?.pair_id || "";

export const isUsdtQuotePair = (pair) => {
    const quote = String(pair?.quote_currency || pair?.quoteCurrency || "").toUpperCase();
    const label = formatPair(pair).toUpperCase();
    return quote === "USDT" || label.endsWith("/USDT");
};

export const isActivePair = (pair) =>
    !pair?.status || String(pair.status).toLowerCase() === "active";

export const getProfileImageUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return `${ApiConfig.appUrl}${String(path).replace(/^\//, "")}`;
};

export const StarRating = ({ value = 0, onChange, editable = false }) => {
    const rating = Math.min(5, Math.max(0, Number(value) || 0));
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="d-flex align-items-center gap-1" style={{ lineHeight: 1 }}>
            {stars.map((star) => {
                const full = rating >= star;
                const half = !full && rating >= star - 0.5;
                return (
                    <span
                        key={star}
                        className="d-inline-block"
                        style={{ position: "relative", fontSize: "1.05rem", cursor: editable ? "pointer" : "default" }}
                    >
                        {editable && (
                            <>
                                <span
                                    style={{ position: "absolute", left: 0, top: 0, width: "50%", height: "100%", zIndex: 1 }}
                                    onClick={() => onChange(star - 0.5)}
                                />
                                <span
                                    style={{ position: "absolute", right: 0, top: 0, width: "50%", height: "100%", zIndex: 1 }}
                                    onClick={() => onChange(star)}
                                />
                            </>
                        )}
                        <i
                            className={full ? "fas fa-star" : half ? "fas fa-star-half-alt" : "far fa-star"}
                            style={{ color: "#f1c40f" }}
                        />
                    </span>
                );
            })}
            <span className="ms-1">{rating.toFixed(1)}</span>
        </div>
    );
};
