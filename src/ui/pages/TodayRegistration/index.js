import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import { CSVLink } from "react-csv";
import moment from "moment";
import DataTableBase from "../../../customComponent/DataTable";
import { Link } from "react-router-dom";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";

const TodayRegistration = () => {
  const [exportData, setExportData] = useState([]);
  const [allData, setallData] = useState([]);
  const userIdFollow = (row) => {
    return (
      row.uuid
    );
  };

  const columns = [
    { name: "Sr no.", sort: true, wrap: true, selector: (row, index) => allData.findIndex(obj => obj === row)+1 },
    { name: "User ID", wrap: true, selector: userIdFollow, },
    { name: "Name", sort: true, wrap: true, selector: row => row?.firstName ? (row?.firstName + " " + row?.lastName) : "-----", },
    { name: "Email", sort: true, wrap: true, selector: row => row.emailId ? row.emailId : "-----", },
    { name: <div style={{ whiteSpace: "revert" }}>Phone Number</div>, wrap: true, sort: true, selector: row => row.mobileNumber ? row.mobileNumber : "-----", },
    { name: <div style={{ whiteSpace: "revert" }}>Registration Date</div>, wrap: true, sort: true, selector: row => moment(row?.createdAt).format("MMM Do YYYY hh:mm A") },

  ];

  useEffect(() => {
    NewRegistrations();
  }, []);



  const NewRegistrations = async () => {
    LoaderHelper.loaderStatus(true)
    await AuthService.getTotalRegistrations().then(async result => {
      if (result) {
        try {
          setExportData(result?.data.reverse());
          setallData(result?.data)
        } catch (error) {
          alertErrorMessage(error)
        }
      } else {
        alertErrorMessage(result?.message);
      }
    })
    LoaderHelper.loaderStatus(false)
  }



  function searchObjects(e) {
    const keysToSearch = ["firstName", "lastName", "emailId", "mobileNumber", "_id"];
    const userInput = e.target.value;
    const searchTerm = userInput?.toLowerCase();
    const matchingObjects = allData.filter(obj => {
      return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm));
    });
    setExportData(matchingObjects);
  }

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
                      <i className="fa fa-wave-square"></i>
                    </div>
                    Today Registration List
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container-xl px-4 mt-n10">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between">
              Today Registration Details
              <div className="col-5">
                <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={searchObjects} />
              </div>
              {exportData.length === 0 ? "" :
                <div className="dropdown">
                  <button
                    className="btn btn-dark btn-sm dropdown-toggle"
                    id="dropdownFadeInUp"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {" "}
                    <i className="fa fa-download me-3"></i> Export
                  </button>
                  <div
                    className="dropdown-menu animated--fade-in-up"
                    aria-labelledby="dropdownFadeInUp"
                  >
                    <CSVLink data={exportData} className="dropdown-item">
                      Export as CSV
                    </CSVLink>
                  </div>
                </div>}
            </div>
            <div className="card-body">
              <div className="table-responsive" width="100%">
                <DataTableBase columns={columns} data={exportData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
};

export default TodayRegistration;
