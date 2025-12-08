import React from "react";

const ContentManager = () => {
    return (
        <div id="layoutSidenav_content">
            <main>
                <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                    <div className="container-xl px-4">
                        <div className="page-header-content pt-4">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto mt-4">
                                    <h1 className="page-header-title">
                                        <div className="page-header-icon"><i className="fa fa-edit"></i></div>
                                        Content Manager
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container-xl px-4 mt-n10">
                    <div className="row">
                        <div className="col-lg-6 col-xl-3 mb-4">
                            <div className="card bg-primary text-white h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="me-3">
                                            <div className="text-white-75 small">Earnings (Monthly)</div>
                                            <div className="text-lg fw-bold">$40,000</div>
                                        </div>
                                        <i className="feather-xl text-white-50" data-feather="calendar"></i>
                                    </div>
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between small">
                                    <a className="text-white stretched-link" href="#!">View Report</a>
                                    <div className="text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-3 mb-4">
                            <div className="card bg-warning text-white h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="me-3">
                                            <div className="text-white-75 small">Earnings (Annual)</div>
                                            <div className="text-lg fw-bold">$215,000</div>
                                        </div>
                                        <i className="feather-xl text-white-50" data-feather="dollar-sign"></i>
                                    </div>
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between small">
                                    <a className="text-white stretched-link" href="#!">View Report</a>
                                    <div className="text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-3 mb-4">
                            <div className="card bg-success text-white h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="me-3">
                                            <div className="text-white-75 small">Task Completion</div>
                                            <div className="text-lg fw-bold">24</div>
                                        </div>
                                        <i className="feather-xl text-white-50" data-feather="check-square"></i>
                                    </div>
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between small">
                                    <a className="text-white stretched-link" href="#!">View Tasks</a>
                                    <div className="text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-3 mb-4">
                            <div className="card bg-danger text-white h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="me-3">
                                            <div className="text-white-75 small">Pending Requests</div>
                                            <div className="text-lg fw-bold">17</div>
                                        </div>
                                        <i className="feather-xl text-white-50" data-feather="message-circle"></i>
                                    </div>
                                </div>
                                <div className="card-footer d-flex align-items-center justify-content-between small">
                                    <a className="text-white stretched-link" href="#!">View Requests</a>
                                    <div className="text-white"><i className="fas fa-angle-right"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-4 mb-4">
                            <a className="card lift h-100" href="#!">
                                <div className="card-body d-flex justify-content-center flex-column">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="me-3">
                                            <i className="feather-xl text-primary mb-3" data-feather="package"></i>
                                            <h5>Powerful Components</h5>
                                            <div className="text-muted small">To create informative visual elements on your pages</div>
                                        </div>
                                        <img src="/assets/img/illustrations/browser-stats.svg" alt="..." style={{ width: "8rem" }} />
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-xl-4 mb-4">
                            <a className="card lift h-100" href="#!">
                                <div className="card-body d-flex justify-content-center flex-column">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="me-3">
                                            <i className="feather-xl text-secondary mb-3" data-feather="book"></i>
                                            <h5>Documentation</h5>
                                            <div className="text-muted small">To keep you on track when working with our toolkit</div>
                                        </div>
                                        <img src="/assets/img/illustrations/processing.svg" alt="..." style={{ width: "8rem" }} />
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-xl-4 mb-4">
                            <a className="card lift h-100" href="#!">
                                <div className="card-body d-flex justify-content-center flex-column">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="me-3">
                                            <i className="feather-xl text-green mb-3" data-feather="layout"></i>
                                            <h5>Pages &amp; Layouts</h5>
                                            <div className="text-muted small">To help get you started when building your new UI</div>
                                        </div>
                                        <img src="/assets/img/illustrations/windows.svg" alt="..." style={{ width: "8rem" }} />
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ContentManager;