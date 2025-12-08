import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Partnership = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [partnersList, setPartnersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalData, setTotalData] = useState(0);
  const [roiEdits, setRoiEdits] = useState({});
  console.log("🚀 ~ Partnership ~ roiEdits:", roiEdits)


  const skip = (currentPage - 1) * itemsPerPage;
  const pageCount = Math.ceil(totalData / itemsPerPage);

  useEffect(() => {
    fetchPartners();
  }, [currentPage, itemsPerPage, statusFilter]);

  const fetchPartners = async () => {
    LoaderHelper.loaderStatus(true);
    try {
      const result = await AuthService.userSubscriptions(skip, itemsPerPage, statusFilter);
      if (result?.success) {
        const data = result?.data.reverse();
        setPartnersList(data);
        setTotalData(result.totalCount);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch {
      alertErrorMessage("Failed to fetch investors");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
const [formData, setFormData] = useState({
  planId: '',
  investAmount: '',
  emailId: ''
});
const [errors, setErrors] = useState({});



const validateForm = () => {
  const errs = {};
  if (!formData.planId) errs.planId = "Plan ID is required";
  if (!formData.investAmount || isNaN(formData.investAmount)) errs.investAmount = "Valid investment amount is required";
  if (!formData.emailId || !/\S+@\S+\.\S+/.test(formData.emailId)) errs.emailId = "Valid email is required";
  setErrors(errs);
  return Object.keys(errs).length === 0;
};

const handleCreateInvestorSubmit = async () => {
  if (!validateForm()) return;

  try {
    LoaderHelper.loaderStatus(true)
    const result = await AuthService.createInvestor(
      formData.planId,
      parseFloat(formData.investAmount),
      formData.emailId
    );
    if (result?.success) {
      alertSuccessMessage(result?.message);
      setShowCreateModal(false);
      setFormData({ planId: '', investAmount: '', emailId: '' });
      fetchPartners();
    } else {
      alertErrorMessage(result?.message);
    }
  } catch {
    alertErrorMessage("Failed to create investor");
  } finally {
    LoaderHelper.loaderStatus(false);
  }
};

  

  const handlePageChange = ({ selected }) => setCurrentPage(selected + 1);

  const handleStatus = async (id, newStatus) => {
    LoaderHelper.loaderStatus(true);
    try {
      const result = await AuthService.updateInvestorStatus(id, newStatus);
      if (result?.success) {
        alertSuccessMessage(result?.message);
        fetchPartners();
      } else {
        alertErrorMessage(result?.message);
      }
    } catch {
      alertErrorMessage("Failed to update status");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const filterByStatus = e => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Excel export
  const exportExcel = () => {
    const wsData = partnersList.map((row, idx) => ({
      SrNo: skip + idx + 1,
      Date: moment(row.start_date).format("YYYY-MM-DD"),
      Name: `${row.userInfo?.firstName} ${row.userInfo?.lastName}`,
      Email: row.userInfo?.emailId,
      Currency: row.currency,
      Invested: row.invested_amount,
      Returned: row.returned_amount,
      Expected: row.expected_return,
      Duration: row.duration_days,
      PayoutCount: row.payout_count,
      MonthlyROI: row.return_percentage_monthly,
      YearlyROI: row.return_percentage_yearly,
      Status: row.status
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Investors");
    XLSX.writeFile(wb, `Investors_${statusFilter}_${Date.now()}.xlsx`);
  };

  // PDF export
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Investors List", 14, 16);
    const columns = [
      "Sr no.",
      "Date",
      "Name",
      "Email",
      "Currency",
      "Invested",
      "Returned",
      "Expected",
      "Duration",
      "PayoutCount",
      "MonthlyROI",
      "YearlyROI",
      "Status"
    ];
    const rows = partnersList.map((row, idx) => [
      skip + idx + 1,
      moment(row.start_date).format("YYYY-MM-DD"),
      `${row.userInfo?.firstName} ${row.userInfo?.lastName}`,
      row.userInfo?.emailId,
      row.currency,
      row.invested_amount,
      row.returned_amount,
      row.expected_return,
      row.duration_days,
      row.payout_count,
      row.return_percentage_monthly,
      row.return_percentage_yearly,
      row.status
    ]);
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
      styles: { fontSize: 8 }
    });
    doc.save(`Investors_${statusFilter}_${Date.now()}.pdf`);
  };


  const handleROIChange = (id, type, value) => {
    setRoiEdits(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type === 'monthly' ? 'return_percentage_monthly' : 'return_percentage_yearly']: value
      }
    }));
  
    setPartnersList(prev =>
      prev.map(item =>
        item._id === id
          ? {
              ...item,
              [type === 'monthly' ? 'return_percentage_monthly' : 'return_percentage_yearly']: value
            }
          : item
      )
    );
  };
  

  const updateROI = async (id) => {
    const updateData = roiEdits[id];
    console.log("🚀 ~ updateROI ~ updateData:", updateData)
    if (!updateData) return;
  
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.updateInvestorRoi(id, updateData);
      if (result?.success) {
        alertSuccessMessage("ROI updated successfully");
        setRoiEdits(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        fetchPartners(); // optional: refresh data
      } else {
        alertErrorMessage(result?.message);
      }
    } catch {
      alertErrorMessage("Failed to update ROI");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };
  


  const columns = [
    { name: 'Sr no.', selector: (row, idx) => skip + idx + 1, width: '80px' },
    {
      name: 'Plan Purchase Date',
      selector: row => moment(row.start_date).format('MMMM Do YYYY'),
      sort: true,
      wrap: true,
      width: '160px'
    },
    {
      name: 'Name',
      selector: row => `${row.userInfo?.firstName || "--"} ${row.userInfo?.lastName || "--"}`,
      wrap: true
    },
    { name: 'Email', selector: row => row.userInfo?.emailId, wrap: true, width: '180px' },
    { name: 'Currency', selector: row => row.currency, width: '100px' },
    { name: 'Invested Amount', selector: row => row.invested_amount, sort: true, width: '140px' },
    { name: 'Returned Amount', selector: row => row.returned_amount, sort: true, width: '140px' },
    { name: 'Expected Return', selector: row => row.expected_return, sort: true, width: '140px' },
    { name: 'Duration Days', selector: row => row.duration_days, sort: true, width: '140px' },
    { name: 'Payout Count', selector: row => row.payout_count, sort: true, width: '120px' },
    {
      name: 'Monthly ROI %',
      cell: row => (
        <input
          type="number"
          className="form-control form-control-sm"
          value={row.return_percentage_monthly}
          onWheel={(e)=>e.target.blur()}
          onChange={e => handleROIChange(row._id, 'monthly', e.target.value)}
        />
      ),
      width: '140px'
    },
    {
      name: 'Yearly ROI %',
      cell: row => (
        <input
          type="number"
          className="form-control form-control-sm"
          value={row.return_percentage_yearly}
          onWheel={(e)=>e.target.blur()}
          onChange={e => handleROIChange(row._id, 'yearly', e.target.value)}
        />
      ),
      width: '140px'
    },
    {
      name: 'Status',
      cell: row => (
        <select
          className="form-select form-select-sm"
          value={row.status}
          onChange={e => handleStatus(row._id, e.target.value)}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      ),
      sort: true,
      width: '140px',
      wrap: true
    },

    {
      name: 'Actions',
      cell: row => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => updateROI(row._id)}
          disabled={!roiEdits[row._id]} // disable if no change made
        >
          Update ROI
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px'
    }
    
  ];

  return (
    <>
    <div id="layoutSidenav_content">
      <main>
        <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
          <div className="container-xl px-4">
            <div className="page-header-content pt-4">
              <h1 className="page-header-title">
                <div className="page-header-icon"><i className="far fa-user" /></div>
                Investors List
              </h1>
            </div>
          </div>
        </header>

        <div className="container-xl px-4 mt-n10">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center ">
              <div> 
              <span className="mx-4">Investors Details</span>
              <button className="btn btn-primary btn-md" onClick={() => setShowCreateModal(true)}>
  Create Investor
</button></div>
              <div className="d-flex gap-2">
                <select className="form-select" value={statusFilter} onChange={filterByStatus}>
                  <option value="all">All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <button className="btn btn-success btn-sm" onClick={exportExcel}>Export Excel</button>
                <button className="btn btn-danger btn-sm" onClick={exportPDF}>Export PDF</button>
              </div>
            </div>

            <div className="card-body">
              {partnersList.length === 0 ? (
                <div className="text-center py-5">
                  <img src="assets/img/no-data.png" alt="No Data" />
                  <p className="mt-3">No Data Available</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <DataTableBase
                      columns={columns}
                      data={partnersList}
                      pagination={false}
                      highlightOnHover
                    />
                  </div>

                  {totalData > itemsPerPage && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <select
                        className="form-select w-auto"
                        value={itemsPerPage}
                        onChange={e => setItemsPerPage(Number(e.target.value))}
                      >
                        {[50, 100, 200, 500].map(n => (
                          <option key={n} value={n}>{n} per page</option>
                        ))}
                      </select>
                      <ReactPaginate
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        containerClassName="pagination"
                        activeClassName="active"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    {showCreateModal && (
  <div
    className="modal fade show d-block"
    tabIndex="-1"
    role="dialog"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    aria-labelledby="create_investor_modal"
    aria-modal="true"
  >
    <div className="modal-dialog alert_modal" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Create Investor</h5>
          <button
            className="btn-close"
            type="button"
            onClick={() => setShowCreateModal(false)}
            aria-label="Close"
          ></button>
        </div>

        <div className="modal-body">
          <form>
            <div className="form-group mb-3 position-relative">
              <label className="small mb-1">Plan ID</label>
              <input
                type="text"
                className={`form-control form-control-solid input-copy ${
                  errors.planId ? "is-invalid" : ""
                }`}
                placeholder="Enter Plan ID"
                value={formData.planId}
                onChange={(e) =>
                  setFormData({ ...formData, planId: e.target.value })
                }
              />
              {errors.planId && (
                <div className="invalid-feedback">{errors.planId}</div>
              )}
            </div>

            <div className="form-group mb-3 position-relative">
              <label className="small mb-1">Investment Amount</label>
              <input
                type="number"
                className={`form-control form-control-solid input-copy ${
                  errors.investAmount ? "is-invalid" : ""
                }`}
                placeholder="Enter Amount"
                value={formData.investAmount}
                onChange={(e) =>
                  setFormData({ ...formData, investAmount: e.target.value })
                }
              />
              {errors.investAmount && (
                <div className="invalid-feedback">{errors.investAmount}</div>
              )}
            </div>

            <div className="form-group mb-3 position-relative">
              <label className="small mb-1">Email ID</label>
              <input
                type="email"
                className={`form-control form-control-solid input-copy ${
                  errors.emailId ? "is-invalid" : ""
                }`}
                placeholder="Enter Email"
                value={formData.emailId}
                onChange={(e) =>
                  setFormData({ ...formData, emailId: e.target.value })
                }
              />
              {errors.emailId && (
                <div className="invalid-feedback">{errors.emailId}</div>
              )}
            </div>

            <div className="form-group mb-3 position-relative">
              <button
                className="btn btn-primary btn-block w-100"
                type="button"
                onClick={handleCreateInvestorSubmit}
              >
                Create Investor
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}


</>
    
  );
};

export default Partnership;
