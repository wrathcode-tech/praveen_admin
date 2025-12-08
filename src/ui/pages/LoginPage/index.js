import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('')

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

    const handleLogin = async ( otp, password) => {
        if (!otp || !password) {
            alertErrorMessage('Please fill all details');
            return
        }
        LoaderHelper.loaderStatus(true);
        await AuthService.login( otp, password).then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    sessionStorage.setItem("token", result?.data.token);
                    sessionStorage.setItem("emailId", result?.data.email_or_phone);
                    sessionStorage.setItem("userType", result?.data.admin_type);
                    sessionStorage.setItem("userId", result?.data.id);
                    sessionStorage.setItem("permissions", JSON.stringify(result?.data?.permissions || []));
                    alertSuccessMessage('Login Successfull!!');
                    navigate('/dashboard');
                    window.location.reload()
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
        LoaderHelper.loaderStatus(true);
        await AuthService.getOtp(email).then(async result => {
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
                <div className="login_section">
                    <main className="login-card">
                        {/* <div class="left_side_cnt">
                            <h1>Welcome to <span>gatbits</span> Admin Dashboard</h1>
                            <div class="logo_vector">
                                       <img src="/assets/img/logo_dark2.svg" className="img-fluid" alt="" width='300' />
                            </div>
                        </div> */}

                        <div className="px-4 login_right_s">

                            <div className="logo_cntr">
                                <img src="/assets/img/logo_light.svg" className="img-fluid" alt="" width='300' />
                            </div>

                            <div className="row justify-content-center">
                                <div className="login_form_cntr">

                                    <div className="card-body p-4 text-center">
                                        {/* <img src="/assets/img/logo_dark.svg" className="img-fluid" alt="" width='300' /> */}
                                    </div>
                                    {/* <hr className="my-0" /> */}
                                    <div className="card ">
                                        <div className="card-body p-4">
                                            <h2 class=" fs-1 text-center">Sign in to account</h2>
                                            <p class="text-center"><small>Enter your email &amp; password to login</small></p>
                                            <form>
                                                {/* <div className="mb-3">
                                                    <label className="text-gray-600 small" for="emailExample">Email address</label>
                                                    <div className="input-group">
                                                        <input className="form-control form-control-solid" type="email" name="email" placeholder="" aria-label="Email Address" aria-describedby="emailExample" value={email} onChange={handleInputChange} />
                                                        <button type="button"
                                                            onClick={() => { handleGetOtp(email) }}
                                                            className="btn btn-block btn-l btn_admin" style={{ backgroundColor: "rgb(219, 165, 12)", color: "white" }} >
                                                            <span> GET OTP </span>
                                                        </button>
                                                    </div>

                                                </div> */}

                                                <div className="mb-3">
                                                    <label className="text-gray-600 small" for="otp">Enter Secret Code</label>
                                                    <input className="form-control form-control-solid" type="number" name="otp" placeholder="Enter Secret code" aria-label="otp" aria-describedby="otpExample" onWheel={(e) => e.target.blur()} value={otp}
                                                        onChange={handleInputChange}

                                                    />
                                                    {/* <div className="mb-3">
                                                <label className="text-gray-600 small" for="passwordExample">Password</label>
                                                <input className="form-control form-control-solid" type="password" placeholder="" aria-label="Password" name="password" aria-describedby="passwordExample" value={password} onChange={handleInputChange} />
                                            </div> */}
                                                </div>
                                                <div className="mb-3">
                                                    <label className="text-gray-600 small" htmlFor="passwordExample">Password</label>

                                                    <div className="relative">
                                                        <input
                                                            className="form-control form-control-solid pr-10 w-full"
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Password *"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required />

                                                        <div className="absolute top-1/2 right-3 transform -translate-y-1/2"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            style={{ cursor: 'pointer' }}>
                                                            <img src={showPassword ? "/assets/img/view_close.svg" : "/assets/img/view_icon.svg"}
                                                                alt="Toggle Password" className="w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="mb-2 forgert_password">
                                                    <Link to="forgotpassword">Forgot Password?</Link>
                                                </div> */}
                                                <div>
                                                    {/* <Link className="btn-link text-decoration-none" to="/forgotpassword">Forgot your password?</Link> */}
                                                </div>
                                                <div className="text-center py-3 mt-2">
                                                    <button type="button" className="btn btn-block w-100 btn-xl btn_admin mt-2 px-5" style={{ backgroundColor: "#dba50c", fontSize: "20px ", color: "white" }}
                                                        onClick={() => handleLogin(otp, password)}>
                                                        Login
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;