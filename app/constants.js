import React from 'react';
import { RELATE_SERVER } from '@env';

//API URL
//setup in the .env file in root
export const API_URL = `http://192.168.2.108:3000/api`;
// export const API_URL = `http://192.168.0.2:3000/api`;
// export const API_URL = `${RELATE_SERVER}/api`;

//API End Points
export const REGISTER = `${API_URL}/auth/register`;
export const LOGIN = `${API_URL}/auth/login`;
export const UPDATE_PROFILE = `${API_URL}/user`;
export const UPLOAD_IMAGE = `${API_URL}/user/upload`;
export const FORGOT_PASSWORD = `${API_URL}/auth/recover`;

// RIT ACTIVITY
export const ACTIVITY = `${API_URL}/activity`;
export const YEAR = `${API_URL}/year`;
export const GET_ACTIVITY = `${API_URL}/activity/getActivitiesByCategory`;
export const GET_DETAILS_EVOLUTION = `${API_URL}/activity/getDetailsEvolution`;

export const GET_ACTIVITY_COUNT_CATEGORY = `${API_URL}/activity/getActivitiesCountByCategory`;
// export const GET_DETAILS_COUNT_CATEGORY = `${API_URL}/activity/getDetailsCountByCategory`;
export const GET_ACTIVITY_COUNT_AXIS = `${API_URL}/activity/getActivitiesCountByAxis`;

export const GET_USER = `${API_URL}/user/getUsersByDepartment`;

export const GET_ACTIVITY_COUNT_CATEGORY_DEPARTMENT = `${API_URL}/activity/getActivitiesCountByCategoryByDepartment`;
export const GET_ACTIVITY_COUNT_AXIS_DEPARTMENT = `${API_URL}/activity/getActivitiesCountByAxisByDepartment`;

export const GET_ACTIVITY_COUNT_CATEGORY_INSTITUTION = `${API_URL}/activity/getActivitiesCountByCategoryByInstitution`;
export const GET_ACTIVITY_COUNT_AXIS_INSTITUTION = `${API_URL}/activity/getActivitiesCountByAxisByInstitution`;

export const GET_ACTIVITY_COUNT_CATEGORY_USER = `${API_URL}/activity/getActivitiesCountByCategoryByUser`;
export const GET_ACTIVITY_COUNT_AXIS_USER = `${API_URL}/activity/getActivitiesCountByAxisByUser`;
export const GET_ACTIVITY_COUNT_AXIS_ALL_DEPARTMENT = `${API_URL}/activity/getActivitiesCountByAxisAllDepartment`;

export const GET_ACTIVITY_COUNT_AXIS_EVOLUTION = `${API_URL}/activity/getActivitiesCountByAxisEvolution`;

// radar user logged
export const GET_ACTIVITY_COUNT_AXIS_ALL_USER = `${API_URL}/activity/getActivitiesCountByAxisAllUser`;
export const GET_ACTIVITY_COUNT_AXIS_BY_USER_BY_DEPARTMENT = `${API_URL}/activity/getActivitiesCountByAxisByUserByDepartment`;

export const UPDATE_DETAILS_ACTIVITY = `${API_URL}/activity/updateDetailsActivity`;
// export const CREATE_DETAILS_ACTIVITY = `${API_URL}/activity/createDetailsActivity`;
// export const STORE_DETAILS_ACTIVITY = `${API_URL}/activity/storeDetailsActivity`;

// importação dos dados
export const ADD_DETAILS_ACTIVITY = `${API_URL}/activity/addDetailsActivity`;
export const ADD_DETAILS_ACTIVITY_LATTES = `${API_URL}/activity/addDetailsActivityLattes`;

// RIT DEPARTMENT
export const GET_DEPARTMENT_USER = `${API_URL}/department/getDepartmentUser`;

export const GET_PROJECT = `${API_URL}/project/getProjectsByCategory`;
export const PROJECT = `${API_URL}/project`;

//PIT CRUD
export const BASE_URL = `${API_URL}/`;
export const PIT_URL = `${API_URL}/pit`;
export const CREATE_PIT = `${API_URL}/pit/register`;
export const YEAR_PIT = `${API_URL}/pit/anual`;
