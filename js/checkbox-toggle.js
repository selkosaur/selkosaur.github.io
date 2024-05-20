function initTog() {
  class CheckboxToggle extends HTMLInputElement {
    constructor() {
      let self = super();
      this.self = self;
    }
    connectedCallback() {}
    disconnectedCallback() {
      //this.removeControlsListener();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      //
    }
    adoptedCallback() {}
  }

  try {
    customElements.define("checkbox-toggle", CheckboxToggle, {
      extends: "input",
    });
  } catch (error) {}
}
addEventListener("DOMContentLoaded", initTog);
