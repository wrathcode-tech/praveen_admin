import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import moment from "moment";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PartnershipWithdrawal = () => {
    const [partnersList, setPartnersList] = useState([]);
    const [allData, setAllData] = useState([]);
    const [distributionArray, setDistributionArray] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);


    // Initialize editable state when data is loaded
    useEffect(() => {
        const initialDistribution = allData.map(row => ({
            investor_id: row.user_id,
            earning_id: row._id,
            emailId: row?.userInfo?.emailId ,
            name: row?.userInfo?.firstName + row?.userInfo?.lastName  ,
            amount: (row.return_percentage_monthly * row.invested_amount) / 100,
            note: `Auto monthly ROI payout #${row.payout_count + 1}`

        }));
        setDistributionArray(initialDistribution);
    }, [allData]);


    const handleAmountChange = (index, newAmount) => {
        const updated = [...distributionArray];
        updated[index].amount = parseFloat(newAmount) || 0;
        setDistributionArray(updated);
    };
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(partnersList.map(row => row._id));
        }
        setSelectAll(!selectAll);
    };

    const toggleSelectSingle = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };


    const statuslinkFollow = (row, index) => {
        return (
            <div>
                <input
                    type="number"
                    className="form-control form-control-solid"
                    placeholder="Enter amount"
                    value={distributionArray[index]?.amount || ''}
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                />
                <button
                    className="btn btn-indigo my-2"
                    type="button"
                    onClick={() => distributeOne(index)}
                >
                    Distribute
                </button>
            </div>
        );
    };

    const handleNoteChange = (index, newNote) => {
        const updated = [...distributionArray];
        updated[index].note = newNote;
        setDistributionArray(updated);
      };
      



    const columns = [
        { name: (<input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />), cell: row => (<input type="checkbox" checked={selectedIds.includes(row._id)} onChange={() => toggleSelectSingle(row._id)} />), width: '60px' },
        { name: 'Sr no.', selector: (row, index) => index + 1, wrap: true },
        {
            name: 'Note',
            width: '290px',
            selector: (row, index) => (
              <input
                type="text"
                className="form-control form-control"
                placeholder={`Auto monthly ROI payout #${row?.payout_count + 1}`}
                value={distributionArray[index]?.note || `Auto monthly ROI payout #${row?.payout_count + 1}`}
                onChange={(e) => handleNoteChange(index, e.target.value)}
              />
            ),
            wrap: true,
          },          
        { name: 'Distribute', sort: true, width: "160px", selector: statuslinkFollow, },
        { name: 'Plan Purchase Date', width: "140px", sort: true, selector: row => moment.utc(row?.start_date).format('MMMM Do YYYY'), wrap: true },
        { name: 'Last Payout Date', width: "140px", sort: true, selector: row => row?.last_payout_date ? moment.utc(row?.last_payout_date).format('MMMM Do YYYY') : "— Not yet paid —", wrap: true },
        { name: 'Name', selector: row => `${row?.userInfo?.firstName || "--"} ${row?.userInfo?.lastName || "--"}`, wrap: true },
        { name: 'Email', width: "100px", wrap: true, selector: row => row?.userInfo?.emailId },
        { name: 'Invested Amount', width: "120px", sort: true, wrap: true, selector: row => `${row?.invested_amount} ${row?.currency}` },
        { name: 'Expected Return', width: "120px", sort: true, wrap: true, selector: row => `${row?.expected_return} ${row?.currency}` },
        { name: 'Returned Amount', width: "120px", sort: true, wrap: true, selector: row => `${row?.returned_amount} ${row?.currency}` },
        { name: 'Payout Count', width: "120px", sort: true, wrap: true, selector: row => row?.payout_count },
        { name: 'Monthly ROI %', width: "120px", sort: true, selector: row => row?.return_percentage_monthly, wrap: true },
        { name: 'Yearly ROI %', sort: true, selector: row => row?.return_percentage_yearly, },

    ];

    function searchObjects(e) {
        const keysToSearch = ["emailId", "firstName", "lastName"];
        const userInput = e.target.value;
        const searchTerm = userInput?.toLowerCase();
        const matchingObjects = allData.filter(obj => {
            return keysToSearch.some(key => obj?.userInfo[key]?.toString()?.toLowerCase()?.includes(searchTerm));
        });
        setPartnersList(matchingObjects);
    };

    const exportToExcel = (data, filename = "distribution") => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Distributions");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
      };
      
      const exportToPDF = (data, filename = "distribution") => {
        const doc = new jsPDF();
      
        const tableColumn = ["#", "Investor Name", "Email", "Amount", "Note", "Status"];
        const tableRows = data.map((item, index) => [
          index + 1,
          item.name,
          item.emailId,
          item.amount,
          item.note || "--",
          item.status
        ]);
      
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 20,
          theme: 'grid',
        });
      
        doc.save(`${filename}.pdf`);
      };
      

    const distributeOne = async (index) => {
        const data = distributionArray[index];

        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to distribute ₹${data.amount} to this user.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, distribute'
        });

        if (!confirmation.isConfirmed) return;

        LoaderHelper.loaderStatus(true);

        await AuthService.distributePayout([data]) // send as array
            .then(async result => {
                LoaderHelper.loaderStatus(false);
                if (result?.success) {
                    handlePartners();
                    const distributionTable = `
                    <div style="max-height:400px; overflow:auto;">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Investor Name</th>
                                <th>Email</th>
                                <th>Amount</th>
                                <th>Note</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${result.results.map((item, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.name}</td>
                                    <td>${item.emailId}</td>
                                    <td>${item.amount}</td>
                                    <td>${item.note}</td>
                                    <td>
                                        <span class="badge bg-${item.status === 'SUCCESS' ? 'success' : 'danger'}">
                                            ${item.status}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        
                        </tbody>
                    </table>
                    </div>
                `;

                await Swal.fire({
                    title: 'Distribution Summary',
                    html: distributionTable,
                    width: '900px',
                    confirmButtonText: 'Close',
                    showCancelButton: true,
                    cancelButtonText: 'Download Excel',
                    showDenyButton: true,
                    denyButtonText: 'Download PDF',
                  }).then((resultSwal) => {
                    if (resultSwal.isDenied) {
                      exportToPDF(result.results, "distribution-summary");
                    } else if (resultSwal.dismiss === Swal.DismissReason.cancel) {
                      exportToExcel(result.results, "distribution-summary");
                    }
                  });
                   
                } else {
                    Swal.fire('Error', result?.message, 'error');
                }
            })
            .catch(err => {
                LoaderHelper.loaderStatus(false);
                Swal.fire('Error', err?.message || 'Something went wrong', 'error');
            });
    };


    const handleDistributeSelected = async () => {
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to distribute to ${selectedIds.length} selected user(s).`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, distribute'
        });
    
        if (confirmation.isConfirmed) {
            LoaderHelper.loaderStatus(true);
    
            const selectedDistributions = allData
                .map((row, index) => ({
                    investor_id: row.user_id,
                    earning_id: row._id,
                    name:  distributionArray[index]?.name,
                    emailId:  distributionArray[index]?.emailId,
                    amount: distributionArray[index]?.amount || 0
                }))
                .filter(row => selectedIds.includes(row.earning_id));
    
            try {
                const result = await AuthService.distributePayout(selectedDistributions);
                LoaderHelper.loaderStatus(false);
    
                if (result?.success) {
                    setSelectedIds([]);
                    setSelectAll(false);
                    handlePartners();
    
                    const distributionTable = `
                        <div style="max-height:400px; overflow:auto;">
                        <table class="table table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Investor Name</th>
                                    <th>Email</th>
                                    <th>Amount</th>
                                    <th>Note</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${result.results.map((item, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${item.name}</td>
                                        <td>${item.emailId}</td>
                                        <td>${item.amount}</td>
                                        <td>${item.note}</td>
                                        <td>
                                            <span class="badge bg-${item.status === 'SUCCESS' ? 'success' : 'danger'}">
                                                ${item.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            
                            </tbody>
                        </table>
                        </div>
                    `;
    
                    await Swal.fire({
                        title: 'Distribution Summary',
                        html: distributionTable,
                        width: '900px',
                        confirmButtonText: 'Close',
                        showCancelButton: true,
                        cancelButtonText: 'Download Excel',
                        showDenyButton: true,
                        denyButtonText: 'Download PDF',
                      }).then((resultSwal) => {
                        if (resultSwal.isDenied) {
                          exportToPDF(result.results, "distribution-summary");
                        } else if (resultSwal.dismiss === Swal.DismissReason.cancel) {
                          exportToExcel(result.results, "distribution-summary");
                        }
                      });
                } else {
                    Swal.fire('Error', result?.message || 'Distribution failed', 'error');
                }
            } catch (err) {
                LoaderHelper.loaderStatus(false);
                Swal.fire('Error', err?.message || 'Something went wrong', 'error');
            }
        }
    };
        



    useEffect(() => {
        handlePartners()
    }, []);

    const handlePartners = async () => {
        LoaderHelper.loaderStatus(true);
        await AuthService.userSubscriptions(0, 100000000, "ACTIVE").then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    setPartnersList(result?.data.reverse());
                    setAllData(result?.data);

                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
            }
        });
    }


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
                                            Investor Withdrawal
                                        </h1>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between">Partners Details
                                <div className="col-5">
                                    <input className="form-control form-control-solid" id="inputLastName" type="search" placeholder="Search here..." name="search" onChange={searchObjects} />
                                </div>
                                <button className="btn btn-indigo my-2" type="button" disabled={selectedIds?.length === 0} onClick={handleDistributeSelected}>Distribute to Selected ({selectedIds.length})</button>
                            </div>
                            <div className="card-body mt-3">
                                {partnersList.length === 0 ? <h6 className="ifnoData"><img alt="" src="assets/img/no-data.png" /> <br />No Data Available</h6> :
                                    <div className="table-responsive" >
                                        <DataTableBase columns={columns} data={partnersList} />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default PartnershipWithdrawal;