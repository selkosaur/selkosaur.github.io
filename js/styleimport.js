/**
 *
 * @param {string|Array} styles the style or styles to add to the document
 */
export function addStyleSheets(styles) {
  if (typeof styles === "string") {
    styles = [styles];
  }
  const sheetHrefs = {
    climacons:
      "https://cdn.jsdelivr.net/gh/christiannaths/Climacons-Font/webfont/climacons-font.css",
    iconsax: "https://selkosaur.github.io/font/i/iconsax.css",
  };
  let stylesheets = document.querySelectorAll("link[rel='stylesheet']");
  const elHrefs = Array.from(stylesheets).map(({ href }) => href);
  styles.forEach((stylename) => {
    if (elHrefs.indexOf(stylename) < 0) {
      let link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = sheetHrefs[stylename];
      document.head.appendChild(link);
    }
  });
}
