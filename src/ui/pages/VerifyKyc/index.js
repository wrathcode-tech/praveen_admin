import React, { useEffect, useState } from "react";
import { alertErrorMessage, alertSuccessMessage, } from "../../../customComponent/CustomAlertMessage";
import AuthService from "../../../api/services/AuthService";
import PendingKyc from "../PendingKyc";
import { $ } from "react-jquery-plugin";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";
const VerifyKyc = () => {
  const {userId} = useParams()
  const [showImage, setShowImage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selfie, setSelfie] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [state, setState] = useState("");
  const [mobile, setMobile] = useState("");
  const [panCardImage, setPanCardImage] = useState("");
  const [panCardNo, setPanCardNo] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [docType, setDocType] = useState("");
  const [docFrontImg, setDocFrontImg] = useState("");
  const [docBackImg, setDocBackImg] = useState("");
  const [date, setDate] = useState("");
  const [update, setUpdate] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [activeScreen, setActiveScreen] = useState("pending");
  const [country, setCountry] = useState("");


  const handleInputChange = (event) => {
    switch (event.target.name) {
      case "rejectReason":
        setRejectReason(event.target.value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleData(userId);
  }, []);

  const handleData = async (userId) => {
try {
      LoaderHelper.loaderStatus(true);
      await AuthService.getkycdata(userId).then(async (result) => {
        if (result?.success) {
          try {
  
            setFirstName(result?.data?.first_name);
            setCountry(result?.data?.country);
            setLastName(result?.data?.last_name);
            setSelfie(result?.data?.user_selfie);
            setMobile(result?.data?.mobileNumber);
            setUpdate(result?.data?.updatedAt);
            setCity(result?.data?.city);
            setPinCode(result?.data?.zip_code);
            setState(result?.data?.state);
            setBirthday(result?.data?.dob);
            setAddress(result?.data?.address);
            setPanCardImage(result?.data?.pancard_image);
            setPanCardNo(result?.data?.pancard_number);
            setDocType(result?.data?.document_type);
            setDocNumber(result?.data?.document_number);
            setDocFrontImg(result?.data?.document_front_image);
            setDocBackImg(result?.data?.document_back_image);
            setDate(result?.data?.updatedAt);
          } catch (error) {
            alertErrorMessage("Unauthorized");
          }
        }
      });
} finally{ LoaderHelper.loaderStatus(false);}
  };

  const verifyIdentity = async (id, status, rejectReason) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.getverifyidentity(id, status, rejectReason).then(
      async (result) => {
        if (result?.success) {
          LoaderHelper.loaderStatus(false);
          try {
            alertSuccessMessage(result?.message);
            // $("#rejectmodal").modal("hide");
            setActiveScreen("detail");
          } catch (error) {
            alertErrorMessage(error);
          }
        } else {
          LoaderHelper.loaderStatus(false);
          alertErrorMessage(result?.message);
        }
      }
    );
  };

const navigate = useNavigate()

  const handleImageDetail = (img) => {
    setShowImage(img);
  };

  return  (
    <>
      <div id="layoutSidenav_content">
        <main>
          <form className="form-data">
            <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
              <div className="container-xl px-4">
                <div className="page-header-content pt-4">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-auto mt-4">
                      <h1 className="page-header-title">
                        <Link
                       to="#"
                       className="page-header-icon"
                       onClick={(e) => {
                         e.preventDefault(); // prevent default anchor behavior
                         navigate(-1);
                       }}
                        >
                          <i className="fa fa-arrow-left"></i>
                        </Link>
                        {firstName} {lastName}
                      </h1>
                    </div>
                    <div className="col-auto mt-4">
                      <div className="row">
                        <div className="d-flex">
                          <button
                            className="btn btn-danger btn-block"
                            data-bs-toggle="modal"
                            data-bs-target="#rejectmodal"
                            type="button"
                         
                          >
                            Reject
                          </button>
                          <button
                            className="btn mx-2 btn-success btn-block"
                            type="button"
                            onClick={() => {
                              verifyIdentity(userId, 2);
                            }}
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <div className="container-xl px-4 mt-n10">
              <div className="row">
                <div className="col-xl-4 mb-4">
                  <div className="card mb-4 mb-xl-0">
                    <div className="card-body py-5 pb-0">
                      {/* <!-- Profile picture image--> */}
                      <div className="text-center">
                        <img
                          className="img-account-profile rounded-circle mb-4"
                          src={ApiConfig?.appUrl + selfie}
                          alt=""
                        />
                        <h3 className="fw-bolder fs-2 mb-0">
                          {firstName} {lastName}
                        </h3>
                      </div>
                      <div className="doc_img py-5 px-4 my-4">
                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                            Full Name:
                          </label>
                          <div className="col-lg-7">
                            <span className="fw-bolder fs-6 text-dark">
                              {" "}
                              {firstName} {lastName}
                            </span>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                            Mobile Number
                          </label>
                          <div className="col-lg-7">
                            <span className="fw-bold fs-6 text-dark">{mobile}</span>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                            Address:
                          </label>
                          <div className="col-lg-7 fv-row">
                            <span className="fw-bold fs-6 text-dark">
                              {" "}
                              {address}{" "}
                            </span>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                          Country:
                          </label>
                          <div className="col-lg-7 fv-row">
                            <span className="fw-bold fs-6 text-dark">{country}</span>
                          </div>
                        </div>
                  
                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                            State:
                          </label>
                          <div className="col-lg-7 fv-row">
                            <span className="fw-bold fs-6 text-dark">{state}</span>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                            City:
                          </label>
                          <div className="col-lg-7 fv-row">
                            <span className="fw-bold fs-6 text-dark">{city}</span>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                            Zip Code:
                          </label>
                          <div className="col-lg-7 fv-row">
                            <span className="fw-bold fs-6 text-dark">
                              {pinCode}
                            </span>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                            {" "}
                            Date of Birth:{" "}
                          </label>
                          <div className="col-lg-7">
                            <span className="fw-bold fs-6 text-dark">
                              {birthday}
                            </span>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <label className="col-lg-5 fw-bold text-muted">
                            Registration Date:
                          </label>
                          <div className="col-lg-7">
                            <span className="fw-bold fs-6 text-dark text-hover-primary">
                              {moment(date).format("MMM Do YYYY hh:mm A")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-8">
                  <div className="card card-header-actions mb-4">
                    <div className="card-body">
                      <div className="row">

                        <div className="col-6  mb-3">
                          <div className="doc_img">
                            <div className="row mb-3">
                              <div className="col">
                                {" "}
                                {country === "India" ? docType : "National ID"}    <small> (Front) </small>{" "}
                              </div>
                            </div>
                            <div className="ratio ratio-16x9">
                              <img
                                src={ApiConfig?.appUrl + docFrontImg}
                                alt=""
                                className="w-100 cursor_pointer"
                                data-bs-toggle="modal"
                                data-bs-target="#image_modal"
                                onClick={() =>
                                  handleImageDetail(
                                    ApiConfig?.appUrl + docFrontImg
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="doc_img">
                            <div className="row mb-3">
                              <div className="col">
                                {" "}
                                {country === "India" ? docType : "National ID"} <small> (Back) </small>{" "}
                              </div>
                            </div>
                            <div className="ratio ratio-16x9">
                              <img
                                src={ApiConfig?.appUrl + docBackImg}
                                alt=""
                                className="w-100 cursor_pointer"
                                data-bs-toggle="modal"
                                data-bs-target="#image_modal"
                                onClick={() =>
                                  handleImageDetail(
                                    ApiConfig?.appUrl + docBackImg
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="doc_img">
                          <div className="row mb-3">
                            <div className="col">
                              {country === "India" ? docType : "National ID"} No. : {docNumber}

                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      <div className="row mt-4">
                        <div className="col-6  mb-3">
                          <div className="doc_img">
                            <div className="row mb-3">
                              <div className="col"> {country === "India" ? "Pan Card " : "Driving Licence"}</div>
                            </div>
                            <div className="ratio ratio-16x9">
                              <img
                                src={
                                  ApiConfig?.appUrl + panCardImage
                                }
                                alt=""
                                className="w-100 cursor_pointer"
                                data-bs-toggle="modal"
                                data-bs-target="#image_modal"
                                onClick={() =>
                                  handleImageDetail(
                                    ApiConfig?.appUrl + panCardImage
                                  )
                                }
                              />
                            </div>

                          </div>
                        </div>
                        <div className="col-6  mb-3">
                          <div className="doc_img">
                            <div className="row mb-3">
                              <div className="col">
                                <small>Selfie</small>
                              </div>
                            </div>
                            <div className="ratio ratio-16x9">
                              <img
                                src={ApiConfig?.appUrl + selfie}
                                alt=""
                                className="w-100 cursor_pointer"
                                data-bs-toggle="modal"
                                data-bs-target="#image_modal"
                                onClick={() =>
                                  handleImageDetail(
                                    ApiConfig?.appUrl + selfie
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="doc_img">
                          <div className="row mb-3">
                            <div className="col">
                              {country === "India" ? "Pan Card No." : "Driving Licence"}: {panCardNo}

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* alert modal data */}
      <div
        className="modal"
        id="rejectmodal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered alert_modal"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                Are You Sure{" "}
                <b>
                  {firstName} {lastName}
                </b>{" "}
                ?
              </h5>
              <button
                className="btn-close"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group mb-4 ">
                  <label className="small mb-1"> Enter Reason </label>
                  <textarea
                    className="form-control form-control-solid"
                    rows="7"
                    placeholder="Enter your message.."
                    value={rejectReason}
                    name="rejectReason"
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <button
                  className="btn btn-danger btn-block w-100"
                  type="button"
                  data-bs-dismiss="modal"
                  disabled={!rejectReason}
                  onClick={() => {
                    verifyIdentity(userId, 3, rejectReason);
                  }}
                >
                  Reject KYC
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* alert modal data */}

      {/* Image Detail */}
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
      {/* Image Detail  */}
    </>
  ) 
};

export default VerifyKyc;
