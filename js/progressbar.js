/**
 * Horizontal progress bar. Needs "value" (defaults to 0) and "max" (defaults to 100) attributes.
 *
 * Will not overflow unless "overflow" attribute is present.
 *
 * Currently, color styles must be set directly by css variable, cannot currently be set with an attribute.
 * Current variables:
 * --progbarborder: the outer bar's border.
 * --progbarbg: the background of the outer bar, default is transparent.
 * --progbarcolor: the inner bar's color.
 */
class ProgressBar extends HTMLElement {
  static observedAttributes = ["color", "size", "max", "value", "overflow"];

  constructor() {
    super();
  }
  get #style() {
    return `<style>
            .bar.outer {
                border: 1px solid var(--progbarborder, hsl(240, 12%, 78%));
                background-color: var(--progbarbg, transparent);
                display: flex;
                border-radius: 30px;
                /* margin: 0px 5px; */
                padding: 3px;
                width: 100%;
                height: 15px;
            }

            .bar .inner {
                background-color: var(--progbarcolor, rgb(129, 129, 156));
                height: 100%;
                border-radius: 30px;
                flex-shrink: 0;
                transition: width 1.2s;
                width: var(--progbarwidth, 0%);
                animation: growWidth 4s 1, fadeIn 1s 1;
            }

            @keyframes growHeight {
                0% {
                    max-height: 0px;

                }

                100% {
                    max-height: 1000px;
                }
            }

            @keyframes growWidth {
                0% {
                    max-width: 0px;

                }

                100% {
                    max-width: 1000px;
                }
            }

            @keyframes fadeIn {
                0% {
                    opacity: 0;

                }

                100% {
                    opacity: 1;
                }
            }
        </style>`;
  }
  get #template() {
    return `<div class="bar outer" part="bar-outer">
                <div class="inner" part="bar-inner" ></div>
            </div>`;
  }
  render() {
    this.innerHTML = this.#style + this.#template;
  }
  /**
   * the actual value for the progress percent (can exceed 100)
   */
  get percentvalue() {
    let max = parseFloat(this.getAttribute("max") ?? 100); // defaults to 100 if not set
    let val = parseFloat(this.getAttribute("value") ?? 0);
    return (val / max) * 100;
  }
  /**
   * the percentage to display for the inner bar's width. accounts for "overflow" attribute being set or not
   */
  get progresspercent() {
    let actualpercent = this.percentvalue;
    return !this.hasAttribute("overflow") && actualpercent > 100
      ? 100
      : actualpercent;
  }
  /**
   * update the element's style via css variable
   * @param {string} attributeName name of the attribute that has changed
   */
  updateStyle(attributeName) {
    switch (attributeName) {
      case "value":
      case "max":
      case "overflow":
        this.style.setProperty(`--progbarwidth`, `${this.progresspercent}%`);
        break;

      default:
        break;
    }
  }
  connectedCallback() {
    // console.log("Custom element added to page.");
    this.render();
  }
  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback(name, oldValue, newValue) {
    this.updateStyle(name);
  }
}

try {
  customElements.define("progress-bar", ProgressBar);
} catch (error) {}
