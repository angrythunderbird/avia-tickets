export function getFormattedDate(date) {
  const months = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
  };

  const fullDate = new Date(date);
  const year = fullDate.getFullYear();
  const monthWord = months[fullDate.getMonth() + 1];
  let dt = fullDate.getDate();
  let hrs = fullDate.getHours();
  let mnts = fullDate.getMinutes();

  if (dt < 10) {
    dt = '0' + dt;
  }

  // const monthWord = months[month];

  if (hrs < 10) {
    hrs = '0' + hrs;
  }

  if (mnts < 10) {
    mnts = '0' + mnts;
  }

  const shortDate = `${dt + ' / ' + monthWord + ' / ' + year + ' / ' + hrs + ':' + mnts}`;
  return shortDate;
}
