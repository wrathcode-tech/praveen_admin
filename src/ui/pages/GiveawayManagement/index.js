// Giveaway Management – With Status Filter & 3 Action Buttons
import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";

const GiveawayManagement = () => {
    const [exportData, setExportData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [search, setSearch] = useState("");
    const [dataType, setDataType] = useState(3); // Default = All

    // ================= ACTION BUTTONS =================
    const linkFollow = (row) => (
        <div className="d-flex gap-2 align-items-center">
            <button
                className={`btn btn-sm ${row?.status === "DISPATCHED" ? "btn-warning" : "btn-outline-warning"}`}
                onClick={() => handleStatus(row?._id, row?.userId?._id, "DISPATCHED")}>
                DISPATCHED
            </button>
            <button
                className={`btn btn-sm ${row?.status === "DELIVERED" ? "btn-success" : "btn-outline-success"}`}
                onClick={() => handleStatus(row?._id, row?.userId?._id, "DELIVERED")}>
                DELIVERED
            </button>
            <button
                className={`btn btn-sm ${row?.status === "CANCELLED" ? "btn-danger" : "btn-outline-danger"}`}
                onClick={() => handleStatus(row?._id, row?.userId?._id, "CANCELLED")}>
                CANCELLED
            </button>
        </div>
    );


    // ================= TABLE COLUMNS =================
    const columns = [
        { name: "S.No", width: "80px", selector: (row, index) => index + 1 },
        { name: "User UID", width: "200px", wrap: true, selector: (row) => row?.userId?.uuid },
        { name: "Name", width: "200px", wrap: true, selector: (row) => (row?.userId?.firstName ? `${row?.userId?.firstName} ${row?.userId?.lastName}` : "-----") },
        { name: "Email", width: "250px", wrap: true, selector: (row) => row?.userId?.emailId || "-----" },
        { name: "Phone", wrap: true, selector: (row) => row.userId?.mobileNumber || "-----" },
        {
            name: "Deposit Amount",
            width: "200px",
            wrap: true,
            selector: (row) => `$${row?.depositedAmount || "-----"}`
        },
        { name: "Delivery Address", width: "250px", wrap: true, selector: (row) => row?.devliveryAddress || "-----", },
        { name: "Description", width: "250px", wrap: true, selector: (row) => row?.description || "-----" },
        { name: "Status", width: "200px", wrap: true, selector: (row) => row?.status || "-----" },
        { name: "Action", width: "400px", selector: linkFollow },
    ];

    // ================= FETCH DATA =================
    const handleUserData = async () => {
        LoaderHelper.loaderStatus(true);
        const res = await AuthService.getGiveawayList();
        LoaderHelper.loaderStatus(false);
        if (res.success) {
            setAllData(res.data);
            filterData(res.data, dataType, search);
        } else alertErrorMessage("No data found");
    };

    // ================= UPDATE STATUS =================
    const handleStatus = async (giveawayId, userId, status) => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService?.updateGiveawayStatus(giveawayId, userId, status);
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                alertSuccessMessage(result?.message || "Giveaway status updated.");
                handleUserData();
            } else {
                alertErrorMessage(result?.message || "Something went wrong.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error updating giveaway status.");
        }
    };

    // ================= FILTER FUNCTION =================
    const filterData = (data, type, searchText) => {
        let filtered = [...data];
        if (type !== 3) {
            const statusMap = ["DISPATCHED", "DELIVERED", "CANCELLED"];
            filtered = filtered?.filter((item) => item?.status === statusMap[type]);
        }
        if (searchText.trim() !== "") {
            filtered = filtered?.filter(
                (item) =>
                    item?.userId?.uuid?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item?.userId?.emailId?.includes(searchText) ||
                    item?.userId?.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item?.userId?.mobileNumber?.includes(searchText) ||
                    item?.userId?.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item?.depositedAmount?.toString().includes(searchText) ||
                    item?.devliveryAddress?.toLowerCase().includes(searchText.toLowerCase()) ||
                    item?.description?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        setExportData(filtered);
    };

    // ================= EFFECTS =================
    useEffect(() => {
        handleUserData();
    }, []);

    useEffect(() => {
        filterData(allData, dataType, search);
    }, [dataType, search]);

    // ================= RENDER =================
    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <h1 className="mt-4 mb-3">Giveaway Management List</h1>
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <input
                            type="search"
                            className="form-control w-25"
                            placeholder="Search email, phone or uuid"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                        <select className="form-select w-25" value={dataType} onChange={(e) => setDataType(Number(e.target.value))}>
                            <option value={0}>DISPATCHED</option>
                            <option value={1}>DELIVERED</option>
                            <option value={2}>CANCELLED</option>
                            <option value={3}>ALL</option>
                        </select>
                    </div>

                    <div className="card-body">
                        <DataTableBase columns={columns} data={exportData} pagination />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GiveawayManagement;
