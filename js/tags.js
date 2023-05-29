class Tag extends HTMLElement {
  static get observedAttributes() {
    return ["c", "l", "value"];
  }
  constructor() {
    super();

    //this.contentEditable = true;
    //this.innerText = `boink`;
  }
  removeTag() {
    this.remove();
  }
  connectedCallback() {
    console.log("Custom input element added to page.");
    this.style.display = "inline-flex";
    this.style.margin = "4px 2px";
    this.style.padding = " 5px 10px";
    this.style.borderRadius = "30px";
    this.style.backgroundColor = "#809a87";
    this.style.color = "#ffffff";
    this.textField = document.createElement("div");
    this.tagIcon = document.createElement("div");
    this.tagIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none">
<path d="M4.16989 15.3L8.69989 19.83C10.5599 21.69 13.5799 21.69 15.4499 19.83L19.8399 15.44C21.6999 13.58 21.6999 10.56 19.8399 8.69005L15.2999 4.17005C14.3499 3.22005 13.0399 2.71005 11.6999 2.78005L6.69989 3.02005C4.69989 3.11005 3.10989 4.70005 3.00989 6.69005L2.76989 11.69C2.70989 13.04 3.21989 14.35 4.16989 15.3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.5 12C10.8807 12 12 10.8807 12 9.5C12 8.11929 10.8807 7 9.5 7C8.11929 7 7 8.11929 7 9.5C7 10.8807 8.11929 12 9.5 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;
    this.textField.contentEditable = true;
    this.textField.style.borderRadius = "5px";
    this.textField.style.padding = "2px";
    this.textField.style.margin = "0px 5px";
    this.textField.style.display = "inline-block";
    this.textField.style.minWidth = "40px";

    //this.textField.style.width = "100%";
    this.textField.style.lineHeight = "normal";

    this.textField.style.minHeight = "10px";
    this.button = document.createElement("button");
    this.button.style.all = "unset";
    this.button.style.cursor = "pointer";
    let xbtn2 = `<svg xmlns="http://www.w3.org/2000/svg" height="13" width="13" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`;
    this.button.innerHTML = xbtn2;
    this.appendChild(this.tagIcon);
    this.appendChild(this.textField);
    this.appendChild(this.button);
    this.button.addEventListener("click", this.removeTag.bind(this));
  }
  disconnectedCallback() {
    console.log("Custom input element removed from page.");
  }
  adoptedCallback() {
    console.log("Custom input element moved to new page.");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log("Custom input element attributes changed.");
  }
}
customElements.define("my-tag", Tag);
