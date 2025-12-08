import React, { useEffect, useState } from 'react';
import LoaderHelper from '../../../customComponent/Loading/LoaderHelper';
import AuthService from '../../../api/services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../../customComponent/CustomAlertMessage';

const TradeBot = () => {
    const [tradeData, setTradeData] = useState({
        _id: '',
        pair: '',
        tradeType: '',
        remark: '',
        quanity: '',
        profit: ''
    });

    const [tradeList, setTradeList] = useState([]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTradeData({ ...tradeData, [name]: value });
    };

    const validateFields = () => {
        const { pair, tradeType, quanity, profit } = tradeData;

        if (!pair.trim()) {
            alertErrorMessage("Pair is required");
            return false;
        }

        if (!tradeType.trim()) {
            alertErrorMessage("Trade Type is required");
            return false;
        }

          if (!tradeType.trim()) {
            alertErrorMessage("Trade Type must be 'BUY' or 'SELL'");
            return false;
        }

        if (!quanity || isNaN(quanity) || Number(quanity) <= 0) {
            alertErrorMessage("Quantity must be a positive number");
            return false;
        }

        if (!profit || isNaN(profit)) {
            alertErrorMessage("Profit must be a number");
            return false;
        }

        return true;
    };

    const fetchTrades = async () => {
        try {
            const res = await AuthService.botTrades();
            if (res.success) {
                setTradeList(res.data);
            }
        } catch (err) {
            console.error("Fetch trades error:", err);
        }
    };

    const handleSaveTrade = async () => {
        if (!validateFields()) return;

        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.addBotTrade(tradeData);
            LoaderHelper.loaderStatus(false);

            if (result?.success) {
                alertSuccessMessage(result?.message);
                setTradeData({ _id: '', pair: '', tradeType: '', remark: '', quanity: '', profit: '' });
                fetchTrades();
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Something went wrong.");
        }
    };

    const handleEditTrade = (trade) => {
        setTradeData(trade);
    };

    const handleDeleteTrade = async (_id) => {
        if (!window.confirm("Are you sure you want to delete this trade?")) return;
        try {
            const res = await AuthService.deleteBotTrades(_id);
            if (res.success) {
                alertSuccessMessage(res.message);
                fetchTrades();
            } else {
                alertErrorMessage(res.message);
            }
        } catch (err) {
            console.error("Delete error:", err);
            alertErrorMessage("Failed to delete trade.");
        }
    };

    useEffect(() => {
        fetchTrades();
    }, []);

    return (
        <div id="layoutSidenav_content">
            <main>
                <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                    <div className="container-xl px-4">
                        <div className="page-header-content pt-4">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto mt-4">
                                    <h1 className="page-header-title">
                                        <div className="page-header-icon"><i className="fas fa-robot"></i></div>
                                        Manage Bot Trades
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div className="card-header">Trade Form</div>
                        <div className="card-body">
                            <form>
                                <div className="row gx-3 mb-3">
                                    {[
                                        { label: 'Pair', name: 'pair' },
                                        { label: 'Trade Type ', name: 'tradeType' },
                                        { label: 'Remark', name: 'remark' },
                                        { label: 'Quantity', name: 'quanity' },
                                        { label: 'Profit', name: 'profit' }
                                    ].map((field) => (
                                        <div className="col-md-6" key={field.name}>
                                            <label className="small mb-1">
                                                {field.label} <em>*</em>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-solid"
                                                name={field.name}
                                                value={tradeData[field.name]}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-primary" type="button" onClick={handleSaveTrade}>
                                    {tradeData._id ? 'Update Trade' : 'Add Trade'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">All Trades</div>
                        <div className="card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Pair</th>
                                        <th>Type</th>
                                        <th>Quantity</th>
                                        <th>Profit</th>
                                        <th>Remark</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tradeList?.length > 0 ? tradeList.map((trade,index) => (
                                        <tr key={trade._id}>
                                            <td>{index+1}</td>
                                            <td>{trade.pair}</td>
                                            <td>{trade.tradeType}</td>
                                            <td>{trade.quanity}</td>
                                            <td>{trade.profit}</td>
                                            <td>{trade.remark}</td>
                                            <td>
                                                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditTrade(trade)}>Edit</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTrade(trade._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    )) : <tr><td colSpan="6" className="text-center">No Trade Found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TradeBot;
