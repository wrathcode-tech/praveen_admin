import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { alertSuccessMessage, alertErrorMessage } from "../../../customComponent/CustomAlertMessage";

const AdminFiatBankList = () => {
  const [bankList, setBankList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  const fetchData = async () => {
    LoaderHelper.loaderStatus(true);
    try {
      const res = await AuthService.getFiatAccounts();
      if (res.success) {
        setBankList(res.data);
      } else {
        alertErrorMessage("Failed to fetch bank accounts");
      }
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditData({ ...bankList[index] });
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditData({});
  };

  const handleSave = async () => {
    LoaderHelper.loaderStatus(true);
    try {
      const res = await AuthService.updateFiatAccounts(editData);
      if (res.success) {
        alertSuccessMessage("Bank account updated");
        setEditIndex(null);
        fetchData();
      } else {
        alertErrorMessage(res.message);
      }
    } catch (e) {
      alertErrorMessage("Error updating bank");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  return (
    <div id="layoutSidenav_content">
      <div className="card">
    <div className="container-xl px-4 mt-4">
      <h2>Fiat Bank Accounts</h2>
      <div className="table-responsive mt-4">
        <table className="table custom-table">
          <thead>
            <tr>
              <th>Currency</th>
              <th>Account Holder</th>
              <th>Account Number</th>
              <th>Bank Name</th>
              <th>Country</th>
              <th>IFSC</th>
              <th>SWIFT</th>
              <th>IBAN</th>
              <th>Notes</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bankList.map((item, idx) => (
              <tr key={item._id}>
                <td>
                  <input
                    className="form-control form-control-sm"
                    value={item.currency}
                    disabled
                  />
                </td>

                {editIndex === idx ? (
                  <>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        value={editData.account_holder_name}
                        onChange={(e) =>
                          handleChange("account_holder_name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        value={editData.account_number}
                        onChange={(e) =>
                          handleChange("account_number", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        value={editData.bank_name}
                        onChange={(e) =>
                          handleChange("bank_name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        value={editData.country}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        value={editData.ifsc_code || ""}
                        onChange={(e) =>
                          handleChange("ifsc_code", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        value={editData.swift_code || ""}
                        onChange={(e) =>
                          handleChange("swift_code", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        value={editData.iban || ""}
                        onChange={(e) =>
                          handleChange("iban", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        value={editData.notes || ""}
                        onChange={(e) =>
                          handleChange("notes", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <span className={editData.is_active ? "text-success" : "text-danger"}>
                        {editData.is_active ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.account_holder_name}</td>
                    <td>{item.account_number}</td>
                    <td>{item.bank_name}</td>
                    <td>{item.country}</td>
                    <td>{item.ifsc_code}</td>
                    <td>{item.swift_code}</td>
                    <td>{item.iban}</td>
                    <td>{item.notes}</td>
                    <td>
                      <span className={item.is_active ? "text-success" : "text-danger"}>
                        {item.is_active ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditClick(idx)}
                      >
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
};

export default AdminFiatBankList;
