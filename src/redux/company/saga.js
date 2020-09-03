// @flow
import axios from "axios";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import {
  ADD_COMPANY, GET_COMPANIES, GET_COMPANY, CREATE_COLUMN, UPDATE_COMPANY,
  ADD_MAIN_PLAN, UPDATE_MAIN_PLAN, DELETE_MAIN_PLAN,
  ADD_RIDER, UPDATE_RIDER, DELETE_RIDER, DELETE_COMPANY,
} from "../../constants/actionTypes";
import {
  addCompanySuccess,
  editCompanySuccess,
  createColumnSuccess,
  addMainPlanSuccess,
  addRiderSuccess,
  deleteMainPlanSuccess,
  deleteRiderSuccess,
  editCompanyError,
  deleteCompanySuccess,
} from "./actions";

/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 */
const fetchJSON = (url, options = {}) => {
  return axios(url, options)
    .then(response => {
      if (response.status === 200) {
        return response.data;
      }
      throw new Error(response.data);
    })
    .catch(error => {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error);
      }
      throw error;
    });
};

function* _addCompany({ payload: { company } }) {
  const options = {
    data: { company },
    method: "POST"
  };
  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/addCompany`,
      options
    );
    yield put(addCompanySuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    console.log(message);
    // yield put(getSettingFailed(message));
  }
}

function* _getCompanies() {
  const options = {
    method: "GET"
  };
  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/getCompany`,
      options
    );
    yield put(addCompanySuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    console.log(message);
  }
}

function* _createColumn({ payload: id }) {
  yield put(createColumnSuccess());
}

function* _getCompany({ payload: id }) {
  const options = {
    method: "GET"
  };
  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/getCompany/${id}`,
      options
    );
    yield put(editCompanySuccess(response));
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    console.log(message);
  }
}

function* _updateCompany({ payload: { companyName, id } }) {
  try {
    yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/company`,
      {
        data: { id, companyName },
        method: "PUT"
      }
    );
  } catch (error) {
    let message;
    if (error.status === 500) {
      message = "Internal Server Error";
    } else {
      message = error;
    }
    console.log(message);
  }
}

function* _deleteCompany({ payload: id }) {
  try {
    yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/company`,
      {
        data: id,
        method: "DELETE"
      }
    );
    yield put(deleteCompanySuccess(id));
  } catch (error) {
    const errorMessage = error.status === 500
      ? "Internal Server Error" : error.message;
    yield put(editCompanyError(errorMessage));
  }
}

function* _addMainPlan({ payload }) {
  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/company/mainPlan`,
      {
        data: payload,
        method: "POST"
      }
    );
    yield put(addMainPlanSuccess(response));
  } catch (error) {
    const errorMessage = error.status === 500
      ? "Internal Server Error" : error.message;
    yield put(editCompanyError(errorMessage));
  }
}

function* _updateMainPlan({ payload }) {
  try {
    yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/company/mainPlan`,
      {
        data: payload,
        method: "PUT"
      }
    );
  } catch (error) {
    const errorMessage = error.status === 500
      ? "Internal Server Error" : error.message;
    yield put(editCompanyError(errorMessage));
  }
}

function* _deleteMainPlan({ payload }) {
  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/company/mainPlan`,
      {
        data: payload,
        method: "DELETE"
      }
    );
    yield put(deleteMainPlanSuccess(response._id));
  } catch (error) {
    const errorMessage = error.status === 500
      ? "Internal Server Error" : error.message;
    yield put(editCompanyError(errorMessage));
  }
}

function* _addRider({ payload }) {
  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/company/mainPlan/rider`,
      {
        data: payload,
        method: "POST"
      }
    );
    yield put(addRiderSuccess(payload.mainPlanId, response));
  } catch (error) {
    const errorMessage = error.status === 500
      ? "Internal Server Error" : error.message;
    yield put(editCompanyError(errorMessage));
  }
}

function* _updateRider({ payload }) {
  try {
    yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/company/mainPlan/rider`,
      {
        data: payload,
        method: "PUT"
      }
    );
  } catch (error) {
    const errorMessage = error.status === 500
      ? "Internal Server Error" : error.message;
    yield put(editCompanyError(errorMessage));
  }
}

function* _deleteRider({ payload }) {
  try {
    const response = yield call(
      fetchJSON,
      `${process.env.REACT_APP_API_URL}settings/company/mainPlan/rider`,
      {
        data: payload,
        method: "DELETE"
      }
    );
    yield put(deleteRiderSuccess(response._id));
  } catch (error) {
    const errorMessage = error.status === 500
      ? "Internal Server Error" : error.message;
    yield put(editCompanyError(errorMessage));
  }
}

export function* watchAddCompany() {
  yield takeEvery(ADD_COMPANY, _addCompany);
}

export function* watchGetCompanies() {
  yield takeEvery(GET_COMPANIES, _getCompanies);
}

export function* watchGetCompany() {
  yield takeEvery(GET_COMPANY, _getCompany);
}

export function* watchDeleteCompany() {
  yield takeEvery(DELETE_COMPANY, _deleteCompany);
}

export function* watchCreateColumn() {
  yield takeEvery(CREATE_COLUMN, _createColumn);
}

export function* watchUpdateCompany() {
  yield takeEvery(UPDATE_COMPANY, _updateCompany);
}

export function* watchAddMainPlan() {
  yield takeEvery(ADD_MAIN_PLAN, _addMainPlan);
}
export function* watchUpdateMainPlan() {
  yield takeEvery(UPDATE_MAIN_PLAN, _updateMainPlan);
}
export function* watchDeleteMainPlan() {
  yield takeEvery(DELETE_MAIN_PLAN, _deleteMainPlan);
}
export function* watchAddRider() {
  yield takeEvery(ADD_RIDER, _addRider);
}
export function* watchUpdateRider() {
  yield takeEvery(UPDATE_RIDER, _updateRider);
}
export function* watchDeleteRider() {
  yield takeEvery(DELETE_RIDER, _deleteRider);
}

function* companySaga() {
  yield all([
    fork(watchAddCompany),
    fork(watchGetCompanies),
    fork(watchGetCompany),
    fork(watchDeleteCompany),
    fork(watchCreateColumn),
    fork(watchUpdateCompany),
    fork(watchAddMainPlan),
    fork(watchUpdateMainPlan),
    fork(watchDeleteMainPlan),
    fork(watchAddRider),
    fork(watchUpdateRider),
    fork(watchDeleteRider),
  ]);
}

export default companySaga;
