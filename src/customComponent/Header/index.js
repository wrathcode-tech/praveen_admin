import React, { useEffect } from "react";

const Header = ({ isSidebar, setIsSidebar }) => {
    const emailId = sessionStorage.getItem('emailId');

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    };

    const sidebar = () => {
        setIsSidebar(!isSidebar);
    };

    useEffect(() => {
        if (!isSidebar) {
            document.body.classList.add('sidenav-toggled');
            document.body.classList.remove('sidenav-toggled-m');
        } else {
            document.body.classList.remove('sidenav-toggled');
            document.body.classList.add('sidenav-toggled-m');
        }
    }, [isSidebar]);

    return (
        <>
            <nav className="topnav light_yellow navbar navbar-expand shadow justify-content-between navbar-light bg-white" id="sidenavAccordion">
                <button className="btn btn-icon btn-transparent-dark order-1 order-lg-0 me-2 ms-lg-2 me-lg-0" id="sidebarToggle" onClick={sidebar}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" className="feather feather-menu">
                        <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <ul className="navbar-nav align-items-center ms-auto">
                    <li className="nav-item d-flex align-items-center me-3 me-lg-4">
                        {/* Email */}
                        <span
                            className="me-2"
                            style={{
                                fontSize: '16px',
                                color: '#000',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {emailId}
                        </span>

                        {/* User Icon + Dropdown */}
                        <div className="dropdown">
                            <button
                                type="button"
                                id="navbarDropdownUserImage"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                                style={{
                                    padding: 0,
                                    border: 'none',
                                    background: 'none',
                                }}
                            >
                                <img
                                    className="rounded-circle"
                                    src="/assets/img/dummy.png"
                                    alt="user"
                                    width="36"
                                    height="36"
                                />
                                {/* Caret icon */}
                                <i className="fa fa-caret-down text-dark" style={{ fontSize: '16px' }}></i>
                            </button>

                            <div
                                className="dropdown-menu dropdown-menu-end border-0 shadow animated--fade-in-up"
                                aria-labelledby="navbarDropdownUserImage"
                            >
                                <button
                                    type="button"
                                    className="dropdown-item d-flex align-items-center justify-content-between"
                                    onClick={handleLogout}
                                >
                                    <span>Logout</span>
                                    <i className="fa fa-power-off text-danger ms-2"></i>
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>


            </nav>
        </>
    );
};

export default Header;
