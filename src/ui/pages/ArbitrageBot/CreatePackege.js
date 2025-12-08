import React, { useState } from 'react';
import LoaderHelper from '../../../customComponent/Loading/LoaderHelper';
import AuthService from '../../../api/services/AuthService';
import { alertErrorMessage, alertSuccessMessage } from '../../../customComponent/CustomAlertMessage';

const CreatePackage = () => {
    const [packageData, setPackageData] = useState({
        name: '',
        price: '',
        minTradeLimit: '',
        maxTradeLimit: '',
        monthlyReturnMin: '',
        monthlyReturnMax: '',
        validityDays: '',
        lockDays: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPackageData({ ...packageData, [name]: value });
    };

    const handleCreatePackage = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const {
                name,
                price,
                minTradeLimit,
                maxTradeLimit,
                monthlyReturnMin,
                monthlyReturnMax,
                validityDays,
                lockDays,
            } = packageData;

            const result = await AuthService.createBotPackage(
                name,
                price,
                minTradeLimit,
                maxTradeLimit,
                monthlyReturnMin,
                monthlyReturnMax,
                validityDays,
                lockDays,
            );

            LoaderHelper.loaderStatus(false);

            if (result?.success) {
                alertSuccessMessage(result?.message || "Package created successfully.");
                setPackageData({
                    name: '',
                    price: '',
                    minTradeLimit: '',
                    maxTradeLimit: '',
                    monthlyReturnMin: '',
                    monthlyReturnMax: '',
                    validityDays: '',
                    lockDays: '',
                });
            } else {
                alertErrorMessage(result?.message || "Failed to create package.");
            }
        } catch (err) {
            LoaderHelper.loaderStatus(false);
            console.error("Error in create package:", err);
            alertErrorMessage("Something went wrong.");
        }
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
                                        <div className="page-header-icon"><i className="far fa-user"></i></div>
                                        Create Package
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container-xl px-4 mt-n10">
                    <div className="card mb-4">
                        <div className="card-header">Enter Package Details</div>
                        <div className="card-body">
                            <form>
                                <div className="row gx-3 mb-3">
                                    {[
                                        { label: 'Name', name: 'name' },
                                        { label: 'Price', name: 'price' },
                                        { label: 'Min Trade Limit', name: 'minTradeLimit' },
                                        { label: 'Max Trade Limit', name: 'maxTradeLimit' },
                                        { label: 'Monthly Return Min', name: 'monthlyReturnMin' },
                                        { label: 'Monthly Return Max', name: 'monthlyReturnMax' },
                                        { label: 'Validity Days', name: 'validityDays' },
                                        { label: 'Lock Days', name: 'lockDays' },
                                    ].map((field) => (
                                        <div className="col-md-6" key={field.name}>
                                            <label className="small mb-1">
                                                {field.label} <em>*</em>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control form-control-solid"
                                                name={field.name}
                                                value={packageData[field.name]}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button className="btn btn-indigo" type="button" onClick={handleCreatePackage}>
                                    Create Package
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CreatePackage;
