import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import { CSVLink } from "react-csv";
import moment from "moment";
import ReactPaginate from 'react-paginate';
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";

const MyActivityLogs = () => {

  const [activity, setActivity] = useState([]);
  // custom pagination /
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalData, setTotalData] = useState()


  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const pageCount = totalData / itemsPerPage

  const skip = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    activityLogs(skip, 100);
  }, [currentPage, skip]);


  const activityLogs = async (startIndex, endIndex) => {
    LoaderHelper.loaderStatus(true)
    await AuthService.getMyActivityLogs(startIndex, endIndex).then(async result => {
      if (result?.success) {
        setActivity(result?.data)
        setTotalData(result.total_count)
      } else {
        alertErrorMessage(result?.message);
      }
    });
    LoaderHelper.loaderStatus(false)
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
                      Activity Logs
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="container-xl px-4 mt-n10">
            <div className="card mb-4">
              <div class="card-header">
                Activity Details
                {activity?.length === 0 ? "" :
                  <div class="dropdown">
                    <button class="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Export{" "}
                    </button>
                    <div class="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                      <CSVLink data={activity} class="dropdown-item">Export as CSV</CSVLink>
                    </div>
                  </div>
                }
              </div>
              {Object.keys(activity)?.length == 0 ? (
                <div className="favouriteData">
                  {/* <img src="assets/img/no-data.svg" className="img-fluid" width="96" height="96" alt="" />
          <br /> */}
                  <p className="mt-3 mb-4 d-flex" style={{ justifyContent: 'center' }}> No Data Found </p>
                </div>
              ) : (
                <div class="row">
                  <div class="col-lg-12 col-xl-12 m-auto">
                    <div class="form-field-wrapper table_scroll p-0 switch_btn border-gray-300 bg-lighten card-rounded shadow-soft">
                      <div class="activity-wrapper">
                        <div class="custom-history">
                          {activity?.length > 0
                            ? activity?.map((item, index) => (
                              <>
                                <div class="single-item-history d-flex-center p-3 m-0">
                                  <div class="content">
                                    {index + skip + 1} )
                                    <p>
                                      Status: <strong>{item?.Activity}</strong>
                                      <br /> IP <strong>{item?.IP ? item?.IP : item?.adminIP}</strong>
                                    </p>
                                  </div>
                                  <small class="date align-self-start">
                                    <strong>
                                      {moment(item?.date).format(
                                        "MMMM Do YYYY, h:mm:ss a"
                                      )}
                                    </strong>
                                  </small>
                                </div>
                                <hr /></>
                            ))
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {totalData > 5 ?
                <ReactPaginate
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                  containerClassName={'customPagination'}
                  activeClassName={'active'}
                />
                : ""}

            </div>
          </div>
        </main>
      </div>

    </>
  )
}

export default MyActivityLogs;