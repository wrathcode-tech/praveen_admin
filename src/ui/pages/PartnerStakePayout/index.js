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

const PartnerStakePayout = () => {
    const [partnersList, setPartnersList] = useState([]);
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(2025);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [totalData, setTotalData] = useState(0);
  
    const skip = (currentPage - 1) * itemsPerPage;
    const pageCount = Math.ceil(totalData / itemsPerPage);
  
    useEffect(() => {
      payoutList();
    }, [currentPage, itemsPerPage]);
  
    const payoutList = async (searchTerm = search) => {
      LoaderHelper.loaderStatus(true);
      try {
        const result = await AuthService.payoutList(skip, itemsPerPage, month, year, searchTerm);
        if (result?.success) {
          setPartnersList(result?.data);
          setTotalData(result.totalCount);
        }
      } catch {
        alertErrorMessage("Failed to fetch data");
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
      payoutList();
    };
  
    const resetSearch = () => {
      setMonth("");
      setSearch("");
      setYear(2025);
      setCurrentPage(1);
      payoutList("");
    };
  
    const handlePageChange = ({ selected }) => {
      setCurrentPage(selected + 1);
    };
  
    const columns = [
      { name: 'Sr No.', selector: (row, idx) => skip + idx + 1, width: '80px' },
      { name: 'User', selector: row => `${row.userInfo?.firstName} ${row.userInfo?.lastName}`, wrap: true },
      { name: 'Email', selector: row => row.userInfo?.emailId, wrap: true, width: '180px' },
      { name: 'Currency', selector: row => row.currency, width: '100px' },
      { name: 'Amount', selector: row => row.amount, width: '100px' },
      { name: 'Payout No.', selector: row => row.payout_no, width: '100px' },
      { name: 'Date', selector: row => moment(row.createdAt).format('MMMM Do YYYY, h:mm A'), width: '200px' },
      { name: 'Status', selector: row => row.status || 'N/A', width: '100px' },
      { name: 'Note', selector: row => row.note || '--', wrap: true },
    ];
  
    // Excel Export
    const exportExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(partnersList.map(row => ({
        SrNo: columns[0].selector(row, 0),
        User: `${row.userInfo?.firstName} ${row.userInfo?.lastName}`,
        Email: row.userInfo?.emailId,
        Currency: row.currency,
        Amount: row.amount,
        PayoutNo: row.payout_no,
        Date: moment(row.createdAt).format('YYYY-MM-DD HH:mm'),
        Status: row.status,
        Note: row.note
      })));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Payouts");
      XLSX.writeFile(workbook, `Payouts_${month || 'all'}_${year || 'all'}.xlsx`);
    };
  
    // PDF Export
    const exportPDF = () => {
      const doc = new jsPDF({ orientation: "landscape" });
      doc.text("Partner Stake Payouts", 14, 16);
      const tableColumn = columns.map(col => col.name);
      const tableRows = partnersList.map((row, idx) => [
        skip + idx + 1,
        `${row.userInfo?.firstName} ${row.userInfo?.lastName}`,
        row.userInfo?.emailId,
        row.currency,
        row.amount,
        row.payout_no,
        moment(row.createdAt).format('YYYY-MM-DD HH:mm'),
        row.status,
        row.note || ""
      ]);
      doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
      doc.save(`Payouts_${month || 'all'}_${year || 'all'}.pdf`);
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
                                            Partners Stake
                                        </h1>
                                    </div>
                                    <div className="col-auto mt-4">
                                    <div className="">
                  <button className="btn btn-success me-2" disabled={partnersList?.length ===0} onClick={exportExcel}>Export Excel</button>
                  <button className="btn btn-danger" disabled={partnersList?.length ===0} onClick={exportPDF}>Export PDF</button>
                </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="card mb-4">
                            <div className="card-header">
                                <div className="row w-100">
                                    <div className="col-12 col-md-3 mb-3">
                                        <h5 className="mb-0">Partners Details</h5>
                                    </div>

                                    <div className="col-12 col-md-9">
                                        <div className="row g-2">

                                            <div className="col-6 col-md-3">
                                                <label className="form-label">Choose Month</label>
                                                <select
                                                    className="form-select"
                                                    value={month}
                                                    onChange={(e) => setMonth(e.target.value)}
                                                >
                                                    <option value="">-- Month --</option>
                                                    {moment.months().map((m, index) => (
                                                        <option key={index + 1} value={index + 1}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-6 col-md-3">
                                                <label className="form-label">Choose Year</label>
                                                <select
                                                    className="form-select"
                                                    value={year}
                                                    onChange={(e) => setYear(e.target.value)}
                                                >
                                                    <option value="">-- Year --</option>
                                                    {[2025, 2026].map((y) => (
                                                        <option key={y} value={y}>{y}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-12 col-md-3">
                                                <label className="form-label">Search</label>
                                                <input
                                                    type="search"
                                                    className="form-control"
                                                    placeholder="Search by email or name"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                />
                                            </div>

                                            <div className="col-6 col-md-2 d-grid">
                                                <label className="form-label d-none d-md-block">&nbsp;</label>
                                                <button className="btn btn-primary" onClick={handleSearch} disabled={!month && !search} >
                                                    Filter
                                                </button>
                                            </div>

                                            <div className="col-6 col-md-1 d-grid">
                                                <label className="form-label d-none d-md-block">&nbsp;</label>
                                                <button className="btn btn-secondary" onClick={resetSearch}>
                                                    Reset
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body mt-3">
                                {partnersList.length === 0 ? <h6 className="ifnoData"><img alt="" src="assets/img/no-data.png" /> <br />No Data Available</h6> :
                                    <> <div className="table-responsive" width="100%">
                                        <DataTableBase columns={columns} data={partnersList} pagination={false} />
                                    </div>
                                        {totalData > itemsPerPage ?
                                            <div className="row mt-5">  <div className="form-group mb-4 col-2">
                                                <select className="form-select form-control shadow-soft-inner" onChange={(e) => setItemsPerPage(e.target.value)}>
                                                    <option>100</option>
                                                    <option>500</option>
                                                    <option>1000</option>
                                                    <option>2000</option>
                                                </select></div>
                                                <div className="col-10">
                                                    <ReactPaginate
                                                        pageCount={pageCount}
                                                        onPageChange={handlePageChange}
                                                        containerClassName={'customPagination'}
                                                        activeClassName={'active'}
                                                    /> </div>
                                            </div> : ""}
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default PartnerStakePayout;