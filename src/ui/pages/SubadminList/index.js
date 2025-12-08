import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import { CSVLink } from "react-csv";
import { $ } from 'react-jquery-plugin';
import moment from "moment";
import Select from "react-select";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";

const SubAdmin = () => {
    const [subAdminList, setSubAdminList] = useState([]);
    const [allData, setAllData] = useState([]);
    const [subadminId, setSubadminId] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [multipleSelectd, setMultipleSelectd] = useState([]);
    const [adminType, setadminType] = useState();
    const [showModal, setshowModal] = useState(false);

    const linkFollow = (row) => {
        return (
            <>
                <button className="btn btn-dark btn-sm me-2" data-bs-toggle="modal" data-bs-target="#edit_modal" onClick={() => handleSubadminDetail(row)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteSubAdmin(row?._id)}>Delete</button>
            </>
        );
    };

    const statuslinkFollow = (row) => {
        return (
            <button className={row?.status === "Active" ? "btn btn-sm btn-success" : "btn btn-sm btn-danger"} style={{ marginLeft: "20px" }} onClick={() => handleStatus(row?._id, row?.status === "Inactive" ? "Active" : "Inactive")}>{row?.status === "Active" ? "Active" : "Inactive"}</button>
        );
    };

    const columns = [
        { name: 'Name', wrap: true, selector: row => row?.first_name + " " + row?.last_name, },
        { name: 'Email', wrap: true, sort: true, selector: row => row?.email_or_phone },
        // { name: 'Whitelisted IP',  wrap: true, sort: true, selector: row => row?.whitelisted_ip },
        { name: <div style={{ whiteSpace: "revert" }}>Registration Date</div>, wrap: true, sort: true, selector: row => moment(row?.createdAt).format('MMMM Do YYYY') },
        // { name: 'Status', wrap: true, sort: true, selector: statuslinkFollow },
        { name: 'Action', wrap: true, selector: linkFollow },
    ];

    function searchObjects(e) {
        const keysToSearch = ["first_name", "email_or_phone", "last_name", "createdAt"];
        const userInput = e.target.value;
        const searchTerm = userInput?.toLowerCase();
        const matchingObjects = allData.filter(obj => {
            return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm));
        });
        setSubAdminList(matchingObjects);
    };

    const handleStatus = async (userId, cell) => {
        await AuthService.handleSubadminStatus2(userId, cell).then(async result => {
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handleSubadmin();
            } else {
                alertErrorMessage(result?.message)
            }
        })
    }


    const handleSubadminDetail = (id) => {
        setshowModal(true)
        setFirstName(id.first_name);
        setLastName(id.last_name);
        setEmail(id.email_or_phone);
        setMultipleSelectd(id.permissions);
        setSubadminId(id._id);
        setadminType(id.admin_type);
    };


    useEffect(() => {
        handleSubadmin()
    }, []);

    const handleSubadmin = async () => {
        LoaderHelper.loaderStatus(true);
        await AuthService.getSubAdminList().then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    setSubAdminList(result?.data.reverse());
                    setAllData(result?.data);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
            }
        });
    }

    const deleteSubAdmin = async (userId) => {
        await AuthService.deleteSubAdminList(userId).then(async result => {
            if (result?.success) {
                alertSuccessMessage("Delete Successfully");
                handleSubadmin()
            } else {
                alertErrorMessage(result?.message)
            }
        })
    }

    const resetEditInput = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
    }

    const handleUpdateSubadminList = async (firstName, lastName, email, subadminId, multipleSelectd, adminType) => {
        await AuthService.updateSubadminList(firstName, lastName, email, subadminId, multipleSelectd, adminType).then(async result => {
            if (result?.success) {
                try {
                    alertSuccessMessage("Subadmin Updated Successfully!!");
                    setshowModal(false)
                    $('#edit_modal').modal('hide');
                    resetEditInput();
                    handleSubadmin();
                } catch (error) {

                }
            } else {
                alertErrorMessage(result?.message);
            }
        });
    };

    var multipleSelect = [
        {
            value: 1,
            label: 'Sub Admin'
        },
        {
            value: 2,
            label: 'Traders'
        },
        {
            value: 3,
            label: 'KYC Manager'
        },
        {
            value: 4,
            label: 'P2P Manager'
        },
        {
            value: 5,
            label: 'User Bank'
        },
        {
            value: 6,
            label: "User UPI"
        },
        {
            value: 7,
            label: "Add Partners"
        },
        {
            value: 22,
            label: "Partners List"
        },
        {
            value: 23,
            label: "Partners Withdrawal"
        },
        {
            value: 24,
            label: "Partners Stake Distribution"
        },
        {
            value: 25,
            label: "Partners Commissions"
        },
        {
            value: 8,
            label: 'Coin Listed Details'
        },
        {
            value: 9,
            label: 'Currency Managemnet'
        },
        {
            value: 10,
            label: 'Currency Pair Management'
        },
        {
            value: 11,
            label: 'Funds Deposit Management'
        },
        {
            value: 12,
            label: 'Funds Withdrawal Management'
        },
        {
            value: 13,
            label: 'Exchange Profit'
        },
        {
            value: 14,
            label: 'Exchange Wallet Management'
        },
        {
            value: 15,
            label: 'Market Trades'
        },
        {
            value: 16,
            label: 'Orderbook'
        },
        {
            value: 17,
            label: 'All Open Orders'
        },
        {
            value: 18,
            label: 'Notification Managemnt'
        },
        {
            value: 19,
            label: 'Banner Managemnt'
        },
        {
            value: 20,
            label: 'Support'
        },
        {
            value: 21,
            label: 'User Wallet Balance'
        },

    ];


    return (
        <>
            <div id="layoutSidenav_content">
                <main style={{ display: showModal ? 'none' : 'block' }}>
                    <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                        <div className="container-xl px-4">
                            <div className="page-header-content pt-4">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-auto mt-4">
                                        <h1 className="page-header-title">
                                            <div className="page-header-icon"><i className="far fa-user"></i></div>
                                            Sub Admin List
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between">Sub Admin Details
                                <div className="col-5">
                                    <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={searchObjects} />
                                </div>
                                {subAdminList.length === 0 ? "" :
                                    <div className="dropdown">
                                        <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Export </button>
                                        <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                                            <CSVLink data={subAdminList} className="dropdown-item">Export as CSV</CSVLink>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className="card-body mt-3">
                                {subAdminList.length === 0 ? <h6 className="ifnoData"><img alt="" src="assets/img/no-data.png" /> <br />No Data Available</h6> :
                                    <div className="table-responsive" width="100%">
                                        <DataTableBase columns={columns} data={subAdminList} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* sub admin edit Pair modal data */}
            <div class="modal"
                id="edit_modal" tabindex="-1"
                style={{ display: showModal ? 'block' : 'none' }}
                role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" onClick={(e) => { e.preventDefault(); setshowModal(false) }}>
                <div class="modal-dialog  alert_modal modal-lg" role="document">
                    <div class="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">
                                Edit Sub Admin Details
                            </h5>
                            <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => { e.stopPropagation(); setshowModal(false) }}> </button>
                        </div>
                        <div className="modal-body">

                            <form>
                                <div class="row gx-3 mb-3">
                                    <div class="col-md-6">
                                        <label class="small mb-1" for="inputFirstName">First name <em>*</em></label>
                                        <input class="form-control  form-control-solid" id="inputFirstName" type="text" placeholder="Enter your first name" value={firstName} onClick={(e) => e.stopPropagation()} onChange={(e) => setFirstName(e.target.value)} />
                                    </div>
                                    <div class="col-md-6">
                                        <label class="small mb-1" for="inputLastName">Last name <em>*</em> </label>
                                        <input class="form-control form-control-solid" id="inputLastName" type="text" placeholder="Enter your last name" value={lastName} onClick={(e) => e.stopPropagation()} onChange={(e) => setLastName(e.target.value)} />
                                    </div>
                                </div>
                                <div class="row gx-3 mb-3">
                                    <div class="col-md-12">
                                        <label class="small mb-1" for="inputEmailAddress">Email or Phone Number</label>
                                        <input class="form-control form-control-solid" id="inputEmailAddress" type="text" placeholder="Enter your email address" value={email} onClick={(e) => e.stopPropagation()} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                </div>

                                <div class="row gx-3 mb-3" onClick={(e) => e.stopPropagation()}>
                                    <div className="col-md-12" >
                                        <label className="small mb-1" for="inputLocation">Permissions</label>
                                        <Select isMulti options={multipleSelect}
                                            onChange={setMultipleSelectd}
                                            value={multipleSelectd}
                                        >
                                        </Select>
                                    </div>
                                </div>
                                <button class="btn btn-indigo" type="button" onClick={(e) => { e.stopPropagation(); handleUpdateSubadminList(firstName, lastName, email, subadminId, multipleSelectd, adminType) }}> Submit Details </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubAdmin;