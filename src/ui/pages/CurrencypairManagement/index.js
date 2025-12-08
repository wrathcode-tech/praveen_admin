import React, { useState, useEffect } from "react";
import { alertErrorMessage, alertSuccessMessage, } from "../../../customComponent/CustomAlertMessage";
import AuthService from "../../../api/services/AuthService";
import { CSVLink } from "react-csv";
import { $ } from "react-jquery-plugin";
import LoaderHelper from "../../../customComponent/Loading/LoaderHelper";
import Swal from "sweetalert2";
import DataTableBase from "../../../customComponent/DataTable";
import Select from "react-select";

const CurrencypairManagement = () => {
  const [currencyPairList, setCurrencyPairList] = useState([]);
  const [allData, setAllData] = useState([]);
  const [fCoin, setFCoin] = useState("");
  const [sCoin, setSCoin] = useState("");
  const [coinList, setCoinList] = useState([]);
  const [coinName, setCoinName] = useState("");
  const [shortName, setShortName] = useState("");
  const [withdrawalFee, setWithdrawalFee] = useState("");
  const [transFee, setTransFee] = useState("");
  const [MinWithdrawal, setMinWithdrawal] = useState("");
  const [newMakerFee, setNewMakerFee] = useState("");
  const [newTakerFee, setNewTakerFee] = useState("");
  const [iconPath, setIconPath] = useState("");
  const [chain, setChain] = useState([])
  const [category, setCategory] = useState("")
  const [contractAdd, setContractAdd] = useState({})
  const [decimal, setDecimal] = useState({})
  const [sellPrice, setSellPrice] = useState()
  const [buyPrice, setBuyPrice] = useState()
  const [available, setAvailable] = useState("")
  const [baseCoin, setbaseCoin] = useState();
  const [quoteCoin, setquoteCoin] = useState();
  const [categoryList, setcategoryList] = useState([]);
  const [tradingBot, settradingBot] = useState({ id: '', gap: '' });
  const [newCategory, setNewCategory] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    handleCoinList();
    handleCurrencyPairList();
    CoinCategory();
  }, []);

  // *******Get Contract Details from Input ************//
  const HandleContractInput = (event) => {
    const { name, value } = event.target;
    setContractAdd((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

  };
  // *******Get Decimal Details from Input ************//
  const HandleDecimalInput = (event) => {
    const { name, value } = event.target;
    setDecimal((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

  };

  // *******Filter Decimal From Chain ************//
  const updatedDecimal = Object.keys(decimal)
    .filter(key => chain.includes(key))
    .reduce((result, key) => {
      result[key] = decimal[key];
      return result;
    }, {});


  // *******Filter Contract Address From Chain ************//
  const updatedContractAddress = Object.keys(contractAdd)
    .filter(key => chain.includes(key))
    .reduce((result, key) => {
      result[key] = contractAdd[key];
      return result;
    }, {});


  // *******Get Values of All Inputs ************//
  const handleInputChange = (event) => {
    switch (event.target.name) {
      case "coinName":
        setCoinName(event.target.value);
        break;
      case "shortName":
        setShortName(event.target.value);
        break;
      case "Category":
        setCategory(event.target.value)
        break;
      case "withdrawalFee":
        setWithdrawalFee(event.target.value);
        break;
      case "transFee":
        setTransFee(event.target.value);
        break;
      case "MinWithdrawal":
        setMinWithdrawal(event.target.value);
        break;
      case "newMakerFee":
        setNewMakerFee(event.target.value);
        break;
      case "newTakerFee":
        setNewTakerFee(event.target.value);
        break;
      default:
    }
  };

  const handleChangeSelfie = async (event) => {
    event.preventDefault();
    const fileUploaded = event.target.files[0];
    setIconPath(fileUploaded);
  };

  // *******Reset State After Coin Added ************//
  const resetInputChange = () => {
    setCoinName("");
    setShortName("");
    setWithdrawalFee("");
    setTransFee("");
    setMinWithdrawal("");
    setNewMakerFee("");
    setNewTakerFee("");
    setContractAdd({});
    setDecimal({});
    setChain([])
    setIconPath();
    setCategory('Innovation')
  };

  // *******Table for List Of Currency Pairs ************//
  const linkFollow = (row) => {
    return (
      <div>
        {row?.status === "Active" ? <button type="button" className="btn btn-sm btn-danger " onClick={() => handleCurrencyDelete(row?._id, 'Inactive')}>Delist Pair</button> :
          <button type="button" className="btn btn-sm btn-success " onClick={() => handleCurrencyDelete(row?._id, 'Active')}>List Pair</button>}

      </div>
    );
  };

  const TradingBot = (row) => {
    return (
      <div>
        {row?.trading_bot ? <button type="button" className='btn btn-sm btn-success' onClick={() => HandleTradingBot(row?._id, false, 0)}>Active</button> :
          <button type="button" className='btn btn-sm btn-danger' onClick={() => tradingBotModal(row)}>Inactive</button>}
      </div>
    );
  };

  const linkFollow2 = (row) => {
    return (`${row?.base_currency}/${row?.quote_currency}`);
  };

  const columns = [
    { name: "Pair Name", wrap: true, selector: linkFollow2, },
    { name: "Sell Price", wrap: true, selector: row => row.sell_price.toFixed(5), },
    { name: "Buy Price", wrap: true, selector: row => row.buy_price.toFixed(5), },
    { name: "Availablity", wrap: true, selector: row => row.available, },
    { name: "Action", wrap: true, selector: linkFollow, },
    { name: "Trading Bot", wrap: true, selector: TradingBot, },
  ];


  // *******Filter Coin details after selecting coin in Pairs creating Section ************//
  useEffect(() => {
    if (fCoin) {
      let filteredArr = coinList?.filter((item) => {
        return item?.short_name === fCoin
      })
      setbaseCoin(filteredArr)
    }

    if (sCoin) {
      let filteredArr = coinList?.filter((item) => {
        return item?.short_name === sCoin
      })
      setquoteCoin(filteredArr)
    }

  }, [fCoin, sCoin]);


  // *******Create Coin Function ************//
  const handleAddCoins = async (coinName, shortName, chain, updatedContractAddress, category, updatedDecimal, withdrawalFee, transFee, MinWithdrawal, newMakerFee, newTakerFee, iconPath) => {
    LoaderHelper.loaderStatus(true);
    var formData = new FormData();
    formData.append('name', coinName);
    formData.append('short_name', shortName);
    formData.append('chain', chain ? JSON.stringify(chain) : '')
    formData.append('contract_address', updatedContractAddress ? JSON.stringify(updatedContractAddress) : '')
    formData.append('category', "MAIN")
    formData.append('withdrawal_fee', +withdrawalFee);
    formData.append('transaction_fee', +transFee);
    formData.append('maker_fee', +newMakerFee);
    formData.append('taker_fee', +newTakerFee);
    formData.append('min_withdrawal', +MinWithdrawal);
    formData.append('coin-image', iconPath);
    formData.append('decimals', updatedDecimal ? JSON.stringify(updatedDecimal) : '');

    await AuthService.addCoins(formData).then(async (result) => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          alertSuccessMessage(result?.message);
          resetInputChange();
          handleCurrencyPairList();
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
      }
    });
  };

  const handleCoinList = async () => {
    LoaderHelper.loaderStatus(true);
    await AuthService.getCoinList().then(async (result) => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          setCoinList(result?.data);
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
      }
    });
  };


  const handleCategory = async (name) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.createCategory(name).then(async (result) => {
      LoaderHelper.loaderStatus(false);
      if (result?.success) {
        try {
          alertSuccessMessage(result?.message);
          setNewCategory('')
          setName('')
          CoinCategory()
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
  const handleAddPair = async (fShortName, fId, sShortName, sId, sellPrice, buyPrice, available) => {
    LoaderHelper.loaderStatus(true);
    await AuthService.AddCoinPair(fShortName, fId, sShortName, sId, sellPrice, buyPrice, available).then(async (result) => {
      if (result?.success) {
        LoaderHelper.loaderStatus(false);
        try {
          alertSuccessMessage("Pair Added Successfully..");
          setbaseCoin()
          setquoteCoin()
          setSellPrice('');
          setBuyPrice('');
          setAvailable('');
          handleCurrencyPairList();
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        LoaderHelper.loaderStatus(false);
        alertErrorMessage(result?.message);
      }
    });
  };


  const handleCurrencyPairList = async () => {
    await AuthService.getCurrencyPairList().then(async (result) => {
      if (result?.success) {
        try {
          setCurrencyPairList(result?.data.reverse());
          setAllData(result?.data);
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        alertErrorMessage(result?.message);
      }
    });
  };

  const HandleTradingBot = async (id, status, gap) => {
    await AuthService.botStatus(id, status, gap).then(async (result) => {
      if (result?.success) {
        try {
          handleCurrencyPairList();
          alertSuccessMessage(result?.message)
        } catch (error) {
          alertErrorMessage(error);
        }
      } else {
        alertErrorMessage(result?.message);
      }
    });
  };

  const handleCurrencyDelete = async (_id, status) => {
    await Swal.fire({
      title: `Do you want to ${status === 'Active' ? 'List' : 'Delist'} this Pair ?`,
      icon: 'info',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await AuthService.deleteCurrency(_id, status).then(async (result) => {
          if (result?.success) {
            try {
              alertSuccessMessage("Pair updated Successfully!!");
              handleCurrencyPairList();
            } catch (error) {
              alertErrorMessage(error);
            }
          } else {
            alertErrorMessage(result?.message);
          }
        })
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'error')
      }
    });
  };
  const tradingBotModal = (data) => {
    settradingBot({
      gap: data?.trading_bot_gap,
      id: data?._id
    })
    $("#trading_bot").modal("show");
  };


  function searchObjects(e) {
    const keysToSearch = ["available", "base_currency", "quote_currency", "buy_price"];
    const searchTerm = e.target.value?.toLowerCase();
    const matchingObjects = allData.filter(obj => { return keysToSearch.some(key => obj[key]?.toString()?.toLowerCase()?.includes(searchTerm)) });
    setCurrencyPairList(matchingObjects);
  };

  const chainOptions = [
    { value: 'TRC20', label: 'TRC20' },
    { value: 'ERC20', label: 'ERC20' },
    { value: 'BEP20', label: 'BEP20' },
    { value: 'SOLANA', label: 'SOLANA' },
    { value: 'POLYGON', label: 'POLYGON' },
  ];

  const handleChainChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setChain(selectedValues);
  };
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
                      <div className="page-header-icon">
                        <i className="fa fa-prescription"></i>
                      </div>
                      Currency Pair Management
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="container-xl px-4 mt-n10">
            <div className="row">
              <div className="col-xl-4">
                <div className="card mb-4">
                  <div className="card-body d-flex justify-content-center flex-column p-4 ">
                    <div className="d-flex align-items-center justify-content-start mb-3 ">
                      <h5 className="mb-0">Add Coins</h5>
                    </div>
                    <div className="form-group mb-3">
                      <label className="small mb-1">
                        Coin Name
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Coin Name"
                        name="coinName"
                        value={coinName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="small mb-1">
                        Short Name
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Short Name"
                        name="shortName"
                        value={shortName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="small mb-1">
                        Select Chain
                      </label>
                      <Select
                        value={chainOptions.filter(option => chain.includes(option.value))}
                        onChange={handleChainChange}
                        options={chainOptions}
                        isMulti
                      />
                    </div>
                    <div className="form-group mb-3">
                      {chain && chain?.map((item, index) => {
                        return (
                          <>  <label className="small mb-1">
                            {`Enter ${item} Contract Address`}
                          </label>
                            <input
                              id={index}
                              className="form-control"
                              type="text"
                              placeholder={`Enter ${item} Contract Address`}
                              name={item}
                              onChange={(event) => { HandleContractInput(event) }}
                            /></>
                        )
                      })}
                    </div>
                    <div className="form-group mb-3">
                      {chain && chain?.map((item, index) => {
                        return (
                          <>  <label className="small mb-1">
                            {`Enter ${item} Decimal`}
                          </label>
                            <input
                              id={index}
                              className="form-control"
                              type="number"
                              placeholder={`Enter ${item} Decimal`}
                              name={item}
                              onChange={(event) => { HandleDecimalInput(event) }}
                            /></>
                        )
                      })}
                    </div>
                    <div className="form-group mb-3">
                      <label className="small mb-1">
                        Withdrawal Fee
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Enter Withdrawal FEE"
                        name="withdrawalFee"
                        value={withdrawalFee}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="small mb-1">
                        Transaction Fee
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Enter Transaction FEE"
                        name="transFee"
                        value={transFee}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="small mb-1">
                        Minimum Withdrawal
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Enter Minimum Withdrawal"
                        name="MinWithdrawal"
                        value={MinWithdrawal}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="small mb-1">
                        Maker FEE
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Enter Maker FEE"
                        name="newMakerFee"
                        value={newMakerFee}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="small mb-1">
                        Taker FEE
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Enter Taker FEE"
                        name="newTakerFee"
                        value={newTakerFee}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="small mb-1">
                        Coin Image
                      </label>
                      <input
                        className="form-control"
                        placeholder="Icon Path"
                        type="file"
                        onChange={handleChangeSelfie}
                      />
                    </div>
                    <div className="form-group ">
                      <button className="btn btn-indigo w-100" type="button" onClick={() => handleAddCoins(coinName, shortName, chain, updatedContractAddress, category, updatedDecimal, withdrawalFee, transFee, MinWithdrawal, newMakerFee, newTakerFee, iconPath)}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-8">
                <div className="card mb-4">
                  <div className="card-body d-flex justify-content-center flex-column p-4 ">
                    <div className="d-flex align-items-center justify-content-start mb-4 ">
                      <h5 className="mb-0">Create Currency Pair</h5>
                    </div>
                    <form>
                      <div className="row">
                        <div className="mb-3 col-md-4 form-group">
                          <label className="small mb-1">
                            First Currency Pair{" "}
                          </label>
                          <select className="form-control form-control-solid form-select" value={fCoin?.short_name} onChange={(e) => { setFCoin(e.target.value) }}>
                            <option>Please Select First Coin</option>
                            {coinList.length > 0
                              ? coinList.map((item, index) => (
                                <option value={item?.short_name}>
                                  {item?.short_name}
                                </option>
                              ))
                              : null}
                          </select>
                        </div>

                        <div className="mb-3  col-md-4 form-group">
                          <label className="small mb-1" for="inputLocation">
                            Second Currency Pair
                          </label>
                          <select className="form-control form-control-solid form-select" value={sCoin?.short_name} onChange={(e) => { setSCoin(e.target.value) }}>
                            <option>Please Select Second Coin</option>
                            {coinList.length > 0 ? coinList.map((item, index) => {
                              return (
                                <option value={item?.short_name}>
                                  {item?.short_name}
                                </option>
                              )
                            })
                              : undefined}
                          </select>
                        </div>
                        <div className="mb-3  col-md-4 form-group">
                          <label className="small mb-1" for="inputLocation">
                            Sell Price
                          </label>
                          <input
                            className="form-control form-control-solid"
                            id="exampleFormControlSelect1"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(e.target.value)}
                          />
                        </div>
                        <div className="mb-3  col-md-4 form-group">
                          <label className="small mb-1" for="inputLocation">
                            Buy Price
                          </label>
                          <input
                            className="form-control form-control-solid"
                            id="exampleFormControlSelect1"
                            value={buyPrice}
                            onChange={(e) => setBuyPrice(e.target.value)}
                          />
                        </div>
                        <div className="mb-3  col-md-4 form-group">
                          <label className="small mb-1" for="inputLocation">
                            Select Availability
                          </label>
                          <select
                            className="form-control form-control-solid form-select"
                            id="exampleFormControlSelect1"
                            value={available}
                            onChange={(e) => setAvailable(e.target.value)}
                          >
                            <option>Select Availability</option>
                            <option value="LOCAL">
                              LOCAL
                            </option>
                            <option value="GLOBAL">
                              GLOBAL
                            </option>
                          </select>
                        </div>
                        <div className="col-md-4 mt-1">
                          <button
                            className="btn btn-indigo mt-4  btn-block w-100 mt-2"
                            type="button"
                            disabled={!fCoin ? true : !sCoin ? true : false}
                            onClick={() => handleAddPair(baseCoin[0]?.short_name, baseCoin[0]?._id, quoteCoin[0]?.short_name, quoteCoin[0]?._id, sellPrice, buyPrice, available)}
                          >
                            Make Pair
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    Currency Pair Details
                    <div className="col-5">
                      <input className="form-control form-control-solid" id="inputLastName" type="text" placeholder="Search here..." name="search" onChange={searchObjects} />
                    </div>
                    {currencyPairList.length === 0 ? "" :
                      <div className="dropdown">
                        <button
                          className="btn btn-dark btn-sm dropdown-toggle"
                          id="dropdownFadeInUp"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Export
                        </button>
                        <div
                          className="dropdown-menu animated--fade-in-up"
                          aria-labelledby="dropdownFadeInUp"
                        >
                          <CSVLink className="dropdown-item" data={currencyPairList}>
                            Export as CSV
                          </CSVLink>
                        </div>
                      </div>}
                  </div>
                  <div className="card-body">
                    <form className="row">
                      <div className="col-12">
                        <div className="table-responsive" width="100%">
                          <DataTableBase columns={columns} data={currencyPairList} />
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

      {/* Currency Pair modal data */}
      <div
        className="modal"
        id="edit_pair"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog  alert_modal" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                BNB/USDT
              </h5>
              <button
                className="btn-close"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group mb-3 ">
                  <label className="small mb-1">Buy Price</label>
                  <input
                    className="form-control  form-control-solid"
                    type="text"
                  />
                </div>
                <div className="form-group mb-4 ">
                  <label className="small mb-1">Sell Price</label>
                  <input
                    className="form-control  form-control-solid"
                    type="text"
                  />
                </div>
                <button
                  className="btn btn-indigo btn-block w-100"
                  data-bs-dismiss="modal"
                  type="button"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Trading Bot Gap */}
      <div className="modal" id="trading_bot" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" >
        <div className="modal-dialog  alert_modal" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">
                Update Trading Bot
              </h5>
              <button
                className="btn-close"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group mb-4 ">
                  <label className="small mb-1">Gap</label>
                  <input
                    className="form-control  form-control-solid"
                    type="number"
                    onChange={(e) => { settradingBot({ ...tradingBot, gap: e.target.value }) }}
                    value={tradingBot?.gap}
                  />
                </div>
                <button
                  className="btn btn-indigo btn-block w-100"
                  data-bs-dismiss="modal"
                  type="button"
                  onClick={() => HandleTradingBot(tradingBot?.id, true, tradingBot?.gap)}
                >
                  Activate
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrencypairManagement;
