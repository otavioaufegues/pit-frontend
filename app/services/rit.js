import axios from 'axios';
import * as c from '../constants';

export async function createActivityService(userId, activity) {
  try {
    return await axios.post(`${c.ACTIVITY}/${userId}`, activity);
  } catch (e) {
    console.log(e);
  }
}

export async function updateActivityService(activityId, userId, activity) {
  try {
    return await axios.put(`${c.ACTIVITY}/${activityId}/${userId}`, activity);
  } catch (e) {
    console.log(e);
  }
}

export async function deleteActivityService(activityId, userId) {
  try {
    return await axios.delete(`${c.ACTIVITY}/${activityId}/${userId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getYearsService() {
  try {
    return await axios.get(c.YEAR);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesService(year) {
  try {
    return await axios.get(`${c.GET_ACTIVITY}/${year}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getDetailsEvolutionService() {
  //details evolution
  try {
    return await axios.get(c.GET_DETAILS_EVOLUTION);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesCountByCategoryService(year) {
  try {
    return await axios.get(`${c.GET_ACTIVITY_COUNT_CATEGORY}/${year}`);
  } catch (e) {
    console.log(e);
  }
}

// export async function getDetailsCountByCategoryService(year) { //details
//   try {
//     return await axios.get(`${c.GET_DETAILS_COUNT_CATEGORY}/${year}`);
//   } catch (e) {
//     console.log(e);
//   }
// }

export async function getActivitiesCountByAxisService(year) {
  try {
    return await axios.get(`${c.GET_ACTIVITY_COUNT_AXIS}/${year}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getUsersByDepartmentService(year) {
  try {
    return await axios.get(`${c.GET_USER}/${year}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesCountByCategoryByDepartmentService(year, departmentId) {
  try {
    return await axios.get(`${c.GET_ACTIVITY_COUNT_CATEGORY_DEPARTMENT}/${year}/${departmentId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesCountByAxisByDepartmentService(year, departmentId) {
  try {
    return await axios.get(`${c.GET_ACTIVITY_COUNT_AXIS_DEPARTMENT}/${year}/${departmentId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesCountByCategoryByInstitutionService(year) {
  try {
    return await axios.get(`${c.GET_ACTIVITY_COUNT_CATEGORY_INSTITUTION}/${year}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesCountByAxisByInstitutionService(year) {
  try {
    return await axios.get(`${c.GET_ACTIVITY_COUNT_AXIS_INSTITUTION}/${year}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesCountByCategoryByUserService(year, username) {
  try {
    return await axios.get(`${c.GET_ACTIVITY_COUNT_CATEGORY_USER}/${year}/${username}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesCountByAxisByUserService(year, username) {
  try {
    return await axios.get(`${c.GET_ACTIVITY_COUNT_AXIS_USER}/${year}/${username}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesCountByAxisByUserByDepartmentService(year, departmentId) {
  try {
    return await axios.get(`${c.GET_ACTIVITY_COUNT_AXIS_BY_USER_BY_DEPARTMENT}/${year}/${departmentId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesCountByAxisAllUserService(year) {
  try {
    return await axios.get(`${c.GET_ACTIVITY_COUNT_AXIS_ALL_USER}/${year}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesCountByAxisAllDepartmentService(year) {
  try {
    return await axios.get(`${c.GET_ACTIVITY_COUNT_AXIS_ALL_DEPARTMENT}/${year}`);
  } catch (e) {
    console.log(e);
  }
}

export async function getActivitiesCountByAxisEvolutionService() {
  try {
    return await axios.get(c.GET_ACTIVITY_COUNT_AXIS_EVOLUTION);
  } catch (e) {
    console.log(e);
  }
}

export async function updateDetailsActivityService(activityId, detailsActivity) {
  try {
    return await axios.put(`${c.UPDATE_DETAILS_ACTIVITY}/${activityId}`, detailsActivity);
  } catch (e) {
    console.log(e);
  }
}

// export async function createDetailsActivityService(activityId, detailsActivity) {
//   try {
//     return await axios.post(`${c.CREATE_DETAILS_ACTIVITY}/${activityId}`, detailsActivity);
//   } catch (e) {
//     console.log(e);
//   }
// }

// export async function storeDetailsActivityService(detailsActivity) {
//   try {
//     return await axios.post(c.STORE_DETAILS_ACTIVITY, detailsActivity);
//   } catch (e) {
//     console.log(e);
//   }
// }

export async function getDepartmentUserService(userId) {
  try {
    return await axios.get(`${c.GET_DEPARTMENT_USER}/${userId}`);
  } catch (e) {
    console.log(e);
  }
}

// importação dados json
export async function addDetailsActivityService(year) {
  try {
    return await axios.post(c.ADD_DETAILS_ACTIVITY, year);
  } catch (e) {
    console.log(e);
  }
}

// importação dados lattes
export async function addDetailsActivityLattesService(formData) {
  try {
    const headers = {'Content-Type': 'multipart/form-data'};
    return await axios.post(c.ADD_DETAILS_ACTIVITY_LATTES, formData, {headers: headers});
  } catch (e) {
    console.log(e);
  }
}
