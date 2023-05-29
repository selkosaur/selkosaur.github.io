import { default as ScrollTop, scroller } from "./js/scroll-top.js";
import "./js/tags.js";

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
const tagCont = document.querySelector(".custom-tags");
const newTagBtn = document.querySelector(".add-tag");
const addTagEl = () => {
  let t = document.createElement("my-tag");
  tagCont.appendChild(t);
};
newTagBtn.addEventListener("click", addTagEl);
