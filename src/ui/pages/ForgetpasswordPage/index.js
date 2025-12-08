import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";

const ForgetpasswordPage = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        switch (event.target.name) {
            case "email":
                setEmail(event.target.value);
                break;
            case "otp":
                setOtp(event.target.value);
                break;
            case "password":
                setPassword(event.target.value);
                break;
                default:
            }
    
    }

    const handleForgotPassword = async () => {
        LoaderHelper.loaderStatus(false);
        await AuthService.forgotPassword(email,otp,password).then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    alertSuccessMessage(result?.message);
                    navigate('/');
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result?.message);
            }
        });
    }
    const handleGetOtp = async (email) => {
        if(!email){
            alertErrorMessage("Please enter email");
            return
        }
        LoaderHelper.loaderStatus(true);
        await AuthService.sendOtp(email).then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    alertSuccessMessage(result?.message);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage(result?.message);
            }
        });
    }

    return (
        <div id="layoutAuthentication" className="mainloginbg">
            <div id="layoutAuthentication_content">
                <main className="login-card">
                    <div className="container-xl px-4">
                        <div className="row justify-content-center">
                            <div className="col-xl-5 col-lg-6 col-md-8 col-sm-11">

                                {/* <div className="card-body p-5 text-center">
                                    <img src="/assets/img/logo-white.png" className="img-fluid" alt="" width='300' />
                                </div> */}
                                <div className="card">
                                    {/* <hr className="my-0" /> */}
                                    <div className="card-body p-4 forgot_password_block">
                                        <div className="h4 text-center mb-2  fs-1">Forgot Password</div>
                                        <div className="text-center small text-muted mb-4">Enter your email address below and we will send your password on your Email.</div>
                                        <form action="/" >
                                            <div className="mb-3">
                                                <label className="text-gray-600 small" for="emailExample">
                                                    Your Email address
                                                </label>

                                                <input className="form-control form-control-solid" type="email" placeholder="Email Address" aria-label="Email Address" aria-describedby="emailExample" name="email" onChange={handleInputChange} />

                                            </div>
                                            <div className="mb-3">
                                                <label className="text-gray-600 small" for="emailExample">Email Verification Code*</label>
                                                <div className="input-group forgot_passwordotp">
                                                    <input className="form-control form-control-solid" type="number" name="otp" placeholder="Verification Code" aria-label="number" aria-describedby="emailExample" value={otp} onChange={handleInputChange} />
                                                    <button type="button"
                                                        onClick={() => { handleGetOtp(email) }}
                                                        className="btn btn-block btn-l btn_admin" style={{ backgroundColor: "rgb(219, 165, 12)", color: "white" }} >
                                                        <span> GET OTP </span>
                                                    </button>
                                                </div>

                                            </div>

                                            <div className="mb-3">
                                                <label className="text-gray-600 small" for="emailExample">New Password</label>
                                                <div className="input-group">
                                                    <input className="form-control form-control-solid" type="text" name="password" placeholder="New Password" aria-label="number" aria-describedby="emailExample" value={password} onChange={handleInputChange} />
                                                   
                                                </div>

                                            </div>

                                            <button className="btn btn-block w-100 btn-xl btn_admin mt-2 px-2" style={{ backgroundColor: "rgb(96, 189, 111)", color: "black" }} type="button" onClick={() => handleForgotPassword(email)}> Save Password</button>
                                        </form>
                                    </div>
                                    {/*  <hr className="my-0" /> */}
                                    <div className="card-body ">
                                        <div className="small text-center">
                                            <Link className="btn-link text-decoration-none" to="/">Back to - Login</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ForgetpasswordPage;