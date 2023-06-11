import {
  tippy,
  createSingleton,
} from "https://selkosaur.github.io/js/tippy.js";

const months = [
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
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const fulldateopt = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

/**
 *
 * @param {Date} date
 */
function DateString(date) {
  return date.toLocaleDateString([], fulldateopt).replace(/\//g, "-");
}
const now = new Date();
const nowmonth = now.getMonth();
const nowday = now.getDate();
const nowyear = now.getFullYear();

/**
 * check if date is today
 * @param {Date} date
 * @return {Boolean}
 */
function isToday(date) {
  if (
    date.getFullYear() === nowyear &&
    date.getMonth() === nowmonth &&
    date.getDate() === nowday
  ) {
    return true;
  }
  return false;
}

const wkdays = weekdays.map((day) => {
  return day.slice(0, 2);
});

/**
 *
 * @param {String} eltype
 * @param {Array} classes
 * @returns {HTMLElement}
 */
const ElWithClass = function (eltype, classes) {
  //
  let el = document.createElement(eltype);
  if (classes) {
    if (!Array.isArray(classes)) {
      classes = [classes];
    }
    classes.forEach((item) => {
      el.classList.add(item);
    });
  }
  return el;
};
const sampleEvent = {
  datestring: "",
  title: "",
  calendar: "",
  description: "",
};

const sampleoptions = {
  targetEl: "",
  events: "",
  initMonth: "",
};

class MiniCal {
  /**
   *
   * @param {{targetEl: HTMLElement, initMonth: Date, events: Array}} options
   */
  constructor(options) {
    if (options) {
      this.targetEl = options.targetEl ?? document.querySelector("body");
      this.initMonth = options.initMonth ?? new Date();
      this.events = options.events ?? [];
    } else {
      this.targetEl = document.querySelector("body");
      this.initMonth = new Date();
      this.events = [];
    }
    this.displayMonth = this.initMonth;
    this.monthNum = this.displayMonth.getMonth();
    this.yearNum = this.displayMonth.getFullYear();
    this.wrapperEl = document.createElement("div");
    this.wrapperEl.classList.add("minicalnew");
    this.headerEl = document.createElement("div");
    this.headerEl.classList.add("minical-header");
    this.headerSpan = document.createElement("span");
    this.headerEl.appendChild(this.headerSpan);
    this._calEvents = {};
    this.calTips = [];

    this.calBodyEl = document.createElement("div");
    this.calBodyEl.classList.add("minical-body");
    this.weekdayEls = [];
    for (let days = 0; days < 7; days++) {
      let wdEl = document.createElement("div");
      wdEl.classList.add("weekday");
      let wdSpan = document.createElement("span");
      wdSpan.classList.add("weekday-title");
      wdSpan.innerHTML = wkdays[days];
      wdEl.appendChild(wdSpan);

      this.weekdayEls.push(wdEl);
      this.calBodyEl.appendChild(wdEl);
    }
    this.wrapperEl.appendChild(this.headerEl);
    this.wrapperEl.appendChild(this.calBodyEl);
    this.dayEls = [];
    this.daySpans = [];
    this.monthDayDivs = [];

    for (let dofM = 0; dofM < 35; dofM++) {
      let dayEl = document.createElement("div");
      dayEl.classList.add("mc-day");
      // dayEl.innerHTML = `<span></span>`;
      this.dayEls.push(dayEl);
      let daySpan = document.createElement("span");
      this.daySpans.push(daySpan);
      dayEl.appendChild(daySpan);
      this.calBodyEl.appendChild(dayEl);
    }

    // this.targetEl.appendChild(this.wrapperEl);
    // this.addDayNumstoSpans();
    this.addDayNumstoSpans();
    this.updateMonthTitle();
    this.targetEl.appendChild(this.wrapperEl);
  }

  updateMonthTitle() {
    this.headerSpan.innerHTML = this.displayMonth.toLocaleDateString([], {
      month: "long",
      year: "numeric",
    });
  }
  /**
   *
   * @param {Array} events
   */
  addEvents(eventstoAdd) {
    //
    this.events = this.events.concat(eventstoAdd);
    this.addEventAttribtoDivs();
    this.createMonthTippySingleton();
  }
  addEventAttribtoDivs() {
    let filteredNumDayDivs = this.dayEls.filter((div) => {
      return div.hasAttribute("data-calday");
    });
    this.events.forEach((ev) => {
      let evStart = ev.start;
      if (!evStart) return;
      let startDate = evStart.dateTime ?? evStart.date;
      if (!startDate) return;
      let evtDate = new Date(startDate);
      let evtDateStr = DateString(evtDate);
      let evtStartStr = ``;
      if (ev.start.dateTime) {
        evtStartStr = evtDate.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
      }
      //
      let dayMatch = filteredNumDayDivs.find((div) => {
        return div.getAttribute("data-calday") === evtDateStr;
      });
      if (dayMatch) {
        if (dayMatch.hasAttribute("data-hascaltip")) {
          let tippyref = dayMatch._tippy;
          let prevcontent = tippyref.props.content;
          tippyref.setContent(
            prevcontent +
              ` <div>
         <span class="minicaltip evt-start">
        ${evtStartStr}
        </span>
        <span class="minicaltip evt-title">
        ${ev.description.replace("--", "").trim() || ev.summary}</span>
        </div>`
          );
          return;
        }
        let headerStr = evtDate.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        dayMatch.classList.add("has-event");
        let tipHTML = `
        <div class="minicaltip header"><span>${headerStr}</span></div>
        <div>
        <span class="minicaltip evt-start">
        ${evtStartStr}
        </span>
        <span class="minicaltip evt-title">
        ${ev.description.replace("--", "").trim() || ev.summary}</span>
        </div>`;

        let tip = tippy(dayMatch, {
          content: tipHTML,
          allowHTML: true,
          theme: "minical",
        });
        this.calTips.push(tip);
        dayMatch.setAttribute("data-hascaltip", true);
      }
    });
  }
  createMonthTippySingleton() {
    this.calSingleton = createSingleton(this.calTips, {
      allowHTML: true,
      theme: "minical",
    });
  }
  removeEvents(events) {
    //
  }
  set events(events) {
    /**
     * @type {Array}
     */
    this._events = events;
  }
  get events() {
    return this._events;
  }
  addSubtractMonths(number) {
    //
  }
  /**
   * @param {Date} date
   */
  set displayMonth(date) {
    this._displayMonth = date;
  }
  get displayMonth() {
    return this._displayMonth;
  }
  addDayNumstoSpans() {
    let d = this.displayMonth;
    let firstofMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    let lastofMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    let day1Weekday = firstofMonth.getDay();
    let monthEndWeekday = lastofMonth.getDay();
    let monthEndDayNum = lastofMonth.getDate();
    //blank cells before month starts
    for (let i = 0; i < day1Weekday; i++) {
      this.daySpans[i].innerHTML = "";
    }
    let lastDaySpan;
    for (let x = 0; x < monthEndDayNum; x++) {
      let num = x + 1;
      let daydate = new Date(this.yearNum, this.monthNum, num);

      let currentSpan = this.daySpans[day1Weekday + x];
      let parentDiv = currentSpan.parentElement;
      let dtStr = DateString(daydate);
      parentDiv.setAttribute("data-calday", dtStr);
      this.monthDayDivs.push(parentDiv);
      currentSpan.innerHTML = num;
      if (isToday(daydate)) {
        parentDiv.classList.add("today");
      }
    }
    let blankSpacesEndNum =
      this.daySpans.length - (monthEndDayNum + day1Weekday);
    for (let z = 0; z < blankSpacesEndNum; z++) {
      let indexSpan = this.daySpans[z + monthEndDayNum + day1Weekday];
      if (!indexSpan) {
        debugger;
      }
      indexSpan.innerHTML = "";
    }
    //for (let x = day1Weekday; x < )
  }
}

let dateglob = new Date();
let yearglob = dateglob.getFullYear();
let monthglob = dateglob.getMonth();
let monthglobfix = monthglob + 1;
let nextmonthglobfix = monthglobfix + 1;
let nextmonthyearglob;
if (monthglobfix == 12) {
  nextmonthglobfix = 1;
  nextmonthyearglob = yearglob + 1;
} else {
  nextmonthyearglob = yearglob;
}

function calcFutureMonths(numberofmonths) {
  let future = {};
  future.month = monthglobfix + parseInt(numberofmonths);
  future.year = yearglob;

  if (future.month > 12) {
    // this won't be accurate looking more than 12 months in the future.. I think?
    future.month = future.month - 12;
    future.year = yearglob + 1;
  }
  return future;
}

function renderMiniCal() {
  // not using
  /*
  automatically generate this month's calendar ? i can't remember, not using this currently 
  */
  let date = new Date();
  const months = [
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
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let monthIndex = date.getMonth();
  let curMonth = months[monthIndex];
  let curWeekDay = weekdays[date.getDay()];
  let curDate = date.getDate();
  let curYear = date.getFullYear();
  let monthStartWeekDay = new Date(curYear, date.getMonth(), 1).getDay();
  monthStartWeekDay = weekdays[monthStartWeekDay];
  console.log(curMonth);
  console.log(curWeekDay);
  console.log(monthStartWeekDay);
  createCalendar(calendar, curYear, monthIndex);
}
//renderMiniCal()

function createCalendar(elem, year, month) {
  //original function, creates table format

  let mon = month - 1; // months in JS are 0..11, not 1..12
  let d = new Date(year, mon);
  let options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  let monthTitle = d.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

  let table = `<table>
          <tr>
            <th colspan="7">
              <h4>${monthTitle}</h4>
            </th>
          </tr>
          <tr>
              <th>
                <span class="weekday">MO</span>
              </th>
              <th>
                <span class="weekday">TU</span>
              </th>
              <th>
                <span class="weekday">WE</span>
              </th>
              <th>
                <span class="weekday">TH</span>
              </th>
              <th>
                <span class="weekday">FR</span>
              </th>
              <th>
              <span class="weekday">SA</span>  
              </th>
              <th>
               <span class="weekday">SU</span> 
              </th>
          </tr>
          <tr>`;

  // spaces for the first row
  // from Monday till the first day of the month
  // * * * 1  2  3  4
  for (let i = 0; i < getDay(d); i++) {
    table += "<td><span></span></td>";
  }

  // <td> with actual dates
  while (d.getMonth() == mon) {
    let dateid = d.toLocaleDateString([], options);
    dateid = dateid.replace(/\//g, "-");
    table += `<td class="${dateid}"><span id="${dateid}">${d.getDate()}</span></td>`;
    /*
    table += `<td class="${dateid}"><span id="${dateid}" class="${dateid}">${d.getDate()}</span></td>`;
    */
    if (getDay(d) % 7 == 6) {
      // sunday, last day of week - newline
      table += `</tr><tr>`;
    }

    d.setDate(d.getDate() + 1);
  }

  // add spaces after last days of month for the last row
  // 29 30 31 * * * *
  if (getDay(d) != 0) {
    for (let i = getDay(d); i < 7; i++) {
      table += "<td><span></span></td>";
    }
  }

  // close the table
  table += "</tr></table>";

  elem.innerHTML = table;
}

function createStyledCalendar(elem, year, month) {
  //create the minical styled ver (uses spans for some reason)

  let mon = month - 1; // months in JS are 0..11, not 1..12
  let d = new Date(year, mon);
  /* let day = d.getDay() */
  let options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  let monthTitle = d.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

  let table = `<h4>${monthTitle}</h4>
      <span class="weekday">MO</span>
      <span class="weekday">TU</span>
      <span class="weekday">WE</span>
      <span class="weekday">TH</span>
      <span class="weekday">FR</span>
      <span class="weekday">SA</span>
      <span class="weekday">SU</span>`;

  // spaces for the first row
  // from Monday till the first day of the month
  // * * * 1  2  3  4
  for (let i = 0; i < getDay(d); i++) {
    table += `<span></span>`;
  }

  // <span> with actual dates
  while (d.getMonth() == mon) {
    let dateid = d.toLocaleDateString([], options);
    dateid = dateid.replace(/\//g, "-");
    table += `<span id="${dateid}" class="${dateid}">${d.getDate()}</span>`;

    /* if (getDay(d) % 7 == 6) { // sunday, last day of week - newline
        table += '</tr><tr>';
      } */

    d.setDate(d.getDate() + 1);
  }

  // add spaces after last days of month for the last row
  // 29 30 31 * * * *
  if (getDay(d) != 0) {
    for (let i = getDay(d); i < 7; i++) {
      table += `<span></span>`;
    }
  }

  // close the table
  //table += '</tr></table>';

  elem.innerHTML = table;
}
function getDay(date) {
  // get day number from 0 (monday) to 6 (sunday)
  let day = date.getDay();
  if (day == 0) day = 7; // make Sunday (0) the last day
  return day - 1;
}

function buildMiniCal(elem, futuremonths = 0) {
  let monthcalc = calcFutureMonths(futuremonths);
  createCalendar(elem, monthcalc.year, monthcalc.month);
  boldToday();
}

function boldToday() {
  let date = new Date();
  let options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  let dateid = date.toLocaleDateString([], options);
  dateid = dateid.replace(/\//g, "-");
  let today = document.getElementById(dateid);

  let todays = document.getElementsByClassName(dateid);
  //  console.log(todays);
  for (let i = 0; i < todays.length; i++) {
    let onetoday = todays[i];
    //console.log(onetoday);
    let oneog = onetoday.innerHTML;
    onetoday.innerHTML = `<b class="today-block">${oneog}</b>`;
    //onetoday.title = "today";
    onetoday.classList.add("today-block");
    onetoday.setAttribute("data-tippy-content", "today");
  }
  /*  let og = today.innerHTML;
      today.innerHTML = `<b class="today-block">${og}</b>`; */
}

export function addEventsTest(datestring) {
  // just for testing purposes
  //just for testing purposes
  let eventdays = document.getElementsByClassName(datestring);

  for (let i = 0; i < eventdays.length; i++) {
    let eventday = eventdays[i];
    let og = eventday.innerHTML;
    eventday.innerHTML = `<b class="event-info">${og}</b>`;
    //eventday.title = `this is the event title for ${datestring}`;
    eventday.classList.add("event-info");
    eventday.setAttribute(
      "data-tippy-content",
      `this is the event title for ${datestring}`
    );
  }
}

function addEvents(eventsarray) {
  for (i = 0; i < eventsarray.length; i++) {
    let event = eventsarray[i];
    let eventdatestr = eventsarray.date;
    let eventtitle = eventsarray.title;
  }
}

export { MiniCal as default, buildMiniCal };
