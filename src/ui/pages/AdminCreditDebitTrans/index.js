

import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import moment from "moment";

const AdminDebitCreditTrans = () => {
    const [partnersList, setPartnersList] = useState([]);
    const [allData, setAllData] = useState([]);

    const columns = [
        { name: 'Sr no.', selector: (row, index) => row.index + 1, wrap: true },
        { name: <div style={{ whiteSpace: "revert" }}> Date</div>, wrap: true, sort: true, selector: row => moment(row?.createdAt).format('MMMM Do YYYY HH:MM A') },
        { name: 'User ID', selector: row => row?.user_id, wrap: true },
        { name: 'Email', selector: row => row?.emailId, wrap: true },
        { name: 'Amount', width: "120px", sort: true, wrap: true, selector: row => row?.amount },
        { name: 'Asset', selector: row => row?.short_name, wrap: true },
        { name: 'Description', width: "150px", selector: row => row?.description, wrap: true },
        { name: 'Transaction type', selector: row => row?.transaction_type, wrap: true },
        { name: 'From Admin', selector: row => row?.from_admin, wrap: true },


    ];

    function searchObjects(e) {
        const keysToSearch = ["amount", "short_name", "description", "transaction_type", "user_id", "from_admin", "emailId"];
        const userInput = e.target.value;
        const searchTerm = userInput?.toLowerCase();
        const matchingObjects = allData.filter(obj => {
            return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm));
        });
        setPartnersList(matchingObjects);
    };


    useEffect(() => {
        handlePartners()
    }, []);

    const handlePartners = async () => {
        LoaderHelper.loaderStatus(true);
        await AuthService.debit_credit_transaction().then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    let filtteredData = result?.data?.map((item, index) => ({ ...item, index }))
                    setPartnersList(filtteredData);
                    setAllData(filtteredData);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
            }
        });
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
                                            <div className="page-header-icon"><i className="far fa-user"></i></div>
                                            Admin Debit Credit Trans
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between">Transaction Details
                                <div className="col-5">
                                    <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={searchObjects} />
                                </div>
                            </div>
                            <div className="card-body mt-3">
                                {partnersList.length === 0 ? <h6 className="ifnoData"><img alt="" src="assets/img/no-data.png" /> <br />No Data Available</h6> :
                                    <div className="table-responsive" width="100%">
                                        <DataTableBase columns={columns} data={partnersList} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default AdminDebitCreditTrans;