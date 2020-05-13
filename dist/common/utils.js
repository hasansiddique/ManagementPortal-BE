import MYSQL_CONNECTION_LOST_ERROR from 'constants';
import transformKeys from './transformKeys';
import mysql from '../services/Mysql';
export const arrayToObject = (array, keyField) => array.reduce((obj, item) => {
  obj[item[keyField].toLowerCase()] = item;
  return transformKeys.toCamelCase(obj);
}, {}); // Params must be a object

const getQueryParams = params => Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

export const URLQueryParams = {
  construct: params => {
    return getQueryParams(params);
  },
  appendToQueryString: (queryString, params) => {
    return queryString ? `${queryString}&${getQueryParams(params)}` : getQueryParams(params);
  }
};
export const handleMysqlError = error => {
  if (error && error.code && error.code === MYSQL_CONNECTION_LOST_ERROR) {
    mysql.restart();
  }
};