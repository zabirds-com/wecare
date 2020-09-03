// @flow
import axios from "axios";
import { Cookies } from "react-cookie";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  UPDATE_ACCOUNT,
  UPDATE_ACCOUNT_CATEGORY,
  UPDATE_ACCOUNT_FINANCIAL,
  ADD_USER,
  GET_USERS,
  GET_USER,
  DELETE_USER,
  DELETE_POLICY,
  CHANGE_PASSWORD,
  ADD_CLIENT,
  GET_CLIENTS,
  GET_CLIENTS_CATEGORY,
  GET_CLIENT,
  DELETE_CLIENT,
  ADD_POLICY,
  GET_POLICY,
  UPDATE_POLICY,
  UPDATE_CLIENT,
  GET_SETTING
} from "../../constants/actionTypes";
import {
  updateAccountSuccess,
  updateAccountFailed,
  updateAccountFinancialSuccess,
  updateAccountFinancialFailed,
  updateAccountCategoriesSuccess,
  updateAccountCategoriesFailed,
  addUserSuccess,
  addUserFailed,
  getUsersSuccess,
  getUsersFailed,
  getUserSuccess,
  getUserFailed,
  deleteUserSuccess,
  deleteUserFailed,
  deletePolicySuccess,
  deletePolicyFailed,
  changePasswordSuccess,
  changePasswordFailed,
  addClientSuccess,
  addClientFailed,
  getClientsSuccess,
  getClientsFailed,
  getClientsByCategorySuccess,
  getClientsByCategoryFailed,
  getClientSuccess,
  getClientFailed,
  deleteClientSuccess,
  deleteClientFailed,
  addPolicySuccess,
  addPolicyFailed,
  getPolicySuccess,
  getPolicyFailed,
  getSettingFailed,
  getSettingSuccess,
  updatePolicySuccess,
  updatePolicyFailed,
  updateClientFailed,
  updateClientSuccess
} from "./actions";
import { logoutUser } from "../auth/actions";

/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 */
const fetchJSON = (url, options = {}) => {
  return axios(url, options)
    .then(json => {
      return json.data;
    })
    .catch(error => {
      throw error;
    });
};

function* updateAccount({ payload: { id, fullName, password, avatar, emailAddress, mobileNumber } }) {
  const options = {
    data: { fullName, password, avatar, emailAddress, mobileNumber },
    method: "PUT"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}users/${id}/account`,
      options
    );
    if (response._id) {
      yield put(updateAccountSuccess(true));
      yield put(updateAccountSuccess(false));
      yield put(logoutUser());
    } else {
      yield put(updateAccountFailed(false));
    }
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(updateAccountFailed(message));
  }
}

export function* watchUpdateAccount() {
  yield takeEvery(UPDATE_ACCOUNT, updateAccount);
}

function* updateAccountFinancial({ payload: { id, financial } }) {
  const options = {
    data: { financial },
    method: "PUT"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}users/${id}/account`,
      options
    );
    if (response._id) {
      yield put(updateAccountFinancialSuccess(true));
    } else {
      yield put(updateAccountFinancialFailed(false));
    }
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(updateAccountFinancialFailed(message));
  }
}

export function* watchUpdateAccountFinancial() {
  yield takeEvery(UPDATE_ACCOUNT_FINANCIAL, updateAccountFinancial);
}

function* updateAccountCategories({ payload: { id, categories } }) {
  const options = {
    data: { categories },
    method: "PUT"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}users/${id}/account`,
      options
    );

    if (response._id) {
      yield put(updateAccountCategoriesSuccess(true));
    } else {
      yield put(updateAccountCategoriesFailed(false));
    }
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(updateAccountCategoriesFailed(message));
  }
}

export function* watchUpdateAccountCategories() {
  yield takeEvery(UPDATE_ACCOUNT_CATEGORY, updateAccountCategories);
}

function* addUser({ payload: { fullName, username, role, password, emailAddress, mobileNumber } }) {
  const options = {
    data: { fullName, username, role, password, emailAddress, mobileNumber },
    method: "POST"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}users`,
      options
    );
    yield put(addUserSuccess(response));
    yield put(addUserSuccess({}));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(addUserFailed(message));
  }
}

export function* watchAddUser() {
  yield takeEvery(ADD_USER, addUser);
}

function* getUsers() {
  const options = {
    method: "GET"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}users`,
      options
    );
    yield put(getUsersSuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(getUsersFailed(message));
  }
}

export function* watchGetUsers() {
  yield takeEvery(GET_USERS, getUsers);
}

function* getUser({ payload: id }) {
  const options = {
    method: "GET"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}users/${id}`,
      options
    );
    yield put(getUserSuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(getUserFailed(message));
  }
}

export function* watchGetUser() {
  yield takeEvery(GET_USER, getUser);
}

function* deletePolicy({ payload: id }) {
  const options = {
    method: "DELETE"
  };

  try {
    yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}clients/${id}/removepolicy`,
      options
    );
    yield put(deletePolicySuccess(true));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    console.log(message);
    yield put(deletePolicyFailed(false));
  }
}

function* deleteUser({ payload: id }) {
  const options = {
    method: "DELETE"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}users/${id}`,
      options
    );
    yield put(deleteUserSuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(deleteUserFailed(message));
  }
}

export function* watchDeleteUser() {
  yield takeEvery(DELETE_USER, deleteUser);
}

export function* watchDeletePolicy() {
  yield takeEvery(DELETE_POLICY, deletePolicy);
}

function* changePassword({ payload: { id, fullName, role, password, emailAddress, mobileNumber } }) {
  const options = {
    data: { fullName, role, password },
    method: "PUT"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}users/${id}/account`,
      options
    );
    if (response._id) {
      yield put(changePasswordSuccess(true));
      yield put(changePasswordSuccess(false));
    } else {
      yield put(changePasswordSuccess(false));
    }
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(changePasswordFailed(message));
  }
}

export function* watchChangePassword() {
  yield takeEvery(CHANGE_PASSWORD, changePassword);
}

function* addClient({
  payload: {
    title,
    nricName,
    preferredName,
    nric_passport,
    dob,
    nextFollowUpDate,
    lastpurchasae,
    lastcontactdate,
    hobbies,
    maritalStatus,
    email,
    contact,
    contact2,
    race,
    nationality,
    familyrelationship,
    address,
    gender,
    category,
    family,
    annualExpense,
    monthlyExpense,
    annualShortTermSavings,
    monthlyShortTermSavings,
    annualIncome,
    monthlyIncome,
    companyaddress,
    companyname,
    occupation,
    referredsource,
    othersource,
    remarks,
    fileList
  }
}) {

  let data = new FormData();
  //Append files to form data
  // data.append("model", JSON.stringify({ "TenantId": "hello", "TenantUrl": "hello", "CertificatePassword": "this.state.CertificatePassword" }));
  //data.append("model", {"TenantId": this.state.TenantId, "TenantUrl": this.state.TenantUrl, "TenantPassword": this.state.TenantPassword });

  data.append(
    "client",
    JSON.stringify({
      title,
      nricName,
      preferredName,
      nric_passport,
      dob,
      nextFollowUpDate,
      lastpurchasae,
      lastcontactdate,
      hobbies,
      maritalStatus,
      email,
      contact,
      contact2,
      race,
      nationality,
      familyrelationship,
      address,
      gender,
      category,
      family,
      annualExpense,
      monthlyExpense,
      annualShortTermSavings,
      monthlyShortTermSavings,
      annualIncome,
      monthlyIncome,
      companyaddress,
      companyname,
      occupation,
      referredsource,
      othersource,
      remarks
    })
  );

  let files = fileList;
  for (let i = 0; i < files.length; i++) {
    let file = files[i].originFileObj;
    data.append("file", file, files[i].name);
  }

  const options = {
    data,
    method: "POST"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}clients`,
      options
    );
    yield put(addClientSuccess(response));
    yield put(addClientSuccess({}));
    let cookiess = new Cookies();
    cookiess.set("clientadded", "true", { path: "/" });
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(addClientFailed(message));
  }
}

export function* watchAddClient() {
  yield takeEvery(ADD_CLIENT, addClient);
}

function* getClients({ payload: key }) {
  let searchKey = "";
  if (key) {
    searchKey = key;
  } else {
    searchKey = "";
  }

  const options = {
    method: "GET"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}clients?key=` + searchKey,
      options
    );
    yield put(getClientsSuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(getClientsFailed(message));
  }
}

export function* watchGetClients() {
  yield takeEvery(GET_CLIENTS, getClients);
}

function* getClientsByCategory({ payload: category }) {
  const options = {
    data: { category: category },
    method: "POST"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}clients/category`,
      options
    );
    yield put(getClientsByCategorySuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(getClientsByCategoryFailed(message));
  }
}

export function* watchGetClientsByCategory() {
  yield takeEvery(GET_CLIENTS_CATEGORY, getClientsByCategory);
}

function* getClient({ payload: id }) {
  const options = {
    method: "GET"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}clients/${id}`,
      options
    );
    yield put(getClientSuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(getClientFailed(message));
  }
}

export function* watchGetClient() {
  yield takeEvery(GET_CLIENT, getClient);
}

function* deleteClient({ payload: id }) {
  const options = {
    method: "DELETE"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}clients/${id}`,
      options
    );
    yield put(deleteClientSuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(deleteClientFailed(message));
  }
}

export function* watchDeleteClient() {
  yield takeEvery(DELETE_CLIENT, deleteClient);
}

function* addPolicy({ payload }) {
  const options = {
    data: {
      policy: payload.policy,
      benefit: payload.benefit,
    },
    method: "POST",
    config: {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  };
  try {
    yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}clients/${payload.clientId}/add-policy`,
      options
    );
    yield put(addPolicySuccess(true));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(addPolicyFailed(message));
  }
}

export function* watchAddPolicy() {
  yield takeEvery(ADD_POLICY, addPolicy);
}

function* getPolicy({ payload: id }) {
  const options = {
    method: "GET"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}clients/${id}/policy`,
      options
    );
    yield put(getPolicySuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(getPolicyFailed(message));
  }
}

export function* watchGetPolicy() {
  yield takeEvery(GET_POLICY, getPolicy);
}

function* getSetting() {
  const options = {
    method: "GET"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/`,
      options
    );
    yield put(getSettingSuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(getSettingFailed(message));
  }
}

export function* watchGetSetting() {
  yield takeEvery(GET_SETTING, getSetting);
}

function* updatePolicy({ payload: { policy, benefit } }) {
  const options = {
    data: {
      policy,
      benefit,
    },
    method: "PUT"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}clients/${policy._id}/policy`,
      options
    );
    if (response._id) {
      yield put(updatePolicySuccess(true));
      yield put(updatePolicySuccess(false));
    } else {
      yield put(updatePolicyFailed(false));
    }
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(updatePolicyFailed(message));
  }
}

export function* watchUpdatePolicy() {
  yield takeEvery(UPDATE_POLICY, updatePolicy);
}

function* updateClient({ payload }) {
  const {
    id,
    title,
    nricName,
    preferredName,
    nric_passport,
    dob,
    nextFollowUpDate,
    lastpurchasae,
    lastcontactdate,
    hobbies,
    maritalStatus,
    email,
    contact,
    contact2,
    race,
    nationality,
    familyrelationship,
    address,
    gender,
    category,
    family,
    annualExpense,
    monthlyExpense,
    annualShortTermSavings,
    monthlyShortTermSavings,
    annualIncome,
    monthlyIncome,
    companyaddress,
    companyname,
    occupation,
    referredsource,
    othersource,
    remarks,
    undeleted,
    fileList
  } = payload;
  let data = new FormData();
  //Append files to form data
  // data.append("model", JSON.stringify({ "TenantId": "hello", "TenantUrl": "hello", "CertificatePassword": "this.state.CertificatePassword" }));
  //data.append("model", {"TenantId": this.state.TenantId, "TenantUrl": this.state.TenantUrl, "TenantPassword": this.state.TenantPassword });

  data.append(
    "client",
    JSON.stringify({
      title,
      nricName,
      preferredName,
      nric_passport,
      dob,
      nextFollowUpDate,
      lastpurchasae,
      lastcontactdate,
      hobbies,
      maritalStatus,
      email,
      contact,
      contact2,
      race,
      nationality,
      familyrelationship,
      address,
      gender,
      category,
      family,
      annualExpense,
      monthlyExpense,
      annualShortTermSavings,
      monthlyShortTermSavings,
      annualIncome,
      monthlyIncome,
      companyaddress,
      companyname,
      occupation,
      referredsource,
      othersource,
      remarks
    })
  );
  data.append("undeleted", JSON.stringify(undeleted));
  let files = fileList;
  for (let i = 0; i < files.length; i++) {
    if (!files[i]._id) {
      let file = files[i].originFileObj;
      data.append("file", file, files[i].name);
    }
  }

  const options = {
    data,
    method: "PUT"
  };

  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}clients/${id}`,
      options
    );
    if (response._id) {
      yield put(updateClientSuccess(payload, true));
    } else {
      yield put(updateClientFailed(false));
    }
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    yield put(updateClientFailed(message));
  }
}

export function* watchUpdateClient() {
  yield takeEvery(UPDATE_CLIENT, updateClient);
}

function* userSaga() {
  yield all([
    fork(watchUpdateAccount),
    fork(watchUpdateAccountCategories),
    fork(watchUpdateAccountFinancial),
    fork(watchAddUser),
    fork(watchDeleteUser),
    fork(watchDeletePolicy),
    fork(watchGetUsers),
    fork(watchGetUser),
    fork(watchChangePassword),
    fork(watchAddClient),
    fork(watchGetClients),
    fork(watchGetClientsByCategory),
    fork(watchGetClient),
    fork(watchDeleteClient),
    fork(watchAddPolicy),
    fork(watchGetPolicy),
    fork(watchGetSetting),
    fork(watchUpdatePolicy),
    fork(watchUpdateClient)
  ]);
}

export default userSaga;
