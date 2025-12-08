import React, { useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertSuccessMessage, alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import Select from "react-select";

const AddNewCoin = () => {
    const [signId, setSignId] = useState('')
    const [packageName, setPackageName] = useState('')
    const [packagePrice, setPackagePrice] = useState('')
    const [duration, setDuration] = useState('')
    const [description, setDescription] = useState('')



    const handleInputChange = (event) => {
        switch (event.target.name) {
            case "packageName":
                setPackageName(event.target.value);
                break;
            case "packagePrice":
                setPackagePrice(event.target.value);
                break;
            case "duration":
                setDuration(event.target.value);
                break;
            case "description":
                setDescription(event.target.value);
                break;
            default:
        }
    }

    const resetInputChange = () => {
        setDescription('');
        setDuration('');
        setPackageName('');
        setPackagePrice('');

    }

    const handleSubAdmin = async (packageName, packagePrice, duration, description,) => {
        if (!packageName || !packagePrice || !duration || !description) {
            alertErrorMessage("Please fill all required field");
            return;
        }
        await AuthService.AddNewCoin(packageName, packagePrice, duration, description,).then(async result => {
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
                                        Add New Coin
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div className="card-header">Enter New Coin Details</div>
                        <div className="card-body">
                            <form>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" for="inputpackageName"> Package Name <em>*</em></label>
                                        <input type="text" className="form-control  form-control-solid" id="inputpackageName" placeholder="Enter your package name" name="packageName" value={packageName} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" for="inputPackagePrice"> Package Price <em>*</em> </label>
                                        <input className="form-control form-control-solid" id="inputPackagePrice" type="text" placeholder="Enter your package price" name="packagePrice" value={packagePrice} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" for="inputLocation">Duration<em>*</em></label>
                                        <input className="form-control form-control-solid" id="inputLocation" type="text" placeholder="Enter your duration in days" name="duration" value={duration} onChange={handleInputChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" for="inputLocation"> Description<em>*</em></label>
                                        <input className="form-control form-control-solid" id="inputLocation" type="text" placeholder="Enter your description" name="description" value={description} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <button className="btn btn-indigo" type="button" onClick={() => handleSubAdmin(packageName, packagePrice, duration, description,)} > Submit Details </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AddNewCoin;