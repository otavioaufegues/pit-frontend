import axios from 'axios';

import { BASE_URL } from '../constants';

export async function getAxis() {
  try {
    return await axios.get(BASE_URL + 'axis');
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
