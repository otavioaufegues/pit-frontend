import axios from 'axios';
import {GET_PROJECT, PROJECT, YEAR} from '../constants';

export async function getProjectsService(yearId) {
  try {
    return await axios.get(`${GET_PROJECT}/${yearId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function createProjectService(userId, project) {
  try {
    return await axios.post(`${PROJECT}/${userId}`, project);
  } catch (e) {
    console.log(e);
  }
}

export async function updateProjectService(projectId, userId, project) {
  try {
    return await axios.put(`${PROJECT}/${projectId}/${userId}`, project);
  } catch (e) {
    console.log(e);
  }
}

export async function deleteProjectService(projectId, userId) {
  try {
    return await axios.delete(`${PROJECT}/${projectId}/${userId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getYearsService() {
  try {
    return await axios.get(YEAR);
  } catch (e) {
    console.log(e);
  }
}
