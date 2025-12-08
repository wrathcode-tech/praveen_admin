import axios from "axios";
import { alertErrorMessage } from "../../customComponent/CustomAlertMessage";


export const ApiCallPost = async (url, parameters, headers) => {
  try {
    const response = await axios.post(url, parameters, { headers: headers });
    return response.data;
  } catch (error) {
    if (error.response.data.message === "Token is expired" || error.response.data.message === "Admin not found this email" || error.response.data.message === "Admin does not have access" || error.response.data.message === "Unauthorized Request!") {
      tokenExpire(error.response.data.message)
      return;
    }
    if (error.response.data.message === "IP not whitelisted for this signid") {
      ipNotWhitelisted(error.response.data.message)
      return;
    }
    return error.response.data;
  }
};

export const ApiCallDelete = async (url, headers) => {
  try {
    const response = await axios.delete(url, { headers: headers });
    return response.data;
  } catch (error) {
    if (error.response.data.message === "Token is expired" || error.response.data.message === "Admin not found this email" || error.response.data.message === "Admin does not have access" || error.response.data.message === "Unauthorized Request!") {
      tokenExpire(error.response.data.message)
      return;
    }
    if (error.response.data.message === "IP not whitelisted for this signid") {
      ipNotWhitelisted(error.response.data.message)
      return;
    }
    return error.response.data;
  }
};


export const ApiCallGet = async (url, headers) => {
  try {
    const response = await axios.get(url, { headers: headers });
    return response.data;

  } catch (error) {
    if (error.response.data.message === "Token is expired" || error.response.data.message === "Admin not found this email" || error.response.data.message === "Admin does not have access" || error.response.data.message === "Unauthorized Request!") {
      tokenExpire(error.response.data.message)
      return;
    }
    if (error.response.data.message === "IP not whitelisted for this signid") {
      ipNotWhitelisted(error.response.data.message)
      return;
    }
    return error.response.data;
  }
};

export const ApiCallPut = async (url, parameters, headers) => {
  try {
    const response = await axios.put(url, parameters, { headers: headers });
    return response.data;
  } catch (error) {
    if (error.response.data.message === "Token is expired" || error.response.data.message === "Admin not found this email" || error.response.data.message === "Admin does not have access" || error.response.data.message === "Unauthorized Request!") {
      tokenExpire(error.response.data.message)
      return;
    }
    if (error.response.data.message === "IP not whitelisted for this signid") {
      ipNotWhitelisted(error.response.data.message)
      return;
    }
    return error.response.data;
  }
};


const tokenExpire = (message) => {
  alertErrorMessage(message);
  sessionStorage.clear();
  window.location.reload();
};

const ipNotWhitelisted = (message) => {
  alertErrorMessage(message);
  sessionStorage.clear();
};