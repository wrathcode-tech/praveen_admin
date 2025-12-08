// Final AffiliateList.jsx - Safe, Bulletproof Version

import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AffiliateList = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [allData, setAllData] = useState([]);
  const [currency, setCurrency] = useState("INR");
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [investmentData, setInvestmentData] = useState({ amount: '', self_roi_percent: '', uplines: [] });
  const [viewModalData, setViewModalData] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editInvestmentData, setEditInvestmentData] = useState(null);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    LoaderHelper.loaderStatus(true);
    try {
      const result = await AuthService.getaffiliateList();
      if (result?.success) {
        setAffiliates(result?.data || []);
        setAllData(result?.data || []);
      } else {
        alertErrorMessage(result?.message);
      }
    } catch {
      alertErrorMessage("Failed to fetch affiliates");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const openInvestmentModal = async (user) => {
    setSelectedAffiliate(user);
    try {
      const response = await AuthService.getUplines(user?._id);
      if (response.success) {
        setInvestmentData({ amount: '', self_roi_percent: '', uplines: response.uplines?.map(l => ({ ...l, roi_percent: '' })) || [] });
        setShowInvestmentModal(true);
      } else {
        alertErrorMessage("Unable to fetch uplines");
      }
    } catch (e) {
      alertErrorMessage("Failed to load uplines");
    }
  };

  const handleInvestmentSubmit = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const payload = {
        investorId: selectedAffiliate._id,
        amount: parseFloat(investmentData.amount),
        currency: currency,
        self_roi_percent: parseFloat(investmentData.self_roi_percent),
        roi_distribution: investmentData.uplines.map(up => ({
          level: up.level,
          userId: up.user._id,
          percent: parseFloat(up.roi_percent) || 0
        }))
      };
      const response = await AuthService.addAffiliateInvestment(payload);
      if (response.success) {
        alertSuccessMessage("Investment added successfully");
        fetchAffiliates();
        setShowInvestmentModal(false);
      } else {
        alertErrorMessage(response.message);
      }
    } catch {
      alertErrorMessage("Failed to add investment");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const openEditModal = (investment) => {
    if (!investment?._id) return;
    const roiDistribution = (investment.roi_distribution || []).map(roi => ({
      ...roi,
      roi_percent: parseFloat(roi.roi_percent || 0),
    }));

    setEditInvestmentData({
      investmentId: investment._id,
      amount: parseFloat(typeof investment.amount === 'object' ? investment.amount?.$numberDecimal : investment.amount || 0),
      self_roi_percent: parseFloat(investment.self_roi_percent || 0),
      roi_distribution: roiDistribution
    });

    setEditModalVisible(true);
  };

  const handleEditInvestmentSubmit = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const payload = {
        investmentId: editInvestmentData.investmentId,
        amount: parseFloat(editInvestmentData.amount),
        self_roi_percent: parseFloat(editInvestmentData.self_roi_percent),
        roi_distribution: editInvestmentData.roi_distribution.map(up => ({
          level: up.level,
          userId: up.user._id,
          percent: parseFloat(up.roi_percent) || 0
        }))
      };
      const response = await AuthService.editAffiliateInvestment(payload);
      if (response.success) {
        alertSuccessMessage("Investment updated successfully");
        fetchAffiliates();
        setEditModalVisible(false);
        setViewModalData(null)
      } else {
        alertErrorMessage(response.message);
      }
    } catch {
      alertErrorMessage("Failed to update investment");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const openViewModal = (user) => {
    setViewModalData({ user, investments: user.investments || [] });
  };

  const columns = [
    { name: 'Sr No.', selector: (row, idx) => idx + 1, width: '80px' },
    { name: 'Name', selector: row => `${row.firstName} ${row.lastName}` },
    { name: 'Email', selector: row => row.emailId, width: '200px' },
    { name: 'Total Investment', selector: row => parseFloat(row.total_investment || 0).toFixed(2), width: '140px' },
    { name: 'Self ROI Returned', selector: row => parseFloat(row.total_self_roi_returned || 0).toFixed(2), width: '160px' },
    { name: 'Total ROI to Uplines', selector: row => parseFloat(row.total_upline_roi_returned || 0).toFixed(2), width: '180px' },
    // { name: 'Status', selector: row => (row.status), width: '180px' },
    {
      name: 'Actions',
      cell: row => (
        <>
          <button className="btn btn-sm btn-primary me-2" onClick={() => openInvestmentModal(row)}>Add Investment</button>
          <button className="btn btn-sm btn-info" onClick={() => openViewModal(row)}>View Details</button>
        </>
      )
    }
  ];
  const handleStatus = async (_id, status) => {

    await AuthService.updateStatusAffiliate(_id, status).then(
      async (result) => {
        if (result?.success) {
          try {
            fetchAffiliates();
            setViewModalData(null)
            alertSuccessMessage(result?.message);
          } catch (error) {
            alertErrorMessage(error);
          }

        } else {
          alertErrorMessage(result?.message);
        }
      }
    );
  };



  const downloadAffiliateList = (affiliateList, format = 'excel') => {
    if (!affiliateList?.length) {
      alert("No data available to download.");
      return;
    }

    const finalRows = [];

    affiliateList.forEach(user => {
      const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const email = user.emailId || '';

      user.investments?.forEach((inv) => {
        const amount = typeof inv.amount === 'object' ? inv.amount?.$numberDecimal : inv.amount || 0;
        const selfROI = inv.self_roi_percent || 0;
        const roiDist = inv.roi_distribution || [];

        if (roiDist.length === 0) {
          finalRows.push({
            Name: userName,
            Email: email,
            Investment: amount,
            SelfROI: selfROI,
            Level: '',
            ROIPercent: '',
            UplineName: '',
            UplineEmail: ''
          });
        } else {
          roiDist.forEach((roi, index) => {
            const upline = roi.user || {};
            finalRows.push({
              Name: index === 0 ? userName : '',
              Email: index === 0 ? email : '',
              Investment: index === 0 ? amount : '',
              SelfROI: index === 0 ? selfROI : '',
              Level: roi.level,
              ROIPercent: roi.roi_percent,
              UplineName: `${upline.firstName || ''} ${upline.lastName || ''}`.trim(),
              UplineEmail: upline.emailId || ''
            });
          });
        }
      });
    });

    if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(finalRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Affiliate ROI');
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'Affiliate_Investments_ROI.xlsx');
    }

    if (format === 'pdf') {
      const doc = new jsPDF();
      const tableData = finalRows.map(row => [
        row.Name,
        row.Email,
        row.Investment,
        row.SelfROI,
        row.Level,
        row.ROIPercent,
        row.UplineName,
        row.UplineEmail
      ]);

      doc.text('Affiliate Investment ROI Details', 14, 15);
      doc.autoTable({
        startY: 20,
        head: [['User Name', 'Email', 'Investment Amount', 'Self ROI %', 'Level', 'ROI %', 'Upline Name', 'Upline Email']],
        body: tableData,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [0, 102, 204] }
      });

      doc.save('Affiliate_Investments_ROI.pdf');
    }
  };



  const searchPackages = (e) => {
    const term = e.target.value.toLowerCase();
    const keysToSearch = ["emailId", "firstName", "lastName",];
    const filtered = allData.filter(obj =>
      keysToSearch.some(key =>
        obj[key]?.toString().toLowerCase().includes(term)
      )
    );
    setAffiliates(filtered);
  };

  return (
    <div id="layoutSidenav_content">
      <div className="container-xl px-4 mt-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5>Affiliate List</h5>
            <div className="col-5">
              <input style={{ border: "1px solid #ccc" }}
                className="form-control form-control-solid"
                type="text"
                placeholder="Search here..."
                onChange={searchPackages}
              />
            </div>
            <div>
              <button className="btn btn-success btn-sm mx-2" onClick={() => downloadAffiliateList(affiliates, 'excel')}>Export Excel</button>
              <button className="btn btn-danger btn-sm" onClick={() => downloadAffiliateList(affiliates, 'pdf')}>Export PDF</button>
            </div>

          </div>


          <div className="card-body">
            <DataTableBase columns={columns} data={affiliates} pagination={true} />
          </div>
        </div>

        {showInvestmentModal && (
          <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Investment for {selectedAffiliate.firstName} {selectedAffiliate.lastName}</h5>
                  <button className="btn-close" onClick={() => setShowInvestmentModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="form-group mb-2">
                    <label>Currency</label>
                    <select className="form-select form-control shadow-soft-inner" onChange={(e) => setCurrency(e.target.value)} value={currency}>
                      <option value="INR">INR </option>
                      <option value="USD">USD </option>
                      <option value="AED">AED </option>
                      <option value="EUR">EUR </option>
                    </select>

                    {/* <input type="text" className="form-control" value={currency} onChange={e => setCurrency(e.target.value)} /> */}
                  </div>
                  <div className="form-group mb-2">
                    <label>Investment Amount ({currency})</label>
                    <input type="number" className="form-control" value={investmentData.amount} onWheel={(e) => e.target.blur()} onChange={e => setInvestmentData({ ...investmentData, amount: e.target.value })} />
                  </div>
                  <div className="form-group mb-2">
                    <label>Self ROI %</label>
                    <input type="number" className="form-control" value={investmentData.self_roi_percent} onWheel={(e) => e.target.blur()} onChange={e => setInvestmentData({ ...investmentData, self_roi_percent: e.target.value })} />
                  </div>
                  {investmentData.uplines.map((up, i) => (
                    <div className="form-group mb-2" key={i}>
                      <label>Level {up.level} - {up.user.firstName} {up.user.lastName} ({up.user.emailId})</label>
                      <input type="number" className="form-control" onWheel={(e) => e.target.blur()} value={up.roi_percent} onChange={e => {
                        const updated = [...investmentData.uplines];
                        updated[i].roi_percent = e.target.value;
                        setInvestmentData({ ...investmentData, uplines: updated });
                      }} />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowInvestmentModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleInvestmentSubmit}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewModalData && (
          <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Investment Details for {viewModalData.user.firstName} {viewModalData.user.lastName}
                  </h5>
                  <button className="btn-close" onClick={() => setViewModalData(null)}></button>
                </div>
                <div className="modal-body">
                  {viewModalData && (
                    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">
                              Investment Details for {viewModalData.user.firstName} {viewModalData.user.lastName}
                            </h5>
                            <button className="btn-close" onClick={() => setViewModalData(null)}></button>
                          </div>
                          <div className="modal-body">
                            {(Array.isArray(viewModalData.investments) && viewModalData.investments.length > 0) ? (
                              viewModalData.investments.map((inv, idx) => {
                                const amount = typeof inv.amount === 'object'
                                  ? parseFloat(inv.amount?.$numberDecimal || 0)
                                  : parseFloat(inv.amount || 0);

                                return (
                                  <div key={idx} className="border p-3 mb-4 rounded">

                                    <div className="my-2 d-flex justify-content-end">
                                      <h6 className="mx-4">  Update status :</h6>

                                      <button className="btn btn-success btn-sm  me-2" onClick={() => { handleStatus(inv?._id, 'ACTIVE') }} >Active</button>
                                      <button className="btn btn-warning btn-sm  me-2" onClick={() => { handleStatus(inv?._id, 'COMPLETED') }} >Complete</button>
                                      <button className="btn btn-danger btn-sm  me-2" onClick={() => { handleStatus(inv?._id, 'CANCELLED') }} >Cancel</button>
                                    </div>
                                    <h6 className="mb-3">Investment #{idx + 1}</h6>
                                    <p className={`${inv?.status === "ACTIVE" ? "text-success" : inv?.status === "COMPLETED" ? "text-warning" : "text-danger"}`}><strong>Status:</strong> {inv?.status}</p>
                                    <p><strong>Currency:</strong> {inv.currency}</p>
                                    <p><strong>Amount:</strong> {amount.toFixed(2)}</p>
                                    <p><strong>Self ROI :</strong> {inv.self_roi_percent}%</p>
                                    <p><strong>Self ROI Returned:</strong> {parseFloat(inv.total_self_roi_returned || 0).toFixed(2)}</p>
                                    <p><strong>Total ROI to Uplines:</strong> {parseFloat(
                                      (inv.roi_distribution || []).reduce((sum, r) => sum + parseFloat(r.total_returned?.$numberDecimal || r.total_returned || 0), 0)
                                    ).toFixed(2)}</p>

                                    <h6 className="mt-3">Upline ROI Distribution:</h6>
                                    <ul className="mb-3">
                                      {(inv.roi_distribution || []).map((roi, i) => (
                                        <li key={i}>
                                          <strong>Level {roi.level}</strong> — {roi.user?.firstName} {roi.user?.lastName} ({roi.user?.emailId})<br />
                                          ROI : {roi.roi_percent}%
                                          {/* <br /> Returned: {parseFloat(roi.total_returned?.$numberDecimal || 0).toFixed(2)} */}
                                        </li>
                                      ))}
                                    </ul>

                                    <div className="text-end">
                                      <button className="btn btn-sm btn-warning" onClick={() => openEditModal(inv)}>Edit</button>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p>No investment records found.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}


        {editModalVisible && editInvestmentData && (
          <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Investment</h5>
                  <button className="btn-close" onClick={() => setEditModalVisible(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="form-group mb-3">
                    <label><strong>Investment Amount </strong></label>
                    <input
                      type="number"
                      className="form-control"
                      onWheel={(e) => e.target.blur()}
                      value={editInvestmentData.amount || ''}
                      onChange={(e) =>
                        setEditInvestmentData({ ...editInvestmentData, amount: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label><strong>Self ROI %</strong></label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={editInvestmentData.self_roi_percent || ''}
                      onChange={(e) =>
                        setEditInvestmentData({ ...editInvestmentData, self_roi_percent: e.target.value })
                      }
                    />
                  </div>

                  {editInvestmentData.roi_distribution?.map((roi, idx) => (
                    <div className="form-group mb-2" key={idx}>
                      <label>
                        <strong>Level {roi.level}</strong> — {roi.user.firstName} {roi.user.lastName} (
                        {roi.user.emailId})
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        onWheel={(e) => e.target.blur()}
                        placeholder="ROI %"
                        value={roi.roi_percent}
                        onChange={(e) => {
                          const updatedROI = [...editInvestmentData.roi_distribution];
                          updatedROI[idx].roi_percent = e.target.value;
                          setEditInvestmentData({ ...editInvestmentData, roi_distribution: updatedROI });
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditModalVisible(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleEditInvestmentSubmit}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AffiliateList;