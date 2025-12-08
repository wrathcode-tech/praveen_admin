// Updated TradeList with Fiat Edit & Map/Unmap Referral functionality
import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const DisputeManagement = () => {
    const navigate = useNavigate();
    const [exportData, setExportData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(100);
    const [totalData, setTotalData] = useState();
    const [search, setSearch] = useState("");
    const [kycType, setKycType] = useState(4);

    const userType = sessionStorage.getItem("userType");

    const handlePageChange = ({ selected }) => setCurrentPage(selected + 1);
    const pageCount = totalData / itemsPerPage;
    const skip = (currentPage - 1) * itemsPerPage;

    const linkFollow = (row) => (
        <div className="d-flex flex-column gap-2">
            <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-dark btn-sm" onClick={() => {
                    navigate("/dashboard/dispute_Details", {
                        state: {
                            userId: row?._id,
                            disputeData: row
                        }
                    });
                }}>View</button>
                {/* <button className={`btn btn-sm ${row?.status === 'Active' ? 'btn-success' : 'btn-danger'}`} onClick={() => handleStatus(row?.id, row?.status === 'Active' ? 'Inactive' : 'Active')}>
                    {row?.status === 'Active' ? 'Active' : 'Inactive'}
                </button> */}

            </div>

        </div>
    );


    const columns = [
        { name: "Sr No.", selector: (row, index) => skip + index + 1 },
        // { name: "User ID", width:"150px",wrap: true, selector: userIdFollow },
        { name: "User UID", width: "150px", wrap: true, selector: row => row?.uuid },
        { name: "Name", wrap: true, selector: row => row?.firstName ? `${row?.firstName} ${row?.lastName}` : "-----" },
        { name: "Email", wrap: true, selector: row => row.emailId || "-----" },
        { name: "Referral Code", width: "150px", wrap: true, selector: row => row.referral_code || "-----" },
        { name: "KYC", wrap: true, selector: row => ["Not Submitted", "Pending", "Approved", "Rejected"][row.kycVerified] },
        { name: "Phone", wrap: true, selector: row => row.mobileNumber || "-----" },
        { name: "Reg. Date", wrap: true, selector: row => moment(row?.createdAt).format("MMM Do YYYY hh:mm A") },
        { name: "Sponsored By", wrap: true, width: "150px", selector: row => row?.sponsered_by?.emailId || row?.sponsered_by?.mobileNumber || "-----" },
        { name: "Action", selector: linkFollow }
    ];




    const handleStatus = async (_id, status) => {
        if (userType !== "1") {
            alertErrorMessage("Not Authorized");
            return;
        }

        const res = await AuthService.updateStatus(_id, status);
        if (res.success) {
            alertSuccessMessage(res.message);
            handleUserData(skip, itemsPerPage, search);
        } else {
            alertErrorMessage(res.message);
        }
    };



    const handleUserData = async (skip, limit, search) => {
        LoaderHelper.loaderStatus(true);
        const res = await AuthService.getUserList(skip, limit, search, kycType);
        LoaderHelper.loaderStatus(false);
        if (res.success) {
            setExportData(res.data);
            setTotalData(res.totalCount);
        } else alertErrorMessage("No data found");
    };





    useEffect(() => {
        handleUserData(skip, itemsPerPage, search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, itemsPerPage, skip, kycType, search]);

    return (
        <div id="layoutSidenav_content">
            <div className="container-xl px-4">
                <h1 className="mt-4 mb-3">Dispute Management</h1>
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between">
                        <input type="search" className="form-control w-25" placeholder="Search email, phone or uuid" onChange={e => setSearch(e.target.value)} value={search} />
                        <select className="form-select w-25" value={kycType} onChange={e => setKycType(e.target.value)}>
                            <option value={2}>Approved KYC</option>
                            <option value={1}>Pending KYC</option>
                            <option value={3}>Rejected KYC</option>
                            <option value={0}>Not Submitted</option>
                            <option value={4}>All</option>
                        </select>
                    </div>
                    <div className="card-body">
                        <DataTableBase columns={columns} data={exportData} pagination={false} />
                        <ReactPaginate pageCount={pageCount} onPageChange={handlePageChange} containerClassName={'customPagination'} activeClassName={'active'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisputeManagement;
