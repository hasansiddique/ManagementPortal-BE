import axios from 'axios';
import merge from 'lodash/merge';

import transformKeys from '../transformKeys';

const forcedHeaders = {
  Accept: 'application/vnd.cia.v1+json',
  'Content-Type': 'application/vnd.cia.v1+json',
};

const getHeaders = (headers) => {
  return merge({}, headers, forcedHeaders);
};

const request = {
  get: (url, headers = {}) => {
    return axios({
      method: 'GET',
      url,
      headers: getHeaders(headers),
    });
  },
  post: (url, data, headers = {}, transform = true) => {
    return axios({
      method: 'POST',
      url,
      data: transform ? transformKeys.toSnakeCase(data) : data,
      headers: getHeaders(headers),
    });
  },
  patch: (url, data, headers = {}, transform = true) => {
    return axios({
      method: 'PATCH',
      url,
      data: transform ? transformKeys.toSnakeCase(data) : data,
      headers: getHeaders(headers),
    });
  },
  delete: (url, headers = {}) => {
    return axios({
      method: 'DELETE',
      url,
      headers: getHeaders(headers),
    });
  },
};

export default request;

