import React, { useEffect, useState } from "react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import copy from 'copy-to-clipboard';
import CryptoJS from 'crypto-js';
import { alertSuccessMessage } from "../CustomAlertMessage";

const VisitorId = () => {

    const [visitorId, setVisitorId] = useState("");
    const SECRET_KEY = "b5bab58f2c29b_cv_trade_b560253293bd";  // Save this in env

    const getDeviceVisitorId = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const encryptedId = CryptoJS.AES.encrypt(result.visitorId, SECRET_KEY).toString();
        setVisitorId(encryptedId)
    };

    const copyVisitorId = () => {
        copy(visitorId);
        alertSuccessMessage("Secret Device ID copied!!")
    }

    useEffect(() => {
        getDeviceVisitorId()
    }, []);

    return (
        <>
            <div id="layoutSidenav_content">
                <main>
                    <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10 deviceIdPage">
                        <div className="container-xl px-4">
                            <div className="page-header-content pt-4">
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-auto mt-4">
                                        <h1 className="page-header-title">
                                            <div className="page-header-icon"></div>
                                            Secret Device ID : {visitorId ? `${visitorId.substring(0, 20)}...` : "Loading..."}<div className="mx-2 cursor-pointer" onClick={copyVisitorId}>
                                                <i class="fa fa-clone" aria-hidden="true"></i></div>
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                </main>
            </div>
        </>
    )
}

export default VisitorId;