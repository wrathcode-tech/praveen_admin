import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";
import jsPDF from 'jspdf';
import ReactPaginate from "react-paginate";
import { $ } from "react-jquery-plugin";
import { useNavigate } from "react-router-dom";

const RejectedKyc = () => {
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);
    const [showImage, setShowImage] = useState("");

    const handleImageDetail = (img) => {
        setShowImage(img);
        $("#image_modal").modal("show");
    };


    function imageFormatter(row) {
        return (
            <img style={{ width: "40%", height: "auto" }} className="table-img" src={ApiConfig?.appUrl + row?.user_selfie} alt="Selfie" />
        );
    };

    const rejectedByFormatter = (row) => {
        return (
            <>{row?.admin_email}
                <br />
                {row?.admin_ip && "IP:" + " " + row?.admin_ip}</>
        )
    }
    function imageFormatter2(row) {
        return (
            <img style={{ width: "40%", height: "auto" }} src={ApiConfig?.appUrl + row?.document_front_image} alt="Selfie" className="table-img cursor_pointer" onClick={() => handleImageDetail(ApiConfig?.appUrl + row?.document_front_image)
            } />
        );
    };

    function imageFormatter3(row) {
        return (
            <img style={{ width: "40%", height: "auto" }} src={ApiConfig?.appUrl + row?.document_back_image} alt="Selfie" className="table-img cursor_pointer" data-bs-toggle="modal" data-bs-target="#image_modal" onClick={() => handleImageDetail(ApiConfig?.appUrl + row?.document_back_image)
            } />
        );
    };
    const linkFollow = (row) => {
        return (
            <button className="verifybtn" onClick={() => { navigateToKyc(row); }}>
                View
            </button>
        );
    };
    const navigate = useNavigate();

    const navigateToKyc = (row) => {
        navigate(`/dashboard/VerifyKyc/${row.uuid}`)
    }
    const columns = [
        { name: "Sr no.", wrap: true, selector: row => allData?.indexOf(row) + 1 },
        { name: "Date", wrap: true, selector: row => moment(row?.createdAt).format("Do MMMM YYYY  h:mm:ss A") },
        { name: "ID", wrap: true, selector: row => row.uuid, },
        { name: "EmailId", wrap: true, selector: row => row.emailId, },
        { name: <div style={{ whiteSpace: "revert" }}>Doc Number</div>, wrap: true, selector: row => row.document_number, },
        { name: "Doc Front Image", selector: row => imageFormatter2(row), },
        { name: "Doc Back Image", selector: row => imageFormatter3(row), },
        { name: "Selfie", selector: row => imageFormatter(row), },
        { name: "Action", selector: row => linkFollow(row), },
    ];

    function searchObjects(e) {
        const keysToSearch = ["document_number", "_id", "emailId", "pancard_number", "dob", "first_name", "last_name"];
        const searchTerm = e.target.value?.toLowerCase();
        const matchingObjects = allData.filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
        setData(matchingObjects);
    };

    useEffect(() => {
        handleData()
    }, []);


    const handleData = async () => {
        LoaderHelper.loaderStatus(true);
        await AuthService.getdatarejectedlist().then(async result => {
            LoaderHelper.loaderStatus(false);
            if (result?.data) {
                try {
                    setData(result?.data);
                    // setTotalData(result?.totalCount)
                    setAllData(result?.data);
                } catch (error) {
                    alertErrorMessage('No data found');
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage('No data found');
            }
        });
    }

    const generatePDF = () => {
        const doc = new jsPDF();
        const tableData = data?.map((row, index) => {
            return [
                moment(row.createdAt).format("Do MMMM YYYY, h:mm:ss A"),
                // row._id,
                `${row.first_name} ${row.last_name}`,
                row.emailId,
                row.document_number,
                row.pancard_number,
                row.dob,
                // ApiConfig.appUrl + row.user_selfie
            ];
        });

        doc.autoTable({
            head: [['Date', 'Name', 'Email', 'Document Number', 'Pan Number', 'DOB']],
            body: tableData
        });

        doc.save("rejected_kyc_list.pdf");
    };

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
                                            <div className="page-header-icon"> <i className="fa fa-user-check" ></i></div>
                                            Rejected Kyc
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10 withdrawal_tbs">
                        <div className="card mb-4">
                            <div className="card-header">Rejected Kyc List
                                <div className="col-5">
                                    <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={searchObjects} />
                                </div>
                                {data.length === 0 ? "" :
                                    <div className="dropdown">
                                        <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-download me-3"></i>Export</button>
                                        <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                                            <button type="button" onClick={generatePDF} className="dropdown-item">Export as PDF</button>
                                        </div>
                                    </div>}
                            </div>
                            <div className="card-body">
                                <div className="table-responsive topspace" width="100%">
                                    <DataTableBase columns={columns} data={data} />
                                </div>
                                {/* {totalData > 5 ? <ReactPaginate
                            pageCount={pageCount}
                            onPageChange={handlePageChange}
                            containerClassName={'customPagination'}
                            activeClassName={'active'}
                        /> : ""} */}
                            </div>
                        </div>
                    </div>
                </main>
            </div>


            <div
                className="modal image_modal"
                id="image_modal"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalCenterTitle"
                aria-hidden="true"
            >
                <div className="modal-dialog  alert_modal modal-lg" role="document">
                    <div className="modal-content">
                        <button
                            className="btn-close"
                            type="button"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                        <div className="ratio ratio-16x9">
                            <img src={showImage} className="w-100 cc_modal_img " alt="" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default RejectedKyc;