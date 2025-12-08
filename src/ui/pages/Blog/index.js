import React, { useState, useEffect } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertSuccessMessage, alertErrorMessage } from "../../../customComponent/CustomAlertMessage";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";
import DataTableBase from "../../../customComponent/DataTable";
import ReactQuill from "react-quill";

const Blog = () => {
  const [selectBanner, setSelectBanner] = useState('');
  const [text, setText] = useState('');
  const [blogLink, setBlogLink] = useState("");
  const [bannerFile, setBannerFile] = useState('');
  const [bannerList, setBannerList] = useState('');
  const [content, setContent] = useState("");

  const handleInputSellChange = (value) => {
    setContent(value);

  }

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
    setSelectBanner("");
    setBannerFile("");
    setContent("");
    setText("")
    setBlogLink("")
    document.getElementById("bannerImg").value = "";
  }

  const handleAddBanner = async (selectBanner, text, bannerFile, content, blogLink) => {
    const blogLinkRegex = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;

    // Optional blogLink validation
    if (blogLink && !blogLinkRegex.test(blogLink)) {
      alertErrorMessage("Please enter a valid blog link (e.g., https://example.com)");
      return;
    }

    var formData = new FormData();
    formData.append('category', selectBanner);
    formData.append('title', text);
    formData.append('blogMedia', bannerFile);
    formData.append('content', content);
    formData.append('blogLink', blogLink);
    LoaderHelper.loaderStatus(true)
    await AuthService.addBlog(formData).then(async result => {
      LoaderHelper.loaderStatus(false)
      if (result?.success) {
        try {
          alertSuccessMessage(result?.message);
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
        <button type="button" className={row?.status === "ACTIVE" ? "btn btn-sm btn-primary" : "btn btn-sm btn-danger"} style={{ marginLeft: "20px" }} onClick={() => handleStatus(row?._id, row?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}>{row?.status}</button>
      </>
    );
  };

  function imageFormatter(row) {
    return (
      <a href={ApiConfig?.appUrl + row?.blogMedia} target="_blank" rel="noreferrer" > <img className="table-img" src={ApiConfig?.appUrl + row?.blogMedia} alt="Banner Img" />
      </a>
    );
  }

  const columns = [
    { name: "Type", shrink: true, selector: row => row.category, },
    { name: "Title", shrink: true, wrap: true, selector: row => row.title, },
    { name: "External Link", shrink: true, wrap: true, selector: row => row.blogLink ? <a href={row.blogLink} target="_blank" rel="noreferrer">View Link</a> : "---", },
    { name: "Banner Image", shrink: true, selector: row => imageFormatter(row), },
    { name: "Status", shrink: true, selector: statuslinkFollow, },
    { name: "Action", shrink: true, selector: linkFollow, },
  ];


  useEffect(() => {
    handleBanners()
  }, []);

  const handleBanners = async () => {
    LoaderHelper.loaderStatus(false);
    await AuthService.blogList().then(async result => {
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





  const deleteBanner = async (userId) => {
    LoaderHelper.loaderStatus(true)
    await AuthService.deleteBlog(userId).then(async result => {
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
    await AuthService.blogStatus(userId, cell).then(async result => {
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
                      Blogs Management
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
                      <h5 className="mb-0" >Add New Blog</h5>
                    </div>
                    <form>
                      <div className="mb-4 form-group">
                        <label className="small mb-1" for="inputLocation">Type </label>
                        {/* <input className="form-control  form-control-solid" value={selectBanner}></input> */}
                        <select className="form-control form-control-solid form-select" id="exampleFormControlSelect1" name="selectBanner" value={selectBanner} onChange={(event) => setSelectBanner(event.target.value)}>
                          <option hidden selected>Select Blog Type</option>
                          <option value="News">News </option>
                          <option value="Analysis">Analysis</option>
                          <option value="Events">Events</option>
                        </select>
                      </div>
                      <div className="form-group  mb-4" >
                        <label className="small mb-1">Blog Title</label>
                        <input className="form-control  form-control-solid" type="text" placeholder="Enter Text" name="text" value={text} onChange={(event) => setText(event.target.value)}></input>
                      </div>
                      <div className="form-group  mb-4" >
                        <label className="small mb-1">Blog Link (Optional)</label>
                        <input className="form-control  form-control-solid" type="text" placeholder="Enter Redirect Link" name="text" value={blogLink} onChange={(event) => setBlogLink(event.target.value)}></input>
                      </div>
                      <div className="form-group  mb-4" >
                        <label className="small mb-1">Blog Image
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
                      <div className="form-group  mb-5" >
                        <label className="small mb-1">Blog Content</label>
                        <ReactQuill
                          className="quillEditor"
                          theme="snow"
                          value={content}
                          onChange={handleInputSellChange}
                          placeholder="Write your message..."
                          style={{ height: "200px", marginBottom: "10px" }}
                        />

                      </div>
                      <button className="btn btn-indigo   btn-block w-100 mt-2" type="button" onClick={() => handleAddBanner(selectBanner, text, bannerFile, content, blogLink)} disabled={!selectBanner || !bannerFile || bannerFile === "" || !text}> Submit </button>
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
    </>
  )
}

export default Blog;