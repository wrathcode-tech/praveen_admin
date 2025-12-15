import React, { useState, useEffect, useRef } from "react";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import SupportPage from "../SupportPage";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill theme styles

const Supportmessage = (props) => {

  const { id, email, description, status, userId } = props;
  const [activeScreen, setActiveScreen] = useState('supportmessage');
  const [message, setMessage] = useState('');
  const [messageQuery, setMessageQuery] = useState([]);
  const messagesEndRef = useRef(null)
  const [isRotating, setRotating] = useState(false);
  const [details, setDetails] = useState([]);

  const [disableButton, setDisableButton] = useState(false);

  const handleInputSellChange = (value) => {
    setMessage(value);

  }


  const handleStatus = async (Id, status) => {
    LoaderHelper.loaderStatus(true)
    try {
      await AuthService.updateTicketStatus(Id, status).then(async result => {
        if (result?.success) {
          setDisableButton(true)
          // handleIssueList();
        } else {
          alertErrorMessage(result?.message)
        }
      })
    } finally {
      LoaderHelper.loaderStatus(false)

    }
  }


  const handleMessageQuery = async (message, id) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.replyTicket(message, id).then(async result => {
      if (result?.success) {
        try {
          LoaderHelper.loaderStatus(false);
          setMessage("");
          getMessageQuery();
        } catch (error) {
          LoaderHelper.loaderStatus(false);
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result.msg);
      }
    });
  }


  const getOrderDetails = async (orderId) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.orderDetails(orderId).then(async result => {
      if (result?.success) {
        try {
          LoaderHelper.loaderStatus(false);
          setDetails(result?.data || [])
        } catch (error) {
          LoaderHelper.loaderStatus(false);
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
      }
    });
  }

  useEffect(() => {
    getMessageQuery();
  }, []);

  const getMessageQuery = async () => {
    LoaderHelper.loaderStatus(true);
    await AuthService.getAllTickets().then(async result => {
      if (result?.success) {
        try {
          LoaderHelper.loaderStatus(false);
          if (id) {
            let filteredData = result?.data?.filter((item) => item?._id == id)
            setMessageQuery(filteredData[0]?.ticket)
            // if (filteredData[0]?.order_id)
            // getOrderDetails(filteredData[0]?.order_id)
          }
          setRotating(false);

        } catch (error) {
          LoaderHelper.loaderStatus(false);
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
        setRotating(false);

      }
    });
  }


  const disputeHandler = async (orderId) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.handleDispute(orderId).then(async result => {
      if (result?.success) {
        try {
          LoaderHelper.loaderStatus(false);
          setDetails(result?.data)
        } catch (error) {
          LoaderHelper.loaderStatus(false);
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
      }
    });
  }



  return (
    activeScreen === 'supportmessage' ?
      <>
        <div id="layoutSidenav_content">
          <main>
            <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
              <div className="container-xl px-4">
                <div className="page-header-content pt-4">
                  <div className="row align-items-center justify-content-between">
                    <div className="col-auto mt-4">
                      <h1 className="page-header-title">
                        <Link to="" onClick={() => setActiveScreen('support')}>
                          <i class="fa fa-arrow-left"></i>
                        </Link>
                        <div className="page-header-icon"></div>
                        Support Message
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="container-xl px-4 mt-n10">
              <div className="row" >
                {/* description */}
                <div className="col-xl-4">
                  <div className="card mb-4">
                    <div class="card-header">Description
                      <div class="dropdown"></div>
                    </div>
                    {description?.length === 0 ? <h6 style={{ textAlign: 'center', padding: '164px 0' }}>No Description Available</h6> :
                      <div className="card-body mt-3">
                        <div class="right">
                          <div class="middle">
                            <div class="tumbler">
                              <div class="messages" >

                                {description}

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
                {/*   handle Message */}
                <div className="col-xl-8">
                  <div className="card mb-4">
                    <div class="card-header">{email}
                      <Link
                        to="#"
                      >
                        UserId: {userId}
                      </Link>

                      {status === "Open" &&
                        <> <div>  <button class="btn btn-sm btn-danger " disabled={disableButton} onClick={() => handleStatus(id, 'Closed')}>Close</button>
                          <button class="btn btn-sm btn-success mx-1" disabled={disableButton} onClick={() => handleStatus(id, "Resolved")}>Resolve</button></div>
                        </>
                      }
                      {/* <div className={`cursor-pointer refresh ${isRotating ? 'rotating' : ''}`} onClick={() => { getMessageQuery(); setRotating(true); }}><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" /></svg></div>
                      <div class="dropdown"></div> */}
                    </div>
                    <div className="card-body mt-3">
                      <div class="right">

                        <div class="middle">
                          <div class="tumbler">
                            <div class="messages" >
                              {messageQuery?.length <= 0 ? (
                                <div className="issue_text text-center mt-5">No message found</div>
                              ) : (
                                <div className="middle">
                                  <div className="tumbler">
                                    <div className="messages" id="message">
                                      {messageQuery.map((item, index) => (
                                        <div ref={messagesEndRef} key={index}>
                                          {item?.replyBy === 0 ? (
                                            // Support Team Message
                                            <div className="clip sent mb-1 mt-2">
                                              <div
                                                className="text text-start px-3 support_team_message"
                                                dangerouslySetInnerHTML={{
                                                  __html: `<strong>Support Team:</strong> ${item?.query.replace(
                                                    /\n/g,
                                                    "<br>"
                                                  )}`,
                                                }}
                                              ></div>
                                            </div>
                                          ) : (
                                            // User Message
                                            <div className="clip received mb-1 d-flex justify-content-end mt-2">
                                              <div
                                                className="text text-end px-3 self_message"
                                                dangerouslySetInnerHTML={{
                                                  __html: `<strong>User:</strong> ${item?.query.replace(
                                                    /\n/g,
                                                    "<br>"
                                                  )}`,
                                                }}
                                              ></div>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                        <div class="bottom">
                          <div class="cup">
                            <ReactQuill
                              className="quillEditor"
                              theme="snow"
                              value={message}
                              onChange={handleInputSellChange}
                              placeholder="Write your message..."
                            // style={{ height: "200px", marginBottom: "10px" }}
                            />
                            {/* <input type="text" id="message" cols="30" rows="1" placeholder="Message..." name="message" value={message} onChange={handleInputSellChange} /> */}
                            <button class="send" onClick={() => handleMessageQuery(message, id)}>Send</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* {details?.length > 0 ?
              <div className="container-xl px-4 mt-2">
                <div className="row" >
                  <div className="col-xl-12">
                    <div className="card mb-4">
                      <div class="card-header">Transfer Funds
                        <div class="dropdown"></div>
                      </div>
                      {description.length === 0 ? <h6 style={{ textAlign: 'center', padding: '164px 0' }}>No Description Available</h6> :
                        <div className="card-body mt-3">
                          <table className="" width="100%" >
                            <DataTable columns={columns} data={details} direction="auto" responsive subHeaderAlign="right" subHeaderWrap striped highlightOnHover fixedHeader />
                          </table>
                        </div>
                      }
                    </div>
                  </div>

                </div>
              </div> : ""} */}

          </main>
        </div>
      </>
      : <SupportPage />
  )
}

export default Supportmessage;
