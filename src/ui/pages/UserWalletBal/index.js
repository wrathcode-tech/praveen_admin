import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import { Link } from "react-router-dom";


const UserWalletBal = () => {


  const [walletData, setWalletData] = useState([]);
  const [hideZeroBal, setHideZeroBal] = useState(true);
  const [totalBalance, setTotalBalance] = useState({ cvtBalance: 0, cvtLockedBal: 0, usdtBalance: 0, usdtLockedBal: 0, });
  const [allData, setAllData] = useState([]);

  const handleHideZeroBal = (e) => {
    setHideZeroBal(e.target.checked)
  };


  const userIdFollow = (row) => {
    return (
      row.userId
    );
  };


  const columns = [
    { name: "Sr No.", wrap: true, selector: (row, index) => row.index, },
    { name: "User Id", width: "200px", sort: true, wrap: true, selector: userIdFollow },
    { name: "Email", width: "200px", sort: true, wrap: true, selector: row => row.emailId ? row.emailId : "-----", },
    { name: "CVT Balance", width: "150px", sortable: true, wrap: true, selector: row => row.cvtBalance || "0", },
    { name: "CVT Locked Balance", width: "150px", sortable: true, wrap: true, selector: row => row.cvtLockedBalance || "0", },
    { name: "CVT Bonus", width: "150px", sortable: true, wrap: true, selector: row => row.cvtBonus || "0", },
    { name: "CVT Total", width: "150px", sortable: true, wrap: true, selector: row => row.cvtTotal || "0", },
    { name: "USDT Balance", width: "150px", sortable: true, wrap: true, selector: row => row.usdtBalance || "0", },
    { name: "USDT Locked Balance", width: "150px", sortable: true, wrap: true, selector: row => row.usdtLockedBalance || "0", },
    { name: "USDT Total", width: "150px", sortable: true, wrap: true, selector: row => row.usdtTotal || "0", },
  ];

  useEffect(() => {
    if (allData?.length > 0) {
      if (hideZeroBal) {
        let filteredItem = allData?.filter((item) => item?.cvtTotal > 0 || item?.usdtTotal > 0)?.map((data, index) => ({ ...data, index: index + 1 }))
        setWalletData(filteredItem)
      } else {
        setWalletData(allData)
      }
    }

  }, [hideZeroBal, allData]);


  useEffect(() => {
    handleWalletDetails()
  }, []);

  const handleWalletDetails = async () => {
    LoaderHelper.loaderStatus(true);
    await AuthService.getUserWallet().then(async result => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          let filteredData = result?.data?.map((data, index) => ({ ...data, index: index + 1 }))
          setWalletData(filteredData);
          setAllData(filteredData);
          const totalAmountCvt = result?.data.reduce((sum, item) => sum + (item.cvtBalance || 0), 0);
          const totalAmountCvtBonus = result?.data.reduce((sum, item) => sum + (item.cvtBonus || 0), 0);
          const totalAmountCvtLocked = result?.data.reduce((sum, item) => sum + (item.cvtLockedBalance || 0), 0);
          const totalAmountUsdt = result?.data.reduce((sum, item) => sum + (item.usdtBalance || 0), 0);
          const totalAmountUsdtLocked = result?.data.reduce((sum, item) => sum + (item.usdtLockedBalance || 0), 0);
          setTotalBalance({ cvtBalance: totalAmountCvt || 0, cvtLockedBal: totalAmountCvtLocked || 0, cvtBonus: totalAmountCvtBonus || 0, usdtBalance: totalAmountUsdt || 0, usdtLockedBal: totalAmountUsdtLocked || 0, })
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
    const keysToSearch = ["_id", "user_id", "emailId", "mobileNumber", "firstName", "cvtBalance", "cvtBonus", "cvtLockedBalance", "cvtTotal", "usdtLockedBalance", "usdtTotal", "usdtBalance"];
    const searchTerm = e.target.value?.toLowerCase();
    const matchingObjects = allData?.filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
    setWalletData(matchingObjects);
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
                    <div className="page-header-icon"><i className="fa fa-wallet"></i></div>
                    User Wallet Balance
                  </h1>
                  <div>
                    <strong className="mx-2">CVT : <strong className="text-success"> {totalBalance?.cvtBalance?.toFixed(5)}</strong> </strong> ||
                    <strong className="mx-2">CVT Locked :  <strong className="text-success"> {totalBalance?.cvtLockedBal?.toFixed(5)}</strong> </strong>||
                    <strong className="mx-2">CVT Bonus :  <strong className="text-success"> {totalBalance?.cvtBonus?.toFixed(5)}</strong> </strong>||
                    <strong className="mx-2">USDT :  <strong className="text-success"> {totalBalance?.usdtBalance?.toFixed(5)}</strong> </strong>||
                    <strong className="mx-2">USDT Locked :  <strong className="text-success"> {totalBalance?.usdtLockedBal?.toFixed(5)}</strong> </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container-xl px-4 mt-n10">
          <div className="card mb-4">
            <div class="card-header">User Wallet Balance
              <div className="col-3">
                <input className="form-control form-control-solid" id="inputLastName" type="search" placeholder="Search here..." name="search" onChange={handleSearch} />
              </div>
              <div className="col-3">

                <input className="mx-2" id="hideZero" type="checkbox" checked={hideZeroBal} onChange={handleHideZeroBal} />
                <label for="hideZero">Hide 0 Balance</label>
              </div>

              <div class="dropdown">
                <button class="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Export </button>
                <div class="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                  <CSVLink data={walletData} class="dropdown-item">Export as CSV</CSVLink>
                </div>
              </div>
            </div>
            <div className="table-responsive" width="100%">
              <DataTableBase columns={columns} data={walletData} pagination={true} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default UserWalletBal;


