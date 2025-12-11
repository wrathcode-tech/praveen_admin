import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Loginpage from "../ui/pages/LoginPage";
import ForgetpasswordPage from "../ui/pages/ForgetpasswordPage";
import DashboardPage from "../ui/pages/DashboardPage";
import HomePage from "../ui/pages/HomePage";
import AddsubAdmin from "../ui/pages/AddsubAdmin";
import SubadminList from "../ui/pages/SubadminList";
import ApprovedKyc from "../ui/pages/ApprovedKyc";
import PendingKyc from "../ui/pages/PendingKyc";
import TradeList from "../ui/pages/TradeList";
import CurrencyManagement from "../ui/pages/CurrencyManagement";
import CurrencypairManagement from "../ui/pages/CurrencypairManagement";
import TradingReport from "../ui/pages/TradingReport";
import FundsManagement from "../ui/pages/FundsCompletedWithdrawal";
import FundsCancelledWithdrawal from "../ui/pages/FundsCancelledWithdrawal";
import FundsPendingWithdrawal from "../ui/pages/FundsPendingWithdrawal";
import FundsDManagement from "../ui/pages/FundsCompletedDeposit";
import WithdrawalFees from "../ui/pages/WithdrawalFees";
import MiscellaneousPage from "../ui/pages/MiscellaneousPage";
import Notification from "../ui/pages/Notification";
import BannerManagement from "../ui/pages/BannerManagement";
import RejectedKyc from "../ui/pages/RejectedKyc";
import TradingCommision from "../ui/pages/TradingCommision";
import OrderBook from "../ui/pages/OrderBook";
import FundsPendingDeposit from "../ui/pages/FundsPendingDeposit";
import SupportPage from "../ui/pages/SupportPage";
import { ToastContainer } from "react-toastify";
import CoinListDetails from "../ui/pages/CoinListDetails";
import TodayRegistration from "../ui/pages/TodayRegistration";
import ExchangeWalletManagement from "../ui/pages/ExchangeWalletManagement";
import MyActivityLogs from "../ui/pages/MyActivityLogs";
import AllOpenOrders from "../ui/pages/AllOpenOrders";
import CoinlistFee from "../ui/pages/CoinListingFee";
import UserWalletBal from "../ui/pages/UserWalletBal";
import PartnerStakePayout from "../ui/pages/PartnerStakePayout";
import QuickBuySellCommission from "../ui/pages/QuickBuySellCommission";
import AdminDebitCreditTrans from "../ui/pages/AdminCreditDebitTrans";
import VisitorId from "../customComponent/VisitorIdPage";
import UserDetailsPage from "../ui/pages/UserCompleteDetails";
import FundsCancelledDeposit from "../ui/pages/FundsCancelledDeposit";
import AddNewCoin from "../ui/pages/CoinPortalManagement/AddNewCoin";
import CoinRequestList from "../ui/pages/CoinPortalManagement/CoinRequestList";
import ApprovedCoinList from "../ui/pages/CoinPortalManagement/ApprovedCoinList";
import RejectedCoinList from "../ui/pages/CoinPortalManagement/RejectedCoinList";
import Blog from "../ui/pages/Blog";
import Partnership from "../ui/pages/InvestorsList";
import AffiliateList from "../ui/pages/AffiliateList";
import AffiliatePayout from "../ui/pages/AffiliatePayout";
import VerifyKyc from "../ui/pages/VerifyKyc";
import InverstorUpdates from "../ui/pages/InvestorUpdate";
import AddTraders from "../ui/pages/TradeList/AddTraders";
import DisputeManagement from "../ui/pages/P2PManagement/DisputeManagement";
import DisputeDetails from "../ui/pages/P2PManagement/DisputeDetails";

const Routing = () => {
    const [actived, setActived] = useState('')
    const token = sessionStorage.getItem('token');

    return (
        <Router>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss={false} draggable pauseOnHover limit={100} theme="light" />
            <Routes>
                {token ?
                    <>
                        <Route exact path="/dashboard/*" element={<DashboardPage />} >
                            <Route index element={<HomePage />}></Route>
                            <Route exect path="homepage" element={<HomePage />}></Route>
                            <Route exect path="listsubadmin" element={<SubadminList />}></Route>
                            <Route exect path="addsubadmin" element={<AddsubAdmin />}></Route>
                            <Route exect path="tradelist" element={<TradeList />}></Route>
                            <Route exect path="pendingkyc" element={<PendingKyc />}></Route>
                            <Route exect path="approvedkyc" element={<ApprovedKyc />}></Route>
                            <Route exect path="VerifyKyc/:userId" element={<VerifyKyc />}></Route>
                            <Route exect path="currencymanagement" element={<CurrencyManagement />}></Route>
                            <Route exect path="currencypair" element={<CurrencypairManagement />}></Route>
                            <Route exect path="tradingfeereport" element={<TradingReport />}></Route>
                            <Route exect path="exchangeWalletManagement" element={<ExchangeWalletManagement />}></Route>
                            <Route exect path="fundsManagement" element={<FundsManagement />}></Route>
                            <Route exect path="fundsCancelledDeposit" element={<FundsCancelledDeposit />}></Route>
                            <Route exect path="FundsCancelledWithdrawal" element={<FundsCancelledWithdrawal />}></Route>
                            <Route exect path="FundsPendingWithdrawal" element={<FundsPendingWithdrawal />}></Route>
                            <Route exect path="fundsDManagement" element={<FundsDManagement />}></Route>
                            <Route exect path="WithdrawalFees" element={<WithdrawalFees />}></Route>
                            <Route exect path="MiscellaneousPage" element={<MiscellaneousPage />}></Route>
                            <Route exect path="notification" element={<Notification />}></Route>
                            <Route exect path="bannerManagement" element={<BannerManagement />}></Route>
                            <Route exect path="RejectedKyc" element={<RejectedKyc />}></Route>
                            <Route exect path="TradingCommision" element={<TradingCommision />}></Route>
                            <Route exect path="OrderBook" element={<OrderBook />}></Route>
                            <Route exect path="FundsPendingDeposit" element={<FundsPendingDeposit />}></Route>
                            <Route exect path="partnership" element={<Partnership />}></Route>
                            <Route exect path="affiliateList" element={<AffiliateList />}></Route>
                            <Route exect path="coinListDetails" element={<CoinListDetails />}></Route>
                            <Route exect path="support" element={<SupportPage />}></Route>
                            <Route exect path="todayRegistration" element={<TodayRegistration />}></Route>
                            <Route exect path="myLogs" element={<MyActivityLogs />}></Route>
                            <Route exect path="allOpenOrders" element={<AllOpenOrders />}></Route>
                            <Route exect path="CoinFee" element={<CoinlistFee />}></Route>
              
                            <Route exect path="QuickBuySellCommission" element={<QuickBuySellCommission />}></Route>
                            <Route exect path="user_wallet_balance" element={<UserWalletBal />}></Route>
                            <Route exect path="PartnerStakePayout" element={<PartnerStakePayout />}></Route>
                            <Route exect path="AddNewCoin" element={<AddNewCoin />}></Route>
                            <Route exect path="CoinRequestList" element={<CoinRequestList />}></Route>
                            <Route exect path="ApprovedCoinList" element={<ApprovedCoinList />}></Route>
                            <Route exect path="RejectedCoinList" element={<RejectedCoinList />}></Route>
                            <Route exect path="Blog" element={<Blog />}></Route>
                            <Route exect path="affiliatePayout" element={<AffiliatePayout />}></Route>
                            <Route exect path="inverstorUpdates" element={<InverstorUpdates />}></Route>
                            <Route exect path="addtraders" element={<AddTraders />}></Route>
                            <Route exect path="AdminDebitCreditTrans" element={<AdminDebitCreditTrans />}></Route>
                            <Route path="user-details/:userId" element={<UserDetailsPage />} />
                            <Route path="dispute_management" element={<DisputeManagement />} ></Route>
                            <Route path="dispute_Details" element={<DisputeDetails />} ></Route>
                        </Route>

                    </> :
                    <Route path="/" element={<Loginpage />}></Route>

                }
                <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />}></Route>
                <Route exact path="/get-secret-device-id" element={<VisitorId />}></Route>
                <Route path="*" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />}></Route>

                <Route exect path="/forgotpassword" element={<ForgetpasswordPage />}></Route>

            </Routes>
        </Router>
    );
}

export default Routing;