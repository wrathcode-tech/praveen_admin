import React, { useState, useEffect } from "react";
import { alertErrorMessage, alertSuccessMessage, } from "../../../customComponent/CustomAlertMessage";
import AuthService from "../../../api/services/AuthService";
import { $ } from "react-jquery-plugin";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import { Link } from "react-router-dom";

const ExchangeWalletManagement = () => {
  const [userWalletList, setUserWalletList] = useState([]);
  const [allData, setAllData] = useState([]);
  const [coinName, setCoinName] = useState("USDT");
  const [coinList, setCoinList] = useState([]);
  const [coinId, setCoinId] = useState([]);
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [accType, setAccType] = useState('');
  const [chain, setChain] = useState([]);
  const [selectedChain, setSelectedChain] = useState('');
  const [hideZeroBal, setHideZeroBal] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState("main");
  const adminId = sessionStorage.getItem("emailId");

  const walletTypes = ['main', 'spot', 'swap', 'earning', 'arbitrage']

  const handleHideZeroBal = (e) => {
    setHideZeroBal(e.target.checked)
  };

  const linkFollow = (row) => {
    return (
      <div>
        <button type="button" className="btn btn-sm btn-primary" onClick={() => { setUserId(row?.userId); showTransfer() }} >
          Debit/Credit
        </button>
      </div>
    );
  };



  const userIdFollow = (row) => {
    return (
      row.userId
    );
  };



  const columns = [
    { name: "User Id", wrap: true, selector: userIdFollow },
    { name: "Email Id", wrap: true, selector: row => row.emailId, },
    { name: "Coin Name", selector: row => row.short_name, },
    { name: "Available", sortable: true, selector: row => row.balance, },
    { name: "Locked", sortable: true, selector: row => row.locked_balance, },
    { name: "Action", selector: linkFollow, },
  ];


  useEffect(() => {
    handleUserWalletList("USDT", selectedWallet);
    handleCoinList();
  }, []);

  useEffect(() => {
    let filerdData = coinList?.filter((item) => {
      return item?.short_name === coinName
    })
    setChain(filerdData[0]?.chain)

  }, [userWalletList]);

  useEffect(() => {
    if (allData?.length > 0) {
      if (hideZeroBal) {
        let filteredItem = allData?.filter((item) => item?.balance > 0 || item?.locked_balance > 0)
        setUserWalletList(filteredItem)
      } else {
        setUserWalletList(allData)
      }
    }

  }, [hideZeroBal, allData]);


  const handleUserWalletList = async (coinName, selectedWallet) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.getUserWalletList(coinName, selectedWallet).then(async (result) => {

      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          setUserWalletList(result?.data);
          setAllData(result?.data);
          setCoinId(result?.data[0]?.currency_id)
        } catch (error) {
          alertErrorMessage(error);

        }
      } else {
        LoaderHelper.loaderStatus(false);
      }
    });
  };

  const handleCoinList = async () => {
    await AuthService.coinlist().then(async (result) => {

      if (result?.success) {
        try {
          setCoinList(result?.data);

        } catch (error) {
          alertErrorMessage(error);

        }
      } else {
        alertErrorMessage(result?.message);
      }
    });
  };


  const handleUserWalletTransfer = async (coinId, userId, amount, type, accType, selectedChain, selectedWallet, description) => {
    if(!coinId || !userId || !amount || !type || !accType  || !selectedWallet || !description){
      alertErrorMessage("All fields are required");
      return;
    }
    LoaderHelper.loaderStatus(true);
    await AuthService.fundsTransfer(coinId, userId, amount, type, accType, selectedChain, adminId, selectedWallet, description).then(async (result) => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        $("#funds_modal").modal("hide");
        alertSuccessMessage(result?.message);
        setAmount("");
        setAccType('');
        setDescription('')
        setType('')
        setSelectedChain('')
        handleUserWalletList(coinName, selectedWallet);
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
      }
    }
    );
  };

  const showTransfer = () => {
    $("#funds_modal").modal("show");
  };

  function handleSearch(e) {
    const keysToSearch = ["emailId", "userId"];
    const searchTerm = e.target.value?.toLowerCase();
    const matchingObjects = allData?.reverse().filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
    setUserWalletList(matchingObjects);
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
                      <div className="page-header-icon">
                        <i className="fa fa-wallet"></i>
                      </div>
                      Exchange Wallet Management
                    </h1>
                  </div>
                  <div className="col-auto mt-4">
                    <div className="exchangebtn_right">
                    <select
                      className="form-control form-control-solid form-select form-select-dark"
                      id="exampleFormControlSelect1"
                      value={coinName}
                      onChange={(e) => setCoinName(e.target.value)}
                    >
                      <option value="" selected="selected" hidden="hidden">
                        Choose here
                      </option>
                      {coinList.length > 0
                        ? coinList.map((item, index) => (
                          <option>{item?.short_name}</option>
                        ))
                        : undefined}
                    </select>
                    <select
                      className="form-control form-control-solid form-select form-select-dark mt-2"
                      id="exampleFormControlSelect1"
                      value={selectedWallet}
                      onChange={(e) => setSelectedWallet(e.target.value)}
                    >
                      <option value="" selected="selected" hidden="hidden">
                        Choose here
                      </option>
                      {walletTypes.length > 0
                        ? walletTypes.map((item, index) => (
                          <option>{item}</option>
                        ))
                        : undefined}
                    </select>
                    <button
                      className="btn btn-success btn-block w-100 mt-3"
                      type="button"
                      onClick={() => handleUserWalletList(coinName, selectedWallet)}
                    >
                      Submit
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="container-xl px-4 mt-n10">
            <div className="row">
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-header">
                    Exchange Wallet Details
                    <div className="col-5">
                      <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={handleSearch} />
                    </div>
                    <div className="col-3">
                      <input className="mx-2" id="hideZero" type="checkbox" checked={hideZeroBal} onChange={handleHideZeroBal} />
                      <label for="hideZero">Hide 0 Balance</label>
                    </div>
                    {userWalletList.length === 0 ? "" :
                      <div className="dropdown">
                        <button
                          className="btn btn-dark btn-sm dropdown-toggle"
                          id="dropdownFadeInUp"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Export
                        </button>
                        <div
                          className="dropdown-menu animated--fade-in-up"
                          aria-labelledby="dropdownFadeInUp"
                        >
                          <CSVLink className="dropdown-item" data={userWalletList}>
                            Export as CSV
                          </CSVLink>
                        </div>
                      </div>}
                  </div>
                  <div className="table-responsive mt-4" width="100%">
                    <DataTableBase columns={columns} data={userWalletList} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* funds modal */}
      <div
        className="modal"
        id="funds_modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="funds_modal_modalTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog  alert_modal" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                Debit/Credit
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
                <div className="form-group  mb-3 position-relative ">
                  <label className="small mb-1">Select Type*</label>
                  <select
                    className="form-control form-control-solid form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option hidden>Select</option>
                    <option value="CREDIT">CREDIT</option>
                    <option value="DEBIT">DEBIT</option>
                  </select>
                </div>
                <div className="form-group  mb-3 position-relative ">
                  <label className="small mb-1">Select Wallet</label>
                  <select
                    className="form-control form-control-solid form-select"
                    value={accType}
                    onChange={(e) => setAccType(e.target.value)}
                  >
                    <option hidden>Select type*</option>
                    <option value="available">Available</option>
                    <option value="locked_balance">Locked Balance</option>
                  </select>
                </div>
                {/* <div className="form-group  mb-3 position-relative ">
                  <label className="small mb-1">Select Chain</label>
                  <select className="form-control form-control-solid form-select" value={selectedChain} onChange={(e) => setSelectedChain(e.target.value)}                  >
                    <option hidden>Select chain</option>
                    {chain?.map((item) => {
                      return (
                        <option value={item}>{item}</option>
                      )
                    })}
                  </select>
                </div> */}


                <div className="form-group  mb-3 position-relative ">
                  <label className="small mb-1"> Amount* </label>
                  <input
                    className="form-control  form-control-solid input-copy"
                    type="text"
                    Placeholder="Enter Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  ></input>
                </div>

                <div className="form-group  mb-3 position-relative ">
                  <label className="small mb-1"> Remark* </label>
                  <input
                    className="form-control  form-control-solid input-copy"
                    type="text"
                    Placeholder="Enter Remark"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></input>
                </div>
                <div className="form-group  mb-3 position-relative">
                  {console.log("coinId, userId, amount, type, accType, selectedChain, selectedWallet, description",coinId, userId, amount, type, accType, selectedChain, selectedWallet, description)
                  }
                  <button
                    className="btn btn-primary   btn-block w-100"
                    type="button"
                    disabled={!coinId || !userId || !amount || !type || !accType  || !selectedWallet || !description}
                    onClick={() =>
                      handleUserWalletTransfer(coinId, userId, amount, type, accType, selectedChain, selectedWallet, description)
                    }
                  >
                    Debit/Credit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExchangeWalletManagement;
