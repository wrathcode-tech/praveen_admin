import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthService from "../../../api/services/AuthService";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import DataTableBase from "../../../customComponent/DataTable";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const UserDetailsPage = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const userType = sessionStorage.getItem('userType');

    const fetchData = async () => {
        LoaderHelper.loaderStatus(true);
        try {
            const result = await AuthService.completeDetailsUser(userId); // Replace with your actual service method
            if (result && result?.success) {
                setUserDetails(result);
            } else {
                console.error("Failed to fetch user details");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };

    const handleDownloadPDF = () => {
        const data = userDetails;
        const doc = new jsPDF();

        // Constants for Layout
        const margin = 20;

        // Helper: Add Header/Footer
        const addHeaderFooter = (isNewPage = false) => {
            if (isNewPage) {
                doc.addPage();
            }

            // Header
            doc.setFontSize(16);
            doc.setTextColor(40, 44, 99);
            doc.text("CV Trade User Report", margin, 15);

            // Footer
            doc.setFontSize(10);
            const pageCount = doc.internal.getNumberOfPages();
            doc.text(`Page ${pageCount}`, doc.internal.pageSize.width - margin, doc.internal.pageSize.height - 10, {
                align: "right",
            });
        };

        // Add Header to the First Page
        addHeaderFooter();

        // Section: User Details
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);

        const userDetailss = data.userDetails;
        autoTable(doc, {
            startY: 35,
            body: [
                ["Email", userDetailss.emailId],
                ["Mobile", userDetailss.mobileNumber],
                ["Status", userDetailss.status],
            ],
            theme: "grid",
        });

        // Section: Wallet Transactions
        const walletTransactions = data.walletTransactions;
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [["Category", "Value"]],
            body: [
                ["Total Deposit Transactions", walletTransactions.totalDepositTransactions],
                ["Total Withdrawal Transactions", walletTransactions.totalWithdrawalTransactions],
                ["Total Admin Credit Transactions", walletTransactions.totalAdminCreditTransactions],
                ["Total Admin Debit Transactions", walletTransactions.totalAdminDebitTransactions],
            ],
            theme: "grid",
        });

        // Section: User Wallets
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            head: [["Currency", "Balance", "Locked Balance", "Bonus"]],
            body: data.userWallets.map((wallet) => [
                wallet.short_name,
                wallet.balance,
                wallet.locked_balance,
                wallet.bonus,
            ]),
            theme: "striped",
        });

        // Section:Total Deposit Transactions
        doc.setFontSize(14); // Title font size
        doc.setTextColor(0, 0, 0); // Black color for the title
        const depositTitleYY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 20; // Adjust position based on the last table
        doc.text("Total Deposits", margin, depositTitleYY); // Title position
        autoTable(doc, {
            startY: depositTitleYY + 10,
            head: [["#", "Currency", "Amount",]],
            body: data.walletTransactions.totalDepositsByCurrency.map((transaction, index) => [
                index + 1,
                transaction.currency,
                transaction.amount,
            ]),
            theme: "grid",
            styles: { overflow: "linebreak", cellWidth: "wrap" }, // Enable text wrapping
        });
        // Section:total Withdrawn
        doc.setFontSize(14); // Title font size
        doc.setTextColor(0, 0, 0); // Black color for the title
        const withdrawTitleYY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 20; // Adjust position based on the last table
        doc.text("Total Withdrawn", margin, withdrawTitleYY); // Title position
        autoTable(doc, {
            startY: withdrawTitleYY + 10,
            head: [["#", "Currency", "Amount",]],
            body: data.walletTransactions.totalWithdrawalsByCurrency.map((transaction, index) => [
                index + 1,
                transaction.currency,
                transaction.amount,
            ]),
            theme: "grid",
            styles: { overflow: "linebreak", cellWidth: "wrap" }, // Enable text wrapping
        });

        // Section: Deposit Transactions
        doc.setFontSize(14); // Title font size
        doc.setTextColor(0, 0, 0); // Black color for the title
        const depositTitleY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 20; // Adjust position based on the last table
        doc.text("Deposit Transactions", margin, depositTitleY); // Title position
        autoTable(doc, {
            startY: depositTitleY + 10,
            head: [["#", "Currency", "Amount", "Hash", "Date"]],
            body: data.depositTransactions.map((transaction, index) => [
                index + 1,
                transaction.short_name,
                transaction.amount,
                transaction.transaction_hash || "Transferred From CV Bot",
                new Date(transaction.createdAt).toLocaleDateString(),
            ]),
            theme: "grid",
            styles: { overflow: "linebreak", cellWidth: "wrap" }, 
            columnStyles: {
                0: { cellWidth: 15 }, // Adjust width of the first column
                1: { cellWidth: 30 }, // Adjust width of the second column (Currency)
                2: { cellWidth: 40 }, // Adjust width of the third column (Amount)
                3: { cellWidth: 60 }, // Adjust width of the fourth column (Hash)
                4: { cellWidth: 50 }, // Adjust width of the fifth column (Date)
            },// Enable text wrapping
        });

        // Section: Withdrawal Transactions
        doc.setFontSize(14); // Title font size
        doc.setTextColor(0, 0, 0); // Black color for the title
        const withdrawalTitleY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 20; // Adjust position based on the last table
        doc.text("Withdrawal Transactions", margin, withdrawalTitleY); // Title position
        autoTable(doc, {
            startY: withdrawalTitleY + 10,
            head: [["#", "Currency", "Amount", "Fee", "Status", "To Address", "Date"]],
            body: data.withdrawalTransactions.map((transaction, index) => [
                index + 1,
                transaction.short_name,
                transaction.amount,
                transaction.fee,
                transaction.status,
                transaction.to_address,
                new Date(transaction.createdAt).toLocaleDateString(),
            ]),
            theme: "striped",
            styles: { overflow: "linebreak", cellWidth: "wrap" }, // Enable text wrapping
            columnStyles: {
                0: { cellWidth: 15 }, // Adjust width of the first column (#)
                1: { cellWidth: 25 }, // Adjust width of the second column (Currency)
                2: { cellWidth: 25 }, // Adjust width of the third column (Amount)
                3: { cellWidth: 15 }, // Adjust width of the fourth column (Fee)
                4: { cellWidth: 40 }, // Adjust width of the fifth column (Status)
                5: { cellWidth: 50 }, // Adjust width of the sixth column (To Address)
                6: { cellWidth: 40 },
            },//
        });

        // Save the PDF
        const docName = `${data.userDetails.firstName || data.userDetails.emailId}_Report.pdf`;
        doc.save(docName);
    };



    useEffect(() => {
        if (userId) fetchData();
    }, [userId]);
    useEffect(() => {
        if (userType !== "1") {
            alertErrorMessage("Not Authorized for this information")
            navigate(-1)
        }
    }, [userType]);

    //   if (isLoading) {
    //     return <LoaderHelper />;
    //   }
    const navigate = useNavigate()
    if (!userDetails) {
        return <>
            <div id="layoutSidenav_content">
                <main>
                    <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                        <div className="container-xl px-4">
                            <div className="page-header-content pt-4">
                                <button
                                    className="btn btn-light btn-icon"
                                    onClick={() => navigate(-1)} // Go back to the previous page
                                    style={{ marginRight: "10px" }}
                                    title="Go Back"
                                >
                                    <i className="fa fa-arrow-left"></i>
                                </button>
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-auto mt-4">

                                        <h1 className="page-header-title d-inline-block">
                                            <div className="page-header-icon"><i className="fa fa-user"></i></div>
                                            User Details
                                        </h1>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        {/* User Information */}
                        <div className="card mb-4">
                            <div className="card-header">
                                <h4>No Data Found</h4>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    }

    const {
        userDetails: userInfo,
        walletTransactions = {}, // Provide default empty object
        userWallets = [],
        userOrderbook = [],
        depositTransactions = [],
        withdrawalTransactions = [],
        adminDebitTransactions = [],
        adminCreditTransactions = [],
        quickBuySellTransactions = [],
    } = userDetails;

    // Handle null or empty walletTransactions gracefully
    const {
        totalDepositTransactions = 0,
        totalWithdrawalTransactions = 0,
        totalAdminCreditTransactions = 0,
        totalAdminDebitTransactions = 0,
        totalDepositsByCurrency = [],
        totalWithdrawalsByCurrency = [],
    } = walletTransactions || {};

    // Table columns for wallet and orderbook data
    const walletColumns = [
        { name: "Currency", selector: (row) => row.short_name || "-", sortable: true },
        { name: "Balance", selector: (row) => row.balance?.toFixed(6) || 0, sortable: true },
        { name: "Locked Balance", selector: (row) => row.locked_balance?.toFixed(6) || 0, sortable: true },
        { name: "Bonus", selector: (row) => row.bonus?.toFixed(6) || 0, sortable: true },
    ];

    const orderbookColumns = [
        { name: "Sr no.", width: "100px", selector: (row, index) => userOrderbook?.indexOf(row) + 1, },
        { name: "Date/Time", width: "200px", selector: (row) => new Date(row.createdAt).toLocaleString() || "-", sortable: true },
        { name: "Order Type", selector: (row) => row.order_type || "-", },
        { name: "Pay Currency", selector: (row) => row?.pay_currency },
        { name: "Get Currency", selector: (row) => row?.ask_currency },
        { name: "Side", selector: (row) => <span className={`${row.side === "BUY" ? "text-success" : "text-danger"} `}>{row.side || "-"} </span> },
        { name: "Price", selector: (row) => row.price?.toFixed(6) || 0, sortable: true },
        { name: "Quantity", selector: (row) => row.quantity?.toFixed(6) || 0, sortable: true },
        { name: "Remaining", selector: (row) => row.remaining?.toFixed(6) || 0, sortable: true },
        { name: "Status", selector: (row) => row.status || "-", sortable: true },
    ];

    const quickBuySellColumns = [
        { name: "Sr no.", width: "100px", selector: (row, index) => quickBuySellTransactions?.indexOf(row) + 1, },
        { name: "Date/Time", width: "200px", selector: (row) => new Date(row.updatedAt).toLocaleString() || "-", sortable: true },
        { name: "Pay Currency", selector: (row) => row?.from },
        { name: "Get Currency", selector: (row) => row?.to },
        { name: "Side", selector: (row) => <span className={`${row.side === "BUY" ? "text-success" : "text-danger"} `}>{row.side || "-"} </span> },
        { name: "Pay Amount", selector: (row) => row.pay_amount?.toFixed(6) || 0, sortable: true },
        { name: "Get Amount", selector: (row) => row.get_amount?.toFixed(6) || 0, sortable: true },
        { name: "Price", selector: (row) => row.price?.toFixed(6) || "N/A", sortable: true },
        { name: "Fee Percentage", selector: (row) => row.fee_percentage?.toFixed(6) || "N/A", sortable: true },
        { name: "Fee", selector: (row) => row.fee?.toFixed(6) || 0, sortable: true },
    ];

    const renderTransactions = (transactions, title) => (
        <div className="card mb-4">
            <div className="card-header">
                <h4>{title}</h4>
            </div>
            <div className="card-body">
                {transactions.length > 0 ? (
                    <ol>
                        {transactions.map((txn, index) => (
                            <React.Fragment key={index} >
                                <li >
                                    <strong>{txn.short_name}:</strong> {txn.amount} <br />
                                    <strong>Status:</strong> <span className={`text-${txn.status === "SUCCESS" ? "success" : txn.status === "REJECTED" ? "danger" : "warning"}`}> {txn.status || "N/A"} </span><br />
                                    <strong>Transaction Hash:</strong> {txn.transaction_hash || "N/A"} <br />
                                    <strong>From:</strong> {txn.from_address || "N/A"} <br />
                                    <strong>To:</strong> {txn.to_address || "N/A"} <br />
                                    <strong>fee:</strong> {txn.fee || "N/A"} <br />
                                    {txn?.description?.includes("CV Bot") &&

                                        <>    <strong>Description:</strong> {txn.description || "N/A"} <br />
                                            <strong>Cv Bot fee:</strong> {txn.cvBotfee || "N/A"} <br />
                                            <strong>Cv Bot ID:</strong> {txn.cvBotID || "N/A"} <br />
                                        </>}
                                    <strong>Date:</strong> {new Date(txn.createdAt).toLocaleString()}
                                </li>
                                <hr />
                            </React.Fragment>
                        ))}
                    </ol>
                ) : (
                    <p>No {title.toLowerCase()} found.</p>
                )}
            </div>
        </div>
    );

    const renderAdminTransactions = (transactions, title) => (
        <div className="card mb-4">
            <div className="card-header">
                <h4>{title}</h4>
            </div>
            <div className="card-body">
                {transactions.length > 0 ? (
                    <ol>
                        {transactions.map((txn, index) => (
                            <React.Fragment key={index} >
                                <li >
                                    <strong>{txn.short_name}:</strong> {txn.amount} <br />
                                    <strong>Amount:</strong> {txn.amount || "N/A"} <br />
                                    <strong>Description:</strong> {txn.description || "N/A"} <br />
                                    <strong>Date:</strong> {new Date(txn.createdAt).toLocaleString()}
                                </li>
                                <hr />
                            </React.Fragment>
                        ))}
                    </ol>
                ) : (
                    <p>No {title.toLowerCase()} found.</p>
                )}
            </div>
        </div>
    );

    return (
        <div id="layoutSidenav_content">
            <main>
                <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                    <div className="container-xl px-4">
                        <div className="page-header-content pt-4">
                            <button
                                className="btn btn-light btn-icon"
                                onClick={() => navigate(-1)} // Go back to the previous page
                                style={{ marginRight: "10px" }}
                                title="Go Back"
                            >
                                <i className="fa fa-arrow-left"></i>
                            </button>
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto mt-4">

                                    <h1 className="page-header-title d-inline-block">
                                        <div className="page-header-icon"><i className="fa fa-user"></i></div>
                                        User Details
                                    </h1>
                                </div>
                                <div className="col-auto mt-4">
                                    <div className="dropdown">
                                        <button className="btn btn-success btn-sm " type="button" onClick={handleDownloadPDF}>
                                            Download PDF
                                        </button>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </header>

                <div className="container-xl px-4 mt-n10">
                    {/* User Information */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>User Information</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>User Id:</strong> {userId}</p>
                                    <p><strong>Name:</strong> {userInfo?.firstName} {userInfo?.lastName}</p>
                                    <p><strong>Email:</strong> {userInfo?.emailId}</p>
                                    <p><strong>Mobile Number:</strong> {userInfo?.mobileNumber}</p>

                                </div>
                                <div className="col-md-6">
                                    <p><strong>Registered Days:</strong> {userInfo?.registeredDays}</p>
                                    <p>
                                        <strong>KYC Status:</strong>{" "}
                                        {userInfo?.kycVerified === 0
                                            ? "Not Submitted"
                                            : userInfo?.kycVerified === 1
                                                ? "Pending"
                                                : userInfo?.kycVerified === 2
                                                    ? "Approved"
                                                    : "Rejected"}
                                    </p>
                                    <p><strong>Total Referrals:</strong> {userInfo?.total_refer}</p>
                                    <p><strong>Status:</strong> {userInfo?.status}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Wallet Transactions */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>Wallet Transactions Summary</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <p><strong>Total Deposits:</strong> {totalDepositTransactions}</p>
                                    <p><strong>Total Withdrawals:</strong> {totalWithdrawalTransactions}</p>
                                    <p><strong>Total Admin Credits:</strong> {totalAdminCreditTransactions}</p>
                                    <p><strong>Total Admin Debits:</strong> {totalAdminDebitTransactions}</p>
                                </div>
                                <div className="col-md-6">
                                    <h5>Total Deposits By Currency:</h5>
                                    <ul>
                                        {totalDepositsByCurrency.map((item, index) => (
                                            <li key={index}>
                                                {item.currency}: {item.amount}
                                            </li>
                                        ))}
                                    </ul>
                                    <h5>Total Withdrawals By Currency:</h5>
                                    <ul>
                                        {totalWithdrawalsByCurrency.map((item, index) => (
                                            <li key={index}>
                                                {item.currency}: {item.amount}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* User Wallets */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>User Wallets</h4>
                        </div>
                        <div className="card-body">
                            <DataTableBase columns={walletColumns} data={userWallets} pagination={true} />
                        </div>
                    </div>



                    {/* Deposit Transactions */}
                    {renderTransactions(depositTransactions, "Deposit Transactions")}

                    {/* Withdrawal Transactions */}
                    {renderTransactions(withdrawalTransactions, "Withdrawal Transactions")}

                    {renderAdminTransactions(adminCreditTransactions, "Admin Credit Transactions")}

                    {renderAdminTransactions(adminDebitTransactions, "Admin Debit Transactions")}


                    {/* User Orderbook */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>User Orderbook</h4>
                        </div>
                        <div className="card-body">
                            <DataTableBase columns={orderbookColumns} data={userOrderbook?.reverse()} pagination={true} />
                        </div>
                    </div>
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>User Quick Buy Sell</h4>
                        </div>
                        <div className="card-body">
                            <DataTableBase columns={quickBuySellColumns} data={quickBuySellTransactions?.reverse()} pagination={true} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDetailsPage;
