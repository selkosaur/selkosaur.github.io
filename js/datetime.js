/**
 * common formats to use with `toLocaleDateString`
 */
const f = {
  MMDDYYYY: {
    // ex)
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
  datewordshort: {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  },
  weekdaymonthday: {
    weekday: "short",
    month: "short",
    day: "numeric",
  },
  timestd: {
    // ex) "2:34 PM"
    hour: "numeric",
    minute: "2-digit",
  },
};

const now = new Date();
const tdbaredate = now.toDateString(); //just today's date to string
//const nowobj = dateTime(now.toJSON()); //converts full dateTime to string

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
/**
 *
 * @param {Number} days
 * @returns {Date}
 */
const addDaystoNow = function (days) {
  return addDays(tdbaredate, days);
};
/**
 * helper function to create object holding multiple types of date info
 * @param {string} datestring date string to parse
 *
 */
export default function dateTime(datestring) {
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
    isFuture: d > now,
    isPast: d < now,
    isToday: d.toDateString() === tdbaredate,
    isWithinNext7Days: d < addDaystoNow(7),
  };
  dateobj.isFuture
    ? (dateobj.isTomorrow = d.toDateString() === addDaystoNow(1).toDateString())
    : (dateobj.isTomorrow = false);
  dateobj.isFuture
    ? (dateobj.isYesterday = false)
    : (dateobj.isYesterday =
        d.toDateString() === addDaystoNow(-1).toDateString());
  dateobj.day00raw = new Date(dateobj.dsnonlocale);
  dateobj.day00ISO = dateobj.day00raw.toISOString();
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
/**
 * get object with info whether a Datetime is during daylight hours or not
 * @param {Date} datetime the `Date` object to evaluate
 * @param {Date} sunrisedatetime the `Date` object for that day's sunrise
 * @param {Date} sunsetdatetime the `Date` object for that day's sunset
 */
export function dayvsnight(datetime, sunrisedatetime, sunsetdatetime) {
  //to compare, dates must be in object formats already
  /**
   * @type {Object}
   *
   */
  const dvn = {};
  dvn.daylight =
    datetime < sunrisedatetime || datetime > sunsetdatetime ? false : true;
  dvn.dayornight = dvn.daylight == true ? "day" : "night";
  dvn.beforeRise = datetime < sunrisedatetime ? true : false;
  dvn.afterSet = datetime > sunsetdatetime ? true : false;
  return dvn;
}
/**
 * display current date
 * @param {HTMLElement|String} targetEl the element to display the date
 * @returns
 */
const dateDisplay = (targetEl) => {
  if (typeof targetEl == "string") {
    targetEl = document.querySelector(targetEl);
  }
  if (!targetEl) {
    console.error("no target element found");
    return;
  }
  let wrapper = document.createElement("span");
  wrapper.classList.add("current-date");
  targetEl.appendChild(wrapper);

  const formatDate = () => {
    let d = new Date();
    let str = d.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    str = str.replace(/,/g, `</span><span>,`);
    str = `<span>${str}</span>`;
    return str;
  };

  const insertHTML = () => {
    wrapper.innerHTML = formatDate();
  };
  insertHTML();
  const update = setInterval(insertHTML, 1000);
};

export { dateDisplay };
