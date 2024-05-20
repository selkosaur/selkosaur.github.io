import slideoutcss from "../css/slideout.css" with {type: "css"}

document.adoptedStyleSheets = [slideoutcss, ...document.adoptedStyleSheets];

export default slideoutcss;