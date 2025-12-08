import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";

const ReferralList = () => {
    const [allData, setAllData] = useState([]);
    const [referralList, setReferralList] = useState([]);


    useEffect(() => {
        handleReferralList();
    }, []);

    const handleReferralList = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.ReferralList();
            LoaderHelper.loaderStatus(false);
            if (result?.success) {
                const data = result?.data.reverse();
                setAllData(data);
                setReferralList(data);
            } else {
                alertErrorMessage(result?.message || "Failed to fetch package list.");
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error fetching package list.");
        }
    };




    const columns = [
        { name: 'Sr No.', width: "70px", selector: (row, index) => index + 1, wrap: true },
        { name: 'Referrer Name', selector: row => row?.name, wrap: true },
        { name: 'Referrer Email', selector: row => row?.email, wrap: true },
        { name: 'Referred User Name', selector: row => row?.name, wrap: true },
        { name: 'Referred User Email', selector: row => row?.email, wrap: true },
    ];


    const searchPackages = (e) => {
        const term = e.target.value.toLowerCase();
        const keysToSearch = ["name", "email"];
        const filtered = allData.filter(obj =>
            keysToSearch.some(key =>
                obj[key]?.toString().toLowerCase().includes(term)
            )
        );
        setReferralList(filtered);
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
                                        <div className="page-header-icon">
                                            <i className="far fa-user"></i>
                                        </div>
                                        Referral List
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>Referral Details</span>
                            <div className="col-5">
                                <input style={{ border: "1px solid #ccc" }}
                                    className="form-control form-control-solid"
                                    type="text"
                                    placeholder="Search here..."
                                    onChange={searchPackages}
                                />
                            </div>
                        </div>
                        <div className="card-body mt-3">
                            {referralList.length === 0 ? (
                                <h6 className="ifnoData">
                                    <img alt="No data" src="/assets/img/no-data.png" /> <br />
                                    No Data Available
                                </h6>
                            ) : (
                                <div className="table-responsive">
                                    <DataTableBase columns={columns} data={referralList} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReferralList;
