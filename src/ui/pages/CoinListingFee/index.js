import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";

const CoinlistFee = () => {
  const [withdrawalFees, setwithdrawalFees] = useState([]);
  const [allData, setallData] = useState([]);


  const columns = [
    { name: "Date", selector: row => moment(row?.createdAt).format("MMM Do YYYY hh:mm A"), },
    { name: "Name", wrap: true, selector: row => row.short_name, },
    { name: "Fee", selector: row => row.fee, },
    { name: "Fee Type", wrap: true, selector: row => row.fee_type, },
    { name: "From User", wrap: true, selector: row => row.from_user, },
    { name: "Percentage", selector: row => row.percentage, },
    { name: "Amount", selector: row => row.amount, },
  ];


  useEffect(() => {
    // WithdrawalFees();
  }, []);

  const WithdrawalFees = async () => {
    LoaderHelper.loaderStatus(true);
    await AuthService.withdrawalFees().then(async (result) => {
      LoaderHelper.loaderStatus(false);
      if (result?.success) {
        try {
          setwithdrawalFees(result?.data?.reverse());
          setallData(result?.data);
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage("Something Went Wrong");
      }
    });
  };
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filterDate = () => {
    const filteredData = allData.filter((item) => {
      const createdAtDate = new Date(item.createdAt);
      return (
        (!fromDate || createdAtDate >= new Date(fromDate)) &&
        (!toDate || createdAtDate <= new Date(toDate))
      );
    });
    setwithdrawalFees(filteredData?.reverse())
  }
  const ResetfilterDate = () => {
    setFromDate('')
    setToDate('')
    setwithdrawalFees(allData)
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
                      <i className="fa fa-dollar-sign"></i>
                    </div>
                    Coin Listing Fees
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Main page content */}
        <div className="container-xl px-4 mt-n10">
          
          <div className="card mb-4">
            <div className="card-header">
              Coin Listing Fees
              {withdrawalFees.length === 0 ? (
                ""
              ) : (
                <div className="dropdown">
                  <button
                    className="btn btn-dark btn-sm dropdown-toggle"
                    id="dropdownFadeInUp"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Export{" "}
                  </button>
                  <div
                    className="dropdown-menu animated--fade-in-up"
                    aria-labelledby="dropdownFadeInUp"
                  >
                    <CSVLink data={withdrawalFees} className="dropdown-item">
                      Export as CSV
                    </CSVLink>
                  </div>
                </div>
              )}
            </div>
            <div className="table-responsive" width="100%">
              <DataTableBase columns={columns} data={withdrawalFees} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoinlistFee;
