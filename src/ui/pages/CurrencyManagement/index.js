import React, { useState, useEffect } from "react";
import AuthService from "../../../api/services/AuthService";
import { alertErrorMessage, alertSuccessMessage, alertWarningMessage, } from "../../../customComponent/CustomAlertMessage";
import { ApiConfig } from "../../../api/apiConfig/ApiConfig";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import Select from "react-select";

const CurrencyManagement = () => {
  const [coinList, setCoinList] = useState([]);
  const [coinImage, setcoinImage] = useState();
  const [categoryList, setcategoryList] = useState([]);
  const [CoinDetail, setCoinDetail] = useState('');
  const [inputData, setinputData] = useState({});
  const [Links, setLinks] = useState([]);


  
  const handleNewRow = () => {
    if (Links.length !== 0) {
      if ((!Links[Links.length - 1]?.name || !Links[Links.length - 1]?.description)) {
        alertWarningMessage('Please fill the first row');
        return;
      }
    }
    setLinks([...Links, {
      'name': "",
      'description': "",
    }])

  }

  const handleCheck = (index, e, selected) => {
    let temp = [...Links];
    temp[index][selected] = e.target.value;
    setLinks(temp);
  }

  const FilterLinks = (selectedIndex) => {
    let filtered = Links?.filter((item, index) => {
      return index !== selectedIndex
    })
    setLinks(filtered)
  }


  const handleInputChange = (event, id) => {
    if (id !== inputData.id) {
      setinputData({ id: '', })
    }
    const { name, value } = event.target;
    setinputData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      id: id
    }));
  };
  useEffect(() => {
    handleCoinList();
    CoinCategory();
  }, []);


  useEffect(() => {
    filterLink()
  }, [CoinDetail]);


  const filterLink = () => {
    let filter = coinList?.filter((item) => {
      return item?.short_name === CoinDetail
    });

    if (filter[0]?.links?.length > 0) {
      setLinks((filter[0]?.links))
    } else {
      setLinks([])
    }
  };

  const handleCoinList = async () => {
    LoaderHelper.loaderStatus(true);
    await AuthService.getCoinList().then(async (result) => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          setCoinList(result?.data);
          setCoinDetail(CoinDetail === '' ? result?.data[0]?.short_name : CoinDetail)
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
      }
    });
  };

  const CoinCategory = async () => {
    LoaderHelper.loaderStatus(true);
    await AuthService.CoinCategory().then(async (result) => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          setcategoryList(result?.data);
        } catch (error) {

        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
      }
    });
  };

  const handleAddCoinWidthraw = async (inputData, coinImage, item, filterdLinks) => {
    if (Links.length !== 0) {
      if ((!Links[Links.length - 1]?.name || !Links[Links.length - 1]?.description)) {
        alertWarningMessage('Please fill custom links input');
        return;
      }
    };
    LoaderHelper.loaderStatus(true);
    var formData = new FormData();
    formData.append('coin-image', coinImage);
    formData.append('_id', inputData?.id ? inputData?.id : item?._id);
    formData.append('issue_price', inputData?.issue_price ? inputData?.issue_price : item?.issue_price);
    formData.append('issue_date', inputData?.issue_date ? inputData?.issue_date : item?.issue_date);
    formData.append('circulating_supply', inputData?.circulating_supply ? inputData?.circulating_supply : '');
    formData.append('links', filterdLinks ? JSON.stringify(filterdLinks) : []);
    formData.append('description', inputData?.Description ? inputData?.Description : item?.description);
    formData.append('issueDate', inputData?.issueDate ? inputData?.issueDate : item?.issueDate);
    formData.append('maker_fee', inputData?.maker_fee ? inputData?.maker_fee : item?.maker_fee);
    formData.append('taker_fee', inputData?.taker_fee ? inputData?.taker_fee : item?.taker_fee);
    formData.append('p2p_status', inputData?.p2p_status ? inputData?.p2p_status : item?.p2p_status);
    formData.append('min_withdrawal', inputData?.minWidthraw ? inputData?.minWidthraw : item?.min_withdrawal);
    formData.append('max_withdrawal', inputData?.max_withdraw ? inputData?.max_withdraw : item?.max_withdrawal);
    formData.append('min_deposit', inputData?.min_deposit ? inputData?.min_deposit : item?.min_deposit);
    formData.append('max_deposit', inputData?.max_deposit ? inputData?.max_deposit : item?.max_deposit);
    formData.append('transaction_fee', inputData?.trans_fee ? inputData?.trans_fee : item?.transaction_fee);
    formData.append('withdrawal_fee', inputData?.widthrawFee ? inputData?.widthrawFee : item?.withdrawal_fee);
    formData.append('total_supply', inputData?.total_supply ? inputData?.total_supply : item?.total_supply);
    formData.append('tds', inputData?.tds ? inputData?.tds : item?.tds);
    formData.append('category', inputData?.Category ? inputData?.Category : item?.category);
    formData.append('deposit_status', inputData?.deposit_status ? inputData?.deposit_status : item?.deposit_status);
    formData.append('withdrawal_status', inputData?.withdrawal_status ? inputData?.withdrawal_status : item?.withdrawal_status);
    await AuthService.addCoinWidthraw(formData).then(async (result) => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          setinputData({});
          setcoinImage()
          alertSuccessMessage(result?.message);
          handleCoinList();
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
      }
    });
  };
    console.log("🚀 ~ handleAddCoinWidthraw ~ inputData:", inputData)

  return (
    <div id="layoutSidenav_content">
      <main>
        <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
          <div className="container-xl px-4">
            <div className="page-header-content pt-4">
              <div className="row align-items-center justify-content-between">
                <div className="col-auto mt-4">
                  <h1 className="page-header-title">
                    <div className="page-header-icon">
                      <i className="fa fa-dollar-sign"></i>
                    </div>
                    Currency Management
                  </h1>
                </div>
                <div className="col-2 mt-4" style={{color:"#69707a"}}>
                <Select
                className="text-center"
                value={CoinDetail}
                onChange={(selectedOption) => setCoinDetail(selectedOption.value)}
                options={coinList.map((item) => ({ value: item.short_name, label: item.short_name }))}
                placeholder={CoinDetail ? CoinDetail : "Choose here"}
                />
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container-xl px-4 mt-n10">
          {coinList.length === 0 ? (
            <h6 className="ifnoData">
              <img alt="" src="/assets/img/no-data.png" />
              <br />
              No Data Available
            </h6>
          ) : (
            <div className="row">
              {coinList?.map((item, index) => (
                item?.short_name === CoinDetail &&
                <div className="col-xl-12 mb-4">
                  <div className="card h-100">
                    <div className="card-body d-flex justify-content-center flex-column p-5 ">
                      <div className="d-flex align-items-center justify-content-center mb-4 ">
                        <div className="me-3">
                          <span className="symbol-label">
                            <img src={ApiConfig?.uploadcurrency + item?.icon_path} className="h-75 align-self-center img-fluid" alt="" />
                          </span>
                        </div>
                        <h5 className="mb-0">{item?.name}</h5>
                      </div>
                      <form>
                        <div className="row gx-3 mb-3">
                          <div className=" col-md-4 form-group  mb-1">
                            <label className="small mb-1">
                              Minimum Withdrawal Amount
                            </label>
                            <input
                              className="form-control  form-control-solid"
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              value={inputData.id == item?._id ? inputData.minWidthraw : item?.min_withdrawal}
                              name="minWidthraw"
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                          <div className=" col-md-4 form-group  mb-1">
                            <label className="small mb-1">  Maximum Withdrawal Amount</label>
                            <input
                              className="form-control  form-control-solid"
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              name="max_withdraw"
                              value={inputData.id == item?._id ? inputData.max_withdraw : item?.max_withdrawal}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                          <div className=" col-md-4 form-group  mb-3">
                            <label className="small mb-1">Withdrawal Fee</label>
                            <input
                              className="form-control  form-control-solid"
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              name="widthrawFee"
                              value={inputData.id == item?._id ? inputData.widthrawFee : item?.withdrawal_fee}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                        </div>
                        <div className="row gx-3 mb-3">
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Maker Fee</label>
                            <input
                              className="form-control  form-control-solid"
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              name="maker_fee"
                              value={inputData.id == item?._id ? inputData.maker_fee : item?.maker_fee}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Taker Fee</label>
                            <input
                              className="form-control  form-control-solid"
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              name="taker_fee"
                              value={inputData.id == item?._id ? inputData.taker_fee : item?.taker_fee}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Minimum Deposit</label>
                            <input
                              className="form-control  form-control-solid"
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              name="min_deposit"
                              value={inputData.id == item?._id ? inputData.min_deposit : item?.min_deposit}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                        </div>
                        <div className="row gx-3 mb-3">
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Maximum Deposit</label>
                            <input
                              className="form-control  form-control-solid"
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              name="max_deposit"
                              value={inputData.id == item?._id ? inputData.max_deposit : item?.max_deposit}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Transaction Fee</label>
                            <input
                              className="form-control  form-control-solid"
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              name="trans_fee"
                              value={inputData.id == item?._id ? inputData.trans_fee : item?.transaction_fee}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1"> Total Supply</label>
                            <input
                              className="form-control  form-control-solid"
                              type="text"
                              name="total_supply"
                              value={inputData.id == item?._id ? inputData.total_supply : item?.total_supply}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                        </div>
                        <div className="row gx-3 mb-3">
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">TDS</label>
                            <input
                              className="form-control  form-control-solid"
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              name="tds"
                              value={inputData.id == item?._id ? inputData.tds : item?.tds}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Category</label>
                            <select className="form-control  form-control-solid" type="text"
                              name="Category" value={inputData.id == item?._id ? inputData.Category : item?.category}
                              onChange={(e) => handleInputChange(e, item?._id)}>
                              {categoryList && categoryList?.map((item) => {
                                return (
                                  <option value={item?.category}>
                                    {item?.category}
                                  </option>
                                )
                              })}
                            </select>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Coin Image</label>
                            <input
                              className="form-control  form-control-solid"
                              type="file"
                              name="coin_image"
                              onChange={(e) => { setcoinImage(e.target.files[0]); inputData.id = item?._id }}
                            ></input>
                          </div>
                        </div>
                        <div className="row gx-3 mb-3">
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Deposit Status</label>
                            <select className="form-control  form-control-solid" type="text"
                              name="deposit_status" value={inputData.id == item?._id ? inputData.deposit_status : item?.deposit_status}
                              onChange={(e) => handleInputChange(e, item?._id)}>
                              <option value='ACTIVE'>
                                Active
                              </option>
                              <option value='INACTIVE'>
                                Inactive
                              </option>
                            </select>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">P2P Status</label>
                            <select className="form-control  form-control-solid" type="text"
                              name="p2p_status" value={inputData.id == item?._id ? inputData.p2p_status : item?.p2p_status}
                              onChange={(e) => handleInputChange(e, item?._id)}>
                              <option value='ACTIVE'>
                                Active
                              </option>
                              <option value='INACTIVE'>
                                Inactive
                              </option>
                            </select>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Withdrawal Status</label>
                            <select className="form-control  form-control-solid" type="text"
                              name="withdrawal_status" value={inputData.id == item?._id ? inputData.withdrawal_status : item?.withdrawal_status}
                              onChange={(e) => handleInputChange(e, item?._id)}>
                              <option value='ACTIVE'>
                                Active
                              </option>
                              <option value='INACTIVE'>
                                Inactive
                              </option>
                            </select>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Description</label>
                            <input
                              className="form-control  form-control-solid"
                              type="text"
                              onWheel={(e) => e.target.blur()}
                              name="Description"
                              value={inputData.id == item?._id ? inputData.Description : item?.description}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Issue Date</label>
                            <input
                              className="form-control  form-control-solid"
                              type="text"
                              name="issueDate"
                              value={inputData.id == item?._id ? inputData.issueDate : item?.issueDate}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Issue Price</label>
                            <input
                              className="form-control  form-control-solid"
                              type="number"
                              onWheel={(e) => e.target.blur()}
                              name="issue_price"
                              value={inputData.id == item?._id ? inputData.issue_price : item?.issue_price}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                          <div className="col-md-4 form-group  mb-1">
                            <label className="small mb-1">Circulating supply</label>
                            <input
                              className="form-control  form-control-solid"
                              type="text"
                              name="circulating_supply"
                              value={inputData.id == item?._id ? inputData.circulating_supply : item?.circulating_supply}
                              onChange={(e) => handleInputChange(e, item?._id)}
                            ></input>
                          </div>
                       
                        </div>
                        {/* <div className="row gx-3 mb-3">
                          <div className="col-md-12 form-group  mb-1"> */}
                        <label className="small mb-1">Add Custom Links</label>
                        {Links ? Links?.map((data, index) => {
                          return <>
                            <div className="row" >
                              <div className="col-5" >
                                <input
                                  className="form-control  form-control-solid"
                                  type="text"
                                  placeholder="Name"
                                  name="Name"
                                  value={data?.name}
                                  onChange={(e) => handleCheck(index, e, 'name')}
                                />
                              </div>
                              <div className="col-5" >
                                <input
                                  className="form-control  form-control-solid mb-3"
                                  type="text"
                                  placeholder="Link"
                                  name="Link"
                                  value={data?.description}
                                  onChange={(e) => handleCheck(index, e, 'description')}
                                />
                              </div>
                              <div className="col-2" >
                                <button className="btn btn-danger w-100" type="button" onClick={() => { FilterLinks(index) }} >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </>
                        }) : ''}

                        <div className="row justify-content-left mt-2 mb-4" >
                          <div className="col-md-3" >
                            <button className="btn btn-dark btn-sm" type="button" onClick={handleNewRow}>Add links</button>
                          </div>
                        </div>
                        {/* </div>
                        </div> */}
                        <div style={{float:"right"}}>
                        <button className="btn btn-indigo btn-block mt-2" type="button" onClick={() => handleAddCoinWidthraw(inputData, coinImage, item, Links)}>
                          Submit
                        </button>
                        </div>
                        
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CurrencyManagement;
