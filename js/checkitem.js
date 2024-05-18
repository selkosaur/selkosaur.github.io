const checkedsquare = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.75 12L10.58 14.83L16.25 9.17004" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const uncheckedsquare = `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const css = `
check-item,:host{
    overflow-wrap: break-word;
    -webkit-line-break: after-white-space;
    display: list-item;
    text-align:-webkit-match-parent;
    unicode-bidi: isolate;
    list-style-type:none;
    user-select: none;
    display:grid;
    grid-template-areas: "checkbox value";
    grid-template-columns: min-content 1fr;
   
}


.checkbox{
    unicode-bidi: isolate;
    font-variant-numeric: tabular-nums;
    text-transform: none;
    text-indent: 0px !important;
    text-align: start !important;
    text-align-last: start !important;
    /* width:min-content; */
    display:inline-block;
    vertical-align: middle;
    align-self:start;
    height:1em;
    margin-block: calc(calc(1lh - 1em) / 2);
    color:var(--checkbox-color);
}
.value{
    margin-inline-start:5px;
    margin-block-end: 0.7rem;
    
}
.sub-items{
    grid-column: span 2;
    padding-inline-start: calc(1em + 5px);
}
`;

class CheckItem extends HTMLElement {
  static observedAttributes = ["checked"];
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
    //this.shadowRoot.querySelector();
    this.addClickListener();
  }
  adoptedCallback() {
    //
  }
  attributeChangedCallback(name, oldValue, newValue) {
    //
    switch (name) {
      case "checked":
        this.updateBox();
        break;

      default:
        break;
    }
  }
  disconnectedCallback() {
    this.removeClickListener();
  }
  togFromClick(e) {
    console.log("you have been clicked");
    this.toggleAttribute("checked");
    const updstatus = this.hasAttribute("checked");
    if (this.hasAttribute("sublist")) {
      this.checkItemDescendants.forEach((el) =>
        el.toggleAttribute("checked", updstatus)
      );
    }
  }
  render() {
    let html = `<style>${css}</style><span class="checkbox" part="checkbox">
        ${this.hasAttribute("checked") ? checkedsquare : uncheckedsquare}
    </span><span class="value" part="value">
        <slot name="value"></slot>
    </span>
    <div class="sub-items" part="sub-items"> <slot></slot>
    </div>
    `;
    this.shadowRoot.innerHTML = html;
  }
  addClickListener() {
    this.shadowRoot
      .querySelector(".checkbox")
      ?.addEventListener("click", this.togFromClick.bind(this));
  }
  removeClickListener() {
    this.shadowRoot
      .querySelector(".checkbox")
      ?.removeEventListener("click", this.togFromClick.bind(this));
  }

  updateBox() {
    this.shadowRoot.querySelector(".checkbox").innerHTML = `${
      this.hasAttribute("checked") ? checkedsquare : uncheckedsquare
    }`;
  }
  get checkItemDescendants() {
    return Array.from(this.querySelectorAll("check-item"));
  }
}

try {
  customElements.define("check-item", CheckItem);
} catch (error) {}
