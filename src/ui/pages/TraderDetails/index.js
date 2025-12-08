import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import AuthService from "../../../api/services/AuthService";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";
import TradeList from "../TradeList";
import { CSVLink } from "react-csv";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";

const TraderDetails = (props) => {
    const [userTradeDetails, setuserTradeDetails] = useState([]);
    const userType = sessionStorage.getItem('userType');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [verifiStatus, setVerifiStatus] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [verificationDate, setVerificationDate] = useState('');
    const [profilePicture, setProfilePicture] = useState();
    const [lastName, setLastName] = useState('');
    const [selfie, setSelfie] = useState()
    const [frontImg, setFrontImg] = useState()
    const [country, setCountry] = useState("");
    const [backImg, setBackImg] = useState()
    const [panImg, setPanImg] = useState()
    const [panCardNo, setPanCardNo] = useState("");
    const [docNumber, setDocNumber] = useState("");
    const [acNumber, setAcNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [branch, setBranch] = useState('');
    const [holderName, setHolderName] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [showImage, setShowImage] = useState('');
    const [activeScreen, setActiveScreen] = useState('tradeList');
    const [kycType, setkycType] = useState();
    const [documentType, setdocumentType] = useState();
    const [walletdetails, setwalletdetails] = useState([]);
    const [userBank, setUserBank] = useState([]);
    console.log("🚀 ~ TraderDetails ~ userBank:", userBank)

    useEffect(() => {
        handleUserData();
        handleTransferhistory();
        userWallet();
    }, [])

    const handleUserData = async () => {
        await AuthService.getkycdata(props.userId).then(async result => {
            if (result?.success) {
                try {
                    setFirstName(result?.data?.first_name);
                    setEmail(result?.data?.emailId);
                    setMobileNumber(result?.data?.mobileNumber);
                    setGender(result?.data?.gender);
                    setAddress(result?.data?.address);
                    setCity(result?.data?.city);
                    setState(result?.data?.state);
                    setZipCode(result?.data?.zip_code);
                    setVerifiStatus(result?.data?.kycVerified);
                    setCreatedAt(result?.data?.createdAt);
                    setVerificationDate(result?.data?.updatedAt);
                    setProfilePicture(result?.data?.user_selfie);
                    setLastName(result?.data?.last_name);
                    setSelfie(result?.data?.user_selfie);
                    setFrontImg(result?.data?.document_front_image);
                    setBackImg(result?.data?.document_back_image);
                    setPanImg(result?.data?.pancard_image);
                    setPanCardNo(result?.data?.pancard_number);
                    setCountry(result?.data?.country);
                    setDocNumber(result?.data?.document_number);
                    setkycType(result?.data?.kyc_type);
                    setdocumentType(result?.data?.document_type);
                    setAcNumber(result?.data?.bankDetails?.AcNumber);
                    setBankName(result?.data?.bankDetails?.BankName);
                    setBranch(result?.data?.bankDetails?.Branch);
                    setHolderName(result?.data?.bankDetails?.HolderName);
                    setIfsc(result?.data?.bankDetails?.ifsc);
                } catch (error) {
                }
            } else {
                // alertErrorMessage('No Data Found')
            }
        })
    }

    const PriceFormat = (row) => {
        return row?.fee && parseFloat(row?.fee?.toFixed(5));
    };

    const columns = [
        { name: "Date/Time", selector: row => moment(row?.updatedAt).format("MMM Do YYYY hh:mm AMMM Do YYYY"), },
        { name: "Currency", selector: row => row.currency, },
        { name: "Fee", selector: PriceFormat },
        { name: "Type", selector: row => row.order_type, },
        { name: "Price", selector: row => row.price, },
        { name: "Quantity", selector: row => row.quantity, },
        { name: "Side", selector: row => row.side, },
        { name: "TDS", selector: row => row.tds, },
    ]

    // ******** Wallet History Table ************//
    const walletdetailscolumns = [
        { name: "Assets", selector: row => row.short_name, },
        { name: "Balance", selector: row => row.balance, },
        { name: "Locked Balance", selector: row => row.locked_balance, },
    ]

    const handleTransferhistory = async () => {
        await AuthService.transferhistory(props.userId).then(async result => {
            if (result?.success) {
                try {
                    setuserTradeDetails(result?.data);
                } catch (error) {
                    console.log('error', `${error}`);
                }
            } else {
                alertErrorMessage(result?.message)
            }
        });
    }
    const userWallet = async () => {
        await AuthService.userWallet(props.userId).then(async result => {
            if (result?.success) {
                try {
                    setwalletdetails(result?.data);
                } catch (error) {
                    console.log('error', `${error}`);
                }
            } else {
                alertErrorMessage(result?.message)
            }
        });
    }

    const handleSubadminDetail = (img) => {
        setShowImage(img);
    };

    const [status, setstatus] = useState(props?.traderData?.master_account);
    const [makerFee, setMakerFee] = useState(props?.traderData?.maker_fee);
    const [takerFee, setTakerFee] = useState(props?.traderData?.taker_fee);

    const HandleStatus = (Status) => {
        setstatus(Status);
        if (!Status) {
            setMakerFee(0)
            setTakerFee(0)
        }
    };
    useEffect(() => {
        if (makerFee > 0 || takerFee > 0) {
            setstatus(true)
        } else {
            setMakerFee(0);
            setTakerFee(0);
            setstatus(false)
        }

    }, [makerFee, takerFee]);
    const HandleMasterAccount = async (userId, makerFee, takerFee, status) => {
        if (userType !== "1") {
            alertErrorMessage("Not Authorized for this")
            return
        }
        LoaderHelper?.loaderStatus(true)
        await AuthService.MasterAccount(userId, makerFee, takerFee, status).then(async result => {
            if (result?.success) {
                LoaderHelper?.loaderStatus(false)
                try {
                    alertSuccessMessage(result?.message)
                } catch (error) {
                    console.log('error', `${error}`);
                }
            } else {
                LoaderHelper?.loaderStatus(false)
                alertErrorMessage(result?.message)
            }
        });
    }
    return (
        activeScreen === 'tradeList' ?
            <>
                <div id="layoutSidenav_content">
                    <main>
                        <form className="form-data" >
                            <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                                <div className="container-xl px-4">
                                    <div className="page-header-content pt-4">
                                        <div className="row align-items-center justify-content-between">
                                            <div className="col-auto mt-4">
                                                <h1 className="page-header-title">
                                                    <Link to="" className="page-header-icon" onClick={() => setActiveScreen('support')}><i className="fa fa-arrow-left" ></i></Link>
                                                    {firstName} {lastName}
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </header>
                            <div className="container-xl px-4 mt-n10" >
                                <div className="row" >

                                    <div className="col-xl-4">
                                        <div className="card mb-4 mb-xl-0">
                                            <div className="card-body py-5">
                                                {/* <!-- Profile picture image--> */}
                                                <div className="text-center">

                                                    {!profilePicture ? <img className="img-account-profile rounded-circle mb-4" src="/assets/img/illustrations/profiles/profile-5.png" alt="profilePicture" /> :

                                                        <img className="img-account-profile rounded-circle mb-4" src={ApiConfig?.appUrl + profilePicture} alt="profilePicture" />
                                                    }
                                                    <h3 className="fw-bolder fs-2 mb-0">
                                                        {firstName} {lastName}
                                                    </h3>
                                                    <div className=" text-gray">
                                                        <small>{email}</small>
                                                    </div>
                                                </div>
                                                <div className=" py-5 px-4 ">
                                                    <ul className="nav nav-pills flex-column" id="cardTab" role="tablist">
                                                        <li className="nav-item  ">
                                                            <a className="menu-link d-flex nav-link active" id="personal-pill" href="#personalPill" data-bs-toggle="tab" role="tab" aria-controls="personal" aria-selected="true">
                                                                <span className="menu-bullet"><span className="bullet"></span>
                                                                </span><span className="menu-title">  Personal Information </span>
                                                            </a>
                                                        </li>
                                                        <li className="nav-item  ">
                                                            <a className="menu-link d-flex nav-link" id="Verification-pill" href="#VerificationPill" data-bs-toggle="tab" role="tab" aria-controls="Verification" aria-selected="false"> <span className="menu-bullet"><span className="bullet"></span>
                                                            </span><span className="menu-title">  KYC Verification</span></a>
                                                        </li>
                                                      
                                                        <li className="nav-item ">
                                                            <a className="menu-link d-flex nav-link" id="Transitions-pill" href="#TransitionsPill" data-bs-toggle="tab" role="tab" aria-controls="example" aria-selected="false"> <span className="menu-bullet"><span className="bullet"></span>
                                                            </span><span className="menu-title">  User Trade Details</span></a>
                                                        </li>
                                                        <li className="nav-item ">
                                                            <a className="menu-link d-flex nav-link" id="Transitions-pill" href="#walletdetails" data-bs-toggle="tab" role="tab" aria-controls="example" aria-selected="false"> <span className="menu-bullet"><span className="bullet"></span>
                                                            </span><span className="menu-title">  User Wallet Details</span></a>
                                                        </li>
                                                        {/* <li className="nav-item ">
                                                            <a className="menu-link d-flex nav-link" id="Transitions-pill" href="#masterAdmin" data-bs-toggle="tab" role="tab" aria-controls="example" aria-selected="false"> <span className="menu-bullet"><span className="bullet"></span>
                                                            </span><span className="menu-title">  Master Trader</span></a>
                                                        </li> */}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-8" >
                                        <div className="tab-content tab-content-card" id="cardPillContent">
                                            {/* personal INformation */}
                                            <div className="tab-pane card show active" id="personalPill" role="tabpanel" aria-labelledby="personal-pill">
                                                {/* <!-- Profile picture help block--> */}
                                                <div className="card-header">Personal Information</div>
                                                <div className="card-body" >
                                                    <div className="profile_data py-4 px-4" >
                                                        <div className="row" > <span className="col-3" >Name: </span><strong className="col text-dark ">{firstName}</strong></div>
                                                        <hr className="my-3" />
                                                        <div className="row" > <span className="col-3" >Email:</span> <strong className=" col">{email}</strong></div>
                                                        <hr className="my-3" />
                                                        <div className="row" > <span className="col-3" >Mobile Number:</span> <strong className="col"> {mobileNumber} </strong></div>
                                                        <hr className="my-3" />
                                                        {/* <div className="row" > <span className="col-3" >Gender:</span> <strong className=" col"> {gender} </strong></div>
                                                        <hr className="my-3" /> */}
                                                        <div className="row" > <span className="col-3 " >Address:</span> <strong className="col"> {address} </strong></div>
                                                        <hr className="my-3" />
                                                        <div className="row" > <span className="col-3" >Country:</span> <strong className=" col"> {country} </strong></div>   <hr className="my-3" />
                                                        <div className="row" > <span className="col-3" >State:</span> <strong className=" col"> {state}  </strong></div>
                                                        <hr className="my-3" />
                                                        <div className="row" > <span className="col-3" >City:</span> <strong className=" col"> {city} </strong></div>

                                                        <hr className="my-3" />
                                                        <div className="row" > <span className="col-3" >Zip Code:</span> <strong className=" col"> {zipCode} </strong></div>
                                                    </div>
                                                </div>
                                                {/* <!-- Profile picture upload button--> */}
                                            </div>
                                            {/* Personal Information */}

                                            {/* KYC Verification */}
                                            <div className="tab-pane card" id="VerificationPill" role="tabpanel" aria-labelledby="Verification-pill">
                                                <div className="card-header">KYC Verification Details</div>
                                                <div className="card-body" >
                                                    <div className="profile_data py-4 px-4" >
                                                        <div className="row" >
                                                            <span className="col-3" >Verification Status: </span>

                                                            {verifiStatus == "2" ?
                                                                <strong className=" col text-success  ">Verified</strong>
                                                                : verifiStatus == "1" ? < strong className=" col text-warning ">Pending</strong>
                                                                    : verifiStatus == "3" ? < strong className=" col text-warning ">Rejected</strong> :
                                                                        < strong className=" col text-warning ">Not Submitted</strong>
                                                            }

                                                        </div>
                                                        <hr className="my-3" />
                                                        <div className="row" > <span className="col-3" >Registration Date:</span> <strong className=" col">{createdAt && moment(createdAt).format('MMM Do YYYY hh:mm A')}</strong></div>
                                                        <hr className="my-3" />
                                                        <div className="row" > <span className="col-3" >Verification Date:</span> <strong className=" col">{verificationDate && moment(verificationDate).format('MMM Do YYYY hh:mm A')}  </strong></div>
                                                        <hr className="my-3" />
                                                        <div className="row" > <span className="col-3" >KYC Type:</span> <strong className=" col"> {kycType} </strong></div>
                                                        <hr className="my-3" />
                                                        <div className="row" > <span className="col-3" >Document Type:</span> <strong className=" col"> {documentType} </strong></div>
                                                        <hr className="my-3" />

                                                        <div className="row">
                                                            <span className="mb-4 col-12" >Document Verification Images:</span>
                                                            <div className="col-6  mb-3">
                                                                <div className="doc_img">
                                                                    <div className="row mb-3">
                                                                        <div className="col">{documentType} <small> (Front) </small>
                                                                        </div>
                                                                    </div>

                                                                    {!frontImg ?
                                                                        <div className="ratio ratio-16x9">
                                                                            <img className="w-100" src="/assets/img/illustrations/profiles/nophoto.png" />
                                                                        </div> :

                                                                        <div className="ratio ratio-16x9">
                                                                            <img src={ApiConfig?.appUrl + frontImg} alt="" className="w-100 cursor_pointer" data-bs-toggle="modal" data-bs-target="#image_modal" onClick={() => handleSubadminDetail(ApiConfig?.appUrl + frontImg)} />
                                                                        </div>
                                                                    }

                                                                </div>
                                                            </div>
                                                            <div className="col-6 mb-3">
                                                                <div className="doc_img">
                                                                    <div className="row mb-3">
                                                                        <div className="col"> {documentType} <small> (Back) </small> </div>
                                                                    </div>
                                                                    {!backImg ?
                                                                        <div className="ratio ratio-16x9">
                                                                            <img className="w-100" src="/assets/img/illustrations/profiles/nophoto.png" />
                                                                        </div> :
                                                                        <div className="ratio ratio-16x9">
                                                                            <img src={ApiConfig?.appUrl + backImg} alt="" className="w-100 cursor_pointer" data-bs-toggle="modal" data-bs-target="#image_modal" onClick={() => handleSubadminDetail(ApiConfig?.appUrl + backImg)} />
                                                                        </div>
                                                                    }

                                                                </div>
                                                            </div>
                                                            <div className="doc_img">
                                                                <div className="row mb-3">
                                                                    <div className="col">
                                                                        {documentType} No. : {docNumber}

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6 mb-3">
                                                                <div className="doc_img">
                                                                    <div className="row mb-3">
                                                                        <div className="col"> Other Identity </div>
                                                                    </div>
                                                                    {!panImg ?
                                                                        <div className="ratio ratio-16x9">
                                                                            <img className="w-100" src="/assets/img/illustrations/profiles/nophoto.png" />
                                                                        </div> :
                                                                        <div className="ratio ratio-16x9">
                                                                            <img src={ApiConfig?.appUrl + panImg} alt="" className="w-100 cursor_pointer" data-bs-toggle="modal" data-bs-target="#image_modal" onClick={() => handleSubadminDetail(ApiConfig?.appUrl + panImg)} />
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-6 mb-3">
                                                                <div className="doc_img">
                                                                    <div className="row mb-3">
                                                                        <div className="col"> Selfie </div>
                                                                    </div>
                                                                    {!selfie ?
                                                                        <div className="ratio ratio-16x9">
                                                                            <img className="w-100" src="/assets/img/illustrations/profiles/nophoto.png" />
                                                                        </div> :
                                                                        <div className="ratio ratio-16x9">
                                                                            <img src={ApiConfig?.appUrl + selfie} alt="" className="w-100 cursor_pointer" data-bs-toggle="modal" data-bs-target="#image_modal" onClick={() => handleSubadminDetail(ApiConfig?.appUrl + selfie)} />
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="doc_img">
                                                                <div className="row mb-3">
                                                                    <div className="col">
                                                                        PanCardNo: {panCardNo}

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* KYC Verification */}

                                      
                                            {/* User Transitions*/}
                                            <div className="tab-pane card" id="TransitionsPill" role="tabpanel" aria-labelledby="Transitions-pill">
                                                <div className="card-header">User Trade Details
                                                    {
                                                        userTradeDetails.length === 0 ? "" :
                                                            <div className="dropdown">
                                                                <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Export</button>
                                                                <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                                                                    <CSVLink data={userTradeDetails} className="dropdown-item">Export as CSV</CSVLink>
                                                                </div>
                                                            </div>
                                                    }

                                                </div>

                                                <div className="card-body" >
                                                    <form className="row">
                                                        <div className="col-12" >
                                                            <table className="" width="100%" >
                                                                <DataTableBase columns={columns} data={userTradeDetails} />

                                                            </table>
                                                        </div>
                                                    </form>
                                                </div>

                                            </div>

                                            {/* walletdetails*/}
                                            <div className="tab-pane card" id="walletdetails" role="tabpanel" aria-labelledby="walletdetails">
                                                <div className="card-header">User Wallet Details
                                                    {
                                                        walletdetails.length === 0 ? "" :
                                                            <div className="dropdown">
                                                                <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Export</button>
                                                                <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                                                                    <CSVLink data={walletdetails} className="dropdown-item">Export as CSV</CSVLink>
                                                                </div>
                                                            </div>
                                                    }

                                                </div>
                                                <div className="card-body" >
                                                    <form className="row">
                                                        <div className="col-12" >
                                                            <table className="" width="100%" >
                                                                <DataTableBase columns={walletdetailscolumns} data={walletdetails} />
                                                            </table>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>

                                            {/* Master Admin */}
                                            <div className="tab-pane card" id="masterAdmin" role="tabpanel" aria-labelledby="bankaccount-pill">
                                                <div className="card-header">Master Trader</div>

                                                <div className="profile_data py-5 px-4" >
                                                    <div className="row" >
                                                        <label className="small mb-1" for="Maker">Maker Fee </label>
                                                        <input type="number" className="form-control  form-control-solid" id="Maker" placeholder="Maker Fee" name="firstName" value={makerFee} onChange={(e) => setMakerFee(e.target.value)} onWheel={(e) => e.target.blur()} />
                                                    </div>
                                                    <hr className="my-3" />
                                                    <div className="row" >
                                                        <label className="small mb-1" for="taker">Taker Fee </label>
                                                        <input type="number" className="form-control  form-control-solid" id="taker" placeholder="Taker Fee " name="firstName" value={takerFee} onChange={(e) => setTakerFee(e.target.value)} onWheel={(e) => e.target.blur()} /></div>
                                                    <hr className="my-3" />
                                                    <div className="row" > <label className="small mb-1" for="taker">Status </label><div>
                                                        <button type="button" className={`btn  btn-sm  me-2 ${status ? 'btn-success' : 'btn-outline-success'}`} onClick={() => HandleStatus(true)} >Active</button>
                                                        <button type="button" className={`btn  btn-sm  me-2 ${status ? 'btn-outline-danger' : 'btn-danger'}`} onClick={() => HandleStatus(false)}  >Inactive</button></div>  </div>
                                                    <hr className="my-3" />
                                                    {/* <div className="row" > */}
                                                    <button type="button" className={`btn  btn-sm me-2 btn-success`} onClick={() => HandleMasterAccount(props.userId, makerFee, takerFee, status)}  >Submit</button>  </div>

                                                {/* </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </main>
                    {/* Trade Image Detail */}
                    <div className="modal image_modal" id="image_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog  alert_modal modal-lg" role="document">
                            <div className="modal-content">
                                <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                                <div className="ratio ratio-16x9">
                                    <img src={showImage} className="w-100 cc_modal_img" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Trade Image Detail  */}
                </div >
            </>
            : <TradeList />

    )


}

export default TraderDetails;