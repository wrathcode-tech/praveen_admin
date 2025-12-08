import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import AuthService from '../../../api/services/AuthService';
import LoaderHelper from '../../../customComponent/Loading/LoaderHelper';
import { alertErrorMessage, alertSuccessMessage } from '../../../customComponent/CustomAlertMessage';
import { ApiConfig } from '../../../api/apiConfig/ApiConfig';
import { $ } from 'react-jquery-plugin';

function UserBank() {
  const [bankList, setBankList] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [showImage, setShowImage] = useState("");


  const handleImageDetail = (img) => {
    setShowImage(img);
    $("#image_modal").modal("show");
  };


  useEffect(() => {
    fetchBankDetails();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, statusFilter, bankList]);

  const fetchBankDetails = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const response = await AuthService.userBank();
      LoaderHelper.loaderStatus(false);
      if (response?.success) {
        setBankList(response.data || []);
      } else {
        alertErrorMessage(response.message || 'Failed to fetch bank details');
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage('Server error while fetching bank details');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      LoaderHelper.loaderStatus(true);
      const res = await AuthService.updateBankStatus(id,status);
      LoaderHelper.loaderStatus(false);
      if (res?.success) {
        alertSuccessMessage(`Bank marked as ${status}`);
        fetchBankDetails();
      } else {
        alertErrorMessage(res.message || 'Failed to update status');
      }
    } catch (error) {
      LoaderHelper.loaderStatus(false);
      alertErrorMessage('Server error while updating status');
    }
  };

  const filterData = () => {
    let data = [...bankList];

    if (statusFilter !== 'All') {
      data = data.filter(item => item.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(item =>
        item?.user_id?.firstName?.toLowerCase().includes(term) ||
        item?.user_id?.lastName?.toLowerCase().includes(term) ||
        item?.user_id?.emailId?.toLowerCase().includes(term)
      );
    }

    setFilteredBanks(data);
  };

  function imageFormatter(row) {
    return (
      <img style={{ width: "40%", height: "auto" }} src={ApiConfig?.appUrl + row?.bankProof} alt="Selfie" className="table-img cursor_pointer" data-bs-toggle="modal" data-bs-target="#image_modal" onClick={() => handleImageDetail(ApiConfig?.appUrl + row?.bankProof)
      } />
    );
  };

  const columns = [
    {
      name: 'User',
      selector: row => `${row?.user_id?.firstName || ''} ${row?.user_id?.lastName || ''}`,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Email',
      selector: row => row?.user_id?.emailId,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Fiat Type',
      selector: row => row.fiatType,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Bank Name',
      selector: row => row.bank_name,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Account No',
      selector: row => row.account_number,
      sortable: true,
      wrap: true,
    },
    {
      name: 'IFSC/SWIFT',
      selector: row => row.ifsc_code,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Bank Proof',
      selector: imageFormatter,
      wrap: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      wrap: true,
      cell: row => <span className={`badge bg-${getStatusColor(row.status)}`}>{row.status}</span>,
    },
    {
      name: 'Actions',
      cell: row =>
        row.status === 'Pending' ? (
          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={() => handleStatusUpdate(row._id, 'Active')}>Approve</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleStatusUpdate(row._id, 'Rejected')}>Reject</button>
          </div>
        ) : (
          <span className="text-muted">—</span>
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      width: "200px",
      button: true,
      wrap: true,
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Rejected': return 'danger';
      default: return 'warning';
    }
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
                    <div className="page-header-icon"><i className="far fa-user"></i></div>
                    User Bank Management
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container-xl px-4 mt-n10">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>User Bank Details</span>
              <div className="d-flex gap-2">
                <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <input
                  className="form-control form-control-solid"
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="card-body">
              <DataTable
                columns={columns}
                data={filteredBanks}
                pagination
                highlightOnHover
                striped
                responsive
                noDataComponent="No matching bank records found"
              />
            </div>
          </div>
        </div>
      </main>
    </div>

<div
className="modal image_modal"
id="image_modal"
tabindex="-1"
role="dialog"
aria-labelledby="exampleModalCenterTitle"
aria-hidden="true"
>
<div className="modal-dialog  alert_modal modal-lg" role="document">
    <div className="modal-content">
        <button
            className="btn-close"
            type="button"
            data-bs-dismiss="modal"
            aria-label="Close"
        ></button>
        <div className="ratio ratio-16x9">
            <img src={showImage} className="w-100 cc_modal_img " alt="" />
        </div>
    </div>
</div>
</div>

</>
  );
}

export default UserBank;
