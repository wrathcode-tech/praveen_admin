// Updated TradeList with Fiat Edit & Map/Unmap Referral functionality
import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import TraderDetails from "../TraderDetails";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import { Link, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Select from "react-select";

const TradeList = () => {
  const [activeScreen, setActiveScreen] = useState("userdetail");
  const [userId, setUserId] = useState("");
  const [exportData, setExportData] = useState([]);
  const [traderData, settraderData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalData, setTotalData] = useState();
  const [search, setSearch] = useState("");
  const [kycType, setKycType] = useState(4);

  // Debit/Credit states
  const [showDebitCreditModal, setShowDebitCreditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [coinList, setCoinList] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [transactionType, setTransactionType] = useState('DEBIT');
  const [amount, setAmount] = useState('');
  const [accountType, setAccountType] = useState('balance');
  const [walletType, setWalletType] = useState('');
  const [walletTypesList, setWalletTypesList] = useState([]);
  console.log("🚀 ~ TradeList ~ walletTypesList:", walletTypesList)

  const userType = sessionStorage.getItem("userType");

  const handlePageChange = ({ selected }) => setCurrentPage(selected + 1);
  const pageCount = totalData / itemsPerPage;
  const skip = (currentPage - 1) * itemsPerPage;

  const linkFollow = (row) => (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex flex-wrap gap-2">
        <button className="btn btn-dark btn-sm" onClick={() => { settraderData(row); setUserId(row?._id); setActiveScreen("detail") }}>View</button>
        <button className={`btn btn-sm ${row?.status === 'Active' ? 'btn-success' : 'btn-danger'}`} onClick={() => handleStatus(row?.id, row?.status === 'Active' ? 'Inactive' : 'Active')}>
          {row?.status === 'Active' ? 'Active' : 'Inactive'}
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => handleOpenDebitCreditModal(row)}>Debit/Credit</button>
      </div>

    </div>
  );


  const userIdFollow = (row) => row._id


  const columns = [
    { name: "Sr No.", selector: (row, index) => skip + index + 1 },
    // { name: "User ID", width:"150px",wrap: true, selector: userIdFollow },
    { name: "User UID", width: "150px", wrap: true, selector: row => row?.uuid },
    { name: "Name", wrap: true, selector: row => row?.firstName ? `${row?.firstName} ${row?.lastName}` : "-----" },
    { name: "Email", wrap: true, selector: row => row.emailId || "-----" },
    { name: "Referral Code", width: "150px", wrap: true, selector: row => row.referral_code || "-----" },
    { name: "KYC", wrap: true, selector: row => ["Not Submitted", "Pending", "Approved", "Rejected"][row.kycVerified] },
    { name: "Phone", wrap: true, selector: row => row.mobileNumber || "-----" },
    { name: "Reg. Date", wrap: true, selector: row => moment(row?.createdAt).format("MMM Do YYYY hh:mm A") },
    { name: "Sponsored By", wrap: true, width: "150px", selector: row => row?.sponsered_by?.emailId || row?.sponsered_by?.mobileNumber || "-----" },
    { name: "Action", selector: linkFollow, width: "150px" }
  ];





  const handleStatus = async (_id, status) => {
    if (userType !== "1") {
      alertErrorMessage("Not Authorized");
      return;
    }

    const res = await AuthService.updateStatus(_id, status);
    if (res.success) {
      alertSuccessMessage(res.message);
      handleUserData(skip, itemsPerPage, search);
    } else {
      alertErrorMessage(res.message);
    }
  };



  const handleUserData = async (skip, limit, search) => {
    LoaderHelper.loaderStatus(true);
    const res = await AuthService.getUserList(skip, limit, search, kycType);
    LoaderHelper.loaderStatus(false);
    if (res.success) {
      setExportData(res.data);
      setTotalData(res.totalCount);
    } else alertErrorMessage("No data found");
  };







  useEffect(() => {
    handleUserData(skip, itemsPerPage, search);
    handleCoinList();
    handleWalletTypesList();
  }, [currentPage, itemsPerPage, skip, kycType, search]);

  const handleCoinList = async () => {
    await AuthService.getCoinList().then(async (result) => {
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
  }

  const handleWalletTypesList = async () => {
    await AuthService.getAvailableWalletTypes().then(async (result) => {
      if (result?.success) {
        try {
          // Handle different response structures
          const walletTypes = Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result?.data?.walletTypes)
              ? result.data.walletTypes
              : [];
          setWalletTypesList(walletTypes);
        } catch (error) {
          console.error('Error setting wallet types:', error);
          setWalletTypesList([]);
        }
      } else {
        // Don't show error if API fails, just use empty array
        setWalletTypesList([]);
      }
    }).catch((error) => {
      console.error('Error fetching wallet types:', error);
      setWalletTypesList([]);
    });
  }

  const handleOpenDebitCreditModal = (row) => {
    setSelectedUser(row);
    setShowDebitCreditModal(true);
    // Reset form
    setSelectedCoin(null);
    setAmount('');
    setAccountType('balance');
    setWalletType('');
    setTransactionType('DEBIT');
  }

  const handleDebitCredit = async () => {
    if (!selectedUser) {
      alertErrorMessage("User not selected");
      return;
    }
    if (!selectedCoin) {
      alertErrorMessage("Please select a coin");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      alertErrorMessage("Please enter a valid amount");
      return;
    }
    if (!walletType) {
      alertErrorMessage("Please enter wallet type");
      return;
    }

    LoaderHelper.loaderStatus(true);
    const data = {
      userId: selectedUser.uuid,
      coinId: selectedCoin._id,
      type: transactionType,
      amount: parseFloat(amount),
      account_type: accountType,
      wallet_type: walletType
    };

    await AuthService.debitCreditForUsers(data).then(async (result) => {
      LoaderHelper.loaderStatus(false);
      if (result?.success) {
        alertSuccessMessage(result?.message);
        setShowDebitCreditModal(false);
        // Reset form
        setSelectedUser(null);
        setSelectedCoin(null);
        setAmount('');
        setAccountType('balance');
        setWalletType('');
        setTransactionType('DEBIT');
      } else {
        alertErrorMessage(result?.message || "Transaction failed");
      }
    }).catch((error) => {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage(error?.message || "Transaction failed");
    });
  }

  return activeScreen === "userdetail" ? (
    <div id="layoutSidenav_content">
      <div className="container-xl px-4">
        <h1 className="mt-4 mb-3">Traders List</h1>
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between">
            <input type="search" className="form-control w-25" placeholder="Search email, phone or uuid" onChange={e => setSearch(e.target.value)} value={search} />
            <select className="form-select w-25" value={kycType} onChange={e => setKycType(e.target.value)}>
              <option value={2}>Approved KYC</option>
              <option value={1}>Pending KYC</option>
              <option value={3}>Rejected KYC</option>
              <option value={0}>Not Submitted</option>
              <option value={4}>All</option>
            </select>
          </div>
          <div className="card-body">
            <DataTableBase columns={columns} data={exportData} pagination={false} />
            <ReactPaginate pageCount={pageCount} onPageChange={handlePageChange} containerClassName={'customPagination'} activeClassName={'active'} />
          </div>
        </div>

      </div>

      {/* Debit/Credit Modal */}
      {showDebitCreditModal && (
        <div className="modal tradelistpop show d-block" id="debitCreditModal" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Debit/Credit Wallet {selectedUser?.firstName} {selectedUser?.lastName}</h5>
                <button type="button" className="btn-close" onClick={() => setShowDebitCreditModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">User Email</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser?.emailId || ''}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Transaction Type</label>
                    <select
                      className="form-select"
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                    >
                      <option value="DEBIT">DEBIT</option>
                      <option value="CREDIT">CREDIT</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Select Coin</label>
                    <select
                      className="form-select"
                      value={selectedCoin?._id || ''}
                      onChange={(e) => {
                        const coin = coinList.find(c => c._id === e.target.value);
                        setSelectedCoin(coin);
                      }}
                    >
                      <option value="">Select Coin</option>
                      {Array.isArray(coinList) && coinList.length > 0 && coinList.map((coin) => (
                        <option key={coin._id} value={coin._id}>
                          {coin.short_name} {coin.currency}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}

                      placeholder="Enter amount"
                      // step="0.00000001"
                      onWheel={(e) => e.target.blur()}
                      min="0"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Account Type</label>
                    <select
                      className="form-select"
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                    >
                      <option value="balance">Balance</option>
                      <option value="locked_balance">Locked Balance</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Wallet Type</label>
                    <select
                      className="form-select"
                      value={walletType}
                      onChange={(e) => setWalletType(e.target.value)}
                      required
                    >
                      <option value="">Select Wallet Type</option>
                      {Array.isArray(walletTypesList) && walletTypesList.length > 0 && walletTypesList.map((type, index) => (
                        <option key={index} value={typeof type === 'string' ? type : type?.value || type?.name || type}>
                          {typeof type === 'string' ? type : type?.label || type?.name || type}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDebitCreditModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleDebitCredit}>
                  {transactionType === 'DEBIT' ? 'Debit' : 'Credit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}





    </div>
  ) : (
    <TraderDetails userId={userId} traderData={traderData} />
  );
};

export default TradeList;
