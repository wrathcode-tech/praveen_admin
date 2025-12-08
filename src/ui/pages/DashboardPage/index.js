import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "../../../customComponent/Header";
import { useEffect } from "react";

const DashboardPage = () => {
    const [isSidebar, setIsSidebar] = useState(true)
    const [actived, setActived] = useState('')

    const myPermission = sessionStorage.getItem('permissions');
    const userType = sessionStorage.getItem('userType');
    let permissions = Array.isArray(JSON.parse(myPermission)) ? JSON.parse(myPermission)?.map(x => x.value) : [];

    useEffect(() => {
        let URL = window.location.href?.split('/');
        let route = URL.pop();
        setActived(route)
    }, []);

    return (
        <>
            <Header isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
            <div id="layoutSidenav" >
                <div id="layoutSidenav_nav">
                    <nav className="sidenav shadow-right sidenav-light">
                        <div className="sidenav-menu">
                            <div className="nav accordion" id="accordionSidenav">
                                <div className="sidenav-menu-heading">
                                    <h1 style={{ color: '#f1c40f' }}>Praveen Admin</h1>
                                </div>
                                <Link to="/dashboard/homepage" className={`nav-link collapsed ${actived?.includes('homepage') ? 'active' : ''}`} onClick={() => { setActived('homepage'); setIsSidebar(true) }}>
                                    <div className="nav-link-icon"><i className="fa fa-th"></i></div>
                                    Dashboards
                                </Link>

                                {userType === '1' ?
                                    <>
                                        <div className={`nav-link collapsed ${actived?.includes('listsubadmin') || actived?.includes('addsubadmin') ? 'active' : ''}`} data-bs-toggle="collapse" data-bs-target="#collapseSubAdmin" aria-expanded="false" aria-controls="collapseSubAdmin">
                                            <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>
                                            Sub Admin
                                            <div className="sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </div>
                                        <div className="collapse" id="collapseSubAdmin" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">
                                                <Link className={`nav-link  ${actived?.includes('listsubadmin') ? 'active' : ''}`} to="listsubadmin" onClick={() => { setActived('listsubadmin'); setIsSidebar(true); }}>Sub Admin List</Link>

                                                <Link className={`nav-link  ${actived?.includes('addsubadmin') ? 'active' : ''}`} to="addsubadmin" onClick={() => { setActived('addsubadmin'); setIsSidebar(true); }}>Add New</Link>
                                            </nav>
                                        </div>
                                    </>
                                    : null
                                }

                                {permissions.includes(2) || userType === '1' ?
                                    <>
                                        <div className={`nav-link collapsed ${actived?.includes('tradelist') || actived?.includes('addtraders') ? 'active' : ''}`} data-bs-toggle="collapse" data-bs-target="#collapseTraders" aria-expanded="false" aria-controls="collapseTraders">
                                            <div className="nav-link-icon"><i className="fa fa-wave-square"></i></div>
                                            Traders
                                            <div className="sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </div>

                                        <div className="collapse" id="collapseTraders" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">
                                                <Link className={`nav-link  ${actived?.includes('tradelist') || actived === "tradelist" ? 'active' : ''}`} to="tradelist" onClick={() => { setActived('tradelist'); setIsSidebar(true); }}>Traders List</Link>
                                                <Link className={`nav-link  ${actived?.includes('addtraders') || actived === "addtraders" ? 'active' : ''}`} to="addtraders" onClick={() => { setActived('addtraders'); setIsSidebar(true); }}>Add New Trader</Link>
                                            </nav>
                                        </div>
                                    </>
                                    : null
                                }

                                {permissions.includes(3) || userType === '1' ?
                                    <>
                                        <div className={`nav-link collapsed ${(actived?.includes('pendingkyc') || actived?.includes('approvedkyc') || actived?.includes('RejectedKyc')) ? 'active' : ''}`} data-bs-toggle="collapse" data-bs-target="#collapseKyc" aria-expanded="false" aria-controls="collapseKyc">
                                            <div className="nav-link-icon"><i className="fa fa-check-circle"></i></div>
                                            KYC Manager
                                            <div className="sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </div>

                                        <div className="collapse" id="collapseKyc" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">

                                                <Link className={`nav-link ${actived?.includes('pendingkyc') ? 'active' : ''}`} to="pendingkyc" onClick={() => { setActived('pendingkyc'); setIsSidebar(true) }}>Pending KYC</Link>

                                                <Link className={`nav-link  ${actived?.includes('approvedkyc') ? 'active' : ''}`} to="approvedkyc" onClick={() => { setActived('approvedkyc'); setIsSidebar(true); }}>Approved KYC</Link>

                                                <Link className={`nav-link  ${actived?.includes('RejectedKyc') ? 'active' : ''}`} to="RejectedKyc" onClick={() => { setActived('RejectedKyc'); setIsSidebar(true); }}>Rejected KYC</Link>
                                            </nav>
                                        </div>
                                    </>
                                    : null
                                }




                                {/* {permissions.includes(5) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('adminBank') ? 'active' : ''}`} to="adminBank" onClick={() => { setActived('adminBank'); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i class="fas fa-user-slash"></i></div>
                                        Admin Bank
                                    </Link>
                                    : null
                                }
                                {permissions.includes(5) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('UserBank') ? 'active' : ''}`} to="UserBank" onClick={() => { setActived('UserBank'); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i class="fa fa-university" aria-hidden="true"></i>
                                        </div>
                                        User Bank Management
                                    </Link>
                                    : null
                                }
 */}

                                {/* {permissions.includes(21) || userType === '1' ?
                                    <>
                                        <div className={`nav-link collapsed ${(actived?.includes('AddPartner') || actived?.includes('partnership') || actived?.includes('PartnershipWithdrawal') || actived?.includes('PartnerStakePayout')) ? 'active' : ''}`} data-bs-toggle="collapse" data-bs-target="#collapsePartner" aria-expanded="false" aria-controls="collapsePartner">
                                            <div className="nav-link-icon"><i class="fas fa-handshake"></i></div>
                                            Earning Manager
                                            <div className="sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </div>

                                        <div className="collapse" id="collapsePartner" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">

                                                {(permissions.includes(21) || userType === '1') && <Link className={`nav-link collapsed ${actived?.includes('AddPartner') ? 'active' : ''}`} to="AddPartner" onClick={() => { setActived('AddPartner'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>
                                                    Add Package
                                                </Link>}
                                                {(permissions.includes(21) || userType === '1') && <Link className={`nav-link collapsed ${actived?.includes('partnership') ? 'active' : ''}`} to="partnership" onClick={() => { setActived('partnership'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>
                                                    Investors List
                                                </Link>}
                                                {(permissions.includes(21) || userType === '1') && <Link className={`nav-link  ${actived?.includes('PartnershipWithdrawal') ? 'active' : ''}`} to="PartnershipWithdrawal" onClick={() => { setActived('PartnershipWithdrawal'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>Investor Payout</Link>
                                                }
                                                {(permissions.includes(21) || userType === '1') && <Link className={`nav-link  ${actived?.includes('PartnerStakePayout') ? 'active' : ''}`} to="PartnerStakePayout" onClick={() => { setActived('PartnerStakePayout'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>Payout List</Link>}


                                            </nav>
                                        </div>
                                    </>
                                    : null
                                } */}

                                {/* {permissions.includes(22) || userType === '1' ?
                                    <>
                                        <div className={`nav-link collapsed ${(actived?.includes('affiliateList') || actived?.includes('roiDistribution') || actived?.includes('affiliatePayout')) ? 'active' : ''}`} data-bs-toggle="collapse" data-bs-target="#collapseaffiliate" aria-expanded="false" aria-controls="collapseaffiliate">
                                            <div className="nav-link-icon"><i class="fas fa-handshake"></i></div>
                                            Affiliate Manager
                                            <div className="sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </div>
                                        <div className="collapse" id="collapseaffiliate" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">

                                                {(permissions.includes(22) || userType === '1') && <Link className={`nav-link collapsed ${actived?.includes('affiliateList') ? 'active' : ''}`} to="affiliateList" onClick={() => { setActived('affiliateList'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>
                                                    Affiliate List
                                                </Link>}


                                                {(permissions.includes(22) || userType === '1') && <Link className={`nav-link collapsed ${actived?.includes('roiDistribution') ? 'active' : ''}`} to="roiDistribution" onClick={() => { setActived('roiDistribution'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>
                                                    ROI Distribution
                                                </Link>}

                                                {(permissions.includes(22) || userType === '1') && <Link className={`nav-link collapsed ${actived?.includes('affiliatePayout') ? 'active' : ''}`} to="affiliatePayout" onClick={() => { setActived('affiliatePayout'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>
                                                    Payout List
                                                </Link>}

                                            </nav>
                                        </div>
                                    </>
                                    : null
                                } */}
                                {/* {permissions.includes(23) || userType === '1' ?
                                    <>
                                        <div className={`nav-link collapsed ${(actived?.includes('createPackage') || actived?.includes('fundList') || actived?.includes('userPackageList') || actived?.includes('packageList') || actived?.includes('referralList')) ? 'active' : ''}`} data-bs-toggle="collapse" data-bs-target="#collapseArbitrageBot" aria-expanded="false" aria-controls="collapseArbitrageBot">
                                            <div className="nav-link-icon"><i class="fa-solid fa-robot"></i></div>
                                            Arbitrage Bot
                                            <div className="sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </div>

                                        <div className="collapse" id="collapseArbitrageBot" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">

                                                {(permissions.includes(23) || userType === '1') && <Link className={`nav-link collapsed ${actived?.includes('createPackage') ? 'active' : ''}`} to="createPackage" onClick={() => { setActived('createPackage'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>
                                                    Create Package
                                                </Link>}

                                                {(permissions.includes(23) || userType === '1') && <Link className={`nav-link collapsed ${actived?.includes('TradeBot') ? 'active' : ''}`} to="TradeBot" onClick={() => { setActived('TradeBot'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>
                                                    Bot Trade Management
                                                </Link>}
                                                {(permissions.includes(23) || userType === '1') && <Link className={`nav-link collapsed ${actived?.includes('packageList') ? 'active' : ''}`} to="packageList" onClick={() => { setActived('packageList'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>
                                                    Package List
                                                </Link>}
                                                {(permissions.includes(22) || userType === '1') && <Link className={`nav-link collapsed ${actived?.includes('userPackageList') ? 'active' : ''}`} to="userPackageList" onClick={() => { setActived('userPackageList'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>
                                                    User Package List
                                                </Link>}
                                                {(permissions.includes(23) || userType === '1') && <Link className={`nav-link collapsed ${actived?.includes('fundList') ? 'active' : ''}`} to="fundList" onClick={() => { setActived('fundList'); setIsSidebar(true); }}>
                                                    <div className="nav-link-icon"><i className="fa fa-user-friends"></i></div>
                                                    User Fund List
                                                </Link>}
                                             
                                            </nav>
                                        </div>
                                    </>
                                    : null
                                } */}

                                {permissions.includes(8) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('coinListDetails') ? 'active' : ''}`} to="coinListDetails" onClick={() => { setActived('coinListDetails'); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i class="fas fa-coins"></i></div>
                                        Coin Listed Details
                                    </Link>
                                    : null
                                }



                                {permissions.includes(9) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('currencymanagement') ? 'active' : ''}`} to="currencymanagement" onClick={() => { setActived('currencymanagement'); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i className="fa fa-dollar-sign"></i></div>
                                        Currency Management
                                    </Link>
                                    : null
                                }

                                {permissions.includes(10) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('currencypair') ? 'active' : ''}`} onClick={() => { setActived('currencypair'); setIsSidebar(true); }} to="currencypair">
                                        <div className="nav-link-icon"><i className="fa fa-prescription"></i></div>
                                        Currency Pair Management
                                    </Link>
                                    : null
                                }

                                {permissions.includes(10) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('BonusManagement') ? 'active' : ''}`} onClick={() => { setActived('BonusManagement'); setIsSidebar(true); }} to="BonusManagement">
                                        <div className="nav-link-icon"><i className="fa fa-prescription"></i></div>
                                        Bonus Management
                                    </Link>
                                    : null
                                }
                                {permissions.includes(11) || userType === '1' ?
                                    <>
                                        <div className={`nav-link collapsed ${(actived?.includes('fundsDManagement') || actived?.includes('FundsPendingDeposit') || actived?.includes('FundsCancelledDeposit')) ? 'active' : ''}`} data-bs-toggle="collapse" data-bs-target="#collapseFundsManagement" aria-expanded="false" aria-controls="collapseSubAdmin">
                                            <div className="nav-link-icon"><i className="fa fa-dollar-sign"></i></div>
                                            Funds Deposit Management
                                            <div className="sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </div>
                                        <div className="collapse" id="collapseFundsManagement" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">
                                                <Link className={`nav-link  ${actived?.includes('fundsDManagement') ? 'active' : ''}`} to="fundsDManagement" onClick={() => { setActived('fundsDManagement'); setIsSidebar(true); }}>Completed Deposit</Link>
                                            </nav>
                                        </div>
                                        <div className="collapse" id="collapseFundsManagement" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">
                                                <Link className={`nav-link  ${actived?.includes('FundsPendingDeposit') ? 'active' : ''}`} to="FundsPendingDeposit" onClick={() => { setActived('FundsPendingDeposit'); setIsSidebar(true); }}>Cancelled Deposit</Link>
                                            </nav>
                                        </div>
                                        {/* <div className="collapse" id="collapseFundsManagement" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">
                                                <Link className={`nav-link  ${actived?.includes('FundsCancelledDeposit') ? 'active' : ''}`} to="FundsCancelledDeposit" onClick={() => { setActived('FundsCancelledDeposit'); setIsSidebar(true); }}>Cancelled Deposit</Link>
                                            </nav>
                                        </div> */}
                                    </>
                                    : null
                                }



                                {permissions.includes(12) || userType === '1' ?
                                    <>
                                        <div className={`nav-link collapsed ${(actived?.includes('fundsManagement') || actived?.includes('FundsPendingWithdrawal') || actived?.includes('FundsCancelledWithdrawal')) ? 'active' : ''}`} data-bs-toggle="collapse" data-bs-target="#collapsefundsWithdrawal" aria-expanded="false" aria-controls="collapsefundsWithdrawal">
                                            <div className="nav-link-icon"><i className="fab fa-google-wallet"></i></div>
                                            Funds Withdrawal Management
                                            <div className="sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </div>
                                        <div className="collapse" id="collapsefundsWithdrawal" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">
                                                <Link className={`nav-link  ${actived?.includes('fundsManagement') ? 'active' : ''}`} to="fundsManagement" onClick={() => { setActived('fundsManagement'); setIsSidebar(true); }}>Completed Withdrawal</Link>

                                                <Link className={`nav-link  ${actived?.includes('FundsPendingWithdrawal') ? 'active' : ''}`} to="FundsPendingWithdrawal" onClick={() => { setActived('FundsPendingWithdrawal'); setIsSidebar(true); }}>Pending Withdrawal</Link>

                                                <Link className={`nav-link  ${actived?.includes('FundsCancelledWithdrawal') ? 'active' : ''}`} to="FundsCancelledWithdrawal" onClick={() => { setActived('FundsCancelledWithdrawal'); setIsSidebar(true); }}>Cancelled Withdrawal</Link>

                                            </nav>
                                        </div>
                                    </>
                                    : null
                                }
                                {permissions.includes(12) || userType === '1' ?
                                    <>
                                        <div className={`nav-link collapsed ${(actived?.includes('dispute_management') || actived?.includes('orderHistory') || actived?.includes('closePositions') || actived?.includes('futureTradeHistory') || actived?.includes('openPositions')) ? 'active' : ''}`} data-bs-toggle="collapse" data-bs-target="#collapseP2PManagement" aria-expanded="false" aria-controls="collapseP2PManagement">
                                            <div className="nav-link-icon"><i className="fab fa-google-wallet"></i></div>
                                            P2P Management
                                            <div className="sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </div>
                                        <div className="collapse" id="collapseP2PManagement" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">
                                                <Link className={`nav-link  ${actived?.includes('dispute_management') ? 'active' : ''}`} to="dispute_management" onClick={() => { setActived('dispute_management'); setIsSidebar(true); }}>Dispute Management</Link>

                                                <Link className={`nav-link  ${actived?.includes('orderHistory') ? 'active' : ''}`} to="orderHistory" onClick={() => { setActived('orderHistory'); setIsSidebar(true); }}>Order History</Link>

                                                <Link className={`nav-link  ${actived?.includes('openPositions') ? 'active' : ''}`} to="openPositions" onClick={() => { setActived('openPositions'); setIsSidebar(true); }}>Open Positions</Link>
                                                <Link className={`nav-link  ${actived?.includes('closePositions') ? 'active' : ''}`} to="closePositions" onClick={() => { setActived('closePositions'); setIsSidebar(true); }}>Close Positions</Link>
                                                <Link className={`nav-link  ${actived?.includes('futureTradeHistory') ? 'active' : ''}`} to="futureTradeHistory" onClick={() => { setActived('futureTradeHistory'); setIsSidebar(true); }}>Future Trade History</Link>

                                            </nav>
                                        </div>
                                    </>
                                    : null
                                }
                                {permissions.includes(13) || userType === '1' ?
                                    <>
                                        <div className={`nav-link collapsed ${(actived?.includes('TradingCommision') || actived?.includes('WithdrawalFees') || actived?.includes('CoinFee')) || actived?.includes('P2pCommission') || actived?.includes('TradingFee') ? 'active' : ''}`} data-bs-toggle="collapse" data-bs-target="#collapseTradingCommision" aria-expanded="false" aria-controls="collapseTradingCommision">
                                            <div className="nav-link-icon"><i className="fab fa-google-wallet"></i></div>
                                            Exchange Profit
                                            <div className="sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                        </div>
                                        <div className="collapse" id="collapseTradingCommision" data-bs-parent="#accordionSidenav">
                                            <nav className="sidenav-menu-nested nav">

                                                <Link className={`nav-link  ${actived?.includes('TradingCommision') ? 'active' : ''}`} to="TradingCommision" onClick={() => { setActived('TradingCommision'); setIsSidebar(true); }}>   Trading Commission</Link>

                                                <Link className={`nav-link  ${actived?.includes('WithdrawalFees') ? 'active' : ''}`} to="WithdrawalFees" onClick={() => setActived('WithdrawalFees')}> Withdrawal Fees</Link>

                                                {/* <Link className={`nav-link  ${actived?.includes('QuickBuySellCommission') ? 'active' : ''}`} to="QuickBuySellCommission" onClick={() => setActived('QuickBuySellCommission')}>Quick Buy Sell Commission</Link> */}


                                            </nav>
                                        </div>
                                    </>
                                    : null
                                }
                                {permissions.includes(14) || userType === '1' ? (
                                    <Link className={`nav-link collapsed ${actived?.includes('exchangeWalletManagement') ? 'active' : ''}`} to="exchangeWalletManagement" onClick={() => { setActived("exchangeWalletManagement"); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i className="fa fa-wallet"></i></div>
                                        Exchange Wallet Management
                                    </Link>
                                ) : null}
                                {permissions.includes(14) || userType === '1' ? (
                                    <Link className={`nav-link collapsed ${actived?.includes('AdminDebitCreditTrans') ? 'active' : ''}`} to="AdminDebitCreditTrans" onClick={() => { setActived("AdminDebitCreditTrans"); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i className="fa fa-wallet"></i></div>
                                        Admin Debit Credit Trans
                                    </Link>
                                ) : null}
                                {permissions.includes(15) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('tradingfeereport') ? 'active' : ''}`} to="tradingfeereport" onClick={() => { setActived('tradingfeereport'); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i className="fa fa-wave-square"></i></div>
                                        Market Trades
                                    </Link>
                                    : null
                                }
                                {permissions.includes(16) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('OrderBook') ? 'active' : ''}`} to="OrderBook" onClick={() => { setActived('OrderBook'); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i className="fa fa-list"></i></div>
                                        OrderBook
                                    </Link>
                                    : null
                                }

                                {permissions.includes(17) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('allOpenOrders') ? 'active' : ''}`} to="allOpenOrders" onClick={() => { setActived('allOpenOrders'); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i className="fa fa-wave-square"></i></div>
                                        All Open Orders
                                    </Link>
                                    : null
                                }
                                {permissions.includes(14) || userType === '1' ? (
                                    <Link className={`nav-link collapsed ${actived?.includes('AnnouncementDetails') ? 'active' : ''}`} to="AnnouncementDetails" onClick={() => { setActived("AnnouncementDetails"); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i className="fa fa-wallet"></i></div>
                                        Announcement Management
                                    </Link>
                                ) : null}

                                {permissions.includes(14) || userType === '1' ? (
                                    <Link className={`nav-link collapsed ${actived?.includes('GiveawayManagement') ? 'active' : ''}`} to="GiveawayManagement" onClick={() => { setActived("GiveawayManagement"); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i className="fa fa-wallet"></i></div>
                                        Giveaway Management
                                    </Link>
                                ) : null}

                                {permissions.includes(18) || userType === '1' ?

                                    <Link className={`nav-link collapsed ${actived?.includes('notification') ? 'active' : ''}`} to="notification" onClick={() => { setActived('notification'); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i className="fa fa-bell"></i></div>
                                        Notifications Management
                                    </Link>
                                    : null
                                }
                                {/* {permissions.includes(19) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('bannerManagement') ? 'active' : ''}`} to="bannerManagement" onClick={() => setActived('bannerManagement')}>
                                        <div className="nav-link-icon"><i className="fa fa-image"></i></div>
                                        Banner Management
                                    </Link>
                                    : null
                                } */}
                                {/* {permissions.includes(25) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('AnnouncementBanner') ? 'active' : ''}`} to="AnnouncementBanner" onClick={() => setActived('AnnouncementBanner')}>
                                        <div className="nav-link-icon"><i className="fa fa-image"></i></div>
                                        Announcement Banner Management
                                    </Link>
                                    : null
                                } */}
                                {/* {permissions.includes(19) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('Blog') ? 'active' : ''}`} to="Blog" onClick={() => setActived('Blog')}>
                                        <div className="nav-link-icon"><i className="fa fa-image"></i></div>
                                        Blog
                                    </Link>
                                    : null
                                } */}

                                {permissions.includes(20) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('support') ? 'active' : ''}`} to="support" onClick={() => { setActived('support'); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i class="fa fa-user"></i></div>
                                        Support
                                    </Link>
                                    : null
                                }
                                {/* {permissions.includes(20) || userType === '1' ?
                                    <Link className={`nav-link collapsed ${actived?.includes('inverstorUpdates') ? 'active' : ''}`} to="inverstorUpdates" onClick={() => { setActived('inverstorUpdates'); setIsSidebar(true); }}>
                                        <div className="nav-link-icon"><i className="fa-solid fa-bullhorn"></i></div>
                                        Announcement for Investors
                                    </Link>
                                    : null
                                }
 */}


                            </div>
                        </div>
                    </nav >
                </div >
                <Outlet />
            </div >
        </>
    )
}

export default DashboardPage;