import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage, } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { $ } from "react-jquery-plugin";
import DataTableBase from "../../../customComponent/DataTable";


const FundsPendingWithdrawal = () => {
  const [fundWithdrawal, setFundWithdrawal] = useState([]);
  const [allData, setAllData] = useState([]);
  const [totalAmount, setTotalAmount] = useState({});
  const [id, setId] = useState();
  const [trHash, setTrHash] = useState();
  const [tokenName, setTokenName] = useState('');
  const [chain, setChain] = useState('');
  const [receiver, setReciver] = useState('');
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const [currency, setCurrency] = useState("ALL");

  const adminId = sessionStorage.getItem("emailId")

  const linkFollow = (row) => {
    return (
      <div className="d-flex gap-2">
        <button
          className="btn btn-success btn-sm"
          type="button"
          onClick={() => {
            if (row.payment_type === "FIAT") {
              HandleWithdrawalStatus(row._id, 'COMPLETED');
            } else {
              ShowWithdrawModal(row);
            }
          }}
        >
          Approve
        </button>
        <button
          className="btn btn-danger btn-sm"
          type="button"
          onClick={() => HandleWithdrawalStatus(row._id, 'REJECTED', " ")}
        >
          Reject
        </button>
      </div>
    );
  };


  const ShowWithdrawModal = (row) => {
    setId(row?._id)
    setChain(row.chain);
    setReciver(row.to_address);
    setEmail(row.emailId);
    setAmount(row.amount);
    setTokenName(row.short_name)
    $("#funds_modal").modal("show");
  };



  const HandleWithdrawalStatus = async (id,status) => {

    LoaderHelper.loaderStatus(true)
    await AuthService.handleFundDenied(id, status, trHash,adminId).then(async result => {
      LoaderHelper.loaderStatus(false)
      if (result?.success) {
        $("#funds_modal").modal("hide");
        setTrHash("")
        handleFundWithdrawal();
        alertSuccessMessage(result?.message)
      } else {
        alertErrorMessage(result?.message)
      }
    })
  };


  const userIdFollow = (row) => {
    return (
      <div>
        {row.user_id}
      </div>
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




  const handleSelect = (row) => {
    return <>
      <input type="checkbox" value={row?._id} onChange={handleCheckboxInput} checked={selectedIds?.includes(row?._id)} style={{ height: "100px", width: "30px" }} />
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


  const columns = [
    // { name: "Select", wrap: true, selector: handleSelect },
    { name: "Sr No.", wrap: true, selector: (row, index) => fundWithdrawal.indexOf(row) + 1, },
    { name: "User Id", wrap: true, selector: userIdFollow },
    { name: "Date", selector: row => moment(row?.createdAt).format("MMM Do YYYY hh:mm A"), wrap: true },
    { name: "Contact ", wrap: true, selector: row => row?.emailId || row?.mobileNumber, },
    { name: "Chain", selector: row => row.chain || "---", },
    { name: "Coin Name", wrap: true, selector: row => row.short_name, },
    { name: <div style={{ whiteSpace: "revert" }}>Withdrawal Address</div>, wrap: true, selector: WithdrawalAddressColumn, },
    { name: "Amount", sortable: true, wrap: true, selector: row => row.amount, },
    { name: "Fee", wrap: true, selector: row => row.fee, },
    { name: "Status", grow: 1.5, width: "200px", selector: linkFollow, },
  ];

  useEffect(() => {
    handleFundWithdrawal();
  }, []);

  const handleFundWithdrawal = async () => {
    LoaderHelper.loaderStatus(true);
    await AuthService.PendingWithdrwal().then(async (result) => {
      LoaderHelper.loaderStatus(false);
      if (result?.success) {
        try {
          setFundWithdrawal(result?.data?.reverse());
          setAllData(result?.data);

          const currencyTotals = {};
          result?.data.forEach(transaction => {
            const { short_name, amount } = transaction;
            if (currencyTotals[short_name]) {
              currencyTotals[short_name] += amount;
            } else {
              currencyTotals[short_name] = amount;
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
    const keysToSearch = ["emailId", "chain", "short_name", "uuid", "to_address", "amount", "mobileNumber"];
    const searchTerm = e.target.value?.toLowerCase();
    const matchingObjects = allData?.filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
    setFundWithdrawal(matchingObjects);
  };


  const selectAll = (e) => {
    if (e.target.checked) {
      const allIds = fundWithdrawal?.map((item) => item?._id);
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }

  };

  const handleCurrency = (e) => {
    const value = e.target.value;
    setCurrency(value);
    const filteredItem = allData?.filter((item) => item?.short_name === value || value === "ALL")
    setFundWithdrawal(filteredItem)
  }

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
                      <div className="page-header-icon">
                        <i className="fa fa-dollar-sign"></i>
                      </div>
                      Pending Withdrawal
                    </h1>


                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="container-xl px-4 mt-n10">
            <div className="card mb-4">
              <div className="card-header">
                Pending Withdrawal
                
                <div className=" col-3">
                  <select className="form-control form-control-solid form-select" value={currency} onChange={handleCurrency}>
                    <option value="ALL"> All</option>
                    {Object.entries(totalAmount).map(([currency, total]) => {
                      return (
                        <>

                          <option value={currency}> {currency}</option>

                        </>
                      );
                    })}
                  </select>
                </div>

                <div className="col-5">
                  <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={handleSearch} />
                </div>
                {fundWithdrawal.length === 0 ? "" :
                  <div className="dropdown">
                    <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Export{" "}
                    </button>
                    <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                      <CSVLink data={fundWithdrawal} className="dropdown-item">
                        Export as CSV
                      </CSVLink>
                    </div>
                  </div>}
                {/* <div>
                  <button
                    className="btn mx-2 btn-success "
                    type="button" onClick={() => approveSelectedRequest("Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn mx-2 btn-danger "
                    type="button" onClick={() => approveSelectedRequest("Rejected")}
                  >
                    Reject
                  </button>
                </div> */}
              </div>
              <div className="table-responsive" width="100%">
                <DataTableBase columns={columns} data={fundWithdrawal} />
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="modal" id="funds_modal" tabindex="-1" role="dialog" aria-labelledby="funds_modal_modalTitle" aria-hidden="true">
        <div className="modal-dialog  alert_modal" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group  mb-3 position-relative ">
                  <label className="small mb-1"> Email Address </label>
                  <input className="form-control form-control-solid input-copy" type="text" Placeholder="Enter Transaction Hash " value={email} disabled ></input>
                </div>

                <div className="form-group  mb-3 position-relative ">
                  <label className="small mb-1"> Token Name </label>
                  <input className="form-control  form-control-solid input-copy" type="text" Placeholder="Enter Transaction Hash " value={tokenName} disabled></input>
                </div>


                <div className="form-group  mb-3 position-relative ">
                  <label className="small mb-1"> Chain </label>
                  <input className="form-control  form-control-solid input-copy" type="text" Placeholder="Enter Transaction Hash " value={chain} disabled></input>
                </div>


                <div className="form-group  mb-3 position-relative ">
                  <label className="small mb-1"> Reciver Address </label>
                  <input className="form-control  form-control-solid input-copy" type="text" Placeholder="Enter Transaction Hash " value={receiver} disabled></input>
                </div>

                <div className="form-group  mb-3 position-relative ">
                  <label className="small mb-1"> Amount </label>
                  <input className="form-control  form-control-solid input-copy" type="text" Placeholder="Enter Transaction Hash " value={amount} disabled></input>
                </div>
                <div className="form-group  mb-3 position-relative ">
                  <label className="small mb-1"> Transaction Hash </label>
                  <input className="form-control  form-control-solid input-copy" type="text" Placeholder="Enter Transaction Hash " value={trHash} onChange={(e) => { setTrHash(e.target.value) }} ></input>
                </div>

                <div className="form-group mt-3 position-relative">
                  <button className="btn btn-success   btn-block w-100" type="button" onClick={() => HandleWithdrawalStatus(id,"COMPLETED")} disabled={!trHash}>
                    Approve
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default FundsPendingWithdrawal;
