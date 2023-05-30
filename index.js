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

const addTagEl = function () {
  let t = document.createElement("my-tag");
  let cont = this.closest(".custom-tags");
  if (!cont) {
    console.error("no tag container element found");
    return;
  }
  cont.appendChild(t);
};
const tagConts = document.querySelectorAll(".custom-tags");
tagConts.forEach((cont) => {
  let newTagBtn = cont.querySelector(".add-tag");
  if (!newTagBtn) {
    newTagBtn = document.createElement("button");
    newTagBtn.classList.add("add-tag");
    newTagBtn.innerHTML = `+`;
    if (cont.firstElementChild) {
      let child = cont.firstElementChild;
      child.insertAdjacentElement("beforeend", newTagBtn);
    } else {
      cont.insertAdjacentElement("beforeend", newTagBtn);
    }
  }
  newTagBtn.addEventListener("click", addTagEl);
});
