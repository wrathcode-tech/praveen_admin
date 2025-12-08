import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import moment from "moment";
import { alertErrorMessage, alertSuccessMessage, } from "../../../customComponent/CustomAlertMessage";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import 'jspdf-autotable';
import DataTableBase from "../../../customComponent/DataTable";
import Select from "react-select";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";

const UserUPI = () => {
    const [data, setData] = useState([]);
    const [slectedBankType, setSlectedBankType] = useState("Pending");

    const dateFilter = (row) => {
        return <>{moment(row?.createdAt).format("MMM Do YYYY hh:mm A")}</>;
    };
    const status = (row) => {
        return (
            <div className=" d-flex gap-2 " >
                {row?.verified === 0 ? <>
                    <button className="btn-success  btn btn-sm" type="button" onClick={() => VerifyBankDetails(row?._id, '1')}>Approve
                    </button>
                    <button className="btn-danger  btn btn-sm" type="button" onClick={() => VerifyBankDetails(row?._id, '2')}>Reject
                    </button></> : row?.verified === 1 ? <span className=" text-success" >Approved </span> : <span className="text-danger" >Rejected </span>}
            </div>
        );
    };

    const image = (row) => {
        return (
            <img style={{ width: '40%', height: 'auto' }}
                className="table-img" src={ApiConfig.appUrl + row?.upi_image} />
        );
    };



    const columns = [

        { name: "User Id", selector: row => row.user_id, },
        { name: "Upi Id", sort: true, selector: row => row.upi_id, },
        { name: "Upi Image", sort: true, selector: image, },
        { name: "Date", sort: true, selector: dateFilter },
        { name: "Status", sort: true, selector: status },
    ];

    useEffect(() => {
        handleData("Pending");
    }, []);

    const VerifyBankDetails = async (id, status) => {
        await AuthService.verifyUPIDetails(id, status).then(async result => {
            if (result?.success) {
                try {
                    alertSuccessMessage("Status Updated")
                    handleData(slectedBankType);
                } catch (error) {
                    console.log('error', `${error}`);
                }
            } else {
                alertErrorMessage(result?.message)
            }
        });
    }

    const handleData = async (type) => {
        setSlectedBankType(type)
        try {
            let result;
            LoaderHelper.loaderStatus(true);
            if (type === "Approved") result = await AuthService.approveUPIDetails()
            else if (type === "Pending") result = await AuthService.pendingUPIDetails()
            else if (type === "Rejected") result = await AuthService.rejectUPIDetails()

            if (result?.success) {
                setData(result?.data?.reverse());
            }
        } finally { LoaderHelper.loaderStatus(false); }
    };


    // *********Export Trade Data In Excel Formats ************* // 
    const exportToExcel = () => {
        const exportableData = ExportableData();
        const ws = XLSX.utils.json_to_sheet(exportableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Trades');
        XLSX.writeFile(wb, 'Approved Bank Accounts.xlsx');
    };


    // *********Export Trade Data In PDF Formats ************* // 
    const exportToPDF = () => {
        const exportableData = ExportableData();
        const doc = new jsPDF('landscape', 'mm', 'a4');
        doc.text('Approved Bank Accounts', 10, 10);
        const tableData = exportableData.map(item => Object.values(item));
        const tableHeaders = Object.keys(exportableData[0]); // Get keys from the first object
        doc.autoTable({
            head: [tableHeaders],
            body: tableData,
            startY: 20,
            theme: 'grid',
        });
        doc.save('Approved Bank Accounts.pdf');
    };

    // ********* Rearrange Exportabel Data ********* //
    const ExportableData = () => {
        const modifiedArray = data.map((item, index) => {
            const { updatedAt, user_id, __v, _id, kyc_reject_reason, kycdata, createdAt, ...rest } = item;
            const modifiedItem = {};
            for (const key in rest) {
                if (Object.hasOwnProperty.call(rest, key)) {
                    const modifiedKey = key.toUpperCase();
                    modifiedItem[modifiedKey] = rest[key];
                }
            }
            modifiedItem.CREATED_AT = moment(createdAt).format('DD/MM/YYYY hh:mm A');
            return modifiedItem;
        });
        return modifiedArray;

    }
    // *********Export Trade Data In CSV Formats ************* // 
    const exportToCSV = () => {
        const exportableData = ExportableData();
        const csv = Papa.unparse(exportableData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'User_UPI_Details.csv';
        link.click();
    };
    const HandleExport = (exportData) => {
        if (exportData === 'EXCEL') {
            exportToExcel()
        }
        else if (exportData === 'PDF') {
            exportToPDF()
        }
        else if (exportData === 'CSV') {
            exportToCSV()
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
                                        <div className="page-header-icon">
                                            <i className=" fa fa-user-slash"></i>
                                        </div>
                                        User UPI Details
                                    </h1>
                                </div>
                                <div className="col-2 mt-4" style={{ color: "#69707a" }}>
                                    <select className="form-control"
                                        value={slectedBankType}
                                        onChange={(e) => handleData(e.target.value)}>
                                        <option>Pending</option>
                                        <option>Approved</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div class="card-header">
                            User UPI Details
                            {data.length === 0 ? (
                                ""
                            ) : (
                                <div class="dropdown">
                                    <button
                                        class="btn btn-dark btn-sm dropdown-toggle"
                                        id="dropdownFadeInUp"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        <i className="fa fa-download me-3"></i>Export
                                    </button>
                                    <div class="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                                        <button type="button" onClick={() => { HandleExport('EXCEL') }} class="dropdown-item">Export as EXCEL</button>
                                        <button type="button" onClick={() => { HandleExport('CSV') }} class="dropdown-item">Export as CSV</button>
                                        <button type="button" onClick={() => { HandleExport('PDF') }} class="dropdown-item">Export as PDF</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="card-body">
                            <>
                                {data.length === 0 ? (
                                    <h6 className="ifnoData">
                                        <img src="/assets/img/no-data.png" /> <br /> No Data
                                        Available
                                    </h6>
                                ) : (
                                    <div class="table-responsive">
                                        <DataTableBase columns={columns} data={data} />
                                    </div>
                                )}
                            </>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
};
export default UserUPI;
