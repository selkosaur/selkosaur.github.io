const inputobj = {
  locationmode: {
    auto: {
      failurecallback: "callbackfn",
    },
    manual: {
      zipcode: 12345,
      country: "US",
    },
    localfirst: "localfirst",
  },
  widgets: [{ widgType: "widgetType", domtarget: "domtarget or htmlelement" }],
};
export class WeatherModule {
  constructor(weatherconfig) {
    this.__locationmode = weatherconfig.locationmode || null;
    this.__widgets = weatherconfig.widgets || [];
    this.weatherLocation();
  }
  set locationmode(locationmodeobj) {
    this.__locationmode = locationmodeobj;
  }
  get locationmode() {
    return this.__locationmode;
  }
  set widgets(widgobjarray) {
    this.__widgets = widgobjarray;
  }
  set lat(lat) {
    this.__latitude = lat;
  }
  set long(long) {
    this.__longitude = long;
  }
  get lat() {
    return this.__latitude;
  }
  get long() {
    return this.__longitude;
  }
  set zipcode(zipcode) {
    this.__zipcode = zipcode;
  }
  get zipcode() {
    return this.__zipcode;
  }
  set country(country) {
    this.__country = country;
  }
  get country() {
    return this.__country;
  }

  logresponse(data) {
    console.log("data has returned:");
    console.log(data);
  }
  /**
   * returns number rounded to four decimal places
   * @param {number} number
   * @returns {number} rounded to fourth decimal place
   */
  toFourDecimals(number) {
    return Math.round(number * 10000) / 10000;
  }
  /**
   * @param {string} url the url for the api fetch request
   * @param {function} [callback = logresponse] a callback function to use the data retrieved from the api response. optional
   */
  async getapi(url, callbackfn = logresponse) {
    // Storing response
    const response = await fetch(url);
    // Storing data in form of JSON
    const data = await response.json();
    if (response) {
      console.log("response is true");
      callbackfn(data);
    }
  }
  defaultLocationFailure() {
    console.error(
      "location request denied, unable to get weather info automatically"
    );
  }
  checkforStoredWeatherLoc() {
    /**
     * checks if key exists in local storage
     * @param {string} key the key name for localstorage
     * @returns {boolean}
     */
    const check = function (key) {
      if (key in localStorage) {
        return true;
      } else {
        return false;
      }
    };
    if (check("weatherlat") && check("weatherlong")) {
      console.log("weather location available");
    }
  }
  geolocatorFailure = (error) => {
    console.log(error);
  };

  geolocatorSuccess = (position) => {
    const coords = position.coords;
    let lat = this.toFourDecimals(coords.latitude);
    let long = this.toFourDecimals(coords.longitude);
    this.__latitude = lat;
    this.__longitude = long;

    this.weatherfetch();
  };
  geolocatorPrompt() {
    navigator.geolocation.getCurrentPosition(
      this.geolocatorSuccess,
      this.geolocatorFailure
    );
  }
  weatherLocation() {
    let mode = this.locationmode;
    console.log("mode: ");
    console.log(mode);
    if (mode.name === "auto" || undefined) {
      this.geolocatorPrompt();
    }
  }
  set weatherdata(data) {
    this.__weatherdata = data;
  }
  get weatherdata() {
    return this.__weatherdata;
  }
  callweatherbuilder(wdata) {
    this.__weatherdata = wdata;
    this.buildWeatherWidgets();
  }
  weatherfetch() {
    let weathurl = `https://api.open-meteo.com/v1/forecast?latitude=${this.lat}&longitude=${this.long}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,cloudcover,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto`;
    console.log("weatherurl: %s", weathurl);
    this.getapi(weathurl, this.callweatherbuilder.bind(this));
  }
  savelatlong(arraydata) {
    let data = arraydata[0];
    let lat = toFourDecimals(data.lat);
    let long = toFourDecimals(data.long);
    this.__latitude = lat;
    this.__longitude = long;
  }
  manualLatLong() {
    const geocodeurl = `https://geocode.maps.co/search?postalcode=${this.__zipcode}&country=${this.__country}`;

    getapi(geocodeurl, savelatlong);
  }
  addStyleSheets(styles) {
    if (typeof styles === "string") {
      styles = [styles];
    }
    const sheetHrefs = {
      climacons:
        "https://cdn.jsdelivr.net/gh/christiannaths/Climacons-Font/webfont/climacons-font.css",
      iconsax: "https://selkosaur.github.io/font/i/iconsax.css",
    };
    let stylesheets = document.querySelectorAll("link[rel='stylesheet']");
    const elHrefs = Array.from(stylesheets).map(({ href }) => href);
    styles.forEach((stylename) => {
      if (elHrefs.indexOf(stylename) < 0) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = sheetHrefs[stylename];
        document.head.appendChild(link);
      }
    });
  }
  buildWeatherWidgets() {
    let data = this.__weatherdata;
    this.addStyleSheets(["iconsax", "climacons"]);
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

    /**
     * weather codes and their meanings, as well as the codes and associated climacon names for night and day
     */
    const c = {
      codes: {
        0: "clear sky",
        1: "mostly clear",
        2: "partly cloudy",
        3: "overcast",
        45: "fog",
        48: "depositing rime fog (?)",
        51: "light drizzle",
        53: "moderate drizzle",
        55: "dense drizzle",
        56: "light freezing drizzle",
        57: "dense freezing drizzle",
        61: "slight rain",
        63: "moderate rain",
        65: "heavy rain",
        66: "light freezing rain",
        67: "heavy freezing rain",
        71: "slight snow fall",
        73: "moderate snow fall",
        75: "heavy snow fall",
        77: "snow grains",
        80: "slight rain showers",
        81: "moderate rain showers",
        82: "heavy rain showers",
        95: "thunderstorm",
      },
      icons: {
        day: {
          0: "sun", //"clear sky",
          1: "cloud sun", //"mostly clear",
          2: "cloud sun", // "partly cloudy",
          3: "cloud", //"overcast",
          45: "fog", //"fog",
          48: "fog", //"depositing rime fog (?)",
          51: "drizzle", //"light drizzle",
          53: "showers", //"moderate drizzle",
          55: "showers", //"dense drizzle",
          56: "drizzle", //"light freezing drizzle",
          57: "showers", //"dense freezing drizzle",
          61: "rain", //"slight rain",
          63: "rain", //"moderate rain",
          65: "downpour", //"heavy rain",
          66: "rain", //"light freezing rain",
          67: "downpour", //"heavy freezing rain",
          71: "flurries", //"slight snow fall",
          73: "flurries", //"moderate snow fall",
          75: "flurries", //"heavy snow fall",
          77: "flurries", // "snow grains",
          80: "showers", //"slight rain showers",
          81: "downpour", //"moderate rain showers",
          82: "downpour", //"heavy rain showers",
          95: "lightning", //"thunderstorm",
        },
        night: {
          0: "moon", //"clear sky",
          1: "cloud moon", //"mostly clear",
          2: "cloud moon", // "partly cloudy",
          3: "cloud", //"overcast",
          45: "fog moon", //"fog",
          48: "fog moon", //"depositing rime fog (?)",
          51: "drizzle moon", //"light drizzle",
          53: "showers moon", //"moderate drizzle",
          55: "showers moon", //"dense drizzle",
          56: "drizzle moon", //"light freezing drizzle",
          57: "showers moon", //"dense freezing drizzle",
          61: "rain moon", //"slight rain",
          63: "rain moon", //"moderate rain",
          65: "downpour moon", //"heavy rain",
          66: "rain moon", //"light freezing rain",
          67: "downpour moon", //"heavy freezing rain",
          71: "flurries moon", //"slight snow fall",
          73: "flurries moon", //"moderate snow fall",
          75: "flurries moon", //"heavy snow fall",
          77: "flurries moon", // "snow grains",
          80: "showers moon", //"slight rain showers",
          81: "downpour moon", //"moderate rain showers",
          82: "downpour moon", //"heavy rain showers",
          95: "lightning moon", //"thunderstorm",
        },
      },
    };
    const now = new Date();
    const tdbaredate = now.toDateString(); //just today's date to string
    const nowobj = dateStringtoObj(now.toJSON()); //converts full dateTime to string

    /**
     * helper function to create object holding multiple types of date info
     * @param {string} datestring date string to parse
     *
     */
    function dateStringtoObj(datestring) {
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

    /**
     * get object with info whether a Datetime is during daylight hours or not
     * @param {Date} datetime the `Date` object to evaluate
     * @param {Date} sunrisedatetime the `Date` object for that day's sunrise
     * @param {Date} sunsetdatetime the `Date` object for that day's sunset
     */
    function dayvsnight(datetime, sunrisedatetime, sunsetdatetime) {
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
    /* =============================================
  weather variables, useful for multiple functions
  =================================================*/
    const currentWeather = data.current_weather;
    let sunriseArr = data.daily.sunrise;
    let sunsetArr = data.daily.sunset;
    let todaySunR = sunriseArr[0];
    let todaySunS = sunsetArr[0];
    let todaySRDateObj = dateStringtoObj(todaySunR);
    let todaySSDateObj = dateStringtoObj(todaySunS);
    let tmrSRDateObj = dateStringtoObj(sunriseArr[1]);
    let tmrSSDateObj = dateStringtoObj(sunsetArr[1]);
    const hdata = data.hourly; //hourly data object
    const hunits = data.hourly_units; // hourly data units object
    const ddata = data.daily; //daily data object
    const hrs = hdata.time; //should be an array of strings
    const clouds = hdata.cloudcover; // array of numbers, cloud cover percentage by the hour
    /*================================================
   end weather variables section
   ================================================= */
    const builderfns = {
      simple: function (targetdomstr) {
        let newDiv = document.createElement("div");
        newDiv.innerHTML = `weatherdata is here.. today's sunrise time is: ${todaySunR}`;
        newDiv.classList.add("simple-weather-widget");
        document.querySelector(targetdomstr).appendChild(newDiv);
      },
      /**
       * populates widget with current weather information
       */
      currentWeatherWidget: function (targetdomstr) {
        // populates widget with current weather information
        let newDiv = document.createElement("div");
        let isDay = currentWeather.is_day;

        let code = c.codes[currentWeather.weathercode];
        let codeicon =
          isDay == "1"
            ? c.icons.day[currentWeather.weathercode]
            : c.icons.night[currentWeather.weathercode];
        if (isDay == 0) {
        }
        for (const weatherInfo in currentWeather) {
          let subdiv = document.createElement("div");

          subdiv.innerHTML = `${weatherInfo}: ${currentWeather[weatherInfo]}`;
          if (weatherInfo == "weathercode") {
            subdiv.innerHTML = `${weatherInfo}: ${currentWeather[weatherInfo]} ${code}
  <i class="climacon ${codeicon} "></i>
  `;
          }
          newDiv.appendChild(subdiv);
        }
        document.querySelector(targetdomstr).appendChild(newDiv);
      },
    };

    /*=============================================
    =            the for loop for the widgets, p sure needs to be at the bottom            =
    =============================================*/
    let widgets = this.__widgets;
    for (let widget of widgets) {
      let wtype = widget.widgType;
      let targetEl = widget.domTarget;
      builderfns[wtype](targetEl);
    }

    /*=====  End of the for loop for the widgets, p sure needs to be at the bottom  ======*/
  }
}
