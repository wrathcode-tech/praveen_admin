import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import { $ } from "react-jquery-plugin";

const CoinListDetails = () => {
    const [coinList, setCoinList] = useState([]);
    const [allData, setAllData] = useState([]);
    const [details,setDetails] = useState({})

    const statuslinkFollow = (row) => {
        return (
            <div>
                {row?.status === 'pending' ? <>
                    <button className="btn btn-success btn-sm me-2" onClick={() => { handleStatus(row?._id, 'completed') }}>Completed</button>
                    <button className="btn btn-danger btn-sm me-2" onClick={() => { handleStatus(row?._id, 'rejected') }} >Rejected</button> </>
                    : row?.status}
            </div>
        );
    };

    const updatedByFormatter = (row) =>{
        return (
            <>{row?.admin_email}
            <br/>
           {row?.admin_ip && "IP:" + " " + row?.admin_ip}</>
        )
    }

    const columns = [
        { name: 'Project Name', sort: true, wrap: true, selector: row => row?.projectName },
        { name: 'Email ID', wrap: true, selector: row => row?.emailId, },
        { name: 'Phone', wrap: true, selector: row => `${row?.countryCode } ${row?.phoneNumber}`, },
        { name: 'Referref By', wrap: true, selector: row => row?.referredBy, },
        { name: 'Smart Contract Address', wrap: true, selector: row => row?.smartContractAddress, },
        { name: 'Comments', wrap: true, selector: row => row?.comments, },
        { name: <div style={{whiteSpace:"revert"}}>Submission Date</div>, sort: true, selector: row => moment(row?.createdAt).format('MMM Do YYYY hh:mm A'), wrap: true },
        // { name: 'Action', selector: statuslinkFollow, wrap: true, grow: 1.5 },
        // { name: <div style={{whiteSpace:"revert"}}>Status Updated By</div> ,  wrap:true, selector: row => updatedByFormatter(row), },

    ];

    function searchObjects(e) {
        const keysToSearch = ["ContactName", "emailID", "PhoneNumber", "status"];
        const userInput = e.target.value;
        const searchTerm = userInput?.toLowerCase();
        const matchingObjects = allData.filter(obj => {
            return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm));
        });
        setCoinList(matchingObjects);
    };

    const handleStatus = async (userId, cell) => {
        await AuthService.CoinDetailsStatus(userId, cell).then(async result => {
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handleCoinDetails();
            } else {
                alertErrorMessage(result?.message)
            }
        })
    }

    useEffect(() => {
        handleCoinDetails()
    }, []);

    const handleCoinDetails = async () => {
        LoaderHelper.loaderStatus(true);
        await AuthService.getCoinListDetails().then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    setCoinList(result?.data);
                    setAllData(result?.data);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
            }
        });
    }

    const customStyles = {
        rows: {
            style: {
            cursor: "pointer", 
            },
        },
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
                                            <div className="page-header-icon"><i className="far fa-user"></i></div>
                                            Coin Listed Details
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between">Coin's Details
                                <div className="col-5">
                                    <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={searchObjects} />
                                </div>
                            </div>
                            <div className="card-body mt-3">
                                {coinList.length === 0 ? <h6 className="ifnoData"><img alt="" src="assets/img/no-data.png" /> <br />No Data Available</h6> :
                                    <div className="table-responsive" width="100%">
                                        <DataTableBase columns={columns} data={coinList} onRowClicked={(row) => {setDetails(row); $("#detail_modal").modal("show")}} customStyles={customStyles} />
                                    </div>}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <div
                className="modal"
                id="detail_modal"
                tabindex="-1"
                role="dialog"
                aria-labelledby="detail_modal_modalTitle"
                aria-hidden="true"
            >
                <div className="modal-dialog  alert_modal" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">
                                Coin Listed Details
                            </h5>
                            <button
                                className="btn-close"
                                type="button"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                                    <>
                                        <div className="form-group position-relative ">
                                            <label className="small">Name : <strong>{details?.ContactName ? details?.ContactName : "-----"}</strong> </label>
                                        </div>
                                        <div className="form-group   position-relative ">
                                            <label className="small ">Email ID : <strong>{details?.emailID ? details?.emailID : "-----"}</strong> </label>
                                        </div>
                                        <div className="form-group position-relative ">
                                            <label className="small mb-1">Phone Number : <strong>{details?.PhoneNumber ? details?.PhoneNumber : "-----"}</strong> </label>
                                        </div>
                                        <div className="form-group position-relative ">
                                            <label className="small mb-1">Project Name : <strong>{details?.ProjectName ? details?.ProjectName : "-----"}</strong> </label>
                                        </div>
                                        <div className="form-group position-relative ">
                                            <label className="small mb-1">Telegram ID : <strong>{details?.Telegram ? details?.Telegram : "-----"    }</strong> </label>
                                        </div>
                                        <div className="form-group position-relative ">
                                            <label className="small mb-1">Whatsapp ID : <strong>{details?.WhatsappID ? details?.WhatsappID:"-----"}</strong> </label>
                                        </div>
                                        <div className="form-group position-relative ">
                                            <label className="small mb-1">Contract Address : <strong>{details?.contractAddress ? details?.contractAddress:"-----"}</strong> </label>
                                        </div>
                                        <div className="form-group position-relative ">
                                            <label className="small mb-1">Registration Date : <strong>{details?.createdAt ? details?.createdAt : "-----"}</strong> </label>
                                        </div>
                                        <div className="form-group position-relative ">
                                            <label className="small mb-1">Coin Status : <strong>{details?.status ? details?.status : "-----"}</strong> </label>
                                        </div>
                                        {details?.status == "completed" ?
                                        <div className="form-group position-relative ">
                                            <label className="small mb-1">Status Updated By : <strong>{details?.admin_email}</strong> with IP <strong>{details?.admin_ip}</strong> </label>
                                        </div> : ""}
                                        <hr />
                                    </>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CoinListDetails;