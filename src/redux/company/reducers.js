// @flow
import {
  ADD_COMPANY,
  ADD_COMPANY_SUCCESS,
  GET_COMPANY_SUCCESS,
  SET_ACTIVE,
  ADD_MAIN_PLAN, ADD_MAIN_PLAN_SUCCESS, UPDATE_MAIN_PLAN,
  DELETE_MAIN_PLAN_SUCCESS, DELETE_MAIN_PLAN,
  ADD_RIDER_SUCCESS, ADD_RIDER, UPDATE_RIDER,
  DELETE_RIDER_SUCCESS, DELETE_RIDER, EDIT_COMPANY_ERROR, DELETE_COMPANY_SUCCESS,
} from '../../constants/actionTypes';

import _ from 'lodash';


const INIT_STATE = {
  loading: false,
  companies: [],
  error: null,
  company: null,
  textarray: [],
  outarray: [],
  riders: [],
  mainPlans: [],
  active: 'financial',
};

const Company = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_COMPANY:
      return {
        ...state, companies: [], error: null,
      };
    case ADD_COMPANY_SUCCESS:
      return {
        ...state, companies: action.payload,
        error: null,
      };
    case GET_COMPANY_SUCCESS:
      return {
        ...state, company: action.payload,
        mainPlans: action.payload.mainPlans,
        riders: _.flatMap(action.payload.mainPlans, m => m.riders),
        error: null,
      };
    case DELETE_COMPANY_SUCCESS:
      let { companies } = state;
      companies = companies.filter(c => c._id !== action.payload.id);
      return {
        ...state, companies,
      }
    case SET_ACTIVE:
      return {
        ...state, active: action.payload
      };
    case ADD_MAIN_PLAN:
    case UPDATE_MAIN_PLAN:
    case DELETE_MAIN_PLAN:
    case ADD_RIDER:
    case UPDATE_RIDER:
    case DELETE_RIDER:
      return {
        ...state, error: null,
      }
    case ADD_MAIN_PLAN_SUCCESS:
      return {
        ...state, mainPlans: [...state.mainPlans, action.payload.mainPlan]
      }
    case DELETE_MAIN_PLAN_SUCCESS:
      return {
        ...state, mainPlans: state.mainPlans.filter(m => m._id !== action.payload.mainPlanId)
      }
    case ADD_RIDER_SUCCESS:
      return {
        ...state, riders: [...state.riders, action.payload.rider]
      }
    case DELETE_RIDER_SUCCESS:
      return {
        ...state, riders: state.riders.filter(m => m._id !== action.payload.riderId)
      }
    case EDIT_COMPANY_ERROR:
      return {
        ...state, error: action.payload.error,
      }
    default:
      return state
  }
};

export default Company;