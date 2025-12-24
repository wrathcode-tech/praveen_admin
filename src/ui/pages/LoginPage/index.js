import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [errors, setErrors] = useState({});

    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const otpRegex = /^\d{6}$/;

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!passwordRegex.test(password)) {
            newErrors.password = "Password must have at least 8 characters with one uppercase, one lowercase, one number and one special character (#?!@$%^&*-)";
        }

        // OTP validation
        if (!verificationCode) {
            newErrors.verificationCode = "OTP verification code is required";
        } else if (verificationCode.length !== 6) {
            newErrors.verificationCode = "OTP must be exactly 6 digits";
        } else if (!otpRegex.test(verificationCode)) {
            newErrors.verificationCode = "OTP must contain only digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            return;
        }
        LoaderHelper.loaderStatus(true);
        await AuthService.login(email, password, verificationCode).then(async result => {
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

    const handleGetOtp = async () => {
        if (!email) {
            setErrors({ ...errors, email: "Email is required to get OTP" });
            return;
        }
        if (!emailRegex.test(email)) {
            setErrors({ ...errors, email: "Please enter a valid email address" });
            return;
        }
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


                        <div className="px-4 login_right_s">

                            <div className="logo_cntr">
                                <img src="/assets/img/Vorienx_white.svg" className="img-fluid" alt="" width='300' />
                            </div>

                            <div className="row justify-content-center">
                                <div className="login_form_cntr">

                                    <div className="card-body p-4 text-center">
                                        {/* <img src="/assets/img/logo_dark.svg" className="img-fluid" alt="" width='300' /> */}
                                    </div>
                                    {/* <hr className="my-0" /> */}
                                    <div className="card ">
                                        <div className="card-body p-4">
                                            <h2 className="fs-1 text-center">Sign in to account</h2>
                                            <p className="text-center"><small>Enter your email, password &amp; OTP to login</small></p>
                                            <form>
                                                {/* Email Field */}
                                                <div className="mb-3">
                                                    <label className="text-gray-600 small" htmlFor="emailExample">Email Address</label>
                                                    <div className="input-group">
                                                        <input
                                                            className={`form-control form-control-solid ${errors.email ? 'is-invalid' : ''}`}
                                                            type="email"
                                                            name="email"
                                                            placeholder="Enter your email"
                                                            aria-label="Email Address"
                                                            aria-describedby="emailExample"
                                                            value={email}
                                                            onChange={(e) => {
                                                                setEmail(e.target.value);
                                                                if (errors.email) setErrors({ ...errors, email: '' });
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleGetOtp}
                                                            className="btn btn-block btn-l btn_admin"
                                                            style={{ backgroundColor: "rgb(52 51 50)", color: "white" }}>
                                                            <span>GET OTP</span>
                                                        </button>
                                                    </div>
                                                    {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                                                </div>

                                                {/* Password Field */}
                                                <div className="mb-3">
                                                    <label className="text-gray-600 small" htmlFor="passwordExample">Password</label>
                                                    <div className="relative">
                                                        <input
                                                            className={`form-control form-control-solid pr-10 w-full ${errors.password ? 'is-invalid' : ''}`}
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Password *"
                                                            value={password}
                                                            onChange={(e) => {
                                                                setPassword(e.target.value);
                                                                if (errors.password) setErrors({ ...errors, password: '' });
                                                            }}
                                                            required
                                                        />
                                                        <div
                                                            className="absolute top-1/2 right-3 transform -translate-y-1/2"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            style={{ cursor: 'pointer' }}>
                                                            <img
                                                                src={showPassword ? "/assets/img/view_close.svg" : "/assets/img/view_icon.svg"}
                                                                alt="Toggle Password"
                                                                className="w-5 h-5"
                                                            />
                                                        </div>
                                                    </div>
                                                    {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                                                    <small className="text-muted">Min 8 chars with uppercase, lowercase, number & special char</small>
                                                </div>

                                                {/* OTP Verification Code Field */}
                                                <div className="mb-3">
                                                    <label className="text-gray-600 small" htmlFor="verificationCode">OTP Verification Code</label>
                                                    <input
                                                        className={`form-control form-control-solid ${errors.verificationCode ? 'is-invalid' : ''}`}
                                                        type="text"
                                                        name="verificationCode"
                                                        placeholder="Enter 6-digit OTP"
                                                        aria-label="verificationCode"
                                                        maxLength={6}
                                                        value={verificationCode}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                            setVerificationCode(value);
                                                            if (errors.verificationCode) setErrors({ ...errors, verificationCode: '' });
                                                        }}
                                                    />
                                                    {errors.verificationCode && <div className="text-danger small mt-1">{errors.verificationCode}</div>}
                                                </div>

                                                <div className="text-center py-3 mt-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-block w-100 btn-xl btn_admin mt-2 px-5"
                                                        style={{ backgroundColor: "rgb(52 51 50)", fontSize: "20px", color: "white" }}
                                                        onClick={handleLogin}>
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