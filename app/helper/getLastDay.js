export const getLastDay = (date) => {
  let dateArray = date.split('/');
  return dateArray[2] + '-12-31';
};
