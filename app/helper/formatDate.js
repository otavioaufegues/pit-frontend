export const formatDate = (date) => {
  let dateArray = date.split('/');
  return dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
};
