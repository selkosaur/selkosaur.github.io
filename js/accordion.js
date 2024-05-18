import accCss from "../css/accordion.css" with { type: "css" };

import phIcons from "https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css" with { type: "css" };

document.adoptedStyleSheets = [...document.adoptedStyleSheets, accCss, phIcons];
/* structure should be
accordion
    head(toggle)
    panel(collapsible)
        the stuff in the accordion dropdown
*/

class Accordion extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    //
    // console.log(`accordion connected!`, this);
    this.toggleEl = this.firstElementChild;
    this.panelEl = this.lastElementChild;
    this.parentElement.closest("accord-ion")
      ? this.setAttribute("sub-menu", true)
      : this.setAttribute("top-menu", true);
    if (this.querySelector("accord-ion")) {
      this.setAttribute("has-submenu", true);
    }

    this.addclickToggleHandler();
    this.clickTogglerAdded = true;
  }
  disconnectedCallback() {
    //
  }
  adoptedCallback() {
    //
  }
  attributeChangedCallback(name, oldValue, newValue) {
    //
  }
  addclickToggleHandler() {
    const acc = this;
    const togAcc = (ev) => {
      //   console.log(`togAcc, ev, this`, ev, this);
      this.classList.toggle("active");
      const wasClosed = !this.panelEl.style.maxHeight;
      this.panelEl.style.maxHeight
        ? (this.panelEl.style.maxHeight = null)
        : (this.panelEl.style.maxHeight = this.panelEl.scrollHeight + "px");
      if (this.hasAttribute("sub-menu") && wasClosed) {
        //
        // console.log("this is a submenu");
        let parentAcc = this.parentElement.closest("accord-ion[has-submenu]");
        let ogheight = parentAcc.lastElementChild.style.maxHeight;
        const ogheightnum = parseInt(ogheight.replace("px", ""));

        let parentScrollHeight = parentAcc.lastElementChild.scrollHeight;
        // console.log(ogheight, this.panelEl.scrollHeight, parentScrollHeight);

        let parentAdjHeight =
          parseInt(ogheight.replace("px", "")) + this.panelEl.scrollHeight;
        // console.log(parentAdjHeight);
        if (ogheightnum < parentScrollHeight + this.panelEl.scrollHeight) {
          parentAcc.lastElementChild.style.maxHeight = parentAdjHeight + "px";
        }
      }
    };
    this.toggleEl.addEventListener("click", togAcc);
  }
}

customElements.define("accord-ion", Accordion);
