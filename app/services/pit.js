import axios from 'axios';

import { LIST_PIT, CREATE_PIT, YEAR_PIT } from '../constants';

export async function listPIT(year) {
  try {
    return await axios.get(LIST_PIT + '/year/' + year);
  } catch (e) {
    throw handler(e);
  }
}

export async function getPIT(pitId) {
  try {
    return await axios.get(LIST_PIT + '/' + pitId);
  } catch (e) {
    throw handler(e);
  }
}

export async function createPIT(payload) {
  try {
    return await axios.post(CREATE_PIT, payload);
  } catch (e) {
    throw handler(e);
  }
}

export async function updatePIT(pitId, payload) {
  try {
    return await axios.put(LIST_PIT + '/' + pitId, payload);
  } catch (e) {
    throw handler(e);
  }
}

export async function removePIT(pitId) {
  try {
    return await axios.delete(LIST_PIT + '/' + pitId);
  } catch (e) {
    throw handler(e);
  }
}

export async function getYearPit(year) {
  try {
    return await axios.get(YEAR_PIT + '/' + year);
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
