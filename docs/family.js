import {
  $,
  el,
  btn,
  t,
  init,
  icon,
  action,
  sheet,
  coverURL,
  asset,
  link,
  small,
  plusDays,
} from "./app-ui.js";
import { cities, setting } from "./places.js";
import { osmPlaceURL } from "./city-map.js";

export function readFamilyTrip(hash) {
  if (
    typeof hash !== "string" ||
    !hash.startsWith("#trip=") ||
    hash.length > 600
  )
    return null;
  const [city, date, ...parts] = hash.slice(6).split("~");
  if (
    !Object.hasOwn(cities, city) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date + "T12:00Z")) ||
    plusDays(date, 0) !== date ||
    parts.length < 1 ||
    parts.length > 3
  )
    return null;
  const known = new Set(cities[city].places.map((p) => p.id));
  const days = parts.map((part) => (part ? part.split(".") : []));
  if (
    days.some(
      (day) =>
        day.length > known.size ||
        new Set(day).size !== day.length ||
        day.some((id) => !known.has(id))
    )
  )
    return null;
  return { city, date, days };
}
export function familyLink(address, city, date, days) {
  const url = new URL("./", address);
  url.hash =
    "trip=" +
    [city, date, ...days.map((day) => day.map((s) => s.id).join("."))].join(
      "~"
    );
  return url.href;
}
export function shareTrip(url) {
  sheet(t("Family link", "家庭分享链接"), (body) => {
    const input = el("input", {
      readonly: true,
      value: url,
      "aria-label": t("Read-only trip link", "只读行程网址"),
      onfocus: (e) => e.target.select(),
    });
    const status = el("p", { cls: "notice", role: "status" });
    const copy = action(
      t("Copy link", "复制链接"),
      "share",
      async () => {
        try {
          await navigator.clipboard.writeText(url);
          status.textContent = t("Link copied.", "链接已复制。");
        } catch {
          input.focus();
          input.select();
          status.textContent = t(
            "Select and copy this link.",
            "请选中并复制这个链接。"
          );
        }
      },
      "subtle"
    );
    body.append(
      small(
        t(
          "Anyone with this link can see the city, travel dates and stops as they are now. Your family notes, budget and AI settings stay private.",
          "持有链接的人可以查看此刻的城市、日期和景点顺序。家庭描述、预算和 AI 设置保留在本机。"
        )
      ),
      input,
      el(
        "div",
        { cls: "actions" },
        copy,
        link(t("Preview family view ↗", "预览家长视图 ↗"), url, true)
      ),
      status
    );
    if (navigator.share) {
      const share = action(
        t("Share trip", "分享行程"),
        "share",
        async () => {
          try {
            await navigator.share({ title: "Field Trip Atlas", url });
          } catch (e) {
            if (e.name !== "AbortError")
              status.textContent = t(
                "Use Copy link to share your trip.",
                "可复制链接分享行程。"
              );
          }
        },
        "primary"
      );
      body.insertBefore(share, input);
    }
  });
}
export function openFamily(hash) {
  init("travel");
  const view = readFamilyTrip(hash);
  const back = link(
    t("Open my planner", "打开我的规划器"),
    new URL("./", location.href).href
  );
  back.className = "family-home";
  if (!view) {
    $("#app").append(
      el(
        "section",
        { cls: "panel" },
        el("h1", {}, t("Trip link unavailable", "行程链接无法读取")),
        small(
          t(
            "Ask the author to copy a new family link.",
            "请让作者重新复制一个家庭分享链接。"
          )
        ),
        back
      )
    );
    return;
  }
  const city = cities[view.city],
    cover = el(
      "section",
      { cls: "atlas-cover" },
      el("img", { src: coverURL(view.city), alt: "", width: 768, height: 512 }),
      el(
        "div",
        { cls: "atlas-cover-copy" },
        el("p", { cls: "kicker" }, t("SHARED ITINERARY", "家庭分享行程")),
        el("h1", {}, city.name),
        el(
          "p",
          {},
          view.date +
            " · " +
            t(
              view.days.length === 1 ? "1 day" : view.days.length + " days",
              view.days.length + " 天"
            )
        )
      )
    );
  const rail = el("nav", {
      cls: "day-rail",
      "aria-label": t("Shared trip days", "分享行程日期"),
    }),
    list = el("section", { cls: "family-stops" });
  function render(di) {
    [...rail.children].forEach((b, i) =>
      b.setAttribute("aria-pressed", String(i === di))
    );
    const date = plusDays(view.date, di);
    list.replaceChildren(el("h2", {}, date));
    if (!view.days[di].length)
      list.append(small(t("No stops on this day yet.", "当天还未安排景点。")));
    view.days[di].forEach((id, n) => {
      const p = city.places.find((v) => v.id === id);
      list.append(
        el(
          "article",
          { cls: "family-place" },
          el("img", {
            src: asset("place-" + id + ".webp"),
            alt: "",
            loading: "lazy",
            width: 90,
            height: 85,
          }),
          el(
            "div",
            {},
            el(
              "p",
              { cls: "place-meta" },
              t("Stop " + (n + 1), "第 " + (n + 1) + " 站") + " · " + setting(p)
            ),
            el("h3", {}, p.name),
            el("p", {}, p.description),
            el(
              "div",
              { cls: "actions" },
              link(t("Official site ↗", "官方网站 ↗"), p.url, true),
              link(t("Open map ↗", "查看地图 ↗"), osmPlaceURL(p), true)
            )
          )
        )
      );
    });
  }
  view.days.forEach((d, i) =>
    rail.append(
      btn(
        t("Day " + (i + 1), "第 " + (i + 1) + " 天"),
        () => render(i),
        "day-chip"
      )
    )
  );
  $("#app").append(cover, rail, list, back);
  render(0);
}
