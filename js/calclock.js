import dateTime from "./datetime.js";

/**
 * Display and update calendar, clock, or both
 */
class CalClock {
  /**
   *
   * @param {"together"|"separate"|"date"|"clock"} displaytype whether to create calendar and clock together in same el, separately in different els, or only either date or clock
   * @param {String|HTMLElement} caltargetel
   * @param {String|HTMLElement} clocktargetel
   */
  constructor(displaytype, caltargetel, clocktargetel) {
    if (!displaytype) {
      switch (true) {
        case caltargetel && clocktargetel:
          displaytype = "together";
          break;
        case caltargetel:
          displaytype = "date";
          break;
        case clocktargetel:
          displaytype = "clock";
        default:
          break;
      }
    }
    this.displaytype = displaytype;
    const isValidEl = function (el) {
      if (typeof el === "string") {
        el = document.querySelector(el);
      } else {
        el = el;
      }

      if (!el || !el instanceof HTMLElement) {
        return false;
      }
      return el;
    };
    switch (displaytype) {
      case "date":
        if (isValidEl(caltargetel)) {
          this.calTargetEl = isValidEl(caltargetel);
        }
        this.insertHTML = this.insertCal;
        if (!this.calTargetEl) {
          console.error("not able to find element");
          return;
        }
        break;
      case "clock":
        if (isValidEl(clocktargetel)) {
          this.clockTargetEl = isValidEl(clocktargetel);
        }
        if (!isValidEl(clocktargetel)) {
          if (isValidEl(caltargetel)) {
            this.clockTargetEl = isValidEl(caltargetel);
          }
        }
        if (!this.clockTargetEl) {
          console.error("not able to find element");
          return;
        }
        this.insertHTML = this.insertClock;
        break;
      case "together":
        this.containerEl = isValidEl(caltargetel) ?? isValidEl(clocktargetel);
        if (!this.containerEl) {
          console.error("not able to find element");
          return;
        }
        this.insertHTML = this.insertCalClockTogether;
        break;
      case "separate":
        if (!isValidEl(caltargetel) || !isValidEl(clocktargetel)) {
          console.error("not able to find element(s)");
          return;
        }
        this.calTargetEl = isValidEl(caltargetel);
        this.clockTargetEl = isValidEl(clocktargetel);
        this.insertHTML = this.insertCalClockSeparate;
        break;
      default:
        console.error("that's not one of the options");
        return;
        break;
    }
    this.insertHTML();
    this.update();
  }
  get now() {
    return dateTime(new Date().toISOString());
  }
  calhtml(d) {
    return `<span><span>${d.weekday.short}</span>,<span> ${d.monthstr}</span><span> ${d.day}</span><span> ${d.year}</span></span>`;
  }
  clockhtml(d) {
    return `<span>${d.timestr}</span>`;
  }
  insertCalClockTogether() {
    //
    let d = this.now;
    this.containerEl.innerHTML = `${this.clockhtml(d)}${this.calhtml(d)}`;
  }
  insertCalClockSeparate() {
    //
    let d = this.now;
    this.clockTargetEl.innerHTML = this.clockhtml(d);
    this.calTargetEl.innerHTML = this.calhtml(d);
  }
  insertClock() {
    //
    let d = this.now;
    this.clockTargetEl.innerHTML = this.clockhtml(d);
    //
  }
  insertCal() {
    //
    let d = this.now;
    this.calTargetEl.innerHTML = this.calhtml(d);
  }

  update() {
    //
    setInterval(this.insertHTML.bind(this), 1000);
  }
}

export default CalClock;
