import React, { useState, useEffect } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertSuccessMessage, alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";
import { CSVLink } from "react-csv";
import { $ } from 'react-jquery-plugin';
import DataTableBase from "../../../customComponent/DataTable";

const BannerManagement = () => {
    const [selectBanner, setSelectBanner] = useState('Banner');
    const [text, setText] = useState('');
    const [bannerFile, setBannerFile] = useState('');
    const [bannerList, setBannerList] = useState('');
    // const [editBanner, setEditBanner] = useState('');
    // const [editSequence, setEditSequence] = useState('');
    // const [editBannerFile, setEditBannerFile] = useState('');
    // const [bannerId, setBannerId] = useState('');

    const handleChangeIdentity = async (event) => {
        event.preventDefault();
        const fileUploaded = event.target.files[0];
        if (fileUploaded.type === "image/png" || fileUploaded.type === "image/jpeg" || fileUploaded.type === "image/jpg") {
            const img = new Image();
            img.onload = function () {
                if (this.width <= 1024 && this.height <= 512) {
                    setBannerFile(fileUploaded);
                } else {
                    alertErrorMessage(`Image size (${this.width} x ${this.height}) exceeds limit (1024 x 512)`);
                    event.target.value = "";
                }
            };
            img.src = URL.createObjectURL(fileUploaded);
        } else {
            alertErrorMessage("Invalid image format");
            event.target.value = "";
            return; 
        }
    };

    const resetInputChange = () => {
        // setSelectBanner("");
        // setSequence("");
        setText("")
        document.getElementById("bannerImg").value = "";
    }

    const handleAddBanner = async (selectBanner,text, bannerFile) => {
        var formData = new FormData();
        formData.append('banner_type', selectBanner);
        formData.append('banner_text', text);
        formData.append('banner_image', bannerFile);
        LoaderHelper.loaderStatus(true)
        await AuthService.AddBanner(formData).then(async result => {
        LoaderHelper.loaderStatus(false)
            if (result?.success) {
                try {
                    // alertSuccessMessage(result?.message);
                    handleBanners();
                    resetInputChange();
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                const errorMessage = result?.message;
                alertErrorMessage(errorMessage);
            }
        });

    }

    const linkFollow = (row) => {
        return (
            <div>
                {/* <button type="button" className="btn btn-sm btn-dark me-2" data-bs-toggle="modal" data-bs-target="#edit_banner" onClick={() => {
                    setBannerId(row?._id);
                }}>Edit</button> */}
                <button className="btn btn-danger btn-sm" type="button" onClick={() => deleteBanner(row?._id)}>
                    Delete
                </button>
            </div>
        );
    };

    const statuslinkFollow = (row) => {
        return (
            <>
                <button type="button" className={row?.status === "Active" ? "btn btn-sm btn-primary" : "btn btn-sm btn-danger"} style={{ marginLeft: "20px" }} onClick={() => handleStatus(row?._id, row?.status === "Active" ? "Inactive" : "Active")}>{row?.status}</button>
            </>
        );
    };

    function imageFormatter(row) {
        return (
            <a href={ApiConfig?.appUrl + row?.banner_path} target="_blank" rel="noreferrer" > <img className="table-img" src={ApiConfig?.appUrl + row?.banner_path} alt="Banner Img" />
            </a>
        );
    }

    const columns = [
        { name: "Type", shrink: true, selector: row => row.banner_type, },
        { name: "Banner Text", shrink: true, wrap:true, selector: row => row.banner_text, },
        { name: "Banner Image", shrink: true, selector: row => imageFormatter(row), },
        { name: "Status", shrink: true, selector: statuslinkFollow, },
        { name: "Action", shrink: true, selector: linkFollow, },
    ];


    useEffect(() => {
        handleBanners()
    }, []);

    const handleBanners = async () => {
        LoaderHelper.loaderStatus(false);
        await AuthService.getBannerList().then(async result => {
            if (result?.success) {
                LoaderHelper.loaderStatus(false);
                try {
                    // alertSuccessMessage()
                    setBannerList(result?.data);
                } catch (error) {
                    alertErrorMessage(error);
                }
            } else {
                LoaderHelper.loaderStatus(false);
                alertErrorMessage("No data found");

            }
        });
    }



    // const handleEditBanner = async (event) => {
    //     event.preventDefault();
    //     const fileUploaded = event.target.files[0];
    //     setEditBannerFile(fileUploaded);
    // }

    // const resetEditInput = () => {
    //     setEditBanner("");
    //     setEditSequence("");
    //     document.getElementById("EditbannerImg").value = "";
    // }

    // const handleUpdateBanner = async (editBanner, editSequence, editBannerFile, bannerId) => {
    //     var formData = new FormData();
    //     formData.append('bannerType', editBanner);
    //     formData.append('sequrence', editSequence);
    //     formData.append('bannerPath', editBannerFile);
    //     formData.append('_id', bannerId);
    //     await AuthService.updateBannerList(formData).then(async result => {
    //         if (result?.success) {
    //             try {
    //                 alertSuccessMessage(result?.message);
    //                 $('#edit_banner').modal('hide');
    //                 resetEditInput();
    //                 handleBanners();
    //             } catch (error) {

    //             }
    //         } else {
    //             const errorMessage = result?.message;
    //             alertErrorMessage(errorMessage);
    //         }
    //     });

    // }

    const deleteBanner = async (userId) => {
        LoaderHelper.loaderStatus(true)
        await AuthService.deletebannerlist(userId).then(async result => {
            LoaderHelper.loaderStatus(false)
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handleBanners()
            } else {
                alertErrorMessage(result?.message)
            }
        })
    }

    const handleStatus = async (userId, cell) => {
        await AuthService.handleBannerStatus(userId, cell).then(async result => {
            if (result?.success) {
                // alertSuccessMessage(result.massage);
                handleBanners();
            } else {
                alertErrorMessage(result?.message)
            }
        })
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
                                            <div className="page-header-icon"><i className="fa fa-image"></i></div>
                                            Banner Management
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="container-xl px-4 mt-n10">
                        <div className="row" >
                            <div className="col-xl-4">
                                <div className="card mb-4 mb-xl-0">
                                    <div className="card-body d-flex justify-content-center flex-column p-5 ">
                                        <div className="d-flex align-items-center justify-content-start mb-4 ">
                                            <h5 className="mb-0" >Add New Banner</h5>
                                        </div>
                                        <form>
                                            <div className="mb-3 form-group">
                                                <label className="small mb-1" for="inputLocation">Type </label>
                                                <input className="form-control  form-control-solid" value={selectBanner}></input>
                                                {/* <select className="form-control form-control-solid form-select" id="exampleFormControlSelect1" name="selectBanner" value={selectBanner} onChange={(event) => setSelectBanner(event.target.value)}>
                                                    <option>Select Banner Type</option>
                                                    <option value="offerBanner">  Offer Banner </option>
                                                    <option value="invite">Invite</option>
                                                </select> */}
                                            </div>
                                            <div className="form-group  mb-3" >
                                                <label className="small mb-1">Banner Text</label>
                                                <input className="form-control  form-control-solid" type="text" placeholder="Enter Text" name="text" value={text} onChange={(event) => setText(event.target.value)}></input>
                                            </div>
                                            <div className="form-group  mb-3" >
                                                <label className="small mb-1">Banner Image
                                                     <small className="text-danger ms-1" >(1024*512)</small>
                                                     {/* <div style={{ color: "red", fontSize: "small" }}>
                                                        (Only JPEG, PNG & JPG formats are supported)
                                                     </div> */}
                                                      </label>
                                                <input className="form-control  form-control-solid" id="bannerImg" type="file" name="bannerFile" onChange={handleChangeIdentity}></input>
                                                <div style={{ color: "red", fontSize: "small" }}>
                                                        (Only JPEG, PNG & JPG formats are supported)
                                                     </div>
                                            </div>
                                            <button className="btn btn-indigo   btn-block w-100 mt-2" type="button" onClick={() => handleAddBanner(selectBanner,text, bannerFile)} disabled={!selectBanner || !bannerFile}> Submit </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-8" >
                                <div className="card">
                                    <div className="card-header">
                                        Banners List
                                        {/* <div className="dropdown">
                                            <button className="btn btn-dark btn-sm dropdown-toggle" id="dropdownFadeInUp" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Export{" "}
                                            </button>
                                            <div className="dropdown-menu animated--fade-in-up" aria-labelledby="dropdownFadeInUp">
                                                <CSVLink data={bannerList} className="dropdown-item">Export as CSV</CSVLink>
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="card-body" >
                                        <form className="row" >
                                            <div className="col-12" >
                                                <div className="table-responsive" >
                                                    <DataTableBase columns={columns} data={bannerList} />
                                                </div>
                                            </div>

                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>


            {/* <div className="modal" id="edit_banner" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog  alert_modal" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">
                                Edit Banner
                            </h5>
                            <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3 form-group">
                                    <label className="small mb-1" for="inputLocation">Banner Type </label>
                                    <select className="form-control form-control-solid form-select" id="exampleFormControlSelect1" name="selectBanner" value={editBanner} onChange={(event) => setEditBanner(event.target.value)}>
                                        <option>Select Banner Type</option>
                                        <option value="offerBanner">  Offer Banner </option>
                                        <option value="invite">Invite</option>
                                    </select>
                                </div>
                                <div className="form-group  mb-3" >
                                    <label className="small mb-1">Banner Sequence</label>
                                    <input className="form-control  form-control-solid" type="text" placeholder="Enter Sequence" name="sequence" value={editSequence} onChange={(event) => setEditSequence(event.target.value)}></input>
                                </div>
                                <div className="form-group  mb-3" >
                                    <label className="small mb-1">Banner Image <small className="text-dark ms-1" >(600X400)</small> </label>
                                    <input className="form-control  form-control-solid" id="EditbannerImg" type="file" name="editBannerFile" onChange={handleEditBanner} ></input>
                                </div>
                                <button className="btn btn-indigo btn-block w-100 mt-2" type="button" onClick={() => handleUpdateBanner(editBanner, editSequence, editBannerFile, bannerId)}> Update Banner </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div> */}

        </>
    )
}

export default BannerManagement;