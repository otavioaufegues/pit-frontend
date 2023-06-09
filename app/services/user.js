import axios from 'axios';

import { GET_RESULT } from '../constants';

export async function getResult(yearId, userId) {
  try {
    return await axios.get(GET_RESULT + '/' + userId + '/' + yearId);
  } catch (e) {
    throw handler(e);
  }
}

export function handler(err) {
  let error = err;

  if (err.response && err.response.data.hasOwnProperty('message'))
    error = err.response.data;
  else if (!err.hasOwnProperty('message')) error = err.toJSON();

  return new Error(error.message);
}
