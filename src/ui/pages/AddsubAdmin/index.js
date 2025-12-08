import React, { useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertSuccessMessage, alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import Select from "react-select";

const AddsubAdmin = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [passwords, setPassword] = useState('');
    const [multipleSelectd, setMultipleSelectd] = useState([]);
    const [signId, setSignId] = useState('')
    const [confirmPassword, setConfirmPassword] = useState("")
    const [ip, setip] = useState("");


    const handleInputChange = (event) => {
        switch (event.target.name) {
            case "firstName":
                setFirstName(event.target.value);
                break;
            case "ipAddress":
                setip(event.target.value);
                break;
            case "lastName":
                setLastName(event.target.value);
                break;
            case "emailorphone":
                setSignId(event.target.value);
                break;
            case "password":
                setPassword(event.target.value);
                break;
            case "confirmPassword":
                setConfirmPassword(event.target.value)
                break;
            default:
        }
    }

    const resetInputChange = () => {
        setFirstName("");
        setLastName("")
        setSignId("")
        setPassword("");
        setConfirmPassword("")
        setMultipleSelectd("");

    }

    const handleSubAdmin = async (firstName, lastName, signId, passwords, confirmPassword, multipleSelectd) => {
        if (!firstName || !lastName || !signId || !passwords || !confirmPassword || !multipleSelectd) {
            alertErrorMessage("Please fill all required field");
            return;
        }
        await AuthService.AddsubAdmin(firstName, lastName, signId, passwords, confirmPassword, multipleSelectd).then(async result => {
            if (result?.success) {
                try {
                    alertSuccessMessage(result?.message);
                    resetInputChange();
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                alertErrorMessage(result?.message);
            }
        })
    }



    var multipleSelect = [

        {
            value: 2,
            label: 'Traders'
        },
        {
            value: 3,
            label: 'KYC Manager'
        },
        {
            value: 21,
            label: 'Earning Manager'
        },

        {
            value: 22,
            label: 'Affiliate Manager'
        },
        {
            value: 23,
            label: 'Arbitrage Bot Manager'
        },


        {
            value: 5,
            label: 'User Bank'
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
            value: 25,
            label: 'Announcement Banner Management'
        },
  


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
                                        Add new sub admin
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div className="card-header">Enter Sub Admin Details</div>
                        <div className="card-body">
                            <form>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" for="inputFirstName">First name <em>*</em></label>
                                        <input type="text" className="form-control  form-control-solid" id="inputFirstName" placeholder="Enter your first name" name="firstName" value={firstName} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" for="inputLastNames">Last name <em>*</em> </label>
                                        <input className="form-control form-control-solid" id="inputLastNames" type="text" placeholder="Enter your last name" name="lastName" value={lastName} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" for="inputLocation">Password<em>*</em></label>
                                        <input className="form-control form-control-solid" id="inputLocation" type="text" placeholder="Enter your Password" name="password" value={passwords} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" for="inputLocation"> Confirm Password<em>*</em></label>
                                        <input className="form-control form-control-solid" id="inputLocation" type="text" placeholder="Enter your Password Again" name="confirmPassword" value={confirmPassword} onChange={handleInputChange} />
                                    </div>

                                </div>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" for="inputEmailAddress">Email<em>*</em></label>
                                        <input className="form-control form-control-solid" id="inputEmailAddress" placeholder="Enter your email address" name="emailorphone" value={signId} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6" >
                                        <label className="small mb-1" for="inputLocation">Permissions<em>*</em></label>
                                        <Select isMulti options={multipleSelect}
                                            onChange={setMultipleSelectd}
                                            value={multipleSelectd}
                                        >
                                        </Select>
                                    </div>
                                </div>

                                {/* <div className="row gx-3 mb-3 " >
                                    <div className="col-md-6" >
                                        <label className="small mb-1" for="inputLocation">Permissions<em>*</em></label>
                                        <Select isMulti options={multipleSelect}
                                            onChange={setMultipleSelectd}
                                            value={multipleSelectd}
                                        >
                                        </Select>
                                    </div>
                                </div> */}
                                <button className="btn btn-indigo" type="button" onClick={() => handleSubAdmin(firstName, lastName, signId, passwords, confirmPassword, multipleSelectd, ip)} > Submit Details </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AddsubAdmin;