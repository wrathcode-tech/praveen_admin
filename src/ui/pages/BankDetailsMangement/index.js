import React, { useState, useEffect } from "react";
import { alertErrorMessage, alertSuccessMessage, } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import AuthService from "../../../api/services/AuthService";
import { $ } from "react-jquery-plugin";


const BankDetailsManagement = () => {

  const [bankName, setBankName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [holderName, setHolderName] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [branchName, setBranchName] = useState("");
  const [bankDetails, setBankDetails] = useState([]);
  const [id, setId] = useState("")

  useEffect(() => {
    handleBankAcc();
  }, []);

  const handleBankAccDetails = async (accNumber, bankName, branchName, holderName, id, ifsc) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.addBankAccount(accNumber, bankName, branchName, holderName, id, ifsc).then(async (result) => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          alertSuccessMessage("Bank details updated successfully");
          setBankName("");
          setAccNumber("");
          setHolderName("");
          setIfsc("");
          setBranchName("");
          $("#bank_modal").modal("hide");
          handleBankAcc()
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
      }
    });
  };

  const handleBankAcc = async () => {
    LoaderHelper.loaderStatus(true);
    await AuthService.getAccDetails().then(async (result) => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          setBankDetails(result?.data);
          if (result?.data?.length > 0) {
            let bank = result?.data[0]
            setBankName(bank?.bank_name)
            setAccNumber(bank?.account_number)
            setHolderName(bank?.holder_name)
            setIfsc(bank?.ifsc)
            setBranchName(bank?.branch)
          }
          setId(result?.data[0]?._id)
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
      }
    });
  };

  return (
    <>
      <div id="layoutSidenav_content">
        <main>
          <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
            <div className="container-xl px-4">
              <div className="page-header-content pt-4">
                <div className="row align-items-center justify-content-between">
                  <div className="col-auto mt-4">
                    <h1 className="page-header-title">
                      <div className="page-header-icon">
                        <i className="fa fa-wallet"></i>
                      </div>
                      Bank Details Management
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </header>
          {/* {/ Main page content /} */}
          <div className="container-xl px-4 mt-n10">
            <div className="row">
              <div className="col-xl-8">
                <div className="row">
                  <div className="col-md-6">
                    <div class="card mb-4">
                      <div className="card-body d-flex justify-content-center flex-column p-3 m-3 ">
                        <div className="d-flex align-items-center justify-content-start mb-4 ">
                          <h5 className="mb-0">Bank Account Details</h5>
                        </div>
                        <hr className="mt-0" />
                        {bankDetails.map((item) => (
                          <>
                            <div className="w-100">
                              <div className="d-flex mb-2 align-items-center justify-content-between">
                                <strong>Bank Name</strong>
                                <span>{item?.bank_name}</span>
                              </div>
                            </div>
                            <div className="w-100">
                              <div className="d-flex mb-2 align-items-center justify-content-between">
                                <strong>Account Number</strong>
                                <span>{item?.account_number}</span>
                              </div>
                            </div>
                            <div className="w-100">
                              <div className="d-flex mb-2 align-items-center justify-content-between">
                                <strong>Account Holder Name</strong>
                                <span>{item?.holder_name}</span>
                              </div>
                            </div>
                            <div className="w-100">
                              <div className="d-flex mb-2 align-items-center justify-content-between">
                                <strong>IFSC</strong>
                                <span>{item?.ifsc}</span>
                              </div>
                            </div>
                            <div className="w-100">
                              <div className="d-flex mb-2 align-items-center justify-content-between">
                                <strong>Branch Name</strong>
                                <span>{item?.branch}</span>
                              </div>
                            </div>
                          </>
                        ))}
                        <form>
                          <div className="row mt-2">
                            <div className="col">
                              <button class="btn btn-primary btn-block w-100 mt-2" data-bs-toggle="modal" data-bs-target="#bank_modal" type="button">
                                Edit
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal" id="bank_modal" tabindex="-1" role="dialog" aria-hidden="true">
            {/* // aria-labelledby="transfer_modal_modalTitle" */}
            <div class="modal-dialog  alert_modal" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalCenterTitle">
                    Add Bank Account
                  </h5>
                  <button class="btn-close" type="button" data-bs-dismiss="modal" ria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group  mb-3 position-relative ">
                      <label class="small mb-1"> Bank Name </label>
                      <input class="form-control  form-control-solid input-copy" value={bankName} type="text" placeholder="Enter Bank Name" onChange={(e) => setBankName(e.target.value)}></input>
                    </div>
                    <div className="form-group  mb-3 position-relative ">
                      <label class="small mb-1"> Account Number</label>
                      <input class="form-control  form-control-solid input-copy" type="text" laceholder="Enter Account Number" value={accNumber} onChange={(e) => setAccNumber(e.target.value)}></input>
                    </div>
                    <div className="form-group  mb-3 position-relative ">
                      <label class="small mb-1"> Account Holder Name </label>
                      <input class="form-control  form-control-solid input-copy" type="text" laceholder="Enter Account Holder Name" value={holderName} onChange={(e) => setHolderName(e.target.value)}></input>
                    </div>
                    <div className="form-group  mb-3 position-relative ">
                      <label class="small mb-1"> IFSC Code </label>
                      <input class="form-control  form-control-solid input-copy" type="text" placeholder="Enter IFSC" value={ifsc} onChange={(e) => setIfsc(e.target.value)}></input>
                    </div>
                    <div className="form-group  mb-3 position-relative ">
                      <label class="small mb-1"> Branch Name </label>
                      <input class="form-control  form-control-solid input-copy" type="text" laceholder="Enter Branch Name" value={branchName} onChange={(e) => setBranchName(e.target.value)}></input>
                    </div>
                    <div className="form-group mb-3 position-relative">
                      <button class="btn btn-primary btn-block w-100" type="button" onClick={() => handleBankAccDetails(accNumber, bankName, branchName, holderName, id, ifsc)}>
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default BankDetailsManagement;