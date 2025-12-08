import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

const FundsManagement = () => {
  const [fundWithdrawal, setFundWithdrawal] = useState([]);
  const [totalAmount, setTotalAmount] = useState({});
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalData, setTotalData] = useState()


  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };


  const pageCount = totalData / itemsPerPage

  const skip = (currentPage - 1) * itemsPerPage;


  function statusFormatter(row) {
    return <strong className="text-success">{row.status}</strong>
  };

  const approvedByFormatter = (row) => {
    return (
      <>{row?.admin_email}
        <br />
        {row?.admin_ip && "IP:" + " " + row?.admin_ip}</>
    )
  }

  const userIdFollow = (row) => {
    return (
      row.user_id
    );
  };

  const WithdrawalAddressColumn = (row) => {
    if (row.payment_type === "FIAT" && row.user_bank) {
      const bank = row.user_bank;
      return (
        <div style={{ whiteSpace: "revert" }}>
          <div><strong>Bank:</strong> {bank.bank_name}</div>
          <div><strong>Holder:</strong> {bank.account_holder_name}</div>
          <div><strong>Acc No:</strong> {bank.account_number}</div>
          <div><strong>IFSC:</strong> {bank.ifsc_code}</div>
          <div><strong>Branch:</strong> {bank.branch_address}</div>
        </div>
      );
    }
    else {
      return (
        <div style={{ whiteSpace: "revert" }}>
          {row.to_address || "---"}
        </div>
      );
    }


  };

  const columns = [
    { name: "Sr No.", wrap: true, selector: (row, index) => fundWithdrawal.indexOf(row) + 1, },
    { name: "User Id", wrap: true, selector: userIdFollow },
    { name: "Date", selector: row => moment(row?.createdAt).format("MMM Do YYYY hh:mm A"), wrap: true },
    { name: "Contact ", wrap: true, selector: row => row?.emailId || row?.mobileNumber, },
    { name: "Chain", selector: row => row.chain || "---", },
    { name: "Coin Name", wrap: true, selector: row => row.short_name, },
    { name: <div style={{ whiteSpace: "revert" }}>Withdrawal Address</div>, wrap: true, selector: WithdrawalAddressColumn, },
    { name: "Tx Hash", sortable: true, wrap: true, selector: row => row.transaction_hash, },
    { name: "Amount", sortable: true, wrap: true, selector: row => row.amount, },
    { name: "Fee", wrap: true, selector: row => row.fee, },
    { name: "Status",wrap: true,width: "130px", selector: statusFormatter, },
  ];

  // useEffect(() => {
  //   handleFundWithdrawal(skip, 100);
  // }, [currentPage, skip]);
  useEffect(() => {
    handleFundWithdrawal(skip, 100);
  }, []);

  const handleFundWithdrawal = async (skip, limit) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.completeWithdrawalRequest(skip, limit).then(async (result) => {
      LoaderHelper.loaderStatus(false);
      if (result?.success) {
        try {
          let filteredData = result?.data?.map((item, index) => ({ ...item, index: index + 1 }))
          setFundWithdrawal(filteredData);
          setTotalData(result?.totalCount)
          setAllData(filteredData);

          const currencyTotals = {};
          result?.data.forEach(transaction => {
            const { short_name, amount } = transaction;
            if (currencyTotals[short_name]) {
              currencyTotals[short_name] += amount;
              currencyTotals[`${short_name}_COUNT`] += 1;
            } else {
              currencyTotals[short_name] = amount;
              currencyTotals[`${short_name}_COUNT`] = 1;
            }
          });
          setTotalAmount(currencyTotals)
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
    const keysToSearch = ["emailId", "chain", "short_name", "user_id", "to_address", "transaction_hash", "amount", "mobileNumber"];
    const searchTerm = e.target.value?.toLowerCase();
    const matchingObjects = allData?.filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
    setFundWithdrawal(matchingObjects);
  };

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filterDate = () => {
    const filteredData = allData.filter((item) => {
      // Convert `updatedAt` (GMT) to IST
      const createdAtDate = new Date(item.updatedAt);
      // createdAtDate.setHours(createdAtDate.getHours() + 5); // Add 5 hours
      // createdAtDate.setMinutes(createdAtDate.getMinutes() + 30); // Add 30 minutes

      // Define the boundaries of the selected date range in IST
      const startDate = fromDate ? new Date(fromDate) : null;
      const endDate = toDate ? new Date(toDate) : null;

      if (startDate) {
        startDate.setHours(0, 0, 0, 0); // Start of the day in IST
      }

      if (endDate) {
        endDate.setHours(23, 59, 59, 999); // End of the day in IST
      }

      // Perform strict range filtering
      const isApproved =
        (!startDate || createdAtDate >= startDate) &&
        (!endDate || createdAtDate <= endDate);


      return isApproved;
    });


    // Calculate currency totals
    const currencyTotals = {};
    filteredData.forEach(transaction => {
      const { short_name, amount } = transaction;
      if (currencyTotals[short_name]) {
        currencyTotals[short_name] += amount;
        currencyTotals[`${short_name}_COUNT`] += 1;
      } else {
        currencyTotals[short_name] = amount;
        currencyTotals[`${short_name}_COUNT`] = 1;
      }
    });

    setTotalAmount(currencyTotals); // Update totals
    setFundWithdrawal(filteredData); // Update filtered data
  };


  const ResetfilterDate = () => {
    setFromDate('')
    setToDate('')
    setFundWithdrawal(allData)
    const currencyTotals = {};
    allData.forEach(transaction => {
      const { short_name, amount } = transaction;
      if (currencyTotals[short_name]) {
        currencyTotals[short_name] += amount;
      } else {
        currencyTotals[short_name] = amount;
      }
    });
    setTotalAmount(currencyTotals)
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
                    Completed Withdrawal
                  </h1>
                  <div className="pt-3">
                    Total Amount  {Object.entries(totalAmount).map(([currency, total]) => {
                      return (
                        <>

                          <span className="mx-2 text-warning" key={currency}>
                            {currency}: {total?.toFixed(4)}
                          </span>
                        </>
                      );
                    })}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container-xl px-4 mt-n10 withdrawal_tbs">
          <div className="card mb-4">
            <div className="card-header">
              <div className="col ">
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
              <div className="col-3 ">
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
              <div className="col-3 ">
                <div className="row">
                  <div className="col">
                    <button
                      className="btn btn-indigo btn-block w-100"
                      type="button"
                      onClick={filterDate}
                      disabled={!fromDate || !toDate}
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
              <div className="col-2 mx-1">
                <input className="form-control form-control-solid" id="inputLastName" type="search" placeholder="Search here..." name="search" onChange={handleSearch} />
              </div>

              <div className="dropdown">
                <button className="btn btn-dark btn-md dropdown-toggle mb-3" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Export{" "}
                </button>
                <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp" >
                  <CSVLink data={fundWithdrawal} className="dropdown-item">
                    Export as CSV
                  </CSVLink>
                </div>
              </div>
            </div>
            <div className="card-body ">
              <div className="table-responsive" width="100%">
                <DataTableBase columns={columns} data={fundWithdrawal} pagination={true} />
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
  );
};

export default FundsManagement;
