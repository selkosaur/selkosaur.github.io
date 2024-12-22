class SlideOut extends HTMLElement {
  static observedAttributes = ["open"];
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  static css = `
  *{
    box-sizing:border-box;
  }
  :host{
    display:block;

  }
    .panel-outer {
    display           : grid;
    /* 1 */
    grid-template-rows: 0fr;
    /* 2 */
    transition        : grid-template-rows 0.5s ease-in-out;
    /* 3 */
}

.panel-outer.open {
    grid-template-rows: 1fr;
    /* 5 */
}

.panel-inner {
    overflow: hidden;
    /* 4 */
}
  `;
  connectedCallback() {
    this.render();
    this.addControlsListener();
  }
  disconnectedCallback() {
    this.removeControlsListener();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "open") {
      const isFalsy = newValue === null || newValue === "false";
      this.panelOuter.classList.toggle("open", !isFalsy);
    }
  }
  adoptedCallback() {}

  render() {
    if (this.rendered) {
      return;
    }
    this.controlToggle = document.createElement("button");
    this.controlToggle.setAttribute("part", "controls-button");
    this.controlToggle.innerHTML = `<slot name="controls"></slot>`;
    this.panelOuter = document.createElement("div");
    this.panelOuter.classList.add("panel-outer");
    this.panelOuter.setAttribute("part", "panel-outer");
    this.panelOuter.innerHTML = `<div class="panel-inner" part="panel-inner"><slot></slot></div>`;
    const style = document.createElement("style");
    style.innerHTML = SlideOut.css;
    this.shadowRoot.append(style, this.controlToggle, this.panelOuter);
    this.rendered = true;
  }
  toggleSlideOut() {
    this.toggleAttribute("open");
  }
  #toggleSlideOutBound = this.toggleSlideOut.bind(this);
  addControlsListener() {
    this.controlToggle.addEventListener("click", this.#toggleSlideOutBound);
  }
  removeControlsListener() {
    this.controlToggle.removeEventListener("click", this.#toggleSlideOutBound);
  }
}

/*   
template:

element
    controller
    panel-outer
        panel-inner
            custom content

*/

/**
 * Optional. Can use this to import the slideout css
 * @returns
 */
export async function importCss() {
  return await import(`./slideout-css.js`);
}
try {
  customElements.define("slide-out", SlideOut);
} catch (error) {}
