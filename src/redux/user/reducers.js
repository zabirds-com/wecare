// @flow
import {
  UPDATE_ACCOUNT,
  UPDATE_ACCOUNT_SUCCESS,
  UPDATE_ACCOUNT_FAILED,

  UPDATE_ACCOUNT_CATEGORY,
  UPDATE_ACCOUNT_CATEGORY_SUCCESS,
  UPDATE_ACCOUNT_CATEGORY_FAILED,

  UPDATE_ACCOUNT_FINANCIAL,
  UPDATE_ACCOUNT_FINANCIAL_FAILED,
  UPDATE_ACCOUNT_FINANCIAL_SUCCESS,

  ADD_USER,
  ADD_USER_SUCCESS,
  ADD_USER_FAILED,

  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USERS_FAILED,

  GET_USER,
  GET_USER_SUCCESS,
  GET_USER_FAILED,

  DELETE_POLICY,
  DELETE_POLICY_SUCCESS,
  DELETE_POLICY_FAILED,

  RESET_POLICIES_CHANGED,

  DELETE_USER,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILED,

  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILED,

  ADD_CLIENT,
  ADD_CLIENT_SUCCESS,
  ADD_CLIENT_FAILED,

  GET_CLIENTS,
  GET_CLIENTS_SUCCESS,
  GET_CLIENTS_FAILED,

  GET_CLIENTS_CATEGORY,
  GET_CLIENTS_CATEGORY_SUCCESS,
  GET_CLIENTS_CATEGORY_FAILED,

  GET_CLIENT,
  GET_CLIENT_SUCCESS,
  GET_CLIENT_FAILED,

  ADD_POLICY,
  ADD_POLICY_SUCCESS,
  ADD_POLICY_FAILED,

  GET_POLICY,
  GET_POLICY_SUCCESS,
  GET_POLICY_FAILED,

  GET_SETTING,
  GET_SETTING_SUCCESS,
  GET_SETTING_FAILED,

  UPDATE_POLICY,
  UPDATE_POLICY_SUCCESS,
  UPDATE_POLICY_FAILED,

  UPDATE_CLIENT,
  UPDATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_FAILED,

  DELETE_CLIENT,
  DELETE_CLIENT_SUCCESS,
  DELETE_CLIENT_FAILED,
} from '../../constants/actionTypes';

const INIT_STATE = {
  loading: false,
  updateAccountSuccess: false,
  user: {},
  userAdded: {},
  users: [],
  changePassword: false,
  clients: [],
  client: {},
  clientAdded: {},
  policiesChanged: false,
  policy: {},
  updatePolicySuccess: false,
  updateClientSuccess: false,
  deleteClientSuccess: false,
};

const Auth = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT:
      return {
        ...state, loading: true
      };
    case UPDATE_ACCOUNT_SUCCESS:
      return {
        ...state, updateAccountSuccess: action.payload, loading: false, error: null
      };
    case UPDATE_ACCOUNT_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case UPDATE_ACCOUNT_CATEGORY:
      return {
        ...state, loading: true
      };
    case UPDATE_ACCOUNT_CATEGORY_SUCCESS:
      return {
        ...state, updateAccountCategorySuccess: action.payload, loading: false, error: null
      };
    case UPDATE_ACCOUNT_CATEGORY_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case UPDATE_ACCOUNT_FINANCIAL:
      return {
        ...state, loading: true
      };
    case UPDATE_ACCOUNT_FINANCIAL_SUCCESS:
      return {
        ...state, updateAccountFinancialSuccess: action.payload, loading: false, error: null
      };
    case UPDATE_ACCOUNT_FINANCIAL_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case ADD_USER:
      return {
        ...state, loading: true
      };
    case ADD_USER_SUCCESS:
      return {
        ...state, userAdded: action.payload, loading: false, error: null
      };
    case ADD_USER_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case GET_USERS:
      return {
        ...state, loading: true
      };
    case GET_USERS_SUCCESS:
      return {
        ...state, users: action.payload, loading: false, error: null
      };
    case GET_USERS_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case GET_USER:
      return {
        ...state, loading: true
      };
    case GET_USER_SUCCESS:
      return {
        ...state, user: action.payload, loading: false, error: null
      };
    case GET_USER_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case DELETE_USER:
      return {
        ...state, loading: true
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state, users: action.payload, loading: false, error: null
      };
    case DELETE_USER_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case DELETE_POLICY:
      return {
        ...state, loading: true
      };
    case DELETE_POLICY_SUCCESS:
      return {
        ...state, policiesChanged: true, loading: false, error: null
      };
    case DELETE_POLICY_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };
    case RESET_POLICIES_CHANGED:
      return {
        ...state, policiesChanged: false,
      };
    case CHANGE_PASSWORD:
      return {
        ...state, loading: true
      };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state, changePassword: action.payload, loading: false, error: null
      };
    case CHANGE_PASSWORD_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case ADD_CLIENT:
      return {
        ...state, loading: true
      };
    case ADD_CLIENT_SUCCESS:
      return {
        ...state, clientAdded: action.payload, loading: false, error: null
      };
    case ADD_CLIENT_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case GET_CLIENTS:
      return {
        ...state, loading: true
      };
    case GET_CLIENTS_SUCCESS:
      return {
        ...state, clients: action.payload, loading: false, error: null
      };
    case GET_CLIENTS_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case GET_CLIENTS_CATEGORY:
      return {
        ...state, loading: true
      };
    case GET_CLIENTS_CATEGORY_SUCCESS:
      return {
        ...state, clients: action.payload, loading: false, error: null
      };
    case GET_CLIENTS_CATEGORY_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case GET_CLIENT:
      return {
        ...state, loading: true
      };
    case GET_CLIENT_SUCCESS:
      return {
        ...state, client: action.payload, loading: false, error: null
      };
    case GET_CLIENT_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };
    default:
      return {
        ...state
      };

    case ADD_POLICY:
      return {
        ...state, loading: true
      };
    case ADD_POLICY_SUCCESS:
      return {
        ...state, policiesChanged: true, loading: false, error: null
      };
    case ADD_POLICY_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case GET_POLICY:
      return {
        ...state, loading: true
      };
    case GET_POLICY_SUCCESS:
      return {
        ...state, policy: action.payload, loading: false, error: null
      };
    case GET_POLICY_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case GET_SETTING:
      return {
        ...state, loading: true
      };
    case GET_SETTING_SUCCESS:
      return {
        ...state, setting: action.payload, loading: false, error: null
      };
    case GET_SETTING_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case UPDATE_POLICY:
      return {
        ...state, loading: true
      };
    case UPDATE_POLICY_SUCCESS:
      return {
        ...state, updatePolicySuccess: action.payload, loading: false, error: null
      };
    case UPDATE_POLICY_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case UPDATE_CLIENT:
      return {
        ...state, loading: true
      };
    case UPDATE_CLIENT_SUCCESS:
      const { client, success } = action.payload;
      const newClient = { ...state.client, ...client };
      console.log(newClient);
      return {
        ...state, client: newClient, updateClientSuccess: success, loading: false, error: null
      };
    case UPDATE_CLIENT_FAILED:
      return {
        ...state, error: action.payload, loading: false
      };

    case DELETE_CLIENT:
      return {
        ...state, loading: true
      };
    case DELETE_CLIENT_SUCCESS:
      return {
        ...state, deleteClientSuccess: action.payload, loading: false, error: null
      }
    case DELETE_CLIENT_FAILED:
      return {
        ...state, error: action.payload, loading: false
      }
  }
};

export default Auth;