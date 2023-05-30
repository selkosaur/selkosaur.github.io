/**
 *
 * @param {Event} event
 */
let handleTagEvent = function (event) {
  if (event.detail) {
    console.log(event.detail);
    switch (event.detail.name) {
      case "tag-entry":
        let tagarea = event.target.closest("tags-area");
        tagarea.addNewTag(event.target.newTagString, event.detail.spacer);
        break;

      default:
        break;
    }
  }
  console.log("there has been a tag event!");
};
document.addEventListener("tagevent", handleTagEvent);

/**
 *
 * @param {KeyboardEvent} event
 */
let docKeyHandle = function (event) {
  let target = event.target;
  if (target.handleKeyPress) {
    target.handleKeyPress(event);
  }
};

/**
 *
 * @param {FocusEvent} event
 */
let docFocusOutHandle = function (event) {
  const target = event.target;
  console.log(target);
  console.log(event);
  if (target.contentEditable) {
    target.spellcheck = false;
  }
  if (event.relatedTarget && event.relatedTarget.contentEditable) {
    event.relatedTarget.spellcheck = true;
  }
};

document.addEventListener("focusout", docFocusOutHandle);
document.addEventListener("keydown", docKeyHandle);

const tagsCss = `   
    tags-area{
      display:flex;
      align-items:center;
      flex-wrap:wrap;
      min-height:1em;

    }
    my-tag{
        display:inline-flex;
         align-items:center;
        margin: 4px 2px;
        padding: 5px 10px;
        border-radius: 30px;
        background-color: var(--note-secondary, #f7f7f7);
        color: var(--note-primary, #000000);

    }
    my-tag .text-field, tag-text{
        border-radius: 5px;
        padding:2px;
        margin: 0px 5px;
        display: inline-block;
        width:auto;
        transition: width 2s, min-width 0.2s;
        min-width:20px;
        line-height:normal;
        min-height: 10px;

    }
    my-tag .text-field:empty, tag-text:empty{
        min-width: 30px;
    }

    my-tag .tag-icon{
        display:flex;
        align-items:center;
        justify-content:center;
    }

    tag-spacer{
        margin: 4px 0px;
        padding: 5px 3px;
        height:inherit;
        min-height:inherit;
        min-width:2px;
        border-radius: 5px;
    }
    tag-spacer:only-child:empty::before{
        content:"add a tag";
    }
    button.tag-btn:defined{
        all:unset;
        cursor:pointer;
        opacity:0.5;
        display:flex;
        align-items:center;
        justify-content:center;
    }  
    button.tag-btn:defined:hover,button.tag-btn:defined:focus{
    opacity:1;
    }
      `;

class TagSpacer extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    //
    this.defineCustomEvents();

    this.contentEditable = true;
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
  /**
   *
   * @param {KeyboardEvent} event
   */
  handleKeyPress(event) {
    // console.log("keyyy boardssss");

    let text = this.textContent.trim();
    let tagEl = this.previousElementSibling;

    //console.log(event);
    switch (event.key) {
      case ",":
      case "Enter":
        event.preventDefault();
        if (!text) {
          return;
        }
        this.newTagString = text;
        this.dispatchEvent(this.newTagEv);
        event.target.innerText = "";
        break;
      case "Backspace":
        if (!tagEl || text) {
          return;
        }
        if (tagEl.nodeName === "MY-TAG") {
          let delbtn = tagEl.button;
          delbtn.focus();
        }
        break;
      default:
        break;
    }
  }
  addInputListener() {
    //  this.addEventListener("input", this.handleInput);
    //this.addEventListener("keydown", this.handleKeyPress);
  }
  defineCustomEvents() {
    let spacerEl = this;
    this.newTagEv = new CustomEvent("tagevent", {
      detail: {
        name: "tag-entry",
        spacer: spacerEl,
      },
      bubbles: true,
    });
  }
}

customElements.define("tag-spacer", TagSpacer);

class TagButton extends HTMLButtonElement {
  constructor() {
    super();
    this.setAttribute("class", "tag-btn");
  }
  connectedCallback() {
    //
    this.contentEditable = true;
    this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="13" width="13" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`;
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
  handleKeyPress(event) {
    // console.log("on ye olde button");
    // console.log(event);
    switch (event.key) {
      case "Backspace":
        this.click();
        break;

      default:
        break;
    }
  }
}
customElements.define("tag-btn", TagButton, { extends: "button" });

class TagText extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    //
    this.classList.add("text-field");
    this.contentEditable = true;
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
  /**
   *
   * @param {KeyboardEvent} event
   */
  handleKeyPress(event) {
    switch (event.key) {
      case "Enter":
        /**
         * @type Tag
         */
        let text = this.textContent.trim();
        this.textContent = text;
        let parent = this.parentElement;
        if (parent) {
          let spacer = parent.nextElementSibling;
          if (spacer) {
            spacer.focus();
          }
        }
      case ",":
        event.preventDefault();
        break;

      default:
        break;
    }
  }
}

customElements.define("tag-text", TagText);

class Tag extends HTMLElement {
  static get observedAttributes() {
    return ["c", "l", "value"];
  }
  static styleTagAdded = false;
  constructor(tagvalue = "") {
    super();
    this._tagValue = tagvalue;
    this.addStyles();
    //this.contentEditable = true;
    //this.innerText = `boink`;
  }
  removeTag() {
    this.dispatchEvent(this.removedEv);
    this.focusPrevSpacer();
    this.spacerEl.remove();
    this.remove();
  }
  focusPrevSpacer() {
    const prevspacer = this.previousElementSibling;
    if (!prevspacer) {
      return;
    }
    if (prevspacer.nodeName === "TAG-SPACER") {
      prevspacer.focus();
    }
  }
  connectedCallback() {
    console.log("Custom input element added to page.");
    this.defineCustomEvents();
    this.textField = document.createElement("tag-text");
    this.tagIcon = document.createElement("div");
    this.tagIcon.classList.add("tag-icon");
    this.tagIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none">
<path d="M4.16989 15.3L8.69989 19.83C10.5599 21.69 13.5799 21.69 15.4499 19.83L19.8399 15.44C21.6999 13.58 21.6999 10.56 19.8399 8.69005L15.2999 4.17005C14.3499 3.22005 13.0399 2.71005 11.6999 2.78005L6.69989 3.02005C4.69989 3.11005 3.10989 4.70005 3.00989 6.69005L2.76989 11.69C2.70989 13.04 3.21989 14.35 4.16989 15.3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.5 12C10.8807 12 12 10.8807 12 9.5C12 8.11929 10.8807 7 9.5 7C8.11929 7 7 8.11929 7 9.5C7 10.8807 8.11929 12 9.5 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;
    this.textField.contentEditable = true;
    this.textField.innerText = this._tagValue;

    this.button = document.createElement("button", { is: "tag-btn" });
    this.spacerEl = document.createElement("tag-spacer");
    this.spacerEl.contentEditable = true;

    this.appendChild(this.tagIcon);
    this.appendChild(this.textField);
    this.appendChild(this.button);
    this.insertAdjacentElement("afterend", this.spacerEl);
    this.button.addEventListener("click", this.removeTag.bind(this));

    this.dispatchEvent(this.addedEv);
    this.addInputListener();
    this.addInnerFunctions();
  }
  disconnectedCallback() {
    const tag = this;
    console.log("disconnected callback");
  }

  adoptedCallback() {
    console.log("Custom input element moved to new page.");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log("Custom input element attributes changed.");
  }
  defineCustomEvents() {
    let tag = this;
    this.addedEv = new CustomEvent("tagevent", {
      detail: {
        name: "added",
        tag: tag,
      },
      bubbles: true,
    });
    this.removedEv = new CustomEvent("tagevent", {
      detail: {
        name: "removed",
        tag: tag,
      },
      bubbles: true,
    });
  }
  get tagValue() {
    return this._tagValue;
  }
  /**
   * @param {String} tagstring the tag value
   */
  set tagValue(tagstring) {
    this._tagValue = tagstring;
    this.textField.innerText = tagstring;
  }
  updateTagValonInput() {
    this._tagValue = this.textField.innerText.trim();
  }
  addInputListener() {
    this.textField.addEventListener(
      "input",
      this.updateTagValonInput.bind(this)
    );
  }
  addInnerFunctions() {
    // let textField = this.textField;
    // textField.prototype.handleKeyPress = function (event) {
    //   console.log("hello there sir");
    // };
  }
  handleKeyPress(event) {
    //
    console.log("tag keypress handler");
  }
  addStyles() {
    if (Tag.styleTagAdded) {
      return;
    }
    const head = document.querySelector("head");
    const style = document.createElement("style");
    style.setAttribute("data-csstype", "tags");
    style.innerHTML = tagsCss;
    head.insertAdjacentElement("beforeend", style);
    Tag.styleTagAdded = true;
  }
}
customElements.define("my-tag", Tag);

class TagsArea extends HTMLElement {
  static styleTagAdded = false;
  static addStyles() {
    if (this.styleTagAdded) {
      return;
    }
    let style = document.querySelector("[data-csstype='tags']");
    if (style) {
      this.styleTagAdded = true;
      return;
    }
    style = document.createElement("style");
    style.innerHTML = tagsCss;
    const head = document.querySelector("head");
    head.insertAdjacentElement("beforeend", style);
    this.styleTagAdded = true;
  }
  constructor() {
    super();
    TagsArea.addStyles();
  }

  connectedCallback() {
    //
    //  this.addInputListener();
    // this.contentEditable = true;
    let firstspacer = document.createElement("tag-spacer");
    this.insertAdjacentElement("afterbegin", firstspacer);
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
  addInputListener() {
    this.addEventListener("input", this.handleInput);
  }
  handleInput(event) {
    //
    // let text = this.textContent;
    // console.log(text);
    // let commareg = /.*,/m;
    // let match = text.match(commareg);
    // if (match) {
    //   console.log("COMMA FOUND!");
    //   this.addNewTag(match[0]);
    //   event.target.innerText = "";
    // }
  }
  /**
   *
   * @param {String} tagstring
   * @param {HTMLElement} spacerRef
   */
  addNewTag(tagstring, spacerRef) {
    tagstring = tagstring.replace(",", "").trim();
    let newtag = document.createElement("my-tag");
    newtag._tagValue = tagstring;
    if (!spacerRef) {
      this.insertAdjacentElement("afterbegin", newtag);
      return;
    }
    spacerRef.insertAdjacentElement("afterend", newtag);
    let newspacer = newtag.nextSibling;
    newspacer.focus();
  }
}

customElements.define("tags-area", TagsArea);
