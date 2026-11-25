import { el, btn, field, small, link, t, lang } from "./common.js";
import {
  defaultPrefs,
  partyAges,
  nightsFor,
  bookingURL,
  feeAction,
  modeName,
  timeLabel,
  timeline,
  usd,
  fareInfo,
  budgetTotal,
} from "./trip-engine.js";
import { humanSearch, readInventory } from "./live-rates.js";

const row = (...nodes) => el("div", { cls: "studio-links" }, ...nodes);
const out = (name, url) => link(name + " ↗", url, true);
export const budgetNames = {
  lodging: t("Lodging", "住宿"),
  food: t("Meals", "餐饮"),
  tickets: t("Admission", "门票"),
  transport: t("Transportation", "交通"),
};
const choices = (options, selected, update) => {
  const node = el(
    "select",
    { onchange: (e) => update(e.target.value) },
    ...options.map(([v, name]) => el("option", { value: v }, name))
  );
  node.value = selected;
  return node;
};
export function groupFields(p, onChange) {
  const set = (key, value) => {
    p[key] = value;
    onChange();
  };
  const count = (key, min, max) =>
    choices(
      Array.from({ length: max - min + 1 }, (_, i) => [i + min, i + min]),
      p[key],
      (v) => {
        if (key === "children" && Number(v) !== p.children) {
          p.ages = "";
          ages.querySelector("input").value = "";
        }
        set(key, Number(v));
        ages.hidden = !p.children;
      }
    );
  const ages = field(
    t("Children’s ages at check-in (under 18)", "入住时儿童年龄（未满 18 岁）"),
    el("input", {
      value: p.ages,
      placeholder: "8, 14",
      maxlength: 20,
      oninput: (e) => set("ages", e.target.value),
    })
  );
  ages.hidden = !p.children;
  return el(
    "div",
    { cls: "group-fields" },
    el(
      "div",
      { cls: "pair" },
      field(t("Adults", "成人"), count("adults", 1, 6)),
      field(t("Under 18", "未满 18 岁"), count("children", 0, 4))
    ),
    ages,
    el(
      "div",
      { cls: "pair" },
      field(
        t("Getting around", "出行方式"),
        choices(
          ["transit", "walking", "driving"].map((x) => [x, modeName(x)]),
          p.mode,
          (v) => set("mode", v)
        )
      ),
      field(
        t("Daily pace", "游览节奏"),
        choices(
          [
            ["easy", t("Easy · more breaks", "轻松 · 多休息")],
            ["balanced", t("Balanced", "适中")],
            ["full", t("Full day", "充实")],
          ],
          p.pace,
          (v) => set("pace", v)
        )
      )
    ),
    field(
      t("Suggested daily start", "每日计划出发时间"),
      el("input", {
        type: "time",
        value: p.startTime,
        onchange: (e) => {
          if (/^\d\d:\d\d$/.test(e.target.value))
            set("startTime", e.target.value);
        },
      })
    )
  );
}
export function activityRow(item, city, prefs, controls) {
  const box = el("article", { cls: "schedule-item type-" + item.kind });
  const time = el(
    "time",
    { cls: "schedule-time" },
    timeLabel(item.start) + "–" + timeLabel(item.end)
  );
  const inner = el("div", { cls: "schedule-body" });
  box.append(time, inner);
  if (item.kind === "leg") {
    inner.append(
      el("strong", {}, modeName(item.mode) + " · " + item.minutes + " min"),
      small(item.from.name + " → " + item.to.name),
      out(t("Get directions", "查看路线"), item.url)
    );
    return box;
  }
  if (item.kind === "wait") {
    inner.append(
      el("strong", {}, t("Before regular opening", "常规开馆前预留时间")),
      small(item.place.name),
      out(t("Check today’s hours", "核对当天时间"), item.place.url)
    );
    return box;
  }
  if (item.kind === "break") {
    inner.append(el("strong", {}, t("Rest break", "休息")));
    return box;
  }
  const p = item.place;
  if (item.kind === "meal") {
    inner.append(
      el("span", { cls: "place-meta" }, t("Meal stop", "用餐")),
      el("h3", {}, p.name),
      small(p.detail),
      out(t("Menu & visitor information", "菜单与到访须知"), p.url)
    );
    return box;
  }
  inner.append(
    el(
      "span",
      { cls: "place-meta" },
      t("Stop ", "第 ") +
        (item.index + 1) +
        " · " +
        p.area +
        " · " +
        item.minutes +
        " min"
    ),
    el("h3", {}, p.name),
    el(
      "p",
      {},
      item.stop.focus && item.stop.focusLang === lang
        ? item.stop.focus
        : p.description
    ),
    small(p.tip)
  );
  if (item.late)
    inner.append(
      small(
        t(
          "This visit extends past regular closing. Move it earlier or confirm special hours.",
          "这次停留超出常规闭馆时间，建议提前或核实特殊开放时段。"
        )
      )
    );
  if (p.admission)
    inner.append(
      small(p.admission),
      out(
        t(
          "Published admission · checked Nov 25, 2026",
          "公布票价 · 2026-11-25 核查"
        ),
        p.priceURL || p.url
      )
    );
  if (item.closed)
    inner.append(
      el(
        "strong",
        { cls: "closure" },
        t(
          "Listed as closed on this date. Choose another stop.",
          "该地点在所选日期闭馆，请更换。"
        )
      )
    );
  inner.append(
    row(
      out(feeAction(p), p.booking),
      p.booking !== p.url ? out(t("Visitor guide", "参观指南"), p.url) : null
    )
  );
  if (controls) inner.append(controls);
  return box;
}
export function travelBoard(city, date, party) {
  const service = city.transit,
    fare = fareInfo(city, date);
  return el(
    "section",
    { cls: "studio-card transit-board" },
    el("h2", {}, t("Transportation", "交通出行")),
    el("strong", {}, service.name),
    el("p", {}, fare.text),
    party && city.id !== "dc"
      ? small(
          t(
            "If each adult pays regular fare, one ",
            "若成人均付普通票价，按所填人数单程 "
          ) +
            (city.id === "sea" ? "Link 1/2" : "Muni") +
            t(" ride for your group totals ", " 共计 ") +
            usd(
              party.adults *
                (city.id === "sea" || date >= "2027-01-04" ? 3 : 2.85)
            ) +
            (city.id === "sf" ? t(" with tap payment.", "（刷卡）。") : ".")
        )
      : null,
    city.id !== "dc" ? small(service.description) : null,
    row(
      out(t("Fare rules", "票价规则"), fare.url),
      out(t("Arrivals / alerts", "实时到站／通告"), service.live),
      out(t("Plan a journey", "运营商路线查询"), service.planner),
      out(t("Tickets & payment", "乘车票与支付"), service.tickets),
      out(t("Airport transfer", "机场接驳"), service.airport),
      ...service.extras.map(([name, url]) => out(name, url))
    )
  );
}
export function createBookings(context, editTrip, selectHotel) {
  const element = el("section", { cls: "bookings-board" }),
    rates = el("div", { cls: "room-rates", "aria-live": "polite" }),
    hotels = el("div", { cls: "hotel-list" }),
    transport = el("div"),
    admission = el("div"),
    criteria = el("p", { cls: "room-criteria" }),
    deep = el("div", { cls: "studio-links" });
  const cap = el("input", {
      type: "number",
      min: 1,
      step: 1,
      inputmode: "numeric",
      placeholder: t("Optional", "可不填"),
      oninput: () => refresh(),
    }),
    refundable = el("input", { type: "checkbox", onchange: () => refresh() });
  const rateButton = btn(
    t("Search OBO room prices", "查询 OBO 实时房价"),
    search,
    "primary"
  );
  const roomCard = el(
    "section",
    { cls: "studio-card rate-card" },
    el("p", { cls: "kicker" }, "OBO TRAVEL"),
    el("h2", {}, t("Find a room for these dates", "按日期与人数找房")),
    criteria,
    el(
      "div",
      { cls: "rate-filters" },
      field(t("Maximum stay total · USD", "整段住宿价格上限 · 美元"), cap),
      field(t("Refundable offers", "可退订报价"), refundable)
    ),
    row(
      rateButton,
      btn(t("Edit dates & guests", "编辑日期与人数"), editTrip, "subtle")
    ),
    rates,
    deep
  );
  const source = el(
    "p",
    { cls: "muted small" },
    t(
      "Search sends the city area, check-in and check-out, guest counts and any child ages to OBO Travel for one room. Confirm fees and cancellation terms on the offer page.",
      "点击查询将所选城市区域、入住及退房日期、人数和填写的儿童年龄发给 OBO Travel，为一间房核价。请在报价页核对附加费用与退订条款。"
    )
  );
  roomCard.insertBefore(source, rates);
  element.append(
    roomCard,
    el(
      "section",
      { cls: "studio-card" },
      el("h2", {}, t("Choose a home base", "选择行程出发酒店")),
      small(
        t(
          "Use a hotel as the start and finish of each day. The official hotel links below let you compare room types directly.",
          "选一家酒店作为每日出发和返回地点。下方官网可独立查询房型。"
        )
      ),
      hotels
    ),
    transport,
    admission
  );
  let key = "",
    request = null,
    timer = 0,
    quote = null;
  function get() {
    const { city, start, days, prefs } = context(),
      stay = nightsFor(start, days);
    return {
      city,
      stay,
      prefs,
      query: {
        city: city.id,
        ...stay,
        adults: prefs.adults,
        ages: partyAges(prefs),
        budget: cap.valueAsNumber,
        refundable: refundable.checked,
      },
    };
  }
  function clear() {
    clearTimeout(timer);
    request?.abort();
    request = null;
    quote = null;
    rates.replaceChildren();
  }
  function refresh() {
    const { city, stay, prefs, query } = get(),
      k = JSON.stringify([query, prefs.children, prefs.ages]);
    if (k !== key) {
      clear();
      key = k;
    }
    rateButton.disabled = !stay.nights || Boolean(request);
    criteria.textContent =
      stay.checkIn +
      (stay.nights ? " → " + stay.checkOut : "") +
      " · " +
      stay.nights +
      t(stay.nights === 1 ? " night" : " nights", " 晚") +
      " · " +
      prefs.adults +
      t(prefs.adults === 1 ? " adult" : " adults", " 位成人") +
      " · " +
      prefs.children +
      t(" under 18", " 位未满18岁");
    if (!stay.nights)
      rates.replaceChildren(
        small(
          t(
            "This is a day trip. Add a second day to search overnight stays.",
            "这是单日行程，增加一天即可查询住宿。"
          )
        )
      );
    deep.replaceChildren(
      ...(stay.nights
        ? [
            out(
              t("Open OBO’s dated search", "打开 OBO 日期查询"),
              humanSearch(query)
            ),
            small(
              t(
                "On the external form, confirm all guests and child ages.",
                "在外部页面确认入住人数与儿童年龄。"
              )
            ),
          ]
        : [])
    );
    hotels.replaceChildren(
      ...city.hotels.map((h) =>
        el(
          "article",
          { cls: "hotel-card" },
          el("span", { cls: "place-meta" }, h.area),
          el("h3", {}, h.name),
          el("p", {}, h.why),
          row(
            btn(
              prefs.hotel === h.id
                ? t("Selected · clear", "已选 · 取消")
                : t("Use as my base", "设为出发酒店"),
              () => selectHotel(prefs.hotel === h.id ? "" : h.id),
              prefs.hotel === h.id ? "selected-base" : "subtle"
            ),
            out(t("Hotel website", "酒店官网"), h.url),
            out(
              ["synxis", "cloudbeds"].includes(h.engine) && stay.nights
                ? t("Check my dates", "按行程日期查房")
                : t("Rooms & reservations", "房型与预订"),
              bookingURL(h, stay, prefs)
            )
          )
        )
      )
    );
    transport.replaceChildren(travelBoard(city, stay.checkIn, prefs));
    const { day, stops } = context(),
      planned = stops
        .map((s) => city.places.find((p) => p.id === s.id))
        .filter(Boolean);
    admission.replaceChildren(
      el(
        "section",
        { cls: "studio-card" },
        el("h2", {}, t("Admission for day ", "当日景点门票 · 第 ") + (day + 1)),
        ...(planned.length
          ? planned.map((p) =>
              el(
                "div",
                { cls: "ticket-row" },
                el("div", {}, el("strong", {}, p.name), small(p.tip)),
                out(feeAction(p), p.booking)
              )
            )
          : [
              small(
                t(
                  "Add stops to see this day’s ticket links.",
                  "添加景点后可查看当天的门票与预约入口。"
                )
              ),
            ])
      )
    );
  }
  function expire() {
    if (quote && Date.now() >= quote.expires) {
      quote = null;
      rates.replaceChildren(
        small(
          t(
            "The quote expired. Search again for current prices.",
            "报价已过期，请重新查询。"
          )
        )
      );
    }
  }
  function display(data) {
    quote = data;
    clearTimeout(timer);
    timer = setTimeout(expire, Math.max(1, data.expires - Date.now() + 50));
    rates.replaceChildren();
    rates.append(
      small(
        t("OBO Travel · checked ", "OBO Travel · 查询时间 ") +
          new Date(data.received).toLocaleString(
            lang === "zh" ? "zh-CN" : "en-US"
          ) +
          (data.partial
            ? t(
                " · partial inventory; retry in about 20 seconds for more.",
                " · 部分库存已返回，约 20 秒后可重试。"
              )
            : "")
      )
    );
    if (!data.offers.length)
      rates.append(
        small(
          t("No room offers returned for this search.", "本次查询未返回房源。")
        )
      );
    for (const item of data.offers)
      rates.append(
        el(
          "article",
          { cls: "rate-result" },
          el("strong", { cls: "room-total" }, usd(item.total) + " USD"),
          small(t("Whole stay", "整段住宿")),
          el("h3", {}, item.name),
          small(item.location),
          small(
            t("Quoted ", "供应商报价时间 ") +
              new Date(item.quotedAt).toLocaleTimeString()
          ),
          small(item.room),
          item.onRequest
            ? small(t("Subject to supplier confirmation.", "需供应商确认。"))
            : null,
          small(
            item.notes ||
              t(
                "Check any property taxes and fees on the offer page.",
                "请在报价页核对当地税费和酒店附加费。"
              )
          ),
          out(
            t("View offer on OBO Travel", "前往 OBO Travel 查看报价"),
            item.url
          )
        )
      );
  }
  async function search() {
    const { stay, query } = get();
    if (!stay.nights || request) return;
    if (!Number.isNaN(query.budget) && query.budget <= 0) {
      rates.replaceChildren(
        small(
          t(
            "Enter a positive price cap or leave it blank.",
            "价格上限需大于零，或留空。"
          )
        )
      );
      return;
    }
    const utcToday = new Date().toISOString().slice(0, 10),
      delta = (Date.parse(stay.checkIn) - Date.parse(utcToday)) / 86400000;
    if (delta < 1 || delta > 400) {
      rates.replaceChildren(
        small(
          t(
            "OBO supports check-in from tomorrow up to 400 days ahead. Use a hotel website for these dates.",
            "OBO 支持明天起 400 天内入住。所选日期请向酒店官网查询。"
          )
        )
      );
      return;
    }
    if (!query.ages) {
      rates.replaceChildren(
        small(
          t(
            "Enter one age per child in Edit dates & guests to price the correct room.",
            "请在「编辑日期与人数」中填写每位儿童年龄，以查询适用客房。"
          )
        )
      );
      return;
    }
    clear();
    const controller = new AbortController();
    request = controller;
    const guard = key;
    const timeout = setTimeout(() => controller.abort(), 45000);
    rateButton.disabled = true;
    rates.replaceChildren(
      small(
        t(
          "Checking room inventory on OBO Travel…",
          "正在查询 OBO Travel 的客房库存…"
        )
      )
    );
    try {
      const data = await readInventory(query, controller.signal);
      if (key === guard && request === controller) display(data);
    } catch (e) {
      if (key === guard && request === controller)
        rates.replaceChildren(
          small(
            e.status === 429
              ? t(
                  "OBO’s search limit was reached. Retry later or open its dated search.",
                  "OBO 已达到查询限额，稍后重试或打开日期查询。"
                )
              : t(
                  "No verified prices came back. Retry or open the dated search below.",
                  "未收到可核实的报价。可以重试，或打开下方的日期查询。"
                )
          )
        );
    } finally {
      clearTimeout(timeout);
      if (request === controller) {
        request = null;
        rateButton.disabled = false;
      }
    }
  }
  document.addEventListener("visibilitychange", expire);
  window.addEventListener("pageshow", expire);
  window.addEventListener("pagehide", () => {
    clear();
    rateButton.disabled = false;
  });
  return { element, refresh, search };
}
export function costEditor(dates, active, stored, onEdit) {
  const date = dates[active],
    stay = active < dates.length - 1,
    day = stored[date] || {},
    daily = el("p", { cls: "cost-total" }),
    entire = el("p", { cls: "muted small" }),
    fields = el("div", { cls: "cost-grid" });
  const draw = () => {
    const part = budgetTotal(stored[date], stay),
      totals = dates.map((d, i) =>
        budgetTotal(stored[d], i < dates.length - 1)
      ),
      missing = totals.reduce((n, b) => n + b.total - b.known, 0);
    daily.textContent =
      t("Day subtotal ", "当日已知小计 ") +
      usd(part.sum) +
      " · " +
      (part.total - part.known) +
      t(" unfilled", " 项待填");
    entire.textContent =
      t("Trip subtotal ", "全程已知小计 ") +
      usd(totals.reduce((n, b) => n + b.sum, 0)) +
      " · " +
      missing +
      t(" unfilled across the trip", " 项待填");
  };
  for (const [key, name] of Object.entries(budgetNames)) {
    if (key === "lodging" && !stay) continue;
    const input = el("input", {
      type: "number",
      min: 0,
      step: "0.01",
      inputmode: "decimal",
      placeholder: "—",
      value: day[key] ?? "",
      oninput: (e) => {
        const v = e.target.value,
          n = e.target.valueAsNumber;
        if (v !== "" && (!Number.isFinite(n) || n < 0)) return;
        (stored[date] ??= {})[key] =
          v === "" ? null : Math.round(n * 100) / 100;
        onEdit();
        draw();
      },
    });
    fields.append(field(name + " · USD", input));
  }
  draw();
  return el(
    "details",
    { cls: "studio-card budget-card" },
    el("summary", {}, t("Family budget", "家庭预算")),
    small(
      t(
        "Enter your own confirmed amounts or allowances in USD for the whole party. Blank categories are still unknown.",
        "填写全家已确认的金额或自定预算（美元）。空白项仍待核价。"
      )
    ),
    fields,
    daily,
    entire
  );
}
