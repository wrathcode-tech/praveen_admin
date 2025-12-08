import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

const WithdrawalFees = () => {
  const [withdrawalFees, setwithdrawalFees] = useState([]);
  const [allData, setallData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalData, setTotalData] = useState()


  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const pageCount = totalData / itemsPerPage

  const skip = (currentPage - 1) * itemsPerPage;

  const userIdFollow = (row) => {
    return (
      row.uuid
    );
  };

  const columns = [
    { name: "Sr No.", wrap: true, selector: (row, index) => skip + 1 + index, },
    { name: "Date", wrap: true, selector: row => moment(row?.updatedAt).format("MMM Do YYYY hh:mm A"), },
    { name: "From User", wrap: true, selector: userIdFollow },
    { name: "Contact", wrap: true, selector: row => row?.emailId || row?.mobileNumber, },
    { name: "Name", wrap: true, selector: row => row.short_name, },
    { name: "Fee", wrap: true, selector: row => row.fee, },
    { name: "Withdraw Amount", wrap: true, selector: row => row.amount, },
  ];


  useEffect(() => {
    WithdrawalFees(skip, 100);
  }, [currentPage, skip]);

  const WithdrawalFees = async (skip, limit) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.withdrawalFees(skip, limit).then(async (result) => {
      LoaderHelper.loaderStatus(false);
      if (result?.success) {
        setwithdrawalFees(result?.data?.list);
        setallData(result?.data?.list);
        setTotalData(result?.totalCount)
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
    setwithdrawalFees(filteredData)
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
                    Withdrawal Fees
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Main page content */}
        <div className="container-xl px-4 mt-n10">
          {/* <div className="filter_bar">
            <form className="row">
              <div className="mb-3 col ">
                <input
                  type="date"
                  className="form-control form-control-solid"
                  data-provide="datepicker"
                  id="litepickerRangePlugin"
                  name="dateFrom"
                  value={fromDate}
                  onChange={(e) => { setFromDate(e.target.value); }}
                />
              </div>
              <div className="mb-3 col ">
                <input
                  type="date"
                  className="form-control form-control-solid"
                  data-provide="datepicker"
                  id="litepickerRangePlugin"
                  name="dateTo"
                  value={toDate}
                  onChange={(e) => { setToDate(e.target.value); }}
                />
              </div>
              <div className="mb-3 col ">
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-indigo btn-block w-100"
                      type="button"
                      onClick={filterDate}
                    >
                      Search
                    </button>
                  </div>
                  <div className="col">
                    <button
                      className="btn btn-indigo btn-block w-100"
                      type="button"
                      onClick={ResetfilterDate}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div> */}
          <div className="card mb-4">
            <div className="card-header">
              Withdrawal Fees
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
              <DataTableBase columns={columns} data={withdrawalFees} pagination={false} />
              {totalData > 5 ? <ReactPaginate
                pageCount={pageCount}
                onPageChange={handlePageChange}
                containerClassName={'customPagination'}
                activeClassName={'active'}
              /> : ""}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default WithdrawalFees;
