import { $, el, btn, save, t } from "./common.js";
export {
  $,
  el,
  btn,
  small,
  field,
  card,
  link,
  notice,
  message,
  lang,
  t,
  read,
  save,
  download,
  parseJSON,
  prettyTime,
  dateInZone,
  plusDays,
} from "./common.js";
const glyphs =
  "cards notes chat chart compass map route sun sliders arrow next plus check pin spark rain close grid leaf clock edit play share filter".split(
    " "
  );
export const asset = (file) => new URL("./" + file, import.meta.url).href;
export const coverURL = (which) => asset("cover-" + which + ".webp");
export function icon(name) {
  const index = glyphs.indexOf(name);
  return el("i", {
    cls: "glyph",
    "aria-hidden": "true",
    style:
      "--glyph-x:" +
      (Math.max(index, 0) * 100) / (glyphs.length - 1) +
      "%;--glyph-size:" +
      glyphs.length * 100 +
      "%",
  });
}
export function action(label, name, fn, cls = "") {
  const b = btn("", fn, cls);
  b.append(icon(name), el("span", {}, label));
  return b;
}
export function init(page, connect) {
  document.documentElement.lang = t("en", "zh-CN");
  if (!document.querySelector("link[data-app-style]"))
    document.head.append(
      el("link", {
        rel: "stylesheet",
        href: asset("mobile.css"),
        "data-app-style": "",
      })
    );
  const root = page === "home" ? "./" : "../";
  const names = {
    home: "Integem Camp Labs",
    study: "Study Desk",
    travel: "Field Trip Atlas",
  };
  const brand = el(
    "a",
    {
      href: root,
      cls: "brand",
      "aria-label": t(
        "Integem Camp Labs · Course home",
        "Integem Camp Labs · 课程首页"
      ),
    },
    page === "home"
      ? el("i", { cls: "sigil", "aria-hidden": "true" })
      : el("img", {
          cls: "app-badge",
          src: asset(page + "-icon-192.png"),
          alt: "",
          width: 38,
          height: 38,
        }),
    el(
      "span",
      { cls: "brand-name" },
      page !== "home" ? el("small", {}, "INTEGEM") : null,
      el("strong", {}, names[page])
    )
  );
  const nav = el(
    "nav",
    { cls: "course-nav", "aria-label": t("Courses", "课程") },
    ...["study", "travel"].map((route) =>
      el(
        "a",
        {
          href: root + route + "/",
          "aria-current": route === page ? "page" : null,
        },
        names[route]
      )
    )
  );
  const language = btn(
    t("中文", "English"),
    () => {
      if (save("language", t("zh", "en"))) location.reload();
      else alert(t("Browser storage is unavailable.", "浏览器存储不可用。"));
    },
    "language"
  );
  const tools = el("div", { cls: "toolbar" }, language);
  if (connect) {
    const b = btn("", connect, "icon-btn settings");
    b.append(icon("sliders"));
    b.title = t("AI settings", "AI 设置");
    b.setAttribute("aria-label", b.title);
    tools.append(b);
  }
  $("#mast").replaceChildren(
    el(
      "a",
      {
        href: "#app",
        cls: "skip",
        onclick: (event) => {
          event.preventDefault();
          const main = $("#app");
          main.focus({ preventScroll: true });
          main.scrollIntoView({ block: "start" });
        },
      },
      t("Skip to workspace", "跳到工作区")
    ),
    el("div", { cls: "mast-inner" }, brand, nav, tools)
  );
}
export function workspaceTabs(label, choices, change, aliases = {}) {
  const nav = el("nav", { cls: "app-tabs", "aria-label": label });
  const buttons = new Map();
  let current = null,
    defaultKey = choices[0][0];
  const known = (key) => buttons.has(key) || Object.hasOwn(aliases, key);
  function show(key, navigate, top) {
    if (!known(key)) key = defaultKey;
    if (navigate && current !== key && location.hash.slice(1) !== key)
      history.pushState(null, "", "#" + key);
    current = key;
    for (const [id, b] of buttons)
      b.setAttribute("aria-pressed", String(id === (aliases[key] || key)));
    change(key);
    if (top) window.scrollTo({ top: 0, behavior: "auto" });
  }
  for (const [id, name, glyph] of choices) {
    const b = action(name, glyph, () => show(id, true, true), "dock-item");
    buttons.set(id, b);
    nav.append(b);
  }
  window.addEventListener("hashchange", () => {
    const route = location.hash.slice(1);
    if (!route || known(route)) show(route || defaultKey, false, true);
  });
  return {
    element: nav,
    select: (key) => show(key, true, true),
    start: (fallback) => {
      if (known(fallback)) defaultKey = fallback;
      const route = location.hash.slice(1);
      show(known(route) ? route : defaultKey, false, false);
    },
  };
}
let sheetNumber = 0;
export function sheet(title, build) {
  const id = "sheet-title-" + ++sheetNumber;
  const dialog = el("dialog", { cls: "app-sheet", "aria-labelledby": id });
  const close = () => dialog.close();
  const x = btn("", close, "icon-btn sheet-x");
  x.append(icon("close"));
  x.setAttribute("aria-label", t("Close", "关闭"));
  const body = el("div", { cls: "sheet-body" });
  dialog.append(
    el("div", { cls: "sheet-grip", "aria-hidden": "true" }),
    el("header", { cls: "sheet-head" }, el("h2", { id }, title), x),
    body
  );
  build(body, close);
  dialog.addEventListener("close", () => dialog.remove(), { once: true });
  dialog.addEventListener("click", (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      close();
  });
  document.body.append(dialog);
  dialog.showModal();
  return dialog;
}
