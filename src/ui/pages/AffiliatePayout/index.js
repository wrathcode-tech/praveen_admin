import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ROIPayoutHistoryAdmin = () => {
  const [payoutListData, setPayoutListData] = useState([]);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(2025);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [totalData, setTotalData] = useState(0);

  const skip = (currentPage - 1) * itemsPerPage;
  const pageCount = Math.ceil(totalData / itemsPerPage);

  useEffect(() => {
    fetchROIHistory();
  }, [currentPage, itemsPerPage]);

  const fetchROIHistory = async (searchTerm = search) => {
    LoaderHelper.loaderStatus(true);
    try {
      const result = await AuthService.payoutListAffiliate(skip, itemsPerPage, month, year, searchTerm);
      if (result?.success) {
        setPayoutListData(result?.data);
        setTotalData(result.totalCount);
      }
    } catch {
      alertErrorMessage("Failed to fetch ROI history data");
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const handleSearch = () => {
    if (!month && !search) {
      alertErrorMessage("Please select month or enter search term.");
      return;
    }
    setCurrentPage(1);
    fetchROIHistory();
  };

  const resetSearch = () => {
    setMonth("");
    setSearch("");
    setYear(2025);
    setCurrentPage(1);
    fetchROIHistory("");
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const columns = [
    { name: 'Sr No.', selector: (row, idx) => skip + idx + 1, width: '80px' },
    {
      name: 'Investor',
      selector: row => `${row.investorInfo?.firstName} ${row.investorInfo?.lastName}`,
      wrap: true,
    },
    {
      name: 'Email',
      selector: row => row.investorInfo?.emailId,
      wrap: true,
      width: '180px'
    },
    { name: 'Currency', selector: row => row.currency, width: '100px' },
    { name: 'Self ROI', selector: row => row.self_amount, width: '100px' },
    {
      name: 'Upline ROI',
      selector: row => row.upline?.length > 0
        ? row.upline.map(u =>
          `L${u.level}: ${u.amount} (${u.userInfo?.firstName || 'N/A'} ${u.userInfo?.lastName || ''})`
        ).join(", ")
        : '-',
      wrap: true
    },
    {
      name: 'Date',
      selector: row => moment(row.createdAt).format('MMMM Do YYYY, h:mm A'),
      width: '200px'
    },
  ];

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      payoutListData.map((row, idx) => ({
        SrNo: skip + idx + 1,
        Investor: `${row.investorInfo?.firstName} ${row.investorInfo?.lastName}`,
        Email: row.investorInfo?.emailId,
        Currency: row.currency,
        Self_ROI: row.self_amount,
        Upline_ROI: (row.upline || []).map(u =>
          `L${u.level}: ${u.amount} (${u.userInfo?.firstName || 'N/A'} ${u.userInfo?.lastName || ''} - ${u.userInfo?.emailId || ''})`
        ).join(" | "),
        Date: moment(row.createdAt).format('YYYY-MM-DD HH:mm'),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ROI_Payouts");
    XLSX.writeFile(workbook, `ROI_Payouts_${month || 'all'}_${year || 'all'}.xlsx`);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("ROI Payout History", 14, 16);

    const tableColumn = ["Sr No.", "Investor", "Email", "Currency", "Self ROI", "Upline ROI", "Date"];
    const tableRows = payoutListData.map((row, idx) => [
      skip + idx + 1,
      `${row.investorInfo?.firstName} ${row.investorInfo?.lastName}`,
      row.investorInfo?.emailId,
      row.currency,
      row.self_amount,
      (row.upline || []).map(u =>
        `L${u.level}: ${u.amount} (${u.userInfo?.firstName || 'N/A'} ${u.userInfo?.lastName || ''})`
      ).join("\n"),
      moment(row.createdAt).format('YYYY-MM-DD HH:mm'),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      columnStyles: { 5: { cellWidth: 70 } }
    });

    doc.save(`ROI_Payouts_${month || 'all'}_${year || 'all'}.pdf`);
  };

  return (
    <div id="layoutSidenav_content">
      <div className="container-xl px-4">
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">ROI Payout History</h5>
            <div>
              <button className="btn btn-success me-2" disabled={payoutListData.length === 0} onClick={exportExcel}>Export Excel</button>
              <button className="btn btn-danger" disabled={payoutListData.length === 0} onClick={exportPDF}>Export PDF</button>
            </div>
          </div>

          <div className="card-body">
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label className="form-label">Choose Month</label>
                <select className="form-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                  <option value="">-- Month --</option>
                  {moment.months().map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Choose Year</label>
                <select className="form-select" value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">-- Year --</option>
                  {[2025, 2026].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Search</label>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by name/email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <button className="btn btn-primary me-2" onClick={handleSearch}>Filter</button>
                <button className="btn btn-secondary" onClick={resetSearch}>Reset</button>
              </div>
            </div>

            {payoutListData.length === 0 ? (
              <div className="text-center py-4">
                <img src="/assets/img/no-data.png" alt="No Data" width="100" className="mb-2" />
                <p>No payout data available</p>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <DataTableBase columns={columns} data={payoutListData} pagination={false} />
                </div>
                {totalData > itemsPerPage && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <select className="form-select w-auto" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                      <option>100</option>
                      <option>500</option>
                      <option>1000</option>
                      <option>2000</option>
                    </select>
                    <ReactPaginate
                      pageCount={pageCount}
                      onPageChange={handlePageChange}
                      containerClassName={'customPagination'}
                      activeClassName={'active'}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIPayoutHistoryAdmin;
