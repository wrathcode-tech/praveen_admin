import React, { useState } from "react";
import AuthService from "../../../api/services/AuthService";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";

function AddTraders() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email_or_phone: "",
    password: "",
    confirm_password: "",
    referral_code: "",
    country_code: "+91",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateInputs = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})[a-zA-Z0-9!@#$%^&*]+$/;

    if (!nameRegex.test(formData.firstName))
      newErrors.firstName = "First name must be at least 2 letters and alphabets only.";
    if (!nameRegex.test(formData.lastName))
      newErrors.lastName = "Last name must be at least 2 letters and alphabets only.";

    if (!emailRegex.test(formData.email_or_phone))
      newErrors.email_or_phone = "Enter valid email ";

    if (!passwordRegex.test(formData.password))
      newErrors.password =
        "Password must be at least 8 characters, include a number and a special character.";

    if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    LoaderHelper.loaderStatus(true);
    try {
      const res = await AuthService.addTrader(formData);
      if (res.success) {
        alertSuccessMessage("Trader added successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email_or_phone: "",
          password: "",
          confirm_password: "",
          referral_code: "",
          country_code: "+91",
        });
      } else {
        alertErrorMessage(res.message || "Failed to add trader.");
      }
    } catch (error) {
      alertErrorMessage(error?.response?.data?.message || "Something went wrong.");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  return (
    <div id="layoutSidenav_content">
    <div className="container-xl px-4">
      <h1 className="mt-4 mb-3">Add New Trader</h1>
      <div className="card mb-4">
        <div className="card-header">Enter User Details</div>
        <div className="card-body">
          <form>
            <div className="row gx-3 mb-3">
              <div className="col-md-6">
                <label className="small mb-1">First name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
              </div>
              <div className="col-md-6">
                <label className="small mb-1">Last name*</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
              </div>
            </div>

            <div className="row gx-3 mb-3">
              <div className="col-md-6">
                <label className="small mb-1">Email or Mobile*</label>
                <input
                  type="text"
                  className="form-control"
                  name="email_or_phone"
                  placeholder="Enter email or mobile"
                  value={formData.email_or_phone}
                  onChange={handleChange}
                />
                {errors.email_or_phone && (
                  <div className="text-danger">{errors.email_or_phone}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="small mb-1">Password*</label>
                <input
                  type="text"
                  className="form-control"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <div className="text-danger">{errors.password}</div>}
              </div>
            </div>

            <div className="row gx-3 mb-3">
              <div className="col-md-6">
                <label className="small mb-1">Confirm Password*</label>
                <input
                  type="text"
                  className="form-control"
                  name="confirm_password"
                  placeholder="Re-enter password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
                {errors.confirm_password && (
                  <div className="text-danger">{errors.confirm_password}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="small mb-1">Referral Code (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  name="referral_code"
                  placeholder="Referral Code"
                  value={formData.referral_code}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="button" className="btn btn-indigo" onClick={handleSubmit}>
              Submit Details
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AddTraders;
