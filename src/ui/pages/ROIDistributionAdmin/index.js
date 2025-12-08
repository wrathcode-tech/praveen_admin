import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { alertErrorMessage, alertSuccessMessage } from "../../../customComponent/CustomAlertMessage";
import Swal from "sweetalert2";

const ROIDistributionAdmin = () => {
  const [roiList, setRoiList] = useState([]);

  useEffect(() => {
    fetchROIData();
  }, []);

  const fetchROIData = async () => {
    LoaderHelper.loaderStatus(true);
    try {
      const res = await AuthService.getROIForDistribution();
      if (res?.success) {
        const updatedList = res.data.map((item) => {
          const selfAmount = item.amount * (item.self_roi_percent / 100);
          const upline = item.uplineDistributions.map((dist) => ({
            ...dist,
            calculated_amount: item.amount * (dist.roi_percent / 100),
            updated_amount: item.amount * (dist.roi_percent / 100),
          }));
          return {
            ...item,
            self_calculated_amount: selfAmount,
            self_updated_amount: selfAmount,
            roi_distribution: upline,
          };
        });
        setRoiList(updatedList);
      }
    } catch (err) {
      alertErrorMessage("Failed to fetch ROI data.");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleSelfChange = (index, value) => {
    const updated = [...roiList];
    updated[index].self_updated_amount = parseFloat(value);
    setRoiList(updated);
  };

  const handleUplineChange = (invIndex, distIndex, value) => {
    const updated = [...roiList];
    updated[invIndex].roi_distribution[distIndex].updated_amount = parseFloat(value);
    setRoiList(updated);
  };

  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will distribute ROI to all users.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, distribute it!",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    LoaderHelper.loaderStatus(true);
    try {
      const payload = roiList.map((item) => ({
        investmentId: item.investmentId,
        self_amount: item.self_updated_amount,
        upline: item.roi_distribution.map((dist) => ({
          user: dist.user._id,
          level: dist.level,
          amount: dist.updated_amount,
        })),
      }));

      const res = await AuthService.distributePayoutAffiliate(payload);
      if (res.success) {
        alertSuccessMessage("ROI distributed successfully");
        fetchROIData();
      } else {
        alertErrorMessage(res.message);
      }
    } catch (err) {
      alertErrorMessage("Submission failed.");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleSingleSubmit = async (item) => {
    const result = await Swal.fire({
      title: `Distribute ROI to ${item.investor?.firstName}?`,
      text: "This will distribute ROI to this user and their uplines.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, distribute",
      cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) return;

    LoaderHelper.loaderStatus(true);
    try {
      const payload = {
        investmentId: item.investmentId,
        self_amount: item.self_updated_amount,
        upline: item.roi_distribution.map((dist) => ({
          user: dist.user._id,
          level: dist.level,
          amount: dist.updated_amount,
        })),
      };

      const res = await AuthService.distributePayoutAffiliate([payload]);
      if (res.success) {
        alertSuccessMessage("ROI distributed successfully for this user.");
        fetchROIData();
      } else {
        alertErrorMessage(res.message);
      }
    } catch (err) {
      alertErrorMessage("Failed to distribute ROI.");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  return (
    <div id="layoutSidenav_content">
      <main>
        <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
          <div className="container-xl px-4">
            <div className="page-header-content pt-4">
              <h1 className="page-header-title">
                <div className="page-header-icon"><i className="fas fa-coins" /></div>
                ROI Distribution Panel
              </h1>
            </div>
          </div>
        </header>

        <div className="container-xl px-4 mt-n10">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Distribute ROI</span>
              <button className="btn btn-success btn-sm" onClick={handleSubmit}>
                Distribute All
              </button>
            </div>

            <div className="card-body table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Sr no.</th>
                    <th>Investor</th>
                    <th>Email</th>
                    <th>Investment</th>
                    <th>Self ROI %</th>
                    <th>Self ROI Amount</th>
                    <th>Upline ROI Distribution</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roiList.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.investor?.firstName} {item.investor?.lastName}</td>
                      <td>{item.investor?.emailId}</td>
                      <td>{item.amount} {item.currency}</td>
                      <td>{item.self_roi_percent}%</td>
                      <td>
                        <input
                          type="number"
                          onWheel={(e) => e.target.value}
                          className="form-control form-control-sm"
                          value={item.self_updated_amount}
                          onChange={(e) => handleSelfChange(index, e.target.value)}
                        />
                      </td>
                      <td>
                        <table className="table table-sm mb-0">
                          <thead>
                            <tr>
                              <th>Level</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>ROI %</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.roi_distribution.map((dist, i) => (
                              <tr key={i}>
                                <td>{dist.level}</td>
                                <td>{dist.user?.firstName} {dist.user?.lastName}</td>
                                <td>{dist.user?.emailId}</td>
                                <td>{dist.roi_percent}%</td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    value={dist.updated_amount}
                                    onWheel={(e) => e.target.value}
                                    onChange={(e) => handleUplineChange(index, i, e.target.value)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleSingleSubmit(item)}
                        >
                          Distribute
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {roiList.length === 0 && (
                <div className="text-center py-4">
                  <img src="/assets/img/no-data.png" alt="No Data" width="100" className="mb-2" />
                  <p>No ROI distribution data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ROIDistributionAdmin;
