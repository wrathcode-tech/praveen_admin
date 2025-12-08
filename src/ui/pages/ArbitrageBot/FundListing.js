import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import moment from "moment";

const FundListing = () => {
    const [allData, setAllData] = useState([]);
    const [fundListData, setFundListData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const columns = [
        { name: 'Sr No.', width: "70px", selector: (row, index) => (page - 1) * limit + index + 1, wrap: true },
        { name: 'Date', selector: row => moment(row?.fundAddedDate).format("MMM Do YYYY hh:mm A"), wrap: true },
        { name: 'Name', selector: row => row?.userInfo?.firstName + " " + row?.userInfo?.lastName, wrap: true },
        { name: 'Email', width: "200px", selector: row => row?.userInfo?.emailId, wrap: true },
        { name: 'Invested Amount ', selector: row => row?.investedAmount, wrap: true },
        { name: 'Bonus Amount', selector: row => row?.bonusAmount ? row?.bonusAmount : "---", wrap: true },
        // { name: 'From Address', width: "200px", selector: row => row?.from_address, wrap: true },
        // { name: 'To Address', width: "200px", selector: row => row?.to_address, wrap: true },
        { name: 'Is distributed?', selector: row => row?.isProfitDistributed ? "Yes":"No", wrap: true },
        { name: 'Profit %', selector: row => row?.profitPercentage, wrap: true },
        { name: 'Returnable Amount', selector: row => row?.returnedAmount, wrap: true },
        { name: 'Status', selector: row => row?.status, wrap: true },
    ];

    const searchPackages = (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allData.filter(obj =>
            obj?.userInfo?.firstName?.toLowerCase().includes(term) ||
            obj?.userInfo?.lastName?.toLowerCase().includes(term) ||
            obj?.userInfo?.emailId?.toLowerCase().includes(term) ||
            obj?.short_name?.toLowerCase().includes(term) ||
            obj?.from_address?.toLowerCase().includes(term) ||
            obj?.to_address?.toLowerCase().includes(term) ||
            obj?.transaction_for?.toLowerCase().includes(term) ||
            obj?.transaction_type?.toLowerCase().includes(term) ||
            obj?.status?.toLowerCase().includes(term)
        );
        setFundListData(filtered);
    };

    const handleFundList = async () => {
        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.getFundList(page, limit);
            LoaderHelper.loaderStatus(false);

            if (result?.success) {
                const data = result?.data;
                setAllData(data);
                setFundListData(data);
                setTotalCount(result?.totalCount || data.length);
            } else {
                alertErrorMessage(result?.message || "Failed to fetch fund list.");
            }
        } catch (error) {
            LoaderHelper.loaderStatus(false);
            alertErrorMessage("Error fetching fund list.");
        }
    };

    useEffect(() => {
        handleFundList();
    }, [page, limit]);

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
                                        Fund Listing
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>Funds Details</span>
                            <div className="col-5">
                                <input
                                    style={{ border: "1px solid #ccc" }}
                                    className="form-control form-control-solid"
                                    type="text"
                                    placeholder="Search here..."
                                    onChange={searchPackages}
                                />
                            </div>
                        </div>
                        <div className="card-body mt-3">
                            {fundListData.length === 0 ? (
                                <h6 className="ifnoData">
                                    <img alt="No data" src="/assets/img/no-data.png" /> <br />
                                    No Data Available
                                </h6>
                            ) : (
                                <div className="table-responsive">
                                    <DataTableBase columns={columns} data={fundListData} pagination={true} />
                                </div>
                            )}

                      

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FundListing;
