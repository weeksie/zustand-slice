const a = (e, l) => () => e()[l], f = (e, l, s) => (t, n) => {
  let c;
  if (s.logCalls) {
    const o = `${l}.${n ?? "set"}`;
    c = s.logCalls === "all" ? { type: o, payload: t } : o;
  }
  e(
    (o) => {
      const u = typeof t == "function" ? t(o[l]) : t;
      return {
        [l]: {
          ...o[l],
          ...u
        }
      };
    },
    !1,
    c
  );
}, r = (e, l, s, t = { logCalls: "all" }) => (n, c) => c(f(e, n, t), a(l, n), s);
export {
  r as default,
  r as slice,
  a as sliceGet,
  f as sliceSet
};
