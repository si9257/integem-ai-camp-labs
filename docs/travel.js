import {
  $,
  el,
  btn,
  field,
  small,
  link,
  card,
  init,
  asset,
  icon,
  action,
  sheet,
  coverURL,
  workspaceTabs,
  notice,
  message,
  t,
  lang,
  read,
  save,
  download,
  prettyTime,
  dateInZone,
  plusDays,
} from "./app-ui.js?v=paper1";
import { tripDate } from "./trip-brief.js?v=student5";
import { familyLink, shareTrip, openFamily } from "./family.js";
import {
  configured,
  openAISettings,
  checkClassroomText,
  allowedInClass,
  classroomNotice,
} from "./ai.js?v=class2";
import { createPlaceMap, osmPlaceURL } from "./city-map.js";
import { cities, interests, setting } from "./places.js";
import {
  pointsURL,
  cacheFor,
  fetchForecast,
  forDay,
  range,
} from "./weather.js";
import {
  MAX_DAYS,
  defaultPrefs,
  nightsFor,
  bookingURL,
  feeAction,
  timeLabel,
  modeName,
  closedOn,
  timeline,
  quickDraft,
  budgetTotal,
  usd,
  fareInfo,
} from "./trip-engine.js";
import {
  groupFields,
  activityRow,
  createBookings,
  costEditor,
  budgetNames,
} from "./trip-studio.js?v=student5";
import { startGeneration, untilCancelled } from "./generation.js";
import { draftWithModel } from "./trip-agent.js?v=class2";
if (!document.querySelector("link[data-trip-studio]"))
  document.head.append(
    el("link", {
      rel: "stylesheet",
      href: new URL("./trip-studio.css", import.meta.url).href,
      "data-trip-studio": true,
    })
  );
const familyAtOpen = location.hash.startsWith("#trip=");
if (familyAtOpen) openFamily(location.hash);
else startPlanner();
window.addEventListener("hashchange", () => {
  const shared = location.hash.startsWith("#trip=");
  if (shared !== familyAtOpen || shared) location.reload();
});
function startPlanner() {
  init("travel", openAISettings);
  const practice = new URL(location.href).searchParams.get("practice") === "1";
  const tripKey = practice ? "atlas-class-practice-v1" : "atlas-v1";
  let tripOpened = false;
  const initial = {
    city: "sf",
    activeDay: 0,
    start: plusDays(dateInZone(new Date(), cities.sf.zone), 1),
    days: 2,
    interests: ["science"],
    brief: "",
    appliedBrief: "",
    budget: "",
    plans: {},
    dayInfo: {},
    expenses: {},
    bases: {},
    requests: {},
  };
  const state = { ...initial, ...read(tripKey, {}) };
  state.prefs = { ...defaultPrefs, ...state.prefs };
  for (const k of ["plans", "dayInfo", "expenses", "bases", "requests"])
    if (!state[k] || typeof state[k] !== "object" || Array.isArray(state[k]))
      state[k] = {};
  if (!["easy", "balanced", "full"].includes(state.prefs.pace))
    state.prefs.pace = "balanced";
  if (!["walking", "transit", "driving"].includes(state.prefs.mode))
    state.prefs.mode = "transit";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(state.prefs.startTime))
    state.prefs.startTime = defaultPrefs.startTime;
  if (!cities[state.city]) state.city = "sf";
  const city = () => cities[state.city];
  const dates = () =>
    Array.from({ length: state.days }, (_, i) => plusDays(state.start, i));
  const matchesDate = (x) =>
    /^\d{4}-\d{2}-\d{2}$/.test(x) && Number.isFinite(Date.parse(x + "T12:00Z"));
  if (!matchesDate(state.start)) state.start = initial.start;
  if (!Number.isInteger(state.days) || state.days < 1 || state.days > MAX_DAYS)
    state.days = 2;
  if (
    !Number.isInteger(state.activeDay) ||
    state.activeDay < 0 ||
    state.activeDay >= state.days
  )
    state.activeDay = 0;
  const tripStatus = notice(),
    weatherStatus = notice(),
    planStatus = notice();
  let forecast = null,
    weatherMode = "loading",
    pendingWeather = null,
    requestId = 0,
    controller = null,
    weatherError = "",
    planning = false,
    revision = 0;
  function persist() {
    const ok = save(tripKey, state);
    if (!ok)
      message(
        planStatus,
        t(
          "Storage is unavailable. Export before leaving.",
          "存储不可用，请在离开前导出。"
        ),
        true
      );
    return ok;
  }
  function changed() {
    revision++;
    persist();
  }
  function plan() {
    return (state.plans[state.city] ??= Object.create(null));
  }
  function stops(date) {
    return plan()[date] || [];
  }
  const prefs = () => ({
    ...state.prefs,
    hotel: state.bases[state.city] || "",
  });
  const meta = () => (state.dayInfo[state.city] ??= {});
  const expenses = () => (state.expenses[state.city] ??= {});
  const baseHotel = () => city().hotels.find((h) => h.id === prefs().hotel);
  function findPlace(id) {
    return city().places.find((p) => p.id === id);
  }
  function localPeriod(p) {
    const fmt = new Intl.DateTimeFormat(t("en-US", "zh-CN"), {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: city().zone,
    });
    return fmt.format(new Date(p.start)) + " – " + fmt.format(new Date(p.end));
  }
  const citySelect = el(
    "select",
    { id: "city" },
    Object.entries(cities).map(([k, c]) => el("option", { value: k }, c.name))
  );
  const dateInput = el("input", {
    type: "date",
    id: "start",
    value: state.start,
  });
  const lengthSelect = el(
    "select",
    { id: "duration" },
    Array.from({ length: MAX_DAYS }, (_, i) => i + 1).map((n) =>
      el("option", { value: n }, n + " " + t(n === 1 ? "day" : "days", "天"))
    )
  );
  const brief = el("textarea", {
    rows: 3,
    maxlength: 1200,
    value: state.brief,
    placeholder: t(
      "Two days in San Francisco with two kids. We like science and want indoor options if it rains.",
      "带两个孩子去旧金山玩两天，喜欢科学，下雨想安排室内活动。"
    ),
  });
  const budget = el("input", {
    value: state.budget,
    maxlength: 160,
    placeholder: t(
      "e.g. $80 total, step-free routes",
      "例如：共 80 美元，需要无台阶路线"
    ),
  });
  const chips = el("div", { cls: "chips" }),
    catalog = el("div", { cls: "places" }),
    weatherBody = el("div", { cls: "stack" }),
    dayRail = el("nav", {
      cls: "day-rail",
      "aria-label": t("Planning day", "规划日期"),
    }),
    itinerary = el("div", { cls: "itinerary" });
  const aiBtn = action(
      t("Plan with AI", "用 AI 规划"),
      "spark",
      () => makePlan(),
      "primary"
    ),
    retry = btn(
      t("Refresh forecast", "刷新预报"),
      () => loadWeather(),
      "subtle"
    );
  function syncForm() {
    citySelect.value = state.city;
    dateInput.value = state.start;
    lengthSelect.value = String(state.days);
    renderInterests();
    if (composer.value !== brief.value) composer.value = brief.value;
    $(".cover-city", banner).textContent = city().name;
    const image = $("img", banner),
      source = coverURL(state.city);
    if (image.src !== source) image.src = source;
    $(".region-label", banner).textContent = regions[state.city];
    $(".cover-dates", banner).textContent = tripLabel();
    $(".compact-trip-city", bar).textContent = city().name;
  }
  function renderInterests() {
    chips.replaceChildren(
      ...Object.entries(interests).map(([key, label]) => {
        const active = state.interests.includes(key);
        const b = btn(
          label,
          () => {
            state.interests = active
              ? state.interests.filter((x) => x !== key)
              : [...state.interests, key];
            changed();
            renderInterests();
          },
          "chip" + (active ? " active" : "")
        );
        b.setAttribute("aria-pressed", String(active));
        return b;
      })
    );
  }
  function newCity(id) {
    if (!cities[id] || id === state.city) return false;
    state.city = id;
    tripOpened = false;
    state.activeDay = 0;
    filterMode = "all";
    message(planStatus, "");
    return true;
  }
  function rerenderTrip() {
    state.activeDay = Math.max(0, Math.min(state.activeDay, state.days - 1));
    syncForm();
    renderCatalog();
    renderPlan();
    renderWeather();
    booking.refresh();
  }
  citySelect.addEventListener("change", () => {
    if (newCity(citySelect.value)) {
      changed();
      rerenderTrip();
      loadWeather();
    }
  });
  dateInput.addEventListener("change", () => {
    if (!matchesDate(dateInput.value)) {
      dateInput.value = state.start;
      message(tripStatus, t("Choose a valid date.", "请选择有效日期。"), true);
      return;
    }
    state.start = dateInput.value;
    changed();
    rerenderTrip();
  });
  lengthSelect.addEventListener("change", () => {
    state.days = Number(lengthSelect.value);
    state.activeDay = Math.min(state.activeDay, state.days - 1);
    changed();
    rerenderTrip();
  });
  budget.addEventListener("input", () => {
    state.budget = budget.value;
    changed();
  });
  brief.addEventListener("input", () => {
    state.brief = brief.value;
    if (state.brief.trim() !== state.appliedBrief)
      state.appliedBriefVersion = 0;
    composer.value = brief.value;
    changed();
  });
  function applyBrief() {
    const value = brief.value.trim();
    brief.setCustomValidity("");
    composer.setCustomValidity("");
    if (
      !value ||
      (value === state.appliedBrief && state.appliedBriefVersion === 2)
    )
      return true;
    const parsed = tripDate(value);
    const ambiguousTeens =
      /(?:teens?|teenagers?|青少年)[^.;。]{0,26}(?:age[ds]?|ages?|年龄|岁)[^.;。]{0,18}\b(?:18|19)\b/i.test(
        value
      );
    if (parsed.problem || ambiguousTeens) {
      const msg = ambiguousTeens
        ? t(
            "For hotel occupancy, write guests aged 18 or over as adults and list the under-18 count separately.",
            "酒店入住人数请将已满 18 岁的旅客计为成人，并单列未满 18 岁的人数。"
          )
        : parsed.problem === "relative"
        ? t(
            "Please write a calendar date with a year in your brief so everyone uses the same travel day.",
            "请在描述中写明含年份的日期，以便同行人确认同一个出行日。"
          )
        : parsed.problem === "year"
        ? t(
            "Include a four-digit year in your trip brief (e.g. July 12, 2027).",
            "请在出行描述中写明四位年份，例如 2027年7月12日。"
          )
        : t(
            "That calendar date does not exist. Correct the date in your trip brief.",
            "这个日期不存在，请修改出行描述中的日期。"
          );
      message(tripStatus, msg, true);
      brief.setCustomValidity(msg);
      composer.setCustomValidity(msg);
      (brief.isConnected ? brief : composer).reportValidity();
      return false;
    }
    brief.setCustomValidity("");
    composer.setCustomValidity("");
    const places = [
      ["sf", /san francisco|旧金山|旧金山市|三藩市/i],
      ["sea", /seattle|西雅图/i],
      [
        "dc",
        /washington[,\s]*(?:d\.?\s?c\.?|district)|washington dc|华盛顿特区|华盛顿哥伦比亚特区/i,
      ],
    ];
    const names = places.filter(([, re]) => re.test(value));
    const moved = names.length === 1 && newCity(names[0][0]);
    const matches = [
      /one[\s-]+day|\b1[\s-]*day|一[天日]|1\s*天/i,
      /two[\s-]+days?|\b2[\s-]*days?|[两二]天|2\s*天/i,
      /three[\s-]+days?|\b3[\s-]*days?|三[天日]|3\s*天/i,
      /four[\s-]+days?|\b4[\s-]*days?|四[天日]|4\s*天/i,
      /five[\s-]+days?|\b5[\s-]*days?|五[天日]|5\s*天/i,
      /six[\s-]+days?|\b6[\s-]*days?|六[天日]|6\s*天/i,
      /seven[\s-]+days?|\b7[\s-]*days?|七[天日]|7\s*天/i,
    ].map((re) => re.test(value));
    if (matches.filter(Boolean).length === 1)
      state.days = matches.indexOf(true) + 1;
    const map = {
      science: /scien|科学/i,
      nature: /nature|自然/i,
      art: /\bart\b|design|艺术|设计/i,
      history: /history|历史/i,
    };
    const requested = Object.keys(map).filter((key) => map[key].test(value));
    if (requested.length) state.interests = requested;
    const counts = {
      zero: 0,
      no: 0,
      零: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      一: 1,
      两: 2,
      二: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
    };
    const group = value.match(
      /(\d+|zero|no|one|two|three|four|[零一两二三四])\s*(?:个|名|位)?\s*(?:kids?|children|child\b|teens?\b|teenagers?\b|孩子|儿童|青少年|少年)/i
    );
    const grown = value.match(
      /(\d+|one|two|three|four|five|six|[一两二三四五六])\s*(?:名|位|个)?\s*(?:adults?|成人|大人)/i
    );
    if (
      /\b(?:adults?[ -]only|no (?:children|kids|teens))\b|仅成人|全是成人/i.test(
        value
      )
    ) {
      state.prefs.children = 0;
      state.prefs.ages = "";
    }
    if (group) {
      const n = Number(group[1]) || counts[group[1].toLowerCase()] || 0;
      if (n <= 4 && n !== state.prefs.children) {
        state.prefs.children = n;
        state.prefs.ages = "";
      }
    }
    if (grown) {
      const n = Number(grown[1]) || counts[grown[1].toLowerCase()];
      if (n >= 1 && n <= 6) state.prefs.adults = n;
    }
    if (parsed.date) state.start = parsed.date;
    document
      .querySelector("[data-editor-group]")
      ?.replaceWith(groupForEditor());
    state.appliedBrief = value;
    state.appliedBriefVersion = 2;
    state.activeDay = Math.min(state.activeDay, state.days - 1);
    changed();
    rerenderTrip();
    if (moved) loadWeather();
    message(
      tripStatus,
      city().name +
        " · " +
        t(
          state.days === 1 ? "1 day" : state.days + " days",
          state.days + " 天"
        ) +
        t(". Trip preferences updated.", "。出行偏好已更新。")
    );
  }
  brief.addEventListener("change", applyBrief);
  function example() {
    brief.value = t(
      "Two days in San Francisco with two kids. We like science and want indoor activities if it rains.",
      "带两个孩子去旧金山玩两天，喜欢科学，下雨想安排室内活动。"
    );
    state.brief = brief.value;
    state.appliedBrief = "";
    applyBrief();
  }
  const regions = {
    sf: t("California", "加利福尼亚州"),
    sea: t("Washington State", "华盛顿州"),
    dc: t("District of Columbia", "哥伦比亚特区"),
  };
  function dayLabel(date) {
    return new Intl.DateTimeFormat(t("en-US", "zh-CN"), {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(date + "T12:00:00Z"));
  }
  function tripLabel() {
    const last = plusDays(state.start, state.days - 1);
    return (
      dayLabel(state.start) +
      (state.days > 1 ? " – " + dayLabel(last) : "") +
      " · " +
      state.days +
      " " +
      t(state.days === 1 ? "day" : "days", "天")
    );
  }
  function groupForEditor() {
    const box = groupFields(state.prefs, () => {
      changed();
      booking.refresh();
      renderPlan();
    });
    box.dataset.editorGroup = "";
    return box;
  }
  function editTrip() {
    sheet(t("Edit trip", "编辑旅行"), (body, close) => {
      const done = btn(
        t("Done", "完成"),
        () => {
          if (applyBrief() !== false) close();
        },
        "primary"
      );
      body.append(
        field(t("Destination", "目的地"), citySelect),
        el(
          "div",
          { cls: "pair" },
          field(t("First day", "出发日期"), dateInput),
          field(t("Duration", "行程天数"), lengthSelect)
        ),
        groupForEditor(),
        field(t("Family trip brief", "家庭出行描述"), brief),
        el(
          "div",
          { cls: "actions" },
          btn(t("Use family example", "使用家庭示例"), example),
          btn(t("Apply trip brief", "应用出行描述"), applyBrief)
        ),
        el(
          "div",
          { cls: "field" },
          el("span", {}, t("Interests", "兴趣")),
          chips
        ),
        field(t("Budget or access needs", "预算或特殊要求"), budget),
        done
      );
    });
  }
  const banner = el(
    "section",
    { cls: "atlas-cover" },
    el("img", {
      src: coverURL(state.city),
      alt: "",
      width: 768,
      height: 512,
      fetchpriority: "high",
    }),
    el(
      "div",
      { cls: "atlas-cover-copy" },
      el("p", { cls: "kicker region-label" }),
      el("h1", { cls: "cover-city" }),
      el("p", { cls: "cover-dates" })
    ),
    action(t("Edit trip", "编辑旅行"), "sliders", editTrip, "cover-edit")
  );
  const wxQuick = action(
    t("Forecast", "天气预报"),
    "sun",
    () => tabs.select("weather"),
    "weather-quick"
  );
  const composer = el("textarea", {
    rows: 2,
    maxlength: 1200,
    value: state.brief,
    "aria-label": t("Describe your trip", "描述你的旅行"),
    placeholder: t(
      "Two days in San Francisco with two kids. We love science. Keep a rainy-day backup.",
      "带两个孩子去旧金山玩两天，喜欢科学，想要雨天备选。"
    ),
    oninput: (e) => {
      state.brief = brief.value = e.target.value;
      if (state.brief.trim() !== state.appliedBrief)
        state.appliedBriefVersion = 0;
      changed();
    },
  });
  const shortcuts = el(
    "section",
    { cls: "studio-composer" },
    el("h2", {}, t("Plan your field trip", "规划家庭之旅")),
    composer,
    el(
      "div",
      { cls: "composer-actions" },
      aiBtn,
      btn(
        t("Build a guide itinerary", "用城市指南生成行程"),
        () => makePlan("guide"),
        "subtle"
      ),
      wxQuick
    ),
    el(
      "div",
      { cls: "studio-links" },
      btn(
        t("Find hotel prices", "查询酒店价格"),
        () => {
          if (applyBrief() === false) return;
          tabs.select("bookings");
          if (!state.prefs.children) booking.search();
        },
        "text-btn"
      ),
      btn(t("Use family example", "使用家庭示例"), example, "text-btn")
    )
  );
  const booking = createBookings(
    () => ({
      city: city(),
      start: state.start,
      days: state.days,
      prefs: prefs(),
      day: state.activeDay,
      stops: stops(dates()[state.activeDay]),
    }),
    editTrip,
    (id) => {
      state.bases[state.city] = id;
      changed();
      booking.refresh();
      renderPlan();
    }
  );
  const refinement = el("textarea", {
    rows: 2,
    maxlength: 650,
    "aria-label": t("Change this day", "修改当天行程"),
    placeholder: t(
      "Keep the museum. Make the afternoon easier for my six-year-old.",
      "保留博物馆，让下午更适合六岁的孩子。"
    ),
  });
  const compactTitle = el("h1"),
    bar = el(
      "div",
      { cls: "trip-view-head" },
      el("div", {}, el("p", { cls: "kicker compact-trip-city" }), compactTitle),
      action(t("Edit trip", "编辑旅行"), "sliders", editTrip, "subtle")
    );
  const map = createPlaceMap(addToDay);
  const weatherPanel = card(
    t("Forecast details", "预报详情"),
    weatherBody,
    weatherStatus,
    retry
  );
  let filterMode = "all";
  const filters = el("div", {
    cls: "place-filters",
    "aria-label": t("Filter places", "筛选景点"),
  });
  const placeCount = el("span");
  const placesPanel = el(
    "section",
    { cls: "places-panel" },
    el(
      "div",
      { cls: "section-head" },
      el("h2", {}, t("Places to explore", "探索景点")),
      placeCount
    ),
    filters,
    catalog
  );
  const familyBtn = action(
    t("Family link", "家庭分享链接"),
    "share",
    () =>
      shareTrip(
        familyLink(
          location.href,
          state.city,
          state.start,
          dates().map(stops),
          prefs(),
          dates().map((d) => meta()[d] || {})
        )
      ),
    "primary"
  );
  const planPanel = el(
    "section",
    { cls: "plan-panel" },
    itinerary,
    el(
      "section",
      { cls: "studio-card refine-card" },
      el("h2", {}, t("Revise this day", "调整当天安排")),
      refinement,
      btn(
        t("Revise this day with AI", "用 AI 修改当天行程"),
        () => makePlan("revise"),
        "subtle"
      )
    ),
    el(
      "div",
      { cls: "plan-actions actions" },
      familyBtn,
      btn(t("Export itinerary", "导出行程"), exportTrip),
      btn(t("Save itinerary", "保存行程"), () => {
        if (persist())
          message(
            planStatus,
            t("Itinerary saved on this device.", "已保存到此设备。")
          );
      })
    ),
    planStatus
  );
  const work = el(
    "div",
    { cls: "atlas-workspace" },
    placesPanel,
    planPanel,
    weatherPanel,
    map.element,
    booking.element
  );
  const tabs = workspaceTabs(
    t("Atlas navigation", "旅行导航"),
    [
      ["explore", t("Explore", "探索"), "compass"],
      ["map", t("Map", "地图"), "map"],
      ["itinerary", t("My trip", "行程"), "route"],
      ["weather", t("Weather", "天气"), "sun"],
      ["bookings", t("Bookings", "预订"), "cards"],
    ],
    (key, chosen) => {
      work.dataset.view = key;
      if (chosen && (key === "map" || key === "itinerary")) {
        tripOpened = true;
        renderCatalog();
      }
      if (key === "itinerary") renderPlan();
      banner.hidden = shortcuts.hidden = key !== "explore";
      bar.hidden = key === "explore";
      compactTitle.textContent =
        {
          map: t("City map", "城市地图"),
          itinerary: t("My trip", "我的行程"),
          weather: t("Weather", "天气"),
          bookings: t("Bookings & transit", "预订与交通"),
        }[key] || "";
      placesPanel.hidden = key !== "explore";
      planPanel.hidden = key !== "itinerary";
      weatherPanel.hidden = key !== "weather";
      booking.element.hidden = key !== "bookings";
      if (key === "bookings") booking.refresh();
      map.element.hidden = key === "weather" || key === "bookings";
      dayRail.hidden = key === "weather";
    }
  );
  $("#app").append(
    ...(practice
      ? [
          small(
            t(
              "Class practice · this itinerary saves separately.",
              "课堂练习 · 此行程单独保存。"
            )
          ),
        ]
      : []),
    banner,
    shortcuts,
    bar,
    dayRail,
    tripStatus,
    work,
    tabs.element
  );
  function changeDay(i) {
    state.activeDay = i;
    persist();
    renderCatalog();
    renderPlan();
    renderWeather();
  }
  function venueImage(p, cls = "") {
    return el("img", {
      cls,
      src: asset("place-" + p.id + ".webp"),
      alt: "",
      width: 376,
      height: 332,
      loading: "lazy",
    });
  }
  function details(p) {
    sheet(p.name, (body, close) => {
      const date = dates()[state.activeDay],
        closed = closedOn(p, date),
        added = stops(date).some((s) => s.id === p.id);
      const add = action(
        added
          ? t("Already in my trip", "已在行程中")
          : t("Add to day ", "添加到第 ") + (state.activeDay + 1),
        "plus",
        () => {
          addToDay(p.id);
          close();
        },
        "primary"
      );
      add.disabled = added || closed;
      body.append(
        venueImage(p, "sheet-photo"),
        el(
          "p",
          { cls: "place-meta" },
          setting(p) + " · " + p.tags.map((k) => interests[k]).join(" / ")
        ),
        el("p", {}, p.description),
        small(p.area + " · " + p.minutes + " min"),
        small(p.tip),
        closed ? closureNotice(date) : "",
        link(feeAction(p) + " ↗", p.booking, true),
        el(
          "div",
          { cls: "actions" },
          add,
          action(
            t("Show on map", "地图定位"),
            "map",
            () => {
              close();
              tabs.select("map");
              map.select(p.id);
            },
            "subtle"
          )
        ),
        link(t("Official site ↗", "官方网站 ↗"), p.url, true)
      );
    });
  }
  function closureNotice(date) {
    return el(
      "small",
      { cls: "closed-note" },
      t("Known closure · ", "已知闭馆日 · ") + date
    );
  }
  function addToDay(id) {
    const date = dates()[state.activeDay],
      place = findPlace(id);
    if (
      !place ||
      closedOn(place, date) ||
      stops(date).some((stop) => stop.id === id)
    )
      return;
    tripOpened = true;
    plan()[date] = [...stops(date), { id, reason: "manual" }];
    changed();
    renderPlan();
    renderCatalog();
    message(
      tripStatus,
      place.name +
        t(" added to day ", " 已添加到第 ") +
        (state.activeDay + 1) +
        t(".", " 天。")
    );
  }
  function renderCatalog() {
    const days = dates(),
      date = days[state.activeDay];
    dayRail.replaceChildren(
      ...days.map((d, i) => {
        const b = btn("", () => changeDay(i), "day-chip");
        b.setAttribute("aria-pressed", String(i === state.activeDay));
        b.append(
          el("strong", {}, t("Day " + (i + 1), "第 " + (i + 1) + " 天")),
          el("span", {}, dayLabel(d))
        );
        return b;
      })
    );
    const choices = [
      ["all", t("All", "全部")],
      ["in", t("Indoors", "室内")],
      ["out", t("Outdoors", "室外")],
    ];
    filters.replaceChildren(
      ...choices.map(([id, name]) => {
        const b = btn(
          name,
          () => {
            filterMode = id;
            renderCatalog();
          },
          "filter-chip"
        );
        b.setAttribute("aria-pressed", String(id === filterMode));
        return b;
      })
    );
    const entries = city().places.filter(
      (p) => filterMode === "all" || p.inside === (filterMode === "in")
    );
    placeCount.textContent = entries.length + " " + t("places", "处");
    catalog.replaceChildren(
      ...entries.map((p) => {
        const closed = closedOn(p, date),
          added = stops(date).some((s) => s.id === p.id);
        const open = btn("", () => details(p), "venue-open");
        open.append(
          venueImage(p),
          el(
            "div",
            { cls: "venue-copy" },
            el(
              "span",
              { cls: "place-meta" },
              setting(p) + " · " + interests[p.tags[0]]
            ),
            el("h3", {}, p.name),
            closed ? closureNotice(date) : null
          )
        );
        const add = btn("", () => addToDay(p.id), "place-plus");
        add.append(icon(added ? "check" : "plus"));
        add.disabled = added || closed;
        const title = closed
          ? p.name + t(" closed on ", " 当天闭馆 ") + date
          : added
          ? p.name + t(" already added", " 已添加")
          : t("Add ", "添加 ") +
            p.name +
            t(" to day ", " 到第 ") +
            (state.activeDay + 1);
        add.setAttribute("aria-label", title);
        add.title = title;
        return el("article", { cls: "venue-card" }, open, add);
      })
    );
    booking.refresh();
    map.update({
      city: state.city,
      places: city().places,
      stops: tripOpened ? stops(date) : [],
      day: state.activeDay,
      date,
    });
  }
  function dayWeather(date) {
    const periods = forDay(forecast, date, city().zone);
    return periods.find((v) => v.daytime) || periods[0] || null;
  }
  function weatherLine(date) {
    const p = dayWeather(date);
    if (p)
      return (
        (weatherMode === "live" ? "NWS" : t("Cached NWS", "NWS 缓存")) +
        " · " +
        p.temp +
        " °" +
        p.unit +
        " · " +
        p.summary
      );
    return weatherMode === "loading"
      ? t("Checking NWS…", "正在查询 NWS…")
      : forecast
      ? t("Outside forecast coverage", "超出预报范围")
      : t("Forecast unavailable", "暂无可用预报");
  }
  function renderWeather() {
    const date = dates()[state.activeDay],
      wx = dayWeather(date);
    $("span", wxQuick).textContent = wx
      ? (weatherMode === "live" ? "NWS" : t("Cached", "缓存")) +
        " · " +
        wx.temp +
        " °" +
        wx.unit
      : t("Forecast", "天气预报");
    wxQuick.title = dayLabel(date) + " · " + weatherLine(date);
    weatherBody.replaceChildren(
      link(
        t(
          "Source · U.S. National Weather Service ↗",
          "来源 · 美国国家气象局 ↗"
        ),
        forecast?.url || pointsURL(city()),
        true
      )
    );
    const c = city(),
      periods = forecast?.periods;
    if (!periods?.length) {
      weatherBody.append(
        small(
          t(
            "No forecast available for this city yet. You can still build the itinerary.",
            "此城市暂时没有可用预报，仍可手动规划。"
          )
        )
      );
    } else {
      weatherBody.append(
        el(
          "span",
          { cls: "tag" },
          weatherMode === "live"
            ? t("NWS response", "NWS 实时请求")
            : t("Cached NWS response", "NWS 缓存")
        ),
        small(
          t("Forecast coverage: ", "预报覆盖：") +
            range(forecast, c.zone) +
            " · " +
            c.zone
        ),
        small(
          t("NWS updated: ", "NWS 更新时间：") +
            prettyTime(forecast.updated, c.zone) +
            " · " +
            t("Retrieved: ", "获取时间：") +
            prettyTime(forecast.fetched, c.zone)
        )
      );
      const days = el("div", { cls: "weather-days" });
      for (const date of dates()) {
        const applicable = forDay(forecast, date, c.zone);
        const box = el("div", { cls: "day-card" }, el("strong", {}, date));
        if (!applicable.length)
          box.append(
            small(
              t(
                "Outside available forecast coverage.",
                "超出可用预报日期范围。"
              )
            )
          );
        for (const p of applicable) {
          box.append(
            el(
              "div",
              { cls: "weather-period" },
              el(
                "strong",
                {},
                p.temp +
                  " °" +
                  p.unit +
                  " · " +
                  (p.daytime ? t("Day", "白天") : t("Night", "夜间"))
              ),
              el("p", { cls: "small" }, p.summary),
              small(localPeriod(p))
            )
          );
        }
        days.append(box);
      }
      weatherBody.append(days);
    }
    message(
      weatherStatus,
      weatherMode === "loading"
        ? t("Requesting the city forecast…", "正在请求该城市的预报…")
        : weatherMode === "error"
        ? (forecast
            ? t(
                "Could not refresh. Showing the timestamped cache. ",
                "刷新失败，正在显示带时间的上次缓存。 "
              )
            : t(
                "Forecast request failed. Retry when connected. ",
                "预报请求失败，可联网后重试。 "
              )) + weatherError
        : "",
      weatherMode === "error"
    );
    retry.disabled = weatherMode === "loading";
  }
  function loadWeather() {
    const id = ++requestId;
    controller?.abort();
    const ctl = new AbortController();
    controller = ctl;
    const c = city();
    forecast = cacheFor(c);
    weatherMode = "loading";
    weatherError = "";
    renderWeather();
    // A cold visit requires two official NWS requests, first the point and then its forecast.
    const timer = setTimeout(() => ctl.abort(), 35000);
    pendingWeather = (async () => {
      try {
        const data = await fetchForecast(c, ctl.signal);
        if (id !== requestId) return;
        forecast = data;
        weatherMode = "live";
      } catch (e) {
        if (id !== requestId) return;
        weatherMode = "error";
        weatherError =
          e.name === "AbortError"
            ? t("NWS timed out.", "NWS 请求超时。")
            : e instanceof TypeError
            ? t(
                "Check network access to api.weather.gov.",
                "请检查 api.weather.gov 的网络连接。"
              )
            : e.message;
      } finally {
        clearTimeout(timer);
        if (id === requestId) {
          renderWeather();
          renderPlan();
        }
      }
    })();
    return pendingWeather;
  }
  function indoorSwap(date, id) {
    const original = findPlace(id),
      cityId = state.city;
    if (!original) return;
    sheet(t("Indoor alternatives", "室内备选"), (body, close) => {
      body.append(
        el(
          "p",
          { cls: "swap-target" },
          t("Replace ", "替换 ") + original.name + " · " + dayLabel(date)
        ),
        small(weatherLine(date))
      );
      const eligible = city().places.filter(
        (p) =>
          p.inside &&
          !closedOn(p, date) &&
          p.id !== id &&
          !stops(date).some((s) => s.id === p.id)
      );
      if (!eligible.length) {
        body.append(
          small(
            t(
              "Every indoor option in this city is already on this day.",
              "此城市所有室内备选都已加入当天行程。"
            )
          )
        );
        return;
      }
      let choice = null;
      const choices = el("div", {
        cls: "swap-list",
        role: "group",
        "aria-label": t("Choose an indoor stop", "选择室内景点"),
      });
      const status = notice(),
        confirm = btn(
          t("Replace this stop", "替换这一站"),
          () => {
            const list = stops(date),
              index = list.findIndex((s) => s.id === id),
              p = findPlace(choice);
            if (
              state.city !== cityId ||
              index < 0 ||
              !p?.inside ||
              list.some((s) => s.id === choice)
            ) {
              message(
                status,
                t(
                  "This day changed. Reopen the alternatives.",
                  "行程已改变，请重新打开备选。"
                ),
                true
              );
              return;
            }
            const updated = list.slice();
            updated[index] = { id: choice, reason: "swap", replacedId: id };
            plan()[date] = updated;
            changed();
            renderCatalog();
            renderPlan();
            close();
            message(
              planStatus,
              t("Replaced with ", "已替换为 ") + p.name + t(".", "。")
            );
          },
          "primary"
        );
      confirm.disabled = true;
      for (const p of eligible) {
        const pick = btn(
          "",
          () => {
            choice = p.id;
            for (const b of choices.querySelectorAll("button"))
              b.setAttribute("aria-pressed", String(b === pick));
            confirm.disabled = false;
          },
          "candidate"
        );
        pick.setAttribute("aria-pressed", "false");
        pick.append(
          venueImage(p),
          el("div", {}, el("strong", {}, p.name), small(p.description))
        );
        choices.append(
          el(
            "article",
            {},
            pick,
            link(t("Official site ↗", "官方网站 ↗"), p.url, true)
          )
        );
      }
      body.append(choices, confirm, status);
    });
  }
  function renderPlan() {
    const all = dates(),
      date = all[state.activeDay],
      list = stops(date),
      info = meta()[date] || {},
      c = city();
    const hasSaved = all.some((d) => stops(d).length);
    const canShow = tripOpened && list.length > 0;
    planPanel.querySelector(".refine-card").hidden = !canShow;
    planPanel.querySelector(".plan-actions").hidden = !(tripOpened && hasSaved);
    if (!tripOpened && hasSaved) {
      itinerary.replaceChildren(
        el(
          "div",
          { cls: "empty-trip" },
          icon("route"),
          el("h2", {}, t("Your saved itinerary", "已保存的行程")),
          small(c.name + " · " + state.start),
          btn(
            t("Open saved itinerary", "打开已保存的行程"),
            () => tabs.select("itinerary"),
            "primary"
          )
        )
      );
      return;
    }
    if (
      info.source === "ai" &&
      !allowedInClass(
        JSON.stringify([info.title, list.map((stop) => stop.focus)])
      )
    ) {
      itinerary.replaceChildren(el("p", { role: "status" }, classroomNotice()));
      return;
    }
    const title =
      list.length && (!info.language || info.language === lang)
        ? info.title
        : "";
    const source = !list.length
      ? t("My trip", "我的行程")
      : info.source === "ai"
      ? t("AI itinerary", "AI 行程")
      : info.source === "guide"
      ? t("City guide itinerary", "城市指南行程")
      : t("Your itinerary", "自选行程");
    itinerary.replaceChildren(
      el(
        "header",
        { cls: "schedule-head" },
        el("p", { cls: "kicker" }, source + " · " + dayLabel(date)),
        el("h2", {}, title || dayLabel(date)),
        small(weatherLine(date) + " · " + c.zone)
      )
    );
    if (!list.length)
      itinerary.append(
        el(
          "div",
          { cls: "empty-trip" },
          icon("route"),
          el("h3", {}, t("Choose your first stop", "选择第一站")),
          el(
            "div",
            { cls: "actions" },
            btn(
              t("Explore places", "探索景点"),
              () => tabs.select("explore"),
              "subtle"
            ),
            btn(
              t("Build a guide itinerary", "用城市指南生成行程"),
              () => makePlan("guide"),
              "primary"
            )
          )
        )
      );
    else
      itinerary.append(
        small(
          t(
            "Suggested local times. Transfer blocks include a planning buffer. Check live departures and opening hours before leaving.",
            "以下为当地时间建议，每段交通已预留缓冲。出发前请核实实时班次与当日开放时段。"
          )
        )
      );
    const h = baseHotel();
    if (h && list.length)
      itinerary.append(
        el("p", { cls: "base-note" }, t("Home base · ", "出发酒店 · ") + h.name)
      );
    for (const item of timeline(c, date, list, prefs(), info)) {
      let controls;
      if (item.kind === "visit") {
        const p = item.place,
          i = item.index;
        function edit(delta) {
          const a = [...stops(date)],
            index = a.findIndex((v) => v.id === p.id);
          if (index < 0) return;
          if (!delta) a.splice(index, 1);
          else {
            const j = index + delta;
            if (j < 0 || j >= a.length) return;
            [a[index], a[j]] = [a[j], a[index]];
          }
          plan()[date] = a;
          changed();
          renderPlan();
          renderCatalog();
          message(planStatus, t("Changes saved.", "修改已保存。"));
        }
        const up = btn("↑", () => edit(-1)),
          down = btn("↓", () => edit(1));
        up.disabled = i === 0;
        down.disabled = i === list.length - 1;
        up.setAttribute("aria-label", t("Move up: ", "上移：") + p.name);
        down.setAttribute("aria-label", t("Move down: ", "下移：") + p.name);
        controls = el(
          "div",
          { cls: "actions stop-tools" },
          !p.inside
            ? action(
                t("Indoor alternatives", "室内备选"),
                "rain",
                () => indoorSwap(date, p.id),
                "rain-btn"
              )
            : null,
          up,
          down,
          btn(t("Remove", "移除"), () => edit(0))
        );
      }
      itinerary.append(activityRow(item, c, prefs(), controls));
    }
    itinerary.append(
      costEditor(all, state.activeDay, expenses(), changed),
      btn(
        t("Hotels, tickets & transportation", "酒店、门票与交通"),
        () => tabs.select("bookings"),
        "subtle"
      )
    );
    familyBtn.disabled = !all.some((d) => stops(d).length);
  }
  function showDraft(draft, stamp, source, request) {
    sheet(
      source === "guide"
        ? t("Preview your guide itinerary", "预览城市指南行程")
        : t("Preview your AI itinerary", "预览 AI 行程"),
      (body, close) => {
        const status = notice();
        body.append(
          el(
            "p",
            { cls: "trip-preview-group" },
            city().name +
              " · " +
              state.start +
              " · " +
              state.prefs.adults +
              t(state.prefs.adults === 1 ? " adult" : " adults", " 位成人") +
              " · " +
              state.prefs.children +
              t(" under 18", " 位未满18岁")
          )
        );
        for (const [date, d] of Object.entries(draft)) {
          const items = timeline(city(), date, d.stops, prefs(), d.meta);
          body.append(
            el(
              "article",
              { cls: "draft-day" },
              el("span", { cls: "place-meta" }, date),
              el("h3", {}, d.meta.title || city().name),
              ...items
                .filter((v) => ["visit", "meal"].includes(v.kind))
                .map((v) =>
                  el(
                    "p",
                    {},
                    el("time", {}, timeLabel(v.start) + " "),
                    v.place.name,
                    v.kind === "meal" ? t(" · Meal", " · 用餐") : ""
                  )
                )
            )
          );
        }
        function apply(target) {
          if (revision !== stamp) {
            message(
              status,
              t(
                "Your trip changed. Close this preview and build it again.",
                "行程已更改，请关闭预览并重新生成。"
              ),
              true
            );
            return;
          }
          tripOpened = true;
          for (const [d, v] of Object.entries(draft)) {
            plan()[d] = v.stops;
            meta()[d] = v.meta;
          }
          if (request) {
            const history = state.requests[state.city] || [];
            state.requests[state.city] = [
              ...history,
              { date: dates()[state.activeDay], request },
            ].slice(-4);
            refinement.value = "";
          }
          changed();
          renderPlan();
          renderCatalog();
          close();
          tabs.select(target);
          if (target === "bookings" && !state.prefs.children) booking.search();
          message(
            planStatus,
            source === "guide"
              ? t(
                  "Built from the verified city guide and saved.",
                  "已按已核查城市指南生成并保存。"
                )
              : t(
                  "Model itinerary saved. Adjust any day below.",
                  "已保存模型生成的行程，可继续调整。"
                )
          );
        }
        body.append(
          btn(
            t("Use this itinerary", "采用这份行程"),
            () => apply("itinerary"),
            "primary"
          ),
          ...(state.days > 1
            ? [
                btn(
                  t("Use itinerary & check rooms", "采用行程并查房"),
                  () => apply("bookings"),
                  "subtle"
                ),
              ]
            : []),
          btn(t("Keep my current trip", "保留原行程"), close, "subtle"),
          status
        );
      }
    );
  }
  async function makePlan(mode = "ai") {
    if (planning || applyBrief() === false) return;
    const revise = mode === "revise",
      request = revise ? refinement.value.trim() : "";
    if (revise && !request) {
      message(
        planStatus,
        t(
          "Describe one change for this day.",
          "请先写下希望怎样修改当天行程。"
        ),
        true
      );
      refinement.focus();
      return;
    }
    if (mode !== "guide") {
      try {
        [state.brief, state.budget, request, ...state.interests].forEach(
          checkClassroomText
        );
      } catch (e) {
        const target = revise ? planStatus : tripStatus;
        message(target, e.message, true);
        target.scrollIntoView({ block: "nearest" });
        return;
      }
    }
    const question = revise ? request : state.brief;
    const wantsItinerary =
      /itinerary|plan (?:a|my|our|the|both)|plan.{0,15}days|规划|安排行程|安排.{0,6}[天日]|行程/i.test(
        question
      );
    if (
      mode !== "guide" &&
      !wantsItinerary &&
      /(look up|search|check|compare|how much|find|查询|搜|比较|多少钱|查一下|帮我查).{0,22}(hotel price|room rate|hotel rate|hotel rooms?|rooms? for|hotel availability|酒店价格|酒店房价|酒店|房价)|(?:hotel prices?|room rates?|房价).{0,10}[?？]/i.test(
        question
      )
    ) {
      tabs.select("bookings");
      if (!state.prefs.children) booking.search();
      return;
    }
    if (
      mode !== "guide" &&
      !wantsItinerary &&
      /(?:check|look up|find|查询|查一下).{0,12}(?:transit fare|train fare|bus fare|departures|交通票价|公交票价|地铁票价|实时班次)/i.test(
        question
      )
    ) {
      tabs.select("bookings");
      booking.element
        .querySelector(".transit-board")
        ?.scrollIntoView({ block: "start" });
      return;
    }
    if (mode !== "guide" && !configured()) {
      openAISettings();
      message(
        tripStatus,
        t(
          "Connect a class gateway to use the AI planner. Build a guide itinerary is also available.",
          "连接班级网关即可使用 AI。也可先用城市指南生成行程。"
        )
      );
      return;
    }
    const stamp = revision,
      c = city(),
      all = dates(),
      target = revise ? [all[state.activeDay]] : all;
    const status = revise ? planStatus : tripStatus;
    planning = true;
    aiBtn.disabled = true;
    const job =
      mode === "guide"
        ? null
        : startGeneration(
            revise
              ? t("Revising your day", "正在调整当天行程")
              : t("Planning your trip", "正在生成行程"),
            t("Checking the available NWS forecast", "正在核对可用的 NWS 预报")
          );
    message(
      status,
      mode === "guide"
        ? t("Building from the city guide…", "正在整理城市指南…")
        : t(
            "Checking forecast and planning the requested days…",
            "正在核对预报并规划所选日期…"
          )
    );
    try {
      if (job && weatherMode === "loading")
        await untilCancelled(pendingWeather, job.signal);
      job?.signal.throwIfAborted();
      if (revision !== stamp)
        throw Error(
          t(
            "Your trip changed. Build again with the new settings.",
            "行程已更改，请按新设置重新生成。"
          )
        );
      const weather = Object.fromEntries(
        all.map((d) => [d, forDay(forecast, d, c.zone)])
      );
      const draft =
        mode === "guide"
          ? quickDraft(
              c,
              target,
              prefs(),
              state.interests,
              weather,
              state.brief
            )
          : await draftWithModel({
              city: c,
              dates: target,
              preferences: {
                adults: prefs().adults,
                children: prefs().children,
                mode: prefs().mode,
                pace: prefs().pace,
                startTime: prefs().startTime,
              },
              interests: state.interests,
              brief: state.brief,
              budget: state.budget,
              request,
              current: Object.fromEntries(all.map((d) => [d, stops(d)])),
              weather,
              weatherStatus: weatherMode,
              updated: forecast?.updated || null,
              base: baseHotel(),
              history: (state.requests[state.city] || []).filter((h) =>
                allowedInClass(h.request)
              ),
              stillCurrent: () => revision === stamp,
              job,
            });
      if (revision !== stamp)
        throw Error(
          t(
            "Edits were saved. Rebuild to use your changes.",
            "修改已保存，请按最新内容重新生成。"
          )
        );
      job?.signal.throwIfAborted();
      job?.finish();
      showDraft(draft, stamp, mode === "guide" ? "guide" : "ai", request);
      message(status, "");
    } catch (e) {
      message(
        status,
        job?.signal.aborted
          ? t(
              "Generation stopped. Your saved itinerary is still available.",
              "生成已停止，之前保存的行程仍可打开。"
            )
          : e.message || t("The planner could not finish.", "本次规划未完成。"),
        !job?.signal.aborted
      );
      status.scrollIntoView({ block: "nearest" });
    } finally {
      job?.finish();
      planning = false;
      aiBtn.disabled = false;
    }
  }
  function exportTrip() {
    if (
      dates().some(
        (d) =>
          meta()[d]?.source === "ai" &&
          !allowedInClass(
            JSON.stringify([meta()[d]?.title, stops(d).map((s) => s.focus)])
          )
      )
    ) {
      message(planStatus, classroomNotice(), true);
      return;
    }
    const c = city(),
      all = dates(),
      h = baseHotel(),
      stay = nightsFor(state.start, state.days),
      fare = fareInfo(c, state.start);
    const lines = [
      "# Field Trip Atlas · " + c.name,
      state.start + " → " + stay.checkOut + " · " + c.zone,
      state.brief,
      state.budget,
      "",
      t("Transportation", "交通") + " · " + fare.text,
      fare.url,
      c.transit.planner,
      c.transit.live,
      c.transit.tickets,
      t("NWS forecast", "NWS 天气") + " · " + (forecast?.url || pointsURL(c)),
      t("Fetched", "获取时间") +
        " " +
        (forecast?.fetched || "—") +
        " · " +
        weatherMode,
    ];
    if (h)
      lines.push(
        "",
        t("Home base", "出发酒店") + " · " + h.name,
        h.why,
        bookingURL(h, stay, prefs())
      );
    lines.push(
      "",
      t(
        "Suggested times and travel buffers. Check departures, admission, and room terms before setting out.",
        "行程时间和交通缓冲均为建议，出发前核对班次、门票与订房条款。"
      )
    );
    for (const [i, date] of all.entries()) {
      const info = meta()[date] || {},
        values = expenses()[date] || {},
        subtotal = budgetTotal(values, i < all.length - 1);
      lines.push(
        "",
        "## " + t("Day ", "第 ") + (i + 1) + " · " + date,
        "",
        info.title || "",
        weatherLine(date)
      );
      const parts = timeline(c, date, stops(date), prefs(), info);
      if (!parts.length) lines.push(t("No stops planned.", "还未添加景点。"));
      for (const a of parts) {
        const time = timeLabel(a.start) + "–" + timeLabel(a.end) + " · ";
        if (a.kind === "leg")
          lines.push(
            "",
            time + modeName(a.mode) + " · " + a.from.name + " → " + a.to.name,
            a.url
          );
        else if (a.kind === "meal")
          lines.push(
            "",
            time + t("Meal · ", "用餐 · ") + a.place.name,
            a.place.detail,
            a.place.url
          );
        else if (a.kind === "visit")
          lines.push(
            "",
            time + a.place.name,
            a.stop.focus && a.stop.focusLang === lang
              ? a.stop.focus
              : a.place.description,
            a.place.tip,
            a.place.admission || "",
            feeAction(a.place) + " " + a.place.booking,
            osmPlaceURL(a.place)
          );
        else
          lines.push(
            time +
              (a.kind === "wait"
                ? t("Before regular opening", "常规开馆前预留时间")
                : t("Rest break", "休息"))
          );
      }
      lines.push("", t("Family budget (USD)", "家庭预算（美元）"));
      for (const [key, name] of Object.entries(budgetNames))
        if (key !== "lodging" || i < all.length - 1)
          lines.push(
            "- " +
              name +
              " · " +
              (typeof values[key] === "number"
                ? usd(values[key])
                : t("unfilled", "待填"))
          );
      lines.push(t("Known subtotal ", "已知小计 ") + usd(subtotal.sum));
    }
    download(
      "field-trip-" + state.city + "-" + state.start + ".md",
      lines.join("\n")
    );
    message(planStatus, t("Itinerary exported.", "行程已导出。"));
  }
  syncForm();
  renderCatalog();
  renderPlan();
  tabs.start("explore");
  loadWeather();
}
