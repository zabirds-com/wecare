import {
  UPDATE_ACCOUNT,
  UPDATE_ACCOUNT_SUCCESS,
  UPDATE_ACCOUNT_FAILED,
  UPDATE_ACCOUNT_FINANCIAL,
  UPDATE_ACCOUNT_FINANCIAL_SUCCESS,
  UPDATE_ACCOUNT_FINANCIAL_FAILED,
  UPDATE_ACCOUNT_CATEGORY,
  UPDATE_ACCOUNT_CATEGORY_SUCCESS,
  UPDATE_ACCOUNT_CATEGORY_FAILED,
  ADD_USER,
  ADD_USER_SUCCESS,
  ADD_USER_FAILED,
  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USERS_FAILED,
  GET_USER,
  GET_USER_SUCCESS,
  GET_USER_FAILED,
  DELETE_USER,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILED,
  DELETE_POLICY,
  DELETE_POLICY_SUCCESS,
  DELETE_POLICY_FAILED,
  RESET_POLICIES_CHANGED,
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
  DELETE_CLIENT,
  DELETE_CLIENT_SUCCESS,
  DELETE_CLIENT_FAILED,
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
  UPDATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_FAILED,
  UPDATE_CLIENT
} from "../../constants/actionTypes";

export const updateAccount = (
  id,
  fullName,
  password,
  avatar,
  emailAddress,
  mobileNumber,
) => ({
  type: UPDATE_ACCOUNT,
  payload: {
    id,
    fullName,
    password,
    avatar,
    emailAddress,
    mobileNumber,
  }
});

export const updateAccountSuccess = (updateAccount) => ({
  type: UPDATE_ACCOUNT_SUCCESS,
  payload: updateAccount
});

export const updateAccountFailed = (error) => ({
  type: UPDATE_ACCOUNT_FAILED,
  payload: error
});

export const updateAccountFinancial = (
  id,
  financial
) => ({
  type: UPDATE_ACCOUNT_FINANCIAL,
  payload: {
    id,
    financial
  }
});

export const updateAccountFinancialSuccess = (updateAccount) => ({
  type: UPDATE_ACCOUNT_FINANCIAL_SUCCESS,
  payload: updateAccount
});

export const updateAccountFinancialFailed = (error) => ({
  type: UPDATE_ACCOUNT_FINANCIAL_FAILED,
  payload: error
});

export const updateAccountCategories = (
  id,
  categories
) => ({
  type: UPDATE_ACCOUNT_CATEGORY,
  payload: {
    id,
    categories
  }
});

export const updateAccountCategoriesSuccess = (updateAccount) => ({
  type: UPDATE_ACCOUNT_CATEGORY_SUCCESS,
  payload: updateAccount
});

export const updateAccountCategoriesFailed = (error) => ({
  type: UPDATE_ACCOUNT_CATEGORY_FAILED,
  payload: error
});

export const addUser = (
  fullName,
  username,
  role,
  password,
  emailAddress,
  mobileNumber,
) => ({
  type: ADD_USER,
  payload: {
    fullName,
    username,
    role,
    password,
    emailAddress,
    mobileNumber,
  }
});

export const addUserSuccess = (user) => ({
  type: ADD_USER_SUCCESS,
  payload: user
});

export const addUserFailed = (error) => ({
  type: ADD_USER_FAILED,
  payload: error
});

export const getUsers = () => ({
  type: GET_USERS
});

export const getUsersSuccess = (users) => ({
  type: GET_USERS_SUCCESS,
  payload: users
});

export const getUsersFailed = (error) => ({
  type: GET_USERS_FAILED,
  payload: error
});

export const getUser = (id) => ({
  type: GET_USER,
  payload: id
});

export const getUserSuccess = (user) => ({
  type: GET_USER_SUCCESS,
  payload: user
});

export const getUserFailed = (error) => ({
  type: GET_USER_FAILED,
  payload: error
});

export const deleteUser = (id) => ({
  type: DELETE_USER,
  payload: id
});

export const deleteUserSuccess = (deleteUser) => ({
  type: DELETE_USER_SUCCESS,
  payload: deleteUser
});

export const deleteUserFailed = (error) => ({
  type: DELETE_USER_FAILED,
  payload: error
});

export const deletePolicy = (id) => ({
  type: DELETE_POLICY,
  payload: id
});

export const deletePolicySuccess = (policy) => ({
  type: DELETE_POLICY_SUCCESS,
  payload: policy
});

export const deletePolicyFailed = (error) => ({
  type: DELETE_POLICY_FAILED,
  payload: error
});

export const resetPoliciesChanged = () => ({
  type: RESET_POLICIES_CHANGED,
  payload: {}
})

export const changePassword = (
  id,
  fullName,
  role,
  password,
  emailAddress,
  mobileNumber,
) => ({
  type: CHANGE_PASSWORD,
  payload: {
    id,
    fullName,
    role,
    password,
    emailAddress,
    mobileNumber
  }
});

export const changePasswordSuccess = (changePassword) => ({
  type: CHANGE_PASSWORD_SUCCESS,
  payload: changePassword
});

export const changePasswordFailed = (error) => ({
  type: CHANGE_PASSWORD_FAILED,
  payload: error
});

export const addClient = (
  title,
  nricName,
  preferredName,
  nric_passport,
  dob,
  age,
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
  fileList,
) => ({
  type: ADD_CLIENT,
  payload: {
    title,
    nricName,
    preferredName,
    nric_passport,
    dob,
    age,
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
    fileList,
  }
});

export const addClientSuccess = (client) => ({
  type: ADD_CLIENT_SUCCESS,
  payload: client
});

export const addClientFailed = (error) => ({
  type: ADD_CLIENT_FAILED,
  payload: error
});

export const getClients = (key) => ({
  type: GET_CLIENTS,
  payload: key
});

export const getClientsSuccess = (clients) => ({
  type: GET_CLIENTS_SUCCESS,
  payload: clients
});

export const getClientsFailed = (error) => ({
  type: GET_CLIENTS_FAILED,
  payload: error
});

export const getClientsByCategory = (category) => ({
  type: GET_CLIENTS_CATEGORY,
  payload: category
});

export const getClientsByCategorySuccess = (clients) => ({
  type: GET_CLIENTS_CATEGORY_SUCCESS,
  payload: clients
});

export const getClientsByCategoryFailed = (error) => ({
  type: GET_CLIENTS_CATEGORY_FAILED,
  payload: error
});


export const deleteClient = (key) => ({
  type: DELETE_CLIENT,
  payload: key
});

export const deleteClientSuccess = (deleteClient) => ({
  type: DELETE_CLIENT_SUCCESS,
  payload: deleteClient
});

export const deleteClientFailed = (error) => ({
  type: DELETE_CLIENT_FAILED,
  payload: error
});

export const getClient = (id) => ({
  type: GET_CLIENT,
  payload: id
});

export const getClientSuccess = (client) => ({
  type: GET_CLIENT_SUCCESS,
  payload: client
});

export const getClientFailed = (error) => ({
  type: GET_CLIENT_FAILED,
  payload: error
});

export const addPolicy = (clientId, policy, benefit) => ({
  type: ADD_POLICY,
  payload: { clientId, policy, benefit }
});

export const addPolicySuccess = (policy) => ({
  type: ADD_POLICY_SUCCESS,
  payload: policy
});

export const addPolicyFailed = (error) => ({
  type: ADD_POLICY_FAILED,
  payload: error
});

export const getPolicy = (id) => ({
  type: GET_POLICY,
  payload: id
});

export const getPolicySuccess = (policy) => ({
  type: GET_POLICY_SUCCESS,
  payload: policy
});

export const getPolicyFailed = (error) => ({
  type: GET_POLICY_FAILED,
  payload: error
});

export const getSetting = () => ({
  type: GET_SETTING,
  payload: null
});

export const getSettingSuccess = (setting) => ({
  type: GET_SETTING_SUCCESS,
  payload: setting
});

export const getSettingFailed = (error) => ({
  type: GET_SETTING_FAILED,
  payload: error
});

export const updatePolicy = (policy, benefit) => ({
  type: UPDATE_POLICY,
  payload: { policy, benefit }
});

export const updatePolicySuccess = (policy) => ({
  type: UPDATE_POLICY_SUCCESS,
  payload: policy
});

export const updatePolicyFailed = (error) => ({
  type: UPDATE_POLICY_FAILED,
  payload: error
});

export const updateClient = (
  id,
  title,
  nricName,
  preferredName,
  nric_passport,
  dob,
  age,
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
  fileList,
) => ({
  type: UPDATE_CLIENT,
  payload: {
    id,
    title,
    nricName,
    preferredName,
    nric_passport,
    dob,
    age,
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
    fileList,
  }
});

export const updateClientSuccess = (client, success) => ({
  type: UPDATE_CLIENT_SUCCESS,
  payload: { client, success }
});

export const updateClientFailed = (error) => ({
  type: UPDATE_CLIENT_FAILED,
  payload: error
});