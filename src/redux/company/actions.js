import {
  GET_COMPANIES, ADD_COMPANY, ADD_COMPANY_SUCCESS,
  GET_COMPANY, GET_COMPANY_SUCCESS, CREATE_COLUMN,
  CREATE_COLUMN_SUCCESS, SET_ACTIVE, UPDATE_COMPANY,
  ADD_MAIN_PLAN, UPDATE_MAIN_PLAN, DELETE_MAIN_PLAN,
  ADD_MAIN_PLAN_SUCCESS, DELETE_MAIN_PLAN_SUCCESS,
  ADD_RIDER, UPDATE_RIDER, DELETE_RIDER,
  ADD_RIDER_SUCCESS, DELETE_RIDER_SUCCESS,
  EDIT_COMPANY_ERROR, DELETE_COMPANY, DELETE_COMPANY_SUCCESS,
} from "../../constants/actionTypes";

export const addCompany = (company, ) => ({
  type: ADD_COMPANY,
  payload: { company }
});

export const addCompanySuccess = (companies) => ({
  type: ADD_COMPANY_SUCCESS,
  payload: companies
});

export const editCompanySuccess = (company) => ({
  type: GET_COMPANY_SUCCESS,
  payload: company
});

export const deleteCompany = (id) => ({
  type: DELETE_COMPANY,
  payload: { id }
});

export const deleteCompanySuccess = (companyId) => ({
  type: DELETE_COMPANY_SUCCESS,
  payload: companyId
});

export const getCompanies = () => ({
  type: GET_COMPANIES
});

export const getCompany = (id) => ({
  type: GET_COMPANY,
  payload: id
});

export const createColumn = (id) => ({
  type: CREATE_COLUMN
});

export const createColumnSuccess = () => ({
  type: CREATE_COLUMN_SUCCESS
});

export const setActive = (active) => ({
  type: SET_ACTIVE,
  payload: active
});

export const updateCompany = (companyName, id) => ({
  type: UPDATE_COMPANY,
  payload: { id, companyName }
});

export const addMainPlan = (companyId, mainPlanName) => ({
  type: ADD_MAIN_PLAN,
  payload: { companyId, mainPlanName }
});

export const addMainPlanSuccess = (mainPlan) => ({
  type: ADD_MAIN_PLAN_SUCCESS,
  payload: { mainPlan }
});

export const updateMainPlan = (mainPlanId, mainPlan) => ({
  type: UPDATE_MAIN_PLAN,
  payload: { mainPlanId, mainPlan },
});

export const deleteMainPlan = (companyId, mainPlanId) => ({
  type: DELETE_MAIN_PLAN,
  payload: { companyId, mainPlanId },
});

export const deleteMainPlanSuccess = (mainPlanId) => ({
  type: DELETE_MAIN_PLAN_SUCCESS,
  payload: { mainPlanId },
});

export const addRider = (mainPlanId, riderName) => ({
  type: ADD_RIDER,
  payload: { mainPlanId, riderName }
});

export const addRiderSuccess = (mainPlanId, rider) => ({
  type: ADD_RIDER_SUCCESS,
  payload: { mainPlanId, rider }
});

export const updateRider = (riderId, rider) => ({
  type: UPDATE_RIDER,
  payload: { riderId, rider }
});

export const deleteRider = (mainPlanId, riderId) => ({
  type: DELETE_RIDER,
  payload: { mainPlanId, riderId },
});

export const deleteRiderSuccess = (riderId) => ({
  type: DELETE_RIDER_SUCCESS,
  payload: { riderId },
});

export const editCompanyError = (error) => ({
  type: EDIT_COMPANY_ERROR,
  payload: { error },
});