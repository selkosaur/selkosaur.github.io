// tippy preferences
import tippy, { createSingleton } from "https://esm.run/tippy.js";
import tipcss from "https://cdn.jsdelivr.net/npm/tippy.js@6.3.7/dist/tippy.css" assert { type: "css" };
import customtipstyle from "/css/tippy.css" assert { type: "css" };
document.adoptedStyleSheets = [tipcss, customtipstyle];

const titletips = tippy("[title]", {
  content: (reference) => {
    let tip = reference.getAttribute("title");
    reference.removeAttribute("title");
    return tip;
  },
  placement: "bottom",
});

tippy.setDefaultProps({
  moveTransition: "transform 0.2s ease-out",
  arrow: false,
  theme: "light",
  placement: "bottom",
  delay: [100, 200],
  duration: 100,
  //
});
/**
 * create tippy singleton
 * @param {String | [...HTMLElement] | NodeList } elements
 * @param {Object} options the options for the tippy instances
 * @param {String} theme
 */
const tippySingleton = (elements, options, theme) => {
  //
  if (!options) options = {};
  if (theme && !options.theme) options.theme = theme;
  const indivtippies = tippy(elements, options);
  if (!options.moveTransition)
    options.moveTransition = "transform 0.2s ease-out";

  const singleton = createSingleton(indivtippies, options);
};
export { titletips as default, tippySingleton, tippy, createSingleton };
