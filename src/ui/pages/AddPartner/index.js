import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertSuccessMessage, alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import Swal from 'sweetalert2';

const CreateEarningPackage = () => {
  const [formData, setFormData] = useState({
    currencyId: "",
    duration_days: 365,
    return_percentage_monthly: "",
    return_percentage_yearly: "",
    min_amount: "",
    max_amount: "",
  });

  const [currencyList, setCurrencyList] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [editedPackage, setEditedPackage] = useState({});
  console.log("🚀 ~ CreateEarningPackage ~ editedPackage:", editedPackage)

  useEffect(() => {
    fetchAllPackageList();
    fetchCurrencyList();
  }, []);

  const fetchCurrencyList = async () => {
    try {
      const result = await AuthService.getCoinList();
      if (result?.success) {
        setCurrencyList(result?.data);
      }
    } catch {
      alertErrorMessage("Failed to fetch currencies");
    }
  };

  const fetchAllPackageList = async () => {
    try {
      const result = await AuthService.allPackageList();
      if (result?.success) {
        setPackageList(result?.data);
      }
    } catch {
      alertErrorMessage("Failed to fetch packages");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { currencyId, duration_days, return_percentage_monthly, return_percentage_yearly, min_amount, max_amount } = formData;
    if (!currencyId || !duration_days || !return_percentage_monthly || !return_percentage_yearly || !min_amount || !max_amount) {
      return alertErrorMessage("All fields are required.");
    }

    try {
      const result = await AuthService.addPackage(currencyId, +duration_days, +return_percentage_monthly, +return_percentage_yearly, +min_amount, +max_amount);
      if (result?.success) {
        alertSuccessMessage(result?.message);
        setFormData({
          currencyId: "",
          duration_days: 365,
          return_percentage_monthly: "",
          return_percentage_yearly: "",
          min_amount: "",
          max_amount: "",
        });
        fetchAllPackageList();
      } else {
        alertErrorMessage(result?.message);
      }
    } catch {
      alertErrorMessage("Something went wrong.");
    }
  };

  const handleEditChange = (e, id) => {
    const { name, value } = e.target;
    setEditedPackage(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [name]: value
      }
    }));
  };

  const savePackageEdit = async (id) => {
    try {
      const data = editedPackage[id];
      console.log("🚀 ~ savePackageEdit ~ data:", data)
      const result = await AuthService.editPackage(id, data);
      if (result?.success) {
        alertSuccessMessage("Package updated successfully");
        setEditingPackageId(null);
        setEditedPackage({});
        fetchAllPackageList();
      } else {
        alertErrorMessage(result?.message);
      }
    } catch {
      alertErrorMessage("Failed to update package");
    }
  };

  const toggleStatus = async (pkg) => {
    try {
      const newStatus = pkg.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const result = await AuthService.updatePackageStatus(pkg._id, newStatus);
      if (result?.success) {
        alertSuccessMessage("Status updated");
        fetchAllPackageList();
      } else {
        alertErrorMessage(result?.message);
      }
    } catch {
      alertErrorMessage("Failed to update status");
    }
  };


  const deletePackage = async (pkg) => {
    console.log("🚀 ~ deletePackage ~ pkg:", pkg)
    
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the package for ${pkg.currency}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (confirm.isConfirmed) {
      try {
        const result = await AuthService.deletePackage(pkg._id);
        if (result?.success) {
          alertSuccessMessage("Package Deleted");
          fetchAllPackageList();
        } else {
          alertErrorMessage(result?.message);
        }
      } catch {
        alertErrorMessage("Failed to delete package");
      }
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
                    <div className="page-header-icon"><i className="fas fa-box"></i></div>
                    Create Earning Package
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container-xl px-4 mt-n10">
          <div className="card mb-4">
            <div className="card-header">New Package Details</div>
            <div className="card-body">
              <form className="row gx-3 mb-3">
                {/* Currency Select */}
                <div className="col-md-6">
                  <label className="small mb-1">Currency <em>*</em></label>
                  <select className="form-select" name="currencyId" value={formData.currencyId} onChange={handleChange}>
                    <option value="">Select Currency</option>
                    {currencyList.map(currency => (
                      <option key={currency._id} value={currency._id}>{currency.name} ({currency.short_name})</option>
                    ))}
                  </select>
                </div>

                {/* Form Inputs */}
                {["duration_days", "return_percentage_monthly", "return_percentage_yearly", "min_amount", "max_amount"].map((field, i) => (
                  <div key={i} className="col-md-6">
                    <label className="small mb-1">{field.replace(/_/g, ' ').toUpperCase()} <em>*</em></label>
                    <input type="number" name={field} value={formData[field]} onChange={handleChange} className="form-control" />
                  </div>
                ))}
              </form>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Create Package
              </button>
            </div>
          </div>

          {/* Packages Table */}
          {packageList.map((group, i) => (
            <div key={i} className="card mb-4">
              <div className="card-header">
                {/* <img src={`${ApiConfig?.appUrl}${group[0].icon_path}`} alt="coin" width="20" className="me-2" /> */}
                {group[0].currency_fullname} ({group[0].currency})
              </div>
              <div className="card-body table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Plan Id</th>
                      <th>Duration</th>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Monthly %</th>
                      <th>Yearly %</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.map(pkg => (
                      <tr key={pkg._id}>
                         <td>
                          <span className={` dge`}>
                            {pkg.plan_id}
                          </span>
                        </td>
                        {["duration_days", "min_amount", "max_amount", "return_percentage_monthly", "return_percentage_yearly"].map(key => (
                          
                          <td key={key}>
                            {editingPackageId === pkg._id ? (
                              <input
                                type="number"
                                className="form-control"
                                value={editedPackage[pkg._id]?.[key] ?? pkg[key]}
                                name={key}
                                onChange={(e) => handleEditChange(e, pkg._id)}
                              />
                            ) : (
                              pkg[key]
                            )}
                          </td>
                        ))}
                        <td>
                          <span className={`badge ${pkg.status === "ACTIVE" ? "bg-success" : "bg-danger"}`}>
                            {pkg.status}
                          </span>
                        </td>
                       
                        <td>
                          {editingPackageId === pkg._id ? (
                            <>
                              <button className="btn btn-success btn-sm me-2" onClick={() => savePackageEdit(pkg._id)}>Save</button>
                              <button className="btn btn-secondary btn-sm" onClick={() => setEditingPackageId(null)}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button className="btn btn-warning btn-sm me-2" onClick={() => {setEditingPackageId(pkg._id);setEditedPackage({[pkg._id]:pkg})}}>Edit</button>
                              <button className="btn btn-outline-primary btn-sm me-2" onClick={() => toggleStatus(pkg)}>
                                Change Status
                              </button>
                              <button className="btn btn-outline-danger btn-sm  " onClick={() => deletePackage(pkg)}>
                              Delete Package
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CreateEarningPackage;
