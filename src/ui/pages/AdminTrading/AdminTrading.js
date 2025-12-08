import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import AuthService from '../../../api/services/AuthService';
import LoaderHelper from '../../../customComponent/Loading/LoaderHelper';
import { alertErrorMessage, alertSuccessMessage } from '../../../customComponent/CustomAlertMessage';
import moment from 'moment';

function AdminTrading() {
    const [adminTrades, setAdminTrades] = useState([]);
    const [search, setSearch] = useState('');

    const fetchAdminTrades = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const response = await AuthService.tradesByAdmin();
            LoaderHelper.loaderStatus(false);
            if (response.success) {
                setAdminTrades(response.data);
            } else {
                alertErrorMessage(response.message || 'Failed to fetch trades');
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage('Server error while fetching trades');
        }
    };
    
    const handleDeleteTrade = async (id) => {
        if (!window.confirm("Are you sure you want to delete this trade?")) return;
        try {
          LoaderHelper.loaderStatus(true);
          const res = await AuthService.deleteTrade(id);
          LoaderHelper.loaderStatus(false);
          if (res.success) {
            alertSuccessMessage("Trade deleted successfully");
            fetchAdminTrades(); // Refresh list
          } else {
            alertErrorMessage(res.message || "Failed to delete trade");
          }
        } catch (error) {
          LoaderHelper.loaderStatus(false);
          alertErrorMessage("Server error while deleting trade");
        }
      };
      
    useEffect(() => {
        fetchAdminTrades();
    }, []);

    const columns = [
        { name: 'User', selector: row => row?.userId?.firstName + ' ' + row?.userId?.lastName, sortable: true ,wrap:true},
        { name: 'Email', selector: row => row?.userId?.emailId, sortable: true ,wrap:true},
        { name: 'Pair', selector: row => row.pair, sortable: true ,wrap:true},
        { name: 'Buy Price', selector: row => row.buyPrice, sortable: true ,wrap:true},
        { name: 'Sell Price', selector: row => row.sellPrice, sortable: true ,wrap:true},
        { name: 'Quantity', selector: row => row.quantity, sortable: true,wrap:true },
        { name: 'Net Profit', selector: row => row.netProfit, sortable: true ,wrap:true},
        { name: 'Date', selector: row => moment(row.createdAt).format('MMM Do YYYY, hh:mm A'), sortable: true,wrap:true },
        {
            name: 'Actions',
            
            cell: row => (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteTrade(row._id)}
              >
                Delete
              </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            wrap:true 
          }
          
    ];

    return (
        <div id="layoutSidenav_content">
            <main>
                <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                    <div className="container-xl px-4">
                        <div className="page-header-content pt-4">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto mt-4">
                                    <h1 className="page-header-title">
                                        <div className="page-header-icon"><i className="far fa-user"></i></div>
                                        Admin Trade History
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>All Admin Trades</span>
                            <div className="d-flex gap-3">
                                <input className="form-control form-control-solid" type="text" placeholder="Search name or pair" value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </div>
                        <div className="card-body">
                            <DataTable
                                columns={columns}
                                data={adminTrades.filter(trade =>
                                    trade?.userId?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
                                    trade?.pair?.toLowerCase().includes(search.toLowerCase())
                                )}
                                pagination
                                highlightOnHover
                                striped
                                responsive
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AdminTrading;
