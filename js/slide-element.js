let e = {
    easing: "ease",
    duration: 250,
    fill: "backwards",
    display: "block",
    overflow: "hidden",
  },
  t = ["overflow", "display"],
  i = (i, n) => {
    let a = Object.assign({}, e, n),
      o = a.display,
      d = (e) => (i.style.display = e),
      l = () => i.clientHeight + "px",
      r = (e) => (i.style.overflow = e ? a.overflow : ""),
      s = () => i.getAnimations(),
      p = (e, n) => {
        var o;
        t.forEach((e) => delete a[e]);
        let d = l(),
          r = [d, n].map((e) => ({
            height: e,
            paddingTop: "0px",
            paddingBottom: "0px",
          })),
          { paddingTop: s, paddingBottom: p } = window.getComputedStyle(i);
        (r[0].paddingTop = s),
          (r[0].paddingBottom = p),
          e && ((r[0].height = d), r.reverse()),
          (null == (o = window.matchMedia("(prefers-reduced-motion: reduce)"))
            ? void 0
            : o.matches) && (a.duration = 0);
        let g = i.animate(r, a);
        return (g.id = (+e).toString()), g;
      },
      g = async (e) => {
        let t = s().map((e) => e.finish());
        var i;
        return (
          await ((i = async (t) => {
            let i = e ? l() : "0px";
            e && d(o),
              r(!0),
              await p(e, i).finished,
              r(!1),
              e || d("none"),
              t();
          }),
          new Promise((e) => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                i(e);
              });
            });
          })),
          t.length ? null : e
        );
      },
      u = async () => g(!1),
      m = async () => g(!0);
    return {
      up: u,
      down: m,
      toggle: async () => {
        var e;
        let t = null == (e = s()[0]) ? void 0 : e.id;
        return ((t ? "1" === t : i.offsetHeight) ? u : m)();
      },
    };
  },
  n = (e, t = {}) => i(e, t).down(),
  a = (e, t = {}) => i(e, t).up(),
  o = (e, t = {}) => i(e, t).toggle();
export { n as down, o as toggle, a as up };
export default null;
