import { ApiConfig } from "../apiConfig/ApiConfig";
import { ApiCallDelete, ApiCallPost, ApiCallPut, ApiCallGet, ApiCallPatch } from "../apiConfig/ApiCall";
import RejectedCoinList from "../../ui/pages/CoinPortalManagement/RejectedCoinList";
const TAG = "AuthService";

const AuthService = {
  login: async (email, password, verificationCode) => {
    const { baseUrl, login } = ApiConfig;
    const url = baseUrl + login;
    const params = {
      email_or_phone: email,
      password: password,
      verification_code: verificationCode,
    };

    const headers = {
      "Content-Type": "application/json",
    };
    return ApiCallPost(url, params, headers);
  },

  getOtp: async (email) => {
    const { baseAdmin, getLoginOtp } = ApiConfig;
    const url = baseAdmin + getLoginOtp;
    const params = {
      email_or_phone: email,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return ApiCallPost(url, params, headers);
  },
  updateAnnouncement: async (text, content) => {
    const Authorization = sessionStorage.getItem("token");
    const { baseAdmin, updateAnnouncement } = ApiConfig;
    const url = baseAdmin + updateAnnouncement;
    const params = {
      title: text,
      description: content
    };
    const headers = {
      Authorization: Authorization,
      "Content-Type": "application/json",
    };
    return ApiCallPost(url, params, headers);
  },

  forgotPassword: async (email, otp, password) => {
    const { baseAdmin, newPassword } = ApiConfig;
    const url = baseAdmin + newPassword;
    const params = {
      email_or_phone: email,
      verification_code: +otp,
      new_password: password,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return ApiCallPost(url, params, headers);
  },

  addTrader: async (data) => {
    const Authorization = sessionStorage.getItem("token");
    const { baseAdmin, addTrader } = ApiConfig;
    const url = baseAdmin + addTrader;

    const headers = {
      Authorization,
      "Content-Type": "application/json",
    };
    return ApiCallPost(url, data, headers);
  },

  sendOtp: async (email_or_phone, type) => {
    const { baseAdmin, sendOtp } = ApiConfig;
    const url = baseAdmin + sendOtp;

    const headers = {
      "Content-Type": "application/json",
    };
    return ApiCallPost(url, { email_or_phone, type }, headers);
  },

  placeTrade: async (data) => {
    const Authorization = sessionStorage.getItem("token");
    const { baseAdmin, placeTrade } = ApiConfig;
    const url = baseAdmin + placeTrade;

    const headers = {
      Authorization,
      "Content-Type": "application/json",
    };
    return ApiCallPost(url, data, headers);
  },

  tradesByAdmin: async (data) => {
    const Authorization = sessionStorage.getItem("token");
    const { baseAdmin, tradesByAdmin } = ApiConfig;
    const url = baseAdmin + tradesByAdmin;

    const headers = {
      Authorization,
      "Content-Type": "application/json",
    };
    return ApiCallGet(url, headers);
  },
  deleteTrade: async (id) => {
    const Authorization = sessionStorage.getItem("token");
    const { baseAdmin, deleteTrade } = ApiConfig;
    const url = baseAdmin + deleteTrade + `/${id}`;

    const headers = {
      Authorization,
      "Content-Type": "application/json",
    };
    return ApiCallDelete(url, headers);
  },

  transferCoin: async (firstCoin) => {
    const token = sessionStorage.getItem("token");
    const { baseWallet, cpbalancebycoin } = ApiConfig;
    const url = baseWallet + cpbalancebycoin;

    const params = {
      coinName: firstCoin,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getdata: async (skip, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getdata } = ApiConfig;
    const url = baseUrl + getdata
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getAnnouncementList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, getAnnouncementList } = ApiConfig;
    const url = baseAdmin + getAnnouncementList
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getNewAnnouncementList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getNewAnnouncementList } = ApiConfig;
    const url = baseUrl + getNewAnnouncementList
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  blogList: async (skip, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, blogList } = ApiConfig;
    const url = baseUrl + blogList
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  withdrawalFees: async (skip, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, withdrawalFees } = ApiConfig;
    const url = baseUrl + withdrawalFees
    const params = {
      skip, limit
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getdataverifylist: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getverifyData } = ApiConfig;
    const url = baseUrl + getverifyData
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getdatarejectedlist: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getrejectedData } = ApiConfig;
    const url = baseUrl + getrejectedData
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getkycdata: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getkycData } = ApiConfig;
    const url = baseUrl + getkycData;
    const params = {
      userId: userId,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getverifyidentity: async (id, status, rejectReason) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, verifyIdentity } = ApiConfig;
    const url = baseUrl + verifyIdentity;
    const params = {
      userId: id,
      status: status,
      adminId: "",
      kyc_reject_reason: rejectReason,
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  getrejectIdentity: async (userId, rejectReason) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, rejectIdentity } = ApiConfig;
    const url = baseSecure + rejectIdentity;

    const params = {
      userId: userId,
      reason: rejectReason,
      status: "3",
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getBannerList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, bannerList } = ApiConfig;
    const url = baseUrl + bannerList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getusers: async () => {
    const token = sessionStorage.getItem("token");

    const { baseSecure, getusers } = ApiConfig;
    const url = baseSecure + getusers;

    const params = {};
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  pendingBankDetails: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, pendingBankDetails } = ApiConfig;
    const url = baseAdmin + pendingBankDetails;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  approveBankDetails: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, approveBankDetails } = ApiConfig;
    const url = baseAdmin + approveBankDetails;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  addCurrency: async (currency_short_name, type) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, add_fiat } = ApiConfig;
    const url = baseAdmin + add_fiat;
    const params = { currency_short_name, type }

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  remove_currency: async (currency_short_name, type) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, remove_currency } = ApiConfig;
    const url = baseAdmin + remove_currency;
    const params = { currency_short_name, type }

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  rejectBankDetails: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, rejectBankDetails } = ApiConfig;
    const url = baseAdmin + rejectBankDetails;
    const params = {}
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },


  getTotaluser: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getTotaluser } = ApiConfig;
    const url = baseUrl + getTotaluser;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getTotalVerified: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getVerified } = ApiConfig;
    const url = baseUrl + getVerified;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getTotalPending: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getPending } = ApiConfig;
    const url = baseUrl + getPending;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getSupportUser: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, getSupport } = ApiConfig;
    const url = baseSecure + getSupport;
    const params = {};
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getWithdrawal: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, getwithdrawal } = ApiConfig;
    const url = baseSecure + getwithdrawal;
    const params = {};
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getNewRegistration: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, getregistration } = ApiConfig;
    const url = baseSecure + getregistration;
    const params = {};
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  allKycData: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, allkyc } = ApiConfig;
    const url = baseUrl + allkyc;
    const params = {
      userId: userId,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  coinlist: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, currencyCoinList } = ApiConfig;
    const url = baseUrl + currencyCoinList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  userBank: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, userBank } = ApiConfig;
    const url = baseUrl + userBank;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  perUserBank: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, userBank } = ApiConfig;
    const url = baseUrl + userBank + `/${userId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getCurrencyPair: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, currencyPair } = ApiConfig;
    const url = baseSecure + currencyPair;
    const params = {};
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },
  coinStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, coinStatus } = ApiConfig;
    const url = baseAdmin + coinStatus;
    const params = {
      id: id,
      status: status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },
  blogStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, blogStatus } = ApiConfig;
    const url = baseAdmin + blogStatus;
    const params = {
      _id: id,
      status: status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPut(url, params, headers);
  },
  announcementStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, announcementStatus } = ApiConfig;
    const url = baseAdmin + announcementStatus;
    const params = {
      _id: id,
      status: status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPut(url, params, headers);
  },

  getSubAdminList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getSubAdminList } = ApiConfig;
    const url = baseUrl + getSubAdminList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getCoinPackageList: async (skip, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getCoinPackageList } = ApiConfig;
    const url = `${baseUrl}${getCoinPackageList}?skip=${skip}&limit=${limit}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  approvedCoinList: async (skip, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, ApprovedCoinList } = ApiConfig;
    const url = `${baseUrl}${ApprovedCoinList}?skip=${skip}&limit=${limit}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  RejectedCoinList: async (skip, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, RejectCoinList } = ApiConfig;
    const url = `${baseUrl}${RejectCoinList}?skip=${skip}&limit=${limit}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getPartnersList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUser, getPartnersList } = ApiConfig;
    const url = baseUser + getPartnersList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getPackageList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getPackageList } = ApiConfig;
    const url = baseUrl + getPackageList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  ReferralList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, ReferralList } = ApiConfig;
    const url = baseUrl + ReferralList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  botTrades: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, botTrades } = ApiConfig;
    const url = baseUrl + botTrades;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  addBotTrade: async (trade) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, addBotTrade } = ApiConfig;
    const url = baseUrl + addBotTrade;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, trade, headers);
  },
  deleteBotTrades: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, deleteBotTrades } = ApiConfig;
    const url = baseUrl + deleteBotTrades + `/${id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallDelete(url, headers);
  },
  userSubscriptions: async (skip, limit, status) => {
    const token = sessionStorage.getItem("token");
    const { baseEarning, userSubscriptions } = ApiConfig;
    const url = `${baseEarning}${userSubscriptions}?skip=${skip}&limit=${limit}&status=${status}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  payoutList: async (skip, limit, month, year, search) => {
    const token = sessionStorage.getItem("token");
    const { baseEarning, payoutList } = ApiConfig;
    const url = `${baseEarning}${payoutList}?skip=${skip}&limit=${limit}&month=${month}&year=${year}&search=${search}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  payoutListAffiliate: async (skip, limit, month, year, search) => {
    const token = sessionStorage.getItem("token");
    const { baseAffiliate, payoutList } = ApiConfig;
    const url = `${baseAffiliate}${payoutList}?skip=${skip}&limit=${limit}&month=${month}&year=${year}&search=${search}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  allPackageList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseEarning, allPackageList } = ApiConfig;
    const url = `${baseEarning}${allPackageList}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getUplines: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseAffiliate, uplines } = ApiConfig;
    const url = `${baseAffiliate}${uplines}/${userId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getROIForDistribution: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAffiliate, getROIForDistribution } = ApiConfig;
    const url = `${baseAffiliate}${getROIForDistribution}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  addAffiliateInvestment: async (payload) => {
    const token = sessionStorage.getItem("token");
    const { baseAffiliate, investment } = ApiConfig;
    const url = `${baseAffiliate}${investment}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, payload, headers);
  },

  editAffiliateInvestment: async (payload) => {
    const token = sessionStorage.getItem("token");
    const { baseAffiliate, editinvestment } = ApiConfig;
    const url = `${baseAffiliate}${editinvestment}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, payload, headers);
  },
  updateStatusAffiliate: async (investmentId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseAffiliate, updateStatusAffiliate } = ApiConfig;
    const url = `${baseAffiliate}${updateStatusAffiliate}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, { investmentId, status }, headers);
  },

  distributePayout: async (distributions) => {
    const token = sessionStorage.getItem("token");
    const { baseEarning, distributePayout } = ApiConfig;
    const url = baseEarning + distributePayout;
    const params = { distributions }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  distributePayoutAffiliate: async (distributions) => {
    const token = sessionStorage.getItem("token");
    const { baseAffiliate, distributePayout } = ApiConfig;
    const url = baseAffiliate + distributePayout;
    const params = { distributions }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, distributions, headers);
  },


  addPackage: async (currencyId, duration_days, return_percentage_monthly, return_percentage_yearly, min_amount, max_amount) => {
    const token = sessionStorage.getItem("token");
    const { baseEarning, addPackage } = ApiConfig;
    const url = baseEarning + addPackage;
    const params = { currencyId, duration_days, return_percentage_monthly, return_percentage_yearly, min_amount, max_amount }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },


  createInvestor: async (planId, investAmount, emailId) => {
    const token = sessionStorage.getItem("token");
    const { baseEarning, createInvestor } = ApiConfig;
    const url = baseEarning + createInvestor;
    const params = { planId, investAmount, emailId }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  updatePackageStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseEarning, updatePackageStatus } = ApiConfig;
    const url = baseEarning + updatePackageStatus + `/${id}`;
    const params = { status }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  updateInvestorStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseEarning, updateInvestorStatus } = ApiConfig;
    const url = baseEarning + updateInvestorStatus + `/${id}`;
    const params = { status }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  updateInvestorRoi: async (id, data) => {
    const token = sessionStorage.getItem("token");
    const { baseEarning, updateInvestorRoi } = ApiConfig;
    const url = baseEarning + updateInvestorRoi + `/${id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, data, headers);
  },

  deletePackage: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseEarning, deletePackage } = ApiConfig;
    const url = baseEarning + deletePackage + `/${id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallDelete(url, headers);
  },

  editPackage: async (id, data) => {
    const token = sessionStorage.getItem("token");
    const { baseEarning, editPackage } = ApiConfig;
    const url = baseEarning + editPackage + `/${id}`;
    const params = data
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  getUserPackageList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getUserPackageList } = ApiConfig;
    const url = `${baseUrl + getUserPackageList}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getFundList: async (page, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getFundList } = ApiConfig;
    const url = `${baseUrl + getFundList}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getCoinListDetails: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, getCoinListDetails } = ApiConfig;
    const url = baseAdmin + getCoinListDetails;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getOrderManagement: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, getallorder } = ApiConfig;
    const url = baseSecure + getallorder;
    const params = {};
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  AddsubAdmin: async (
    firstName,
    lastName,
    signId,
    passwords,
    confirmPassword,
    multipleSelectd,
    ip
  ) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, AddsubAdmin } = ApiConfig;
    const url = baseUrl + AddsubAdmin;
    const params = {
      first_name: firstName,
      last_name: lastName,
      email_or_phone: signId,
      password: passwords,
      confirm_password: confirmPassword,
      permissions: multipleSelectd,
      admin_type: 0,
      ip
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  AddNewCoin: async (packageName, packagePrice, duration, description,) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, AddNewCoin } = ApiConfig;
    const url = baseUrl + AddNewCoin;
    const params = {
      packageName,
      packagePrice: Number(packagePrice),
      duration: Number(duration),
      description,

    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  addNotify: async (notificationTitle, notification, notificationType) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, addNotify } = ApiConfig;
    const url = baseUrl + addNotify;
    const params = {
      title: notificationTitle,
      message: notification,
      type: notificationType,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  createBotPackage: async (name, price, minTradeLimit, maxTradeLimit, monthlyReturnMin, monthlyReturnMax, validityDays, lockDays,) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, createBotPackage } = ApiConfig;
    const url = baseUrl + createBotPackage;
    const params = {
      name: name,
      price: price,
      minTradeLimit: minTradeLimit,
      maxTradeLimit: maxTradeLimit,
      monthlyReturnMin: monthlyReturnMin,
      monthlyReturnMax: monthlyReturnMax,
      validityDays: validityDays,
      lockDays: lockDays,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  buyArbitrageBot: async (planId, userId, subscriptionDate) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, buyArbitrageBot } = ApiConfig;
    const url = baseUrl + buyArbitrageBot;
    const params = {
      planId, userId, subscriptionDate
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  deleteNotify: async (notificationId) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, deleteNotify } = ApiConfig;
    const url = `${baseNotification + deleteNotify}/${notificationId}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  DeleteAnnouncement: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, DeleteAnnouncement } = ApiConfig;
    const url = `${baseUrl + DeleteAnnouncement}/${id}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  bannerDelete: async (bannerId) => {
    const token = sessionStorage.getItem("token");
    const { baseBanner, bannerDelete } = ApiConfig;
    const url = `${baseBanner + bannerDelete}/${bannerId}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  updateNotificationStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, updateNotificationStatus } = ApiConfig;
    const url = baseNotification + updateNotificationStatus;
    const params = {
      id: id,
      isActive: status,
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  updateAnnouncementStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateAnnouncementStatus } = ApiConfig;
    const url = baseUrl + updateAnnouncementStatus;
    const params = {
      id: id,
      status: status,
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  updateBannerStatus: async (bannerId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseBanner, updateBannerStatus } = ApiConfig;
    const url = baseBanner + updateBannerStatus;
    const params = {
      bannerId: bannerId,
      status: status,
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  updateBankStatus: async (bankId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateBankStatus } = ApiConfig;
    const url = baseUrl + updateBankStatus;
    const params = {
      _id: bankId,
      status: status,
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  updateSubadminList: async (firstName, lastName, email, subadminId, multipleSelectd, adminType) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateSubadmin } = ApiConfig;
    const url = baseUrl + updateSubadmin;
    const params = {
      first_name: firstName,
      last_name: lastName,
      email_or_phone: email,
      id: subadminId,
      permissions: multipleSelectd,
      admin_type: adminType,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  AddTrade: async (firstName, lastName, gender, number, email, address) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, AddTrade } = ApiConfig;
    const url = baseSecure + AddTrade;
    const params = {
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      mobileNumber: number,
      emailId: email,
      line1: address,
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  deleteSubAdminList: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, subadmindelete } = ApiConfig;
    const url = baseUrl + subadmindelete;
    const params = {
      _id: userId,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  cancelOrder: async (orderID, userID) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, cancelOrder } = ApiConfig;
    const url = baseUrl + cancelOrder;
    const params = {
      order_id: orderID,
      userId: userID,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  handleSubadminStatus: async (Id, userId, status) => {
    const token = sessionStorage.getItem("token");

    const { baseSecure, adminsupport } = ApiConfig;
    const url = baseSecure + adminsupport;
    const params = {
      _id: Id,
      userId: userId,
      status: status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  handleTradeStatus: async (userId, cell) => {
    const token = sessionStorage.getItem("token");

    const { baseSecure, tradeStatus } = ApiConfig;
    const url = baseSecure + tradeStatus;
    const params = {
      _id: userId,
      status: cell,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getNotificationList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, notificationList } = ApiConfig;
    const url = baseNotification + notificationList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getAnnouncementCategoryList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getAnnouncementCategoryList } = ApiConfig;
    const url = baseUrl + getAnnouncementCategoryList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  completeDetailsUser: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, completeDetailsUser } = ApiConfig;
    const url = baseUrl + completeDetailsUser + `/${userId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  IssueList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, helplist } = ApiConfig;
    const url = baseSecure + helplist;
    const params = {};
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  getFiatWithdraw: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getInrWithrawList } = ApiConfig;
    const url = baseUrl + getInrWithrawList;
    const params = {};

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getFiatDeposit: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, inrdepositreq } = ApiConfig;
    const url = baseUrl + inrdepositreq;
    const params = {};

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },





  fundTransfer: async (tokenName, chain, receiver, amount, email) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, fund_transfer } = ApiConfig;
    const url = baseUrl + fund_transfer;
    const params = {
      tokenName: tokenName,
      chain: chain,
      receiver: receiver,
      amount: amount,
      email: email
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  handleFundDenied: async (id, status, Hash, adminId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, transactionstatus } = ApiConfig;
    const url = baseUrl + transactionstatus;
    const params = {
      _id: id,
      status: status,
      transaction_hash: Hash,
      adminId: adminId
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  handleFundApprove: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, transactionstatus } = ApiConfig;
    const url = baseSecure + transactionstatus;
    const params = {
      _id: id,
      status: "approve",
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  handleFiatApprove: async (id, userId) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, userreqapprove } = ApiConfig;
    const url = baseSecure + userreqapprove;
    const params = {
      transId: id,
      userId: userId,
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  handleFiatDenied: async (id, userId) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, userreqreject } = ApiConfig;
    const url = baseSecure + userreqreject;
    const params = {
      transId: id,
      userId: userId,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  // handleFiatDApprove: async (id, userId) => {
  //   const token = sessionStorage.getItem("token");
  //   const { baseUrl, confirmInrDeposit } = ApiConfig;
  //   const url = baseUrl + confirmInrDeposit;
  //   const params = {
  //     _id: id,
  //     status: "APPROVE",
  //   };
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: token,
  //   };
  //   return ApiCallPost(url, params, headers);
  // },

  // handleFiatDrejected: async (id, userId) => {
  //   const token = sessionStorage.getItem("token");
  //   const { baseUrl, rejectInrDeposit } = ApiConfig;
  //   const url = baseUrl + rejectInrDeposit;
  //   const params = {
  //     _id: id,
  //     status: "CANCELLED",
  //   };
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: token,
  //   };
  //   return ApiCallPost(url, params, headers);
  // },

  addAdTicket: async (message, userId, id) => {
    const token = sessionStorage.getItem("token");
    const { baseHelp, addAdTicket } = ApiConfig;
    const url = baseHelp + addAdTicket;

    const params = {
      query: message,
      clientId: userId,
      ticketId: id,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  ticketList: async (userId, id) => {
    const token = sessionStorage.getItem("token");
    const { baseHelp, ticketList } = ApiConfig;
    const url = baseHelp + ticketList;

    const params = {
      userId: userId,
      id: id,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  sendUsersMail: async (userId, sendMail) => {
    const token = sessionStorage.getItem("token");
    const { baseData, sendmailtouser } = ApiConfig;
    const url = baseData + sendmailtouser;

    const params = {
      userId: userId,
      message: sendMail,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  uploadDocument: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseData, documentchange } = ApiConfig;
    const url = baseData + documentchange;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };
    return ApiCallPost(url, formData, headers);
  },
  createLaunchpad: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, createLaunchpad } = ApiConfig;
    const url = baseUrl + createLaunchpad;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };
    return ApiCallPost(url, formData, headers);
  },


  announcementBanner: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseBanner, announcementBanner } = ApiConfig;
    const url = baseBanner + announcementBanner;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };
    return ApiCallPost(url, formData, headers);
  },

  transferhistory: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, transferhistory } = ApiConfig;
    const url = baseUrl + transferhistory;
    const params = {
      userId: id,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  userWallet: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, userWallet } = ApiConfig;
    const url = baseUrl + userWallet;
    const params = {
      userId: id,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  handleSubadminStatus2: async (userId, cell) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, SubadminStatus } = ApiConfig;
    const url = baseUrl + SubadminStatus;
    const params = {
      _id: userId,
      status: cell,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },
  createCategory: async (name) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, createCategory } = ApiConfig;
    const url = baseUrl + createCategory;
    const params = {
      name: name
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getTotalRegistrations: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, todayNewRegistrations } = ApiConfig;
    const url = baseUrl + todayNewRegistrations;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getLplist: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getLplist } = ApiConfig;
    const url = baseUrl + getLplist;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getUpcominglpList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getUpcominglpList } = ApiConfig;
    const url = baseUrl + getUpcominglpList;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getCancelList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getCancelList } = ApiConfig;
    const url = baseUrl + getCancelList;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getLiveList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getLiveList } = ApiConfig;
    const url = baseUrl + getLiveList;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getGiveawayList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getGiveawayList } = ApiConfig;
    const url = baseUrl + getGiveawayList;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getEndedList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getEndedList } = ApiConfig;
    const url = baseUrl + getEndedList;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  getAnnouncementBannerList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseBanner, getBannerList } = ApiConfig;
    const url = baseBanner + getBannerList;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  PartnersStatus: async (userId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, PartnersStatus } = ApiConfig;
    const url = baseUrl + PartnersStatus;
    const params = {
      partner_id: userId,
      admin_apporval: status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  UpdateUpcomingStatus: async (userId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, UpdateUpcomingStatus } = ApiConfig;
    const url = baseUrl + UpdateUpcomingStatus;
    const params = {
      id: userId,
      status: status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  packageStatus: async (userId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, packageStatus } = ApiConfig;
    const url = baseUrl + packageStatus;
    const params = {
      packageId: userId,
      status: status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  OpenOrderStatus: async (id, user_id) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, OpenOrderStatus } = ApiConfig;
    const url = baseAdmin + OpenOrderStatus;
    const params = {
      order_id: id,
      userId: user_id
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  CoinDetailsStatus: async (userId, cell) => {
    const token = sessionStorage.getItem("token");
    const { baseUser, CoinDetailsStatus } = ApiConfig;
    const url = baseUser + CoinDetailsStatus;
    const params = {
      _id: userId,
      status: cell,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  coinTransfer: async () => {
    const token = sessionStorage.getItem("token");
    const { baseWallet, getcpcoinbalance } = ApiConfig;
    const url = baseWallet + getcpcoinbalance;

    const params = {};

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getTodayRegestration: async () => {
    const token = sessionStorage.getItem("token");

    const { baseSecure, getregistration } = ApiConfig;
    const url = baseSecure + getregistration;

    const params = {};
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getTodayDeposit: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, depositrequest } = ApiConfig;
    const url = baseSecure + depositrequest;
    const params = {};

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getTodayWithdraw: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, withdrawlrequest } = ApiConfig;
    const url = baseSecure + withdrawlrequest;
    const params = {};

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getToalDeposit: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, totaldepositrequest } = ApiConfig;
    const url = baseSecure + totaldepositrequest
    const params = {};

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getToalWithdraw: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, totalwithdrawlrequest } = ApiConfig;
    const url = baseSecure + totalwithdrawlrequest;
    const params = {};

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getChangeScreen: async (userId, id) => {
    const token = sessionStorage.getItem("token");
    const { baseHelp, changeseen } = ApiConfig;
    const url = baseHelp + changeseen;

    const params = {
      clientId: userId,
      chatId: id,
      status: 2,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  // getCoinList: async () => {
  //   const { baseUrl, currencyCoinList } = ApiConfig;
  //   const url = baseUrl + currencyCoinList;
  //   const params = {};
  //   const headers = {
  //     "Content-Type": "application/json",
  //   };

  //   return ApiCallGet(url, headers);
  // },

  getwalletCoinList: async (user_Id) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, walletCoinList } = ApiConfig;
    const url = baseSecure + walletCoinList;
    const params = {
      userId: user_Id,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  getAdmincoinaddress: async (coinName, user_Id) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, admincoinaddress } = ApiConfig;
    const url = baseSecure + admincoinaddress;
    const params = {
      type: coinName,
      userId: user_Id,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  addBankAccount: async (accNumber, bankName, branchName, holderName, id, ifsc) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, addBankAcc } = ApiConfig;
    const url = baseUrl + addBankAcc;
    const params = {
      account_number: accNumber,
      bank_name: bankName,
      branch: branchName,
      holder_name: holderName,
      _id: id,
      ifsc: ifsc,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  getReceives: async (user_Id) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, getreceive } = ApiConfig;
    const url = baseSecure + getreceive;
    const params = {
      userId: user_Id,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  getAccDetails: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getAccDetails } = ApiConfig;
    const url = baseUrl + getAccDetails;
    const params = {};
    const headers = {
      Authorization: token,
      "Content-Type": "application/json",
    };

    return ApiCallGet(url, params, headers);
  },

  addCoinWidthraw: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, setcoinwithdrawal } = ApiConfig;
    const url = baseUrl + setcoinwithdrawal;

    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: token,
    };

    return ApiCallPut(url, formData, headers);
  },
  CoinCategory: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, CoinCategory } = ApiConfig;
    const url = baseUrl + CoinCategory;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallGet(url, headers);
  },
  tradingCommission: async (skip, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, tradingCommission } = ApiConfig;
    const url = baseUrl + tradingCommission;

    const params = {
      skip: skip,
      limit: limit
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },


  coinPaymentDetails: async () => {
    const token = sessionStorage.getItem("token");
    const { baseWallet, getcpaccountinfo } = ApiConfig;
    const url = baseWallet + getcpaccountinfo;

    const params = {};
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  AddCoinPair: async (fShortName, fId, sShortName, sId, sellPrice, buyPrice, available) => {
    const token = sessionStorage.getItem("token");
    const { baseCoin, AddCoinPair } = ApiConfig;
    const url = baseCoin + AddCoinPair;
    const params = {
      base_currency: fShortName,
      quote_currency: sShortName,
      base_currency_id: fId,
      quote_currency_id: sId,
      buy_price: buyPrice,
      sell_price: sellPrice,
      available: available
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  AddPairFee: async (makerFee, takerFee, currencyID) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, AddPairFee } = ApiConfig;

    const url = baseSecure + AddPairFee;

    const params = {
      maker_fee: makerFee,
      taker_fee: takerFee,
      _id: currencyID,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  getCurrencyPairList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, getCurrencyPairList } = ApiConfig;
    const url = baseAdmin + getCurrencyPairList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallGet(url, headers);
  },

  deleteCurrency: async (_id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, deleteCoinPair } = ApiConfig;
    const url = baseSecure + deleteCoinPair;
    const params = {
      _id: _id,
      status: status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  botStatus: async (_id, status, gap) => {
    const token = sessionStorage.getItem("token");
    const { baseCoins, botStatus } = ApiConfig;
    const url = baseCoins + botStatus;
    const params = {
      ids: [_id],
      status: status,
      gap: gap,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getTradingReport: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, tredingReport } = ApiConfig;
    const url = baseUrl + tredingReport;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  tradeHistory: async (skip, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, tradeHistory } = ApiConfig;

    const url = baseUrl + tradeHistory;
    const params = {
      skip: skip,
      limit: limit
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  OrderBook: async (skip, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseExchange, OrderBook } = ApiConfig;
    const url = baseExchange + OrderBook;
    const params = {
      skip: skip,
      limit: limit
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  OpenOrder: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, OpenOrders } = ApiConfig;
    const url = baseUrl + OpenOrders
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  tradeById: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseExchange, tradeById } = ApiConfig;

    const url = baseExchange + tradeById;
    const params = {
      "order_id": id
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getWithdrawalStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseCoin, sendFundStatus } = ApiConfig;

    const url = baseCoin + sendFundStatus;

    const params = {
      _Id: id,
      status: status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  completeWithdrawalRequest: async (skip, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, completeWithdrawalRequest } = ApiConfig;
    const url = baseUrl + completeWithdrawalRequest
    const params = {
      skip, limit
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  PendingWithdrwal: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, PendingWithdrwal } = ApiConfig;
    const url = baseUrl + PendingWithdrwal
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  CancelledWithdrwal: async (skip, limit) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, CancelledWithdrwal } = ApiConfig;
    const url = baseUrl + CancelledWithdrwal;
    const params = {
      skip, limit
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  cvbot_complete_deposit_request: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, cvbot_complete_deposit_request } = ApiConfig;
    const url = baseUrl + cvbot_complete_deposit_request
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallGet(url, headers);
  },


  completeDepositRequest: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, completeDepositRequest } = ApiConfig;
    const url = baseUrl + completeDepositRequest
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallGet(url, headers);
  },

  completeBonusRequest: async () => {
    const token = sessionStorage.getItem("token");
    const { baseTran, completeBonusRequest } = ApiConfig;
    const url = baseTran + completeBonusRequest
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallGet(url, headers);
  },


  cancelled_deposit_request: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, cancelled_deposit_request } = ApiConfig;
    const url = baseUrl + cancelled_deposit_request
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallGet(url, headers);
  },

  updateDepositRequest: async (transId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateDepositRequest } = ApiConfig;

    const url = baseUrl + updateDepositRequest;

    const params = {
      transId, status
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },
  completePendingRequest: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, completePendingRequest } = ApiConfig;

    const url = baseUrl + completePendingRequest


    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallGet(url, headers);
  },
  miscellaneousRequest: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, miscellaneousRequest } = ApiConfig;

    const url = baseUrl + miscellaneousRequest;


    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallGet(url, headers);
  },

  getUserWalletList: async (coinName, selectedWallet) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getUserWalletList } = ApiConfig;

    const url = baseUrl + getUserWalletList;

    const params = {
      coinName: coinName,
      walleType: selectedWallet
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },


  fundsTransfer: async (coinId, userId, amount, type, accType, selectedChain, adminId, selectedWallet, description) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, fundsTransfer } = ApiConfig;

    const url = baseUrl + fundsTransfer;

    const params = {
      userId: userId,
      coinId: coinId,
      type: type,
      amount: amount,
      account_type: accType,
      chain: selectedChain,
      wallet_type: selectedWallet,
      adminId,
      description
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },
  MasterAccount: async (userId, makerFee, takerFee, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, MasterAccount } = ApiConfig;
    const url = baseUrl + MasterAccount;
    const params = {
      userId: userId,
      maker_fee: makerFee,
      taker_fee: takerFee,
      status: status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  userWalletTransfer: async (coinId, user_Id, sendWalletTo, amount, otp) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, userWalletTransfer } = ApiConfig;
    const url = baseSecure + userWalletTransfer;

    const params = {
      userId: user_Id,
      coinId: coinId,
      to_address: sendWalletTo,
      amount: +amount,
      otp: +otp,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  walletTransfer: async (coinId, user_Id, walletTo, requestOtp, amount) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, walletTransfer } = ApiConfig;
    const url = baseSecure + walletTransfer;

    const params = {
      userId: user_Id,
      coinId: coinId,
      to_address: walletTo,
      amount: +amount,
      otp: +requestOtp,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  // AddrewarRate: async (reward) => {
  //   const token = sessionStorage.getItem("token");

  //   const { baseUrl, setrewardrate } = ApiConfig;
  //   const url = baseUrl + setrewardrate;
  //   const params = {
  //     amount: reward,
  //   };
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: token,
  //   };
  //   return ApiCallPost(url, params, headers);
  // },

  // AddtdsRate: async (tdsRate) => {
  //   const token = sessionStorage.getItem("token");

  //   const { baseSecure, updatetdsrate } = ApiConfig;
  //   const url = baseSecure + updatetdsrate;
  //   const params = {
  //     rate: tdsRate,
  //   };
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: token,
  //   };
  //   return ApiCallPost(url, params, headers);
  // },

  updateEmailTamplate: async (emailSubject, key, template) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, updatemailTamplate } = ApiConfig;
    const url = baseSecure + updatemailTamplate;
    const params = {
      emailSubject: emailSubject,
      key: key,
      template: template,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getUserList: async (skip, limit, search, kycType) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, tradersList } = ApiConfig;
    const url = baseUrl + tradersList + `?skip=${skip}&limit=${limit}&email=${search}&kycStatus=${kycType}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getstats: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, stats } = ApiConfig;
    const url = baseUrl + stats;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getaffiliateList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAffiliate, tradersList } = ApiConfig;
    const url = baseAffiliate + tradersList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  updateStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateStatus } = ApiConfig;
    const url = baseUrl + updateStatus;
    const params = {
      _id: id,
      status
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },
  updateGiveawayStatus: async (giveawayId, userId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateGiveawayStatus } = ApiConfig;
    const url = baseUrl + updateGiveawayStatus;
    const params = {
      giveawayId: giveawayId,
      userId: userId,
      status: status
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  updateAffiliateStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseAffiliate, updateStatus } = ApiConfig;
    const url = baseAffiliate + updateStatus;
    const params = {
      userId: id,
      status
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  getCoinList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getCoinList } = ApiConfig;
    const url = baseUrl + getCoinList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  debit_credit_transaction: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, debit_credit_transaction } = ApiConfig;
    const url = baseUrl + debit_credit_transaction;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  verifyBankDetails: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, verifyBankDetails } = ApiConfig;
    const url = baseUrl + verifyBankDetails;
    const params = {
      _id: id,
      status: +status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  approveUPIDetails: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, approveUPIDetails } = ApiConfig;
    const url = baseAdmin + approveUPIDetails;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },


  pendingUPIDetails: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, pendingUPIDetails } = ApiConfig;
    const url = baseAdmin + pendingUPIDetails;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  partnerWithdrawalRequests: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, partnerWithdrawalRequests } = ApiConfig;
    const url = baseAdmin + partnerWithdrawalRequests;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  partner_update_withdrawal_status: async (_id, status, transaction_hash) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, partner_update_withdrawal_status } = ApiConfig;
    const url = baseAdmin + partner_update_withdrawal_status;
    const params = {
      _id, status, transaction_hash
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  createPartner: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, createPartner } = ApiConfig;
    const url = baseAdmin + createPartner;

    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };
    return ApiCallPost(url, formData, headers);
  },


  partner_deposit_payouts_list: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, partner_deposit_payouts_list } = ApiConfig;
    const url = baseUrl + partner_deposit_payouts_list;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  partner_monthly_payouts_list: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, partner_monthly_payouts_list } = ApiConfig;
    const url = baseUrl + partner_monthly_payouts_list;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  verifyUPIDetails: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, verifyUPIDetails } = ApiConfig;
    const url = baseUrl + verifyUPIDetails;
    const params = {
      _id: id,
      status: +status,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },


  rejectUPIDetails: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, rejectUPIDetails } = ApiConfig;
    const url = baseAdmin + rejectUPIDetails;

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },


  exportPandingList: async (dateFrom, dateTo) => {
    const token = sessionStorage.getItem("token");
    const { baseReport, pendingtrader } = ApiConfig;
    const url = baseReport + pendingtrader;
    const params = {
      fromDate: dateFrom,
      toDate: dateTo,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  exportFiatManagement: async (dateFrom, dateTo) => {
    const token = sessionStorage.getItem("token");
    const { baseReport, fiatwithreq } = ApiConfig;
    const url = baseReport + fiatwithreq;
    const params = {
      fromDate: dateFrom,
      toDate: dateTo,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  exportApprovedList: async (dateFrom, dateTo) => {
    const token = sessionStorage.getItem("token");
    const { baseReport, verifiedtrader } = ApiConfig;
    const url = baseReport + verifiedtrader;
    const params = {
      fromDate: dateFrom,
      toDate: dateTo,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  sendNotificationToUser: async (userId, title, message, link) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, singalUser } = ApiConfig;
    const url = baseNotification + singalUser;
    const params = {
      userId: userId,
      title: title,
      message: message,
      link: link
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  sendBulkNotification: async (userId, title, message, link) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, sendBulkNotification } = ApiConfig;
    const url = baseNotification + sendBulkNotification;
    const params = {
      "userIds": userId,
      title: title,
      message: message,
      link: link
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  sendAllNotification: async (title, message, link) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, sendToAll } = ApiConfig;
    const url = baseNotification + sendToAll;
    const params = {
      title: title,
      message: message,
      link: link
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  createAnnouncement: async (title, description, categoryId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, createAnnouncement } = ApiConfig;
    const url = baseUrl + createAnnouncement;
    const params = {
      title: title,
      description: description,
      announcementCategoryId: categoryId,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },
  userFind: async (userId) => {
    const token = sessionStorage.getItem("token");
    const { baseNotification, userFind } = ApiConfig;
    const url = baseNotification + userFind;
    const params = {
      emailId: userId,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  exportFiatDeposit: async (dateFrom, dateTo) => {
    const token = sessionStorage.getItem("token");
    const { baseReport, fiatdepreq } = ApiConfig;
    const url = baseReport + fiatdepreq;
    const params = {
      fromDate: dateFrom,
      toDate: dateTo,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  addCoins: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseCoin, addNewCoins } = ApiConfig;

    const url = baseCoin + addNewCoins;

    const params = {
    };
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };

    return ApiCallPost(url, formData, headers);
  },

  getMasterWalletList: async (user_Id) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, getMasterWalletList } = ApiConfig;

    const url = baseSecure + getMasterWalletList;

    const params = {
      userId: user_Id,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  walletStatus: async (_id, withdrawalstatus) => {
    const token = sessionStorage.getItem("token");
    const { baseSecure, walletStatus } = ApiConfig;

    const url = baseSecure + walletStatus;

    const params = {
      userId: _id,
      status: withdrawalstatus,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  getstakingDetails: async () => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, stakingList } = ApiConfig;
    const url = baseUrl + stakingList;
    const params = {}
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  AddBanner: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, Addbanner } = ApiConfig;
    const url = baseUrl + Addbanner;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };

    return ApiCallPost(url, formData, headers);
  },

  addBlog: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, addBlog } = ApiConfig;
    const url = baseAdmin + addBlog;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };

    return ApiCallPost(url, formData, headers);
  },


  updateBannerList: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, updateBanner } = ApiConfig;
    const url = baseUrl + updateBanner;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };

    return ApiCallPut(url, formData, headers);
  },

  deletebannerlist: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, bannerdelete } = ApiConfig;
    const url = baseUrl + bannerdelete + `${id}`;
    const params = {}
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallDelete(url, params, headers);
  },
  packageDelete: async (packageId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, packageDelete } = ApiConfig;
    const url = baseUrl + packageDelete + `${packageId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  deleteBlog: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, deleteBlog } = ApiConfig;
    const url = `${baseAdmin.replace(/\/$/, '')}/${deleteBlog.replace(/^\//, '')}/${id}`;
    const params = {}
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallDelete(url, params, headers);
  },
  deleteAnnouncement: async (id) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, deleteAnnouncement } = ApiConfig;
    const url = `${baseAdmin.replace(/\/$/, '')}/${deleteAnnouncement.replace(/^\//, '')}/${id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallDelete(url, headers);
  },


  handleBannerStatus: async (userId, cell) => {
    const token = sessionStorage.getItem("token");

    const { baseUrl, BannerStatus } = ApiConfig;
    const url = baseUrl + BannerStatus;
    const params = {
      _id: userId,
      status: cell,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, params, headers);
  },

  getUpiOtp: async (signId) => {
    const token = sessionStorage.getItem("token");
    const { baseUrl, getOtp } = ApiConfig;
    const url = baseUrl + getOtp;

    const params = {
      signId: signId,
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, params, headers);
  },

  qbshistory: async () => {
    const token = sessionStorage.getItem("token")
    const { baseUrl, qbshistory } = ApiConfig;
    const url = baseUrl + qbshistory;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallGet(url, headers);
  },

  getMyActivityLogs: async (startIndex, endIndex) => {
    const token = sessionStorage.getItem("token")
    const { baseUrl, getMyLogs } = ApiConfig;
    const url = baseUrl + getMyLogs + `?skip=${startIndex}&limit=${endIndex}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallGet(url, headers);
  },

  getFiatAccounts: async (startIndex, endIndex) => {
    const token = sessionStorage.getItem("token")
    const { baseUrl, getFiatAccounts } = ApiConfig;
    const url = baseUrl + getFiatAccounts;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallGet(url, headers);
  },

  updateFiatAccounts: async (data) => {
    const token = sessionStorage.getItem("token")
    const { baseUrl, updateFiatAccounts } = ApiConfig;
    const url = baseUrl + updateFiatAccounts;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPut(url, data, headers);
  },

  updateAllowedFiat: async (data) => {
    const token = sessionStorage.getItem("token")
    const { baseUrl, updateAllowedFiat } = ApiConfig;
    const url = baseUrl + updateAllowedFiat;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, data, headers);
  },

  mapReferral: async (data) => {
    const token = sessionStorage.getItem("token")
    const { baseUrl, mapReferral } = ApiConfig;
    const url = baseUrl + mapReferral;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, data, headers);
  },

  unmapReferral: async (data) => {
    const token = sessionStorage.getItem("token")
    const { baseUrl, UnmapReferral } = ApiConfig;
    const url = baseUrl + UnmapReferral;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };

    return ApiCallPost(url, data, headers);
  },

  getUserWallet: async () => {
    const token = sessionStorage.getItem("token")
    const { baseUrl, user_walletdd } = ApiConfig;
    const url = baseUrl + user_walletdd;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  updateTicketStatus: async (id, status) => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, updateTicketStatus } = ApiConfig;
    const url = baseSupport + updateTicketStatus;
    const params = {
      status: status,
      ticket_id: id,
    };
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  p2pCoinList: async () => {
    const token = sessionStorage.getItem('token');
    const { baseCoin, p2pCoinList } = ApiConfig;
    const url = baseCoin + p2pCoinList;
    const headers = {
      'Content-Type': 'application/json',
      "Authorization": token,
    };
    return ApiCallGet(url, headers);
  },

  fiatCurrencyList: async () => {
    const token = sessionStorage.getItem('token');
    const { baseP2P, fiatCurrencyList } = ApiConfig;
    const url = baseP2P + fiatCurrencyList;
    const headers = {
      'Content-Type': 'application/json',
      "Authorization": token,
    };
    return ApiCallGet(url, headers);
  },

  all_p2p_orders: async () => {
    const token = sessionStorage.getItem('token');
    const { baseP2P, all_p2p_orders } = ApiConfig;
    const url = baseP2P + all_p2p_orders;
    const headers = {
      'Content-Type': 'application/json',
      "Authorization": token,
    };
    return ApiCallGet(url, headers);
  },

  getAllTickets: async () => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, getAllTickets } = ApiConfig;
    const url = baseSupport + getAllTickets;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getbalanceNativeBNB: async () => {
    const token = sessionStorage.getItem("token");
    const { baseBalance, getbalanceNativeBNB } = ApiConfig;
    const url = baseBalance + getbalanceNativeBNB;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  TronNativeBalance: async () => {
    const token = sessionStorage.getItem("token");
    const { baseBalance, TronNativeBalance } = ApiConfig;
    const url = baseBalance + TronNativeBalance;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  getbalanceNativeETH: async () => {
    const token = sessionStorage.getItem("token");
    const { baseBalance, getbalanceNativeETH } = ApiConfig;
    const url = baseBalance + getbalanceNativeETH;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },


  replyTicket: async (messagerply, id) => {
    const token = sessionStorage.getItem("token");
    const { baseSupport, replyTicket } = ApiConfig;
    const url = baseSupport + replyTicket;
    const params = {
      replyBy: 0,
      query: messagerply,
      ticket_id: id,
    };
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  orderDetails: async (orderId) => {
    const token = sessionStorage.getItem('token');
    const { baseP2P, orderDetails } = ApiConfig;
    const url = baseP2P + orderDetails;
    const params = {
      order_id: orderId
    };
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  handleDispute: async (orderId) => {
    const token = sessionStorage.getItem('token');
    const { baseP2P, orderDispute } = ApiConfig;
    const url = baseP2P + orderDispute;
    const params = {
      order_id: orderId
    };
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  statusToSettle: async (orderId) => {
    const token = sessionStorage.getItem('token');
    const { baseP2P, statusToSettle } = ApiConfig;
    const url = baseP2P + statusToSettle;
    const params = {
      order_id: orderId
    };
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getReferredUserData: async (code) => {
    // const token = sessionStorage.getItem('token');
    const url = `https://webcvtoken.lunaplus.in/tokenPrice.php?user_id=${code}`
    const headers = {
      "Content-Type": "application/json",
      // Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  futureOpenOrders: async () => {
    const token = sessionStorage.getItem("token");
    const { baseFutures, futureOpenOrders } = ApiConfig;
    const url = baseFutures + futureOpenOrders;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  futureOrderHistory: async () => {
    const token = sessionStorage.getItem("token");
    const { baseFutures, futureOrderHistory } = ApiConfig;
    const url = baseFutures + futureOrderHistory;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  futureOpenPositions: async () => {
    const token = sessionStorage.getItem("token");
    const { baseFutures, futureOpenPositions } = ApiConfig;
    const url = baseFutures + futureOpenPositions;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  futurePositionHistory: async () => {
    const token = sessionStorage.getItem("token");
    const { baseFutures, futurePositionHistory } = ApiConfig;
    const url = baseFutures + futurePositionHistory;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },
  futureTradeHistory: async () => {
    const token = sessionStorage.getItem("token");
    const { baseFutures, futureTradeHistory } = ApiConfig;
    const url = baseFutures + futureTradeHistory;
    const headers = {
      "content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  // =====================================================================
  // 💰 P2P FIAT CURRENCY MANAGEMENT APIs
  // =====================================================================
  p2pCreateFiat: async (data) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pCreateFiat } = ApiConfig;
    const url = baseAdmin + p2pCreateFiat;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, data, headers);
  },

  p2pUpdateFiat: async (fiatId, data) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pUpdateFiat } = ApiConfig;
    const url = baseAdmin + p2pUpdateFiat + `/${fiatId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPut(url, data, headers);
  },

  p2pUpdateFiatStatus: async (fiatId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pUpdateFiatStatus } = ApiConfig;
    const url = baseAdmin + p2pUpdateFiatStatus + `/${fiatId}/status`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPatch(url, { status }, headers);
  },

  p2pDeleteFiat: async (fiatId) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pDeleteFiat } = ApiConfig;
    const url = baseAdmin + p2pDeleteFiat + `/${fiatId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallDelete(url, headers);
  },

  p2pGetFiatList: async (params = {}) => {
    const token = sessionStorage.getItem("token");
    const { baseP2P, p2pFiatList } = ApiConfig;
    const queryString = new URLSearchParams(params).toString();
    const url = baseP2P + p2pFiatList + (queryString ? `?${queryString}` : "");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  // =====================================================================
  // 📋 P2P ADS MANAGEMENT APIs
  // =====================================================================
  p2pGetAdsList: async (params = {}) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pAdsList } = ApiConfig;
    const queryString = new URLSearchParams(params).toString();
    const url = baseAdmin + p2pAdsList + (queryString ? `?${queryString}` : "");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  p2pGetAdDetails: async (adId) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pAdDetails } = ApiConfig;
    const url = baseAdmin + p2pAdDetails + `/${adId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  // =====================================================================
  // 📋 P2P ORDERS MANAGEMENT APIs
  // =====================================================================
  p2pGetOrdersList: async (params = {}) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pOrdersList } = ApiConfig;
    const queryString = new URLSearchParams(params).toString();
    const url = baseAdmin + p2pOrdersList + (queryString ? `?${queryString}` : "");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  p2pGetOrderDetails: async (orderId) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pOrderDetails } = ApiConfig;
    const url = baseAdmin + p2pOrderDetails + `/${orderId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  // =====================================================================
  // 📋 USER PAYMENT METHODS APIs
  // =====================================================================
  p2pGetUserPaymentMethods: async (userId, params = {}) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pUserPaymentMethods } = ApiConfig;
    const queryString = new URLSearchParams(params).toString();
    const url = baseAdmin + p2pUserPaymentMethods + `/${userId}/payment-methods` + (queryString ? `?${queryString}` : "");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  // =====================================================================
  // ⚖️ DISPUTE MANAGEMENT APIs
  // =====================================================================
  p2pGetDisputesList: async (params = {}) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pDisputesList } = ApiConfig;
    const queryString = new URLSearchParams(params).toString();
    const url = baseAdmin + p2pDisputesList + (queryString ? `?${queryString}` : "");
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  p2pGetDisputeDetails: async (orderId) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pDisputeDetails } = ApiConfig;
    const url = baseAdmin + p2pDisputeDetails + `/${orderId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  p2pResolveDispute: async (orderId, data) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pResolveDispute } = ApiConfig;
    const url = baseAdmin + p2pResolveDispute + `/${orderId}/resolve`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, data, headers);
  },

  p2pSendEmailToUser: async (data) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, p2pSendEmail } = ApiConfig;
    const url = baseAdmin + p2pSendEmail;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, data, headers);
  },

  debitCreditForUsers: async (data) => {
    const token = sessionStorage.getItem("token");
    const adminId = sessionStorage.getItem("userId"); // userId contains admin ID after login
    const { baseAdmin, debitCreditForUsers } = ApiConfig;
    const url = baseAdmin + debitCreditForUsers;
    const params = {
      ...data,
      adminId: adminId
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  getAvailableWalletTypes: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, availableWalletTypes } = ApiConfig;
    const url = baseAdmin + availableWalletTypes;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  updateApk: async (formData) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, updateApk } = ApiConfig;
    const url = baseAdmin + updateApk;
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    };
    return ApiCallPost(url, formData, headers);
  },

  getApkList: async () => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, getApkList } = ApiConfig;
    const url = baseAdmin + getApkList;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallGet(url, headers);
  },

  updateApkStatus: async (apkId, status) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, updateApkStatus } = ApiConfig;
    const url = baseAdmin + updateApkStatus;
    const params = {
      apkId: apkId,
      status: status
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallPost(url, params, headers);
  },

  deleteApk: async (apkId) => {
    const token = sessionStorage.getItem("token");
    const { baseAdmin, deleteApk } = ApiConfig;
    const url = baseAdmin + deleteApk + `/${apkId}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
    return ApiCallDelete(url, headers);
  },

};

export default AuthService;
