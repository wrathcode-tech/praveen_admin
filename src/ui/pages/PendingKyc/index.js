import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import "./style.css";
import VerifyKyc from "../VerifyKyc";
import { CSVLink } from "react-csv";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import moment from "moment";
import { alertErrorMessage, alertSuccessMessage, } from "../../../customComponent/CustomAlertMessage";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import { $ } from "react-jquery-plugin";
import { useNavigate } from "react-router-dom";

const PendingKyc = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [activeScreen, setActiveScreen] = useState("pending");
  const [userId, setUserId] = useState("");
  const [userKycData, setuserKycData] = useState();
  const [rejectReason, setRejectReason] = useState("");
  const [showImage, setShowImage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const linkFollow = (row) => {
    return (
      <button className="verifybtn" onClick={() => { navigateToKyc(row);}}>
        View
      </button>
    );
  };
  const linkFollow2 = (row) => {
    return (
      <div className="d-flex">
        <button
          className="btn btn-danger btn-md"
          data-bs-toggle="modal"
          data-bs-target="#rejectmodal"
          type="button"
          onClick={() => {
            setUserId(row?.userId)
          }}
        >
          Reject
        </button>
        <button
          className="btn mx-2 btn-success  btn-xs"
          type="button"
          onClick={() => {
            verifyIdentity(row?.userId, 2);
          }}
        >
          Approve
        </button>
      </div>
    );
  };

  function imageFormatter(row) {
    return (
      <img style={{ width: "40%", height: "auto" }} src={ApiConfig?.appUrl + row?.user_selfie} alt="Selfie " className="table-img cursor_pointer" data-bs-toggle="modal" data-bs-target="#image_modal" onClick={() => handleImageDetail(ApiConfig?.appUrl + row?.user_selfie)
      } />
    );
  };

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

  const handleInputChange = (event) => {
    switch (event.target.name) {
      case "rejectReason":
        setRejectReason(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleImageDetail = (img) => {
    setShowImage(img);
    $("#image_modal").modal("show");
  };

  const handleSelect = (row) => {
    return <>
      <input type="checkbox" value={row?.userId} onChange={handleCheckboxInput} checked={selectedIds?.includes(row?.userId)} style={{ height: "100px", width: "30px" }} />
    </>
  };

  const handleCheckboxInput = (e) => {
    const value = e.target.value;
    if (selectedIds?.includes(value)) {
      const filteredItem = selectedIds?.filter((item) => item !== value)
      setSelectedIds(filteredItem)
    } else {
      setSelectedIds([...selectedIds, value])
    }

  }
  const navigate = useNavigate();

  const navigateToKyc = (row) => {
    navigate(`/dashboard/VerifyKyc/${row.userId}`)
  }


  const columns = [
    { name: "Sr no.", wrap: true, selector: row => allData?.indexOf(row) + 1 },
    { name: "Select", wrap: true, selector: handleSelect },
    { name: "Date", wrap: true, selector: row => moment(row?.createdAt).format("Do MMMM YYYY  h:mm:ss A") },
    { name: "ID", wrap: true, selector: row => row.uuid, },
    { name: "EmailId", wrap: true, selector: row => row.emailId, },
    { name: <div style={{ whiteSpace: "revert" }}>Doc Number</div>, wrap: true, selector: row => row.document_number, },
    { name: "Doc Front Image", selector: row => imageFormatter2(row), },
    { name: "Doc Back Image", selector: row => imageFormatter3(row), },
    { name: "Selfie", selector: row => imageFormatter(row), },
    { name: "Status Update", width: "200px", selector: row => linkFollow2(row), },
    { name: "Action", selector: row => linkFollow(row), },
  ];

  function searchObjects(e) {
    const keysToSearch = ["userId", "emailId", "pancard_number", "dob"];
    const userInput = e.target.value;
    const searchTerm = userInput?.toLowerCase();
    const matchingObjects = allData.filter(obj => {
      return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm));
    });
    setData(matchingObjects);
  };


  const approveSelectedKYC = async () => {
    if (selectedIds?.length === 0) {
      alertErrorMessage("Please select user")
      return
    }
    for await (const id of selectedIds) {
      const totalLength = selectedIds?.length;
      const currentIndex = selectedIds?.indexOf(id)
      await verifyIdentityAll(id, 2);
      await alertSuccessMessage(`${currentIndex + 1} of ${totalLength} withdrawal status updated`)

    }
    setSelectedIds([])
    handleData();
  }

  const selectAll = (e) => {
    if (e.target.checked) {
      const allIds = allData?.map((item) => item?.userId);
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }

  };


  useEffect(() => {
    handleData();
  }, []);

  const verifyIdentity = async (id, status, rejectReason) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.getverifyidentity(id, status, rejectReason).then(
      async (result) => {
        if (result?.success) {
          LoaderHelper.loaderStatus(false);
          try {
            alertSuccessMessage(result?.message);
            setSelectedIds([])
            handleData();
            // $("#rejectmodal").modal("hide");
            // setActiveScreen("detail");
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
  const verifyIdentityAll = async (id, status, rejectReason) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.getverifyidentity(id, status, rejectReason).then(
      async (result) => {
        if (result?.success) {
          LoaderHelper.loaderStatus(false);
          try {
            // alertSuccessMessage(result?.message);
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

  const handleData = async () => {
    LoaderHelper.loaderStatus(true);
    await AuthService.getdata().then(async (result) => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          setData(result?.data);
          // setTotalData(result?.totalCount)
          setAllData(result?.data);
        } catch (error) {
        }
      } else {
        LoaderHelper.loaderStatus(false);
      }
    });
  };


  return (
    <>
      <div id="layoutSidenav_content">
        <main>
          <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
            <div className="container-xl px-4">
              <div className="page-header-content pt-4">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto mt-4 d-flex justify-content-between">
                    <h1 className="page-header-title">
                      <div className="page-header-icon">
                        <i className=" fa fa-user-slash"></i>
                      </div>
                      Pending Kyc

                    </h1>
                  </div>

                </div>
              </div>
            </div>
          </header>
          <div className="container-xl px-4 mt-n10 withdrawal_tbs">
            <div className="card mb-4">
              <div className="card-header">
                Pending Kyc List
                <div>
                  <label for="selectall" className="mx-2 cursor-pointer" >Select all</label>
                  <input id="selectall" type="checkbox" onChange={selectAll} />
                </div>

                <div className="col-5">
                  <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={searchObjects} />
                </div>
                {data.length === 0 ? "" :
                  <div className="dropdown">
                    <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                      <i className="fa fa-download me-3"></i>Export
                    </button>
                    <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp" >
                      <CSVLink data={data} className="dropdown-item">
                        Export as CSV
                      </CSVLink>
                    </div>
                  </div>
                }
                <button
                  className="btn mx-2 btn-success "
                  type="button" onClick={approveSelectedKYC}
                >
                  Approve
                </button>
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
                Are You Sure{" "}?
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
};
export default PendingKyc;
