import { timeAgo } from "https://selkosaur.github.io/time/timeago.js";
function Span(cssclasses) {
  let span = document.createElement("span");
  if (cssclasses) {
    if (!Array.isArray(cssclasses)) {
      cssclasses = [cssclasses];
    }
    cssclasses.forEach((css) => {
      span.classList.add(css);
    });
  }
  return span;
}
//helper functions
/**
 * @constructor helper fn
 * @param {string} string the  raw "from" in the "Sender Name" <address@email.com> format
 *
 */
let SplitEmailInfo = function (string) {
  this.combined = string;
  let splitIndex = string.indexOf("<");
  this.name = string.slice(0, splitIndex).replace(/"/g, "").trim();
  this.email = string.slice(splitIndex).replace(/[<>]/g, "").trim();
};

/**
 * calculates the days difference between two days
 * @param {Date} endDate the later Date obj
 * @param {Date} startDate the earlier Date obj
 * @return {number} the difference in days
 */
let DaysDiff = function (endDate, startDate) {
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays;
};

function returnLast(arr) {
  return arr.at(-1);
}

class EmailEntry {
  static emailbox = document.querySelector(".email-box");
  /**
   *
   * @param {Object} thread email thread from gmail response
   */
  constructor(thread) {
    this.wrapper = document.createElement("div");
    this._emailDetails = thread;
    this.emailPicSVG = `                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M17 21.25H7C3.35 21.25 1.25 19.15 1.25 15.5V8.5C1.25 4.85 3.35 2.75 7 2.75H17C20.65 2.75 22.75 4.85 22.75 8.5V15.5C22.75 19.15 20.65 21.25 17 21.25ZM7 4.25C4.14 4.25 2.75 5.64 2.75 8.5V15.5C2.75 18.36 4.14 19.75 7 19.75H17C19.86 19.75 21.25 18.36 21.25 15.5V8.5C21.25 5.64 19.86 4.25 17 4.25H7Z"
                          fill="#292D32"
                        />
                        <path
                          d="M11.9988 12.868C11.1588 12.868 10.3088 12.608 9.6588 12.078L6.5288 9.57802C6.2088 9.31802 6.14881 8.84802 6.4088 8.52802C6.6688 8.20802 7.13881 8.14802 7.45881 8.40802L10.5888 10.908C11.3488 11.518 12.6388 11.518 13.3988 10.908L16.5288 8.40802C16.8488 8.14802 17.3288 8.19802 17.5788 8.52802C17.8388 8.84802 17.7888 9.32802 17.4588 9.57802L14.3288 12.078C13.6888 12.608 12.8388 12.868 11.9988 12.868Z"
                          fill="#292D32"
                        />
                      </svg>`;
    this.emptyStarSVG = ``;
    this.filledStarSVG = `      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 17.6601 22.6703 C 17.1301 22.6703 16.4501 22.5003 15.6001 22.0003 L 12.6101 20.2303 C 12.3001 20.0503 11.7001 20.0503 11.4001 20.2303 L 8.4001 22.0003 C 6.6301 23.0503 5.5901 22.6303 5.1201 22.2903 C 4.6601 21.9503 3.9401 21.0803 4.4101 19.0803 L 5.1201 16.0103 C 5.2001 15.6903 5.0401 15.1403 4.8001 14.9003 L 2.3201 12.4203 C 1.0801 11.1803 1.1801 10.1203 1.3501 9.6003 C 1.5201 9.0803 2.0601 8.1603 3.7801 7.8703 L 6.9701 7.3403 C 7.2701 7.2903 7.7001 6.9703 7.8301 6.7003 L 9.6001 3.1703 C 10.4001 1.5603 11.4501 1.3203 12.0001 1.3203 C 12.5501 1.3203 13.6001 1.5603 14.4001 3.1703 L 16.1601 6.6903 C 16.3001 6.9603 16.7301 7.2803 17.0301 7.3303 L 20.2201 7.8603 C 21.9501 8.1503 22.4901 9.0703 22.6501 9.5903 C 22.8101 10.1103 22.9101 11.1703 21.6801 12.4103 L 19.2001 14.9003 C 18.9601 15.1403 18.8101 15.6803 18.8801 16.0103 L 19.5901 19.0803 C 20.0501 21.0803 19.3401 21.9503 18.8801 22.2903 C 18.6301 22.4703 18.2301 22.6703 17.6601 22.6703 Z Z"
        />
        <!-- fill="currentColor"  ---->
      </svg>`;
    this.wrapper.classList.add("email-entry");

    //create inner html elements
    this.starredEl = Span(["star-status", "index-0"]);
    this.emailPicEl = Span(["index-1", "iconsax", "email-pic"]);
    this.emailPicEl.innerHTML = this.emailPicSVG;
    this.senderEl = Span(["email", "sender", "index-2"]);
    this.subjectEl = Span(["email", "subject", "index-3"]);
    this.timeEl = Span(["email", "time", "index-4"]);
    let childEls = [
      this.starredEl,
      this.emailPicEl,
      this.senderEl,
      this.subjectEl,
      this.timeEl,
    ];
    //set starred emails as starred
    this.starredEl.innerHTML = thread.hasStarred
      ? this.filledStarSVG
      : `<i class="isax isax-star"></i>`;

    //this is the raw "from" in the "Sender Name" <address@email.com> format
    let combinedFrom = thread.messages[0].from;
    let splitIndex = combinedFrom.indexOf("<");

    //sender name is trimmed to just their name
    let senderName = combinedFrom.slice(0, splitIndex);

    //sender email is trimmed to just their email address
    let senderEmail = combinedFrom
      .slice(splitIndex)
      .replace(/[<>]/g, "")
      .trim();
    senderName = senderName.replace(/"/g, "").trim();
    //for convos, get names of last message
    if (thread.msgcount > 1) {
      let lastmsg = thread.messages.at(-1);

      let lastmsgSender = new SplitEmailInfo(lastmsg.from);
      let lastmsgReceiver = new SplitEmailInfo(lastmsg.to);
      senderName = `<span class="last-msg-sender">${lastmsgSender.name}</span><span class="last-msg-receiver">${lastmsgReceiver.name}</span>`;
      senderEmail = `<span class="last-msg-sender">${lastmsgSender.email}</span><span class="last-msg-receiver">${lastmsgReceiver.email}</span>`;
    }
    /*
        
        date section
        
        */
    let emaildate = new Date(thread.lastupdate);
    let worddatestr = emaildate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
    let dateDisp =
      DaysDiff(new Date(), emaildate) > 7 ? worddatestr : timeAgo(emaildate);

    this.senderEl.innerHTML = `
        <span class="sender-name">${senderName}</span>
        <span class="sender-email">${senderEmail}</span>`;
    this.subjectEl.textContent = thread.subject;
    this.timeEl.innerHTML = `
        <span data-title="${emaildate.toLocaleDateString()}" >
          ${dateDisp}
          </span>`;
    if (thread.isUnread) {
      this.wrapper.classList.add("unread");
    }
    //add child elements to the <email-entry> parent
    for (let el of childEls) {
      this.wrapper.appendChild(el);
    }
    Object.defineProperty(this.wrapper, "emailDetails", {
      get() {
        return thread;
      },
    });
    Object.defineProperty(this.wrapper, "hasWinbox", {
      value: false,
      writable: true,
    });
  }
  get emailDetails() {
    return this._emailDetails;
  }
  addtoEmailBox() {
    let thread = this._emailDetails;
    thread.hasStarred
      ? EmailEntry.emailbox.prepend(this.wrapper)
      : EmailEntry.emailbox.appendChild(this.wrapper);
  }
}

export default EmailEntry;
