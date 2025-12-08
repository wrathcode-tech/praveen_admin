import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";

const TradingCommision = () => {
  const [TradingCommission, setTradingCommission] = useState([]);
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
      row.userId
    );
  };



  const columns = [
    { name: "Sr No.", wrap: true, selector: (row, index) => skip + 1 + index, },
    { name: "Date", selector: row => moment(row?.createdAt).format("MMM Do YYYY hh:mm "), wrap: true },
    { name: "Name", wrap: true, selector: row => row.short_name, },
    { name: "Fee", wrap: true, selector: row => row.fee, },
    { name: "Fee Type", wrap: true, selector: row => row.fee_type, },
    { name: "From User", wrap: true, selector:userIdFollow },
    { name: "From Order", wrap: true, selector: row => row.fromOrder, },
    { name: "Percentage", wrap: true, selector: row => row.percentage, },
    { name: "Disbursed Amount", width:"150px", wrap: true, selector: row => row.amount, },
  ];

  function handleSearch(e) {
    const keysToSearch = ["short_name", "fee", "fee_type", "from_user", "percentage", "fromOrder", "amount"];
    const searchTerm = e.target.value?.toLowerCase();
    const matchingObjects = allData?.filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
    setTradingCommission(matchingObjects);
  };

  useEffect(() => {
    tradingCommission(skip, 100);
  }, [currentPage, skip]);

  const tradingCommission = async (skip, limit) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.tradingCommission(skip, limit).then(async (result) => {
      LoaderHelper.loaderStatus(false);
      if (result?.success) {
        try {
          setTradingCommission(result?.data);
          setallData(result?.data);
          setTotalData(result?.totalCount)
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage("Something Went Wrong");
      }
    });
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
                    Trading Commission
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Main page content */}
        <div className="container-xl px-4 mt-n10">
          <div className="filter_bar">
            {/* <form className="row">
              <div className="mb-3 col ">
                <input type="date" className="form-control form-control-solid" data-provide="datepicker"
                  id="litepickerRangePlugin" name="dateFrom" value={fromDate} onChange={(e) => { setFromDate(e.target.value); }} />
              </div>
              <div className="mb-3 col ">
                <input type="date" className="form-control form-control-solid" data-provide="datepicker" id="litepickerRangePlugin" name="dateTo" value={toDate}
                  onChange={(e) => { setToDate(e.target.value); }} />
              </div>
              <div className="mb-3 col ">
                <div className="row">
                  <div className="col">
                    <button className="btn btn-indigo btn-block w-100" type="button" onClick={filterDate}>
                      Search
                    </button>
                  </div>
                  <div className="col">
                    <button className="btn btn-indigo btn-block w-100" type="button" onClick={ResetfilterDate}>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </form> */}
          </div>
          <div className="card mb-4">
            <div className="card-header">
              Trading Commission
              <div className="col-5">
                <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={handleSearch} />
              </div>
              {TradingCommission.length === 0 ? "" :
                <div className="dropdown">
                  <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false"                >
                    Export{" "}
                  </button>
                  <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp"                >
                    <CSVLink data={TradingCommission} className="dropdown-item">
                      Export as CSV
                    </CSVLink>
                  </div>
                </div>}
            </div>
            <div className="table-responsive" width="100%">
              <DataTableBase columns={columns} data={TradingCommission} pagination={false} />
            </div>
            {totalData > 5 ? <ReactPaginate
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName={'customPagination'}
              activeClassName={'active'}
            /> : ""}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TradingCommision;
