import _ from 'lodash';

const defaultMainDataHeader = ["Age", "Premium", "Cash Outlay"];
const defaultRiderHeader = ["Age", "Premium"];

export function convertCsvToMainPlanData(csv) {
  const ret = [];
  const { data } = csv;

  if (!data || !_.isEqual(data[0], defaultMainDataHeader)) {
    throw new Error("Invalid csv data");
  }

  for (var i = 1; i < data.length; i++) {
    if (isUndefinedOrEmpty(data[i][0]) && isUndefinedOrEmpty(data[i][1]) && isUndefinedOrEmpty(data[i][2])) {
      continue;
    }

    if (isNotANumber(data[i][0]) || isNotANumber(data[i][1]) || isNotANumber(data[i][2])) {
      throw new Error("Invalid csv data");
    }
    ret.push({ age: data[i][0], premium: data[i][1], cashOutlay: data[i][2] })
  }

  return ret;
}

function isNotANumber(text) {
  return text.trim() === '' || isNaN(+text);
}

function isUndefinedOrEmpty(text) {
  return !text || text.trim() === '';
}

export function convertMainPlanDataToCsv(data) {
  let str = '';
  str = "data:text/csv;charset=utf-8," + _.join(defaultMainDataHeader, ',') + '\n';
  _.forEach(data, (item) => {
    str += _.join([item.age, item.premium, item.cashOutlay], ',') + '\n';
  });
  str = str.substring(0, str.length - 2);
  return str;
}

export function convertCsvToRiderData(csv) {
  const ret = [];
  const { data } = csv;

  if (!data || !_.isEqual(data[0], defaultRiderHeader)) {
    throw new Error("Invalid csv data");
  }

  for (var i = 1; i < data.length; i++) {
    if (isUndefinedOrEmpty(data[i][0]) && isUndefinedOrEmpty(data[i][1])) {
      continue;
    }
    if (isNotANumber(data[i][0]) || isNotANumber(data[i][1])) {
      throw new Error("Invalid csv data");
    }
    ret.push({ age: data[i][0], premium: data[i][1] })
  }

  return ret;
}

export function convertRiderDataToCsv(data) {
  let str = '';
  str = "data:text/csv;charset=utf-8," + _.join(defaultRiderHeader, ',') + '\n';
  _.forEach(data, (item) => {
    str += _.join([item.age, item.premium], ',') + '\n';
  });
  str = str.substring(0, str.length - 2);
  return str;
}