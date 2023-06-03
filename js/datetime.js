const now = new Date();
const tdbaredate = now.toDateString(); //just today's date to string
const nowobj = dateTime(now.toJSON()); //converts full dateTime to string

/**
 * helper function to create object holding multiple types of date info
 * @param {string} datestring date string to parse
 *
 */
export function dateTime(datestring) {
  // function to take date string, parse into date, return object
  const d = new Date(datestring);
  const baredate = new Date(d.toDateString());

  let h = d.getHours();
  const monthnames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let dateobj = {
    raw: d,
    datestr: d.toLocaleDateString([], f.datewordshort),
    dsnonlocale: d.toDateString(),
    MMDDYYYY: d.toLocaleDateString([], f.MMDDYYYY),
    timestr: d.toLocaleTimeString([], f.timestd),
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    monthstr: monthnames[d.getMonth()],
    day: d.getDate(),
    weekday: {
      long: d.toLocaleDateString([], { weekday: "long" }),
    },
    unixtime: d.getTime(),
    hour24: d.getHours(),
    hour12: h < 13 ? h : h - 12,
    minutes: parseInt(d.toLocaleTimeString([], { minute: "2-digit" })),
    seconds: parseInt(d.toLocaleTimeString([], { second: "2-digit" })),
    ampm: d.getHours() < 12 ? "am" : "pm",
  };
  if (dateobj.hour24 == 0) {
    dateobj.hour12 = 12;
  }
  dateobj.weekday.short = dateobj.weekday.long.slice(0, 3);
  dateobj.weekday.letter = dateobj.weekday.long.slice(0, 1);
  dateobj.dashed = dateobj.MMDDYYYY.replace(/\//g, "-");
  dateobj.iscurrenthr =
    dateobj.hour24 == now.getHours() && tdbaredate == dateobj.dsnonlocale
      ? true
      : false;
  const daydiffinMS =
    new Date(dateobj.datestr).getTime() - new Date(tdbaredate).getTime();
  dateobj.daydiff = daydiffinMS / (1000 * 60 * 60 * 24); //positive number means date is in the future
  return dateobj;
}
export { dateTime as default };
