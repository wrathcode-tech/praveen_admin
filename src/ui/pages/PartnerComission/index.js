

import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";

const PartnerComission = () => {
    const [partnersList, setPartnersList] = useState([]);
    const [allData, setAllData] = useState([]);

    const columns = [
        { name: 'Sr no.', selector: (row, index) => index + 1, wrap: true },
        { name: 'Partner Id', width: "120px", sort: true, wrap: true, selector: row => row?.PartnerId },
        { name: 'Partne Name', selector: row => row?.PartnerName, wrap: true },
        { name: 'Credit Amount', selector: row => row?.credit_amount, wrap: true },


    ];

    function searchObjects(e) {
        const keysToSearch = ["PartnerId", "deposited_amount", "commission_on_deposited_amount","month_payout_amount", "total_distributed", "count"];
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
        await AuthService.partner_monthly_payouts_list().then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    setPartnersList(result?.data.reverse());
                    setAllData(result?.data);
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
                                            Partners Comission
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between">Partners Details
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

export default PartnerComission;