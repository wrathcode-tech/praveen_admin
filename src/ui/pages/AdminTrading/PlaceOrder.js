import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";

const PlaceOrder = () => {
    const [exportData, setExportData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [totalData, setTotalData] = useState();
    const [search, setSearch] = useState("");
    const [kycType, setKycType] = useState(4);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currencyPairList, setCurrencyPairList] = useState([]);
    const [tradeForm, setTradeForm] = useState({
        pair: "",
        buyPrice: "",
        sellPrice: "",
        quantity: "",
        netProfit: "",
    });

    const skip = (currentPage - 1) * itemsPerPage;
    const pageCount = totalData / itemsPerPage;

    useEffect(() => {
        handleUserData(skip, itemsPerPage, search);
        handleCurrencyPairList();
    }, [currentPage, itemsPerPage, skip, kycType, search]);

    const handleUserData = async (skip, limit, search) => {
        LoaderHelper.loaderStatus(true);
        const res = await AuthService.getUserList(skip, limit, search, kycType);
        LoaderHelper.loaderStatus(false);
        if (res.success) {
            setExportData(res.data);
            setTotalData(res.totalCount);
        } else alertErrorMessage("No data found");
    };

    const handleCurrencyPairList = async () => {
        const result = await AuthService.getCurrencyPairList();
        if (result?.success) {
            setCurrencyPairList(result?.data.reverse());
        } else {
            alertErrorMessage(result?.message);
        }
    };

    const openTradeModal = (user) => {
        setSelectedUser(user);
        setTradeForm({ pair: "", buyPrice: "", sellPrice: "", quantity: "", netProfit: "" });
        const modal = document.getElementById("trade_modal");
        if (modal) modal.classList.add("show");
        modal.style.display = "block";
    };

    const closeModal = () => {
        const modal = document.getElementById("trade_modal");
        modal.classList.remove("show");
        modal.style.display = "none";
    };

    const handleTradeInput = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...tradeForm, [name]: value };
      
        const { buyPrice, sellPrice, quantity } = updatedForm;
        const bp = parseFloat(buyPrice);
        const sp = parseFloat(sellPrice);
        const qty = parseFloat(quantity);
      
        if (!isNaN(bp) && !isNaN(sp) && !isNaN(qty)) {
          updatedForm.netProfit = ((sp - bp) * qty).toFixed(2);
        } else {
          updatedForm.netProfit = "";
        }
      
        setTradeForm(updatedForm);
      };
      

    const handlePlaceTrade = async () => {
        const { pair, buyPrice, sellPrice, quantity, netProfit } = tradeForm;
        if (!pair || !buyPrice || !sellPrice || !quantity || !netProfit) {
            alertErrorMessage("All fields are required");
            return;
        }

        try {
            LoaderHelper.loaderStatus(true);
            const res = await AuthService.placeTrade( {
                userId: selectedUser._id,
                pair,
                buyPrice,
                sellPrice,
                quantity,
                netProfit,
            });

            if (res?.success) {
                alertSuccessMessage("Trade placed successfully");
                closeModal();
            } else {
                alertErrorMessage(res?.message || "Failed to place trade");
            }
        } catch (error) {
            alertErrorMessage(error?.response?.data?.message || "Server error");
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const columns = [
        { name: "Sr No.", selector: (row, index) => skip + index + 1 },
        { name: "Name", selector: (row) => `${row?.firstName} ${row?.lastName}` },
        { name: "Email", selector: (row) => row.emailId || "-----" },
        { name: "KYC", selector: (row) => ["Not Submitted", "Pending", "Approved", "Rejected"][row.kycVerified] },
        { name: "Phone", selector: (row) => row.mobileNumber || "-----" },
        { name: "Reg. Date", selector: (row) => moment(row?.createdAt).format("MMM Do YYYY hh:mm A") },
        {
            name: "Action",
            cell: (row) => (
                <button className="btn btn-sm btn-primary" onClick={() => openTradeModal(row)}>
                    Add Trade
                </button>
            ),
        },
    ];

    return (
        <>
            <div id="layoutSidenav_content">
                <div className="container-xl px-4">
                    <h1 className="mt-4 mb-3">Traders List</h1>
                    <div className="card mb-4">
                        <div className="card-header d-flex justify-content-between">
                            <input type="search" className="form-control w-25" placeholder="Search email..." onChange={(e) => setSearch(e.target.value)} value={search} />
                            <select className="form-select w-25" value={kycType} onChange={(e) => setKycType(e.target.value)}>
                                <option value={2}>Approved KYC</option>
                                <option value={1}>Pending KYC</option>
                                <option value={3}>Rejected KYC</option>
                                <option value={0}>Not Submitted</option>
                                <option value={4}>All</option>
                            </select>
                        </div>
                        <div className="card-body">
                            <DataTableBase columns={columns} data={exportData} pagination={false} />
                            <ReactPaginate pageCount={pageCount} onPageChange={({ selected }) => setCurrentPage(selected + 1)} containerClassName={'customPagination'} activeClassName={'active'} />
                        </div>
                    </div>
                </div>


            </div>

            {/* Modal for placing trade */}
            <div className="modal" id="trade_modal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog alert_modal" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">
                                {selectedUser?.firstName}'s Trade
                            </h5>
                            <button className="btn-close" type="button" onClick={closeModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group mb-3">
                                    <label className="small mb-1">Select Pair</label>
                                    <select
                                        className="form-control form-control-solid"
                                        name="pair"
                                        value={tradeForm.pair}
                                        onChange={handleTradeInput}
                                    >
                                        <option value="">-- Select --</option>
                                        {currencyPairList.map((pair) => (
                                            <option
                                                key={pair._id}
                                                value={`${pair.base_currency}/${pair.quote_currency}`}
                                            >
                                                {pair.base_currency}/{pair.quote_currency}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="small mb-1">Buy Price</label>
                                    <input className="form-control form-control-solid" name="buyPrice" type="number" value={tradeForm.buyPrice} onChange={handleTradeInput} />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="small mb-1">Sell Price</label>
                                    <input className="form-control form-control-solid" name="sellPrice" type="number" value={tradeForm.sellPrice} onChange={handleTradeInput} />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="small mb-1">Quantity</label>
                                    <input className="form-control form-control-solid" name="quantity" type="number" value={tradeForm.quantity} onChange={handleTradeInput} />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="small mb-1">Net Profit</label>
                                    <input className="form-control form-control-solid" name="netProfit" type="number" value={tradeForm.netProfit} disabled/>
                                </div>
                                <button className="btn btn-indigo btn-block w-100" type="button" onClick={handlePlaceTrade}>
                                    Place Trade
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default PlaceOrder;
