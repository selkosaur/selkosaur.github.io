class SlideOut extends HTMLElement {
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
    //
  }
  adoptedCallback() {}

  render() {
    this.controlToggle = document.createElement("button");
    this.controlToggle.setAttribute("part", "controls-button");
    this.controlToggle.innerHTML = `<slot name="controls"></slot>`;
    this.panelOuter = document.createElement("div");
    this.panelOuter.classList.add("panel-outer");
    this.panelOuter.setAttribute("part", "panel-outer");
    this.panelOuter.innerHTML = `<div class="panel-inner" part="panel-inner"><slot></slot></div>`;
    let style = document.createElement("style");
    style.innerHTML = SlideOut.css;
    this.shadowRoot.append(style, this.controlToggle, this.panelOuter);
  }
  toggleSlideOut() {
    this.toggleAttribute("open");
    this.panelOuter.classList.toggle("open");
  }
  addControlsListener() {
    this.controlToggle.addEventListener(
      "click",
      this.toggleSlideOut.bind(this)
    );
  }
  removeControlsListener() {
    this.controlToggle.removeEventListener(
      "click",
      this.toggleSlideOut.bind(this)
    );
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

try {
  customElements.define("slide-out", SlideOut);
} catch (error) {}
