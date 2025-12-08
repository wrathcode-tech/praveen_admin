import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";

const MiscellaneousPage = () => {
  const [MiscellaneousList, setMiscellaneousList] = useState([]);
  const [allData, setAllData] = useState([]);

  function statusFormatter(row) {
    return <button className={`btn btn-success btn-sm   me-2`} style={{ cursor: 'default' }}>{row.status}</button>
  };

  const columns = [
    { name: "Date", selector: row => moment(row?.createdAt).format("MMM Do YYYY hh:mm A"), },
    { name: "Email Id", wrap: true, selector: row => row.emailId, },
    { name: "Coin Name", selector: row => row.short_name, },
    { name: "Chain", selector: row => row.chain, },
    { name: "User Id", wrap: true, selector: row => row.user_id, },
    { name: "Withdrawal Address", wrap: true, selector: row => row.to_address, },
    { name: "Transaction Hash", wrap: true, selector: row => row.transaction_hash, },
    { name: "Amount", selector: row => row.amount, },
    { name: "Status", selector: statusFormatter, },
  ];

  useEffect(() => {
    MiscellaneousRequest();
  }, []);

  const MiscellaneousRequest = async () => {
    LoaderHelper.loaderStatus(true);
    await AuthService.miscellaneousRequest().then(async (result) => {
      LoaderHelper.loaderStatus(false);
      if (result?.success) {
        try {
          setMiscellaneousList(result?.data?.reverse());
          setAllData(result?.data);
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage("Something Went Wrong");
      }
    });
  };
  function handleSearch(e) {
    const keysToSearch = ["emailId", "short_name", "chain", "user_id", "to_address", "transaction_hash"];
    const searchTerm = e.target.value?.toLowerCase();
    const matchingObjects = allData?.reverse().filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
    setMiscellaneousList(matchingObjects);
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
                      <i className="fa fa-dollar-sign"></i>
                    </div>
                    Miscellaneous Withdrawal
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container-xl px-4 mt-n10">
          <div className="filter_bar">
          </div>
          <div className="card mb-4">
            <div className="card-header">
              Miscellaneous Withdrawal
              <div className="col-5">
                <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={handleSearch} />
              </div>
              {MiscellaneousList.length === 0 ? "" :
              <div className="dropdown">
                <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Export{" "}
                </button>
                <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                  <CSVLink data={MiscellaneousList} className="dropdown-item">
                    Export as CSV
                  </CSVLink>
                </div>
              </div>}
            </div>
            <div className="table-responsive" width="100%">
              <DataTableBase columns={columns} data={MiscellaneousList} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MiscellaneousPage;
