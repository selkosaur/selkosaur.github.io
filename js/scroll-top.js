/* 
    <div class="scroll-to-top">
      <button class="scroll-btn btn-position btn-style">
        <i class="isax isax-arrow-up-1"></i
      ></button>
    </div>

*/

class ScrollTop {
  constructor(options) {
    this.appendTarget = document.querySelector("body");
    this.scrollListen = window;
    this.scrollTopOuterEl = document.createElement("div");
    this.scrollBtn = document.createElement("button");
    this.insertCss = true;
    this.iconHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 15.5V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 11.5L12 8.5L15 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
    this.standardCss = `
      :root{
  --scroller-bgcol: rgba(255, 255, 255, 0);
  --scroller-col  : rgb(110, 116, 123);
      }
    .scroll-to-top {
  position        : relative;

}

.btn-position {
  position: fixed;
  bottom  : 40px;
  right   : 25px;
  z-index : 20;
}

.btn-style {
  box-shadow: initial;
  background-color: var(--scroller-bgcol);
  border          : 0px solid #fff;
  border-radius   : 50%;
  height          : 50px;
  width           : 50px;
  color           : var(--scroller-col);
  cursor          : pointer;
  /* animation    : movebtn 3s ease-in-out infinite; */
  transition      : all 0.5s ease-in-out;
  font-size       : 40px;
  display         : flex;
  justify-content : center;
  align-items     : center;
  visibility      : hidden;
  opacity         : 0;
  transition      : opacity 0.7s, transform 0.3s, outline 0.4s;
  outline-color: transparent;
  outline-width: 0px;
  outline-style:solid;
  animation-play-state: paused;
  animation: bobble 2s ease-in-out infinite paused;
}

.btn-style.show {
  opacity: 1;
}

.btn-style:active{
    box-shadow:initial;
}

.btn-style:hover {
  
  animation-play-state: running;
}

.btn-style:focus-visible{
    outline-color: rgba(0,0,0,0.3);
    outline-width: 1px;
    outline-style: solid;
}

.icon-style:hover {
  animation : none;
  background: #fff;
  color     : #551b54;
  border    : 2px solid #551b54;
}

@keyframes movebtn {
  0% {
    transform: translateY(0px);
  }

  25% {
    transform: translateY(20px);
  }

  50% {
    transform: translateY(0px);
  }

  75% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes bobble {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0px);
  }
}`;
    if (options) {
      for (const [key, value] of Object.entries(options)) {
        console.log(`${key}: ${value}`);
        this[key] = value;
        console.log(this);
      }
    }
    this.init();
  }
  init() {
    if (this.insertCss) {
      this.injectStyle();
    }
    this.createEl();
    document.addEventListener("scroll", this.buttonVisibility.bind(this));
  }
  createEl() {
    this.scrollTopOuterEl.classList.add("scroll-to-top");
    this.scrollBtn.classList.add("scroll-btn", "btn-position", "btn-style");
    this.scrollBtn.innerHTML = this.iconHTML;
    this.scrollBtn.addEventListener("click", this.scrollToTop.bind(this));
    this.scrollTopOuterEl.appendChild(this.scrollBtn);
    this.appendTarget.appendChild(this.scrollTopOuterEl);
  }
  injectStyle() {
    const head = document.querySelector("head");
    let firstCssLink = head.querySelector("link[rel='stylesheet']");
    this.styleTag = document.createElement("style");
    this.styleTag.setAttribute("data-csstype", "scrolltop");
    this.styleTag.innerHTML = this.standardCss;

    if (!firstCssLink) {
      const firstStyle = document.querySelector("style");
      if (!firstStyle) {
        head.appendChild(this.styleTag);
        return;
      }
      firstStyle.insertAdjacentElement("beforebegin", this.styleTag);
      return;
    }
    firstCssLink.insertAdjacentElement("beforebegin", this.styleTag);
  }
  show() {
    this.scrollBtn.style.visibility = "visible";
  }
  hide() {
    if (this.scrollListen.scrollY < 400) {
      this.scrollBtn.style.visibility = "hidden";
    }
  }
  buttonVisibility() {
    if (this.scrollListen.scrollY > 400) {
      this.scrollBtn.style.visibility = "visible";
      this.scrollBtn.classList.toggle("show", true);
    } else {
      this.scrollBtn.classList.toggle("show", false);
      setTimeout(this.hide.bind(this), 500);
    }
  }
  scrollToTop() {
    this.scrollListen.scrollTo({ top: 0, behavior: "smooth" });
  }
}
let scroller = function () {
  return new ScrollTop();
};

export { ScrollTop as default, scroller };
