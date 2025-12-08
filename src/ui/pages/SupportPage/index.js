import React, { useEffect, useState } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import { CSVLink } from "react-csv";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import Supportmessage from "../Supportmessage";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import moment from "moment";

const SupportPage = () => {
  const [issueList, setIssueList] = useState([]);
  const [userId, setuserId] = useState("");
  const [emailId, setEmailID] = useState([]);
  const [description, setDescription] = useState([]);
  const [ticketId, setTicketId] = useState('');
  const [status, setStatus] = useState("");
  const [activeScreen, setActiveScreen] = useState('support');


  const linkEmail = (row) => {
    return (
      <div >
        <span className={row?.seen === 1 ? "fw-bolder" : ""}>{row?.emailId} </span>
      </div>
    );
  };


  const linkSubject = (row) => {
    return (
      <div  >
        <span className={row?.seen === 1 ? "fw-bolder" : ""}>{row?.subject} </span>
      </div>
    );
  };


  const linkDescription = (row) => {
    return (
      <div >
        <span className={row?.seen === 1 ? "fw-bolder" : ""}>
          {row?.status} <small><i class={row?.seen === 1 ? "fa fa-circle ms-2 text-success" : ""}></i></small>
        </span>
      </div>
    );
  };

  const statuslinkFollow = (row) => {
    return (
      <>{row?.status === "Open" ?
        <>  <button class="btn btn-sm btn-danger " onClick={() => handleStatus(row?._id, 'Closed')}>Close</button>
          <button class="btn btn-sm btn-success mx-1" onClick={() => handleStatus(row?._id, "Resolved")}>Resolve</button>
          <button class="btn btn-sm btn-primary" onClick={() => nextPage(row)}>Chat</button>
        </> :
        <>  {row?.status}
          <button class="btn btn-sm btn-primary mx-1" style={{ marginLeft: "20px" }} onClick={() => nextPage(row)}>Chat</button>

        </>
      }

      </>
    );
  };

  const handleStatus = async (Id, status) => {
    await AuthService.updateTicketStatus(Id, status).then(async result => {
      if (result?.success) {
        handleIssueList();
      } else {
        alertErrorMessage(result?.message)
      }
    })
  }

  function imageFormatter(row) {
    return <a href={ApiConfig?.appUrl + row?.issueImage} target="_blank" rel="noreferrer" >
      <img alt="Image not uploaded" className="table-img" src={ApiConfig?.appUrl + row?.issueImage} /></a>;
  }

  const userIdFollow = (row) => {
    return (
      row.userId
    );
  };


  const columns = [
    { name: "Date", selector: row => moment(row?.createdAt).format("MMM Do YYYY hh:mm A"), wrap: true },
    { name: 'IssueImage', sort: true, wrap: true, selector: imageFormatter },
    { name: 'User Id', sort: true, wrap: true, selector: userIdFollow },
    { name: 'Email Id', sort: true, wrap: true, selector: linkEmail },
    { name: 'Subject', sort: true, wrap: true, selector: linkSubject },
    { name: 'Status', sort: true, wrap: true, selector: linkDescription },
    { name: 'Change Status', width: '300px', wrap: true, selector: statuslinkFollow },
  ];



  const nextPage = (row) => {
    setActiveScreen('supportmessage');
    setTicketId(row?._id)
    setEmailID(row?.emailId);
    setDescription(row?.description);
    setStatus(row?.status);
    setuserId(row?.userId);
  }

  useEffect(() => {
    handleIssueList()
  }, []);

  const handleIssueList = async () => {
    LoaderHelper.loaderStatus(false);
    await AuthService.getAllTickets().then(async result => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          const openTickets = result?.data
            ?.filter(ticket => ticket?.status === "Open")
          const closeTickets = result?.data
            ?.filter(ticket => ticket?.status !== "Open")

          setIssueList([...openTickets?.reverse(), ...closeTickets?.reverse()]);
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage("Something Went Wrong");
      }
    });
  };


  return (

    activeScreen === 'support' ?
      <>
        <div id="layoutSidenav_content">
          <main>
            <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
              <div className="container-xl px-4">
                <div className="page-header-content pt-4">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-auto mt-4">
                      <h1 className="page-header-title">
                        <div className="page-header-icon"><i className="fa fa-question"></i></div>
                        Support Page
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <div className="container-xl px-4 mt-n10 supportouter">
              <div className="card mb-4">
                <div class="card-header">Issue List
                  <div class="dropdown">
                    <button class="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Export </button>
                    <div class="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                      <CSVLink data={issueList} class="dropdown-item">Export as CSV</CSVLink>
                    </div>
                  </div>
                </div>
                <div className="card-body mt-3">
                  <table className="" width="100%" >
                    <DataTable columns={columns} data={issueList} pagination direction="auto" responsive subHeaderAlign="right" subHeaderWrap striped highlightOnHover fixedHeader onRowClicked={(row) => { nextPage(row) }} />
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </>
      :
      <Supportmessage id={ticketId} email={emailId} description={description} status={status} userId={userId} />
  )
}

export default SupportPage;


