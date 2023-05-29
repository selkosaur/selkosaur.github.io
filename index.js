import { default as ScrollTop, scroller } from "./js/scroll-top.js";

let scr = scroller();

const demo = {
  bodyEl: document.querySelector("body"),
  makeBoxes: function (num = 50) {
    let main = document.querySelector("main");
    if (!main) {
      main = document.createElement("main");
      this.bodyEl.appendChild(main);
    }

    for (let i = 0; i < num; i++) {
      let div = document.createElement("div");
      div.classList.add("square");
      main.appendChild(div);
    }
  },
};

demo.makeBoxes();
