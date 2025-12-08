import React, { useState } from "react";
import EmailTemplate from "../EmailTemplate";
import { Link } from "react-router-dom";

const ViewEmailTemplate = (props) => {
    const [activeScreen, setActiveScreen] = useState('viewTemplate');
    const [emailSubject, setEmailSubject] = useState('');

    const [key, setKey] = useState('');
    const [template, setTemplate] = useState('');
    const [content, setContent] = useState('');

    
    return (
        activeScreen === 'viewTemplate' ?
            <>
                <div id="layoutSidenav_content">
                    <main>

                        <form className="form-data">
                            <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                                <div className="container-xl px-4">
                                    <div className="page-header-content pt-4">
                                        <div className="row align-items-center justify-content-between">
                                            <div className="col-auto mt-4">
                                                <h1 className="page-header-title">
                                                    <Link to="" className="page-header-icon" onClick={() => setActiveScreen('back')}>
                                                        <i className="fa fa-arrow-left"></i>
                                                    </Link> View Email Template
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </header>
                            <div className="container-xl px-4 mt-n10">
                                <div className="row">
                                    <div className="col-xl-12 mb-12">
                                        <div className="card mb-12 mb-xl-0">
                                            <div className="card-body py-5 pb-0">
                                                <div className="text-center">
                                                    <h3 className="fw-bolder fs-2 mb-0">
                                                        {emailSubject}
                                                    </h3>
                                                </div>
                                                <div className="doc_img py-5 px-4 my-4">
                                                    <div className="row mb-12">
                                                        <label className="col-lg-5 fw-bold text-muted">Email Subject:</label>
                                                        <div className="col-lg-7">
                                                            <span className="fw-bolder fs-6 text-dark">{emailSubject}</span>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-12">
                                                        <label className="col-lg-5 fw-bold text-muted">Key:</label>
                                                        <div className="col-lg-7">
                                                            <span className="fw-bold fs-6 text-dark">{key}</span>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-12">
                                                        <label className="col-lg-5 fw-bold text-muted">Content:</label>
                                                        <div className="col-lg-7 fv-row">
                                                            <span className="fw-bold fs-6 text-dark"> {content}  </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </main>
                </div>

            </>
            : <EmailTemplate />
    )


}

export default ViewEmailTemplate;