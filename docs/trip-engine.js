import { t, lang, plusDays } from "./common.js";

export const MAX_DAYS = 7;
export const dateList = (first, count) =>
  Array.from({ length: count }, (_, i) => plusDays(first, i));
export const nightsFor = (start, days) => ({
  checkIn: start,
  checkOut: plusDays(start, Math.max(0, days - 1)),
  nights: Math.max(0, days - 1),
});
export const usd = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n
  );
export function closedOn(place, date) {
  if (place.openExceptions?.includes(date)) return false;
  return Boolean(
    place.exceptions?.includes(date) ||
      place.datesClosed?.includes(date.slice(5)) ||
      place.closed?.includes(new Date(date + "T12:00Z").getUTCDay())
  );
}
export function kmBetween(a, b) {
  if (!a?.point || !b?.point) return null;
  const [aLat, aLon] = a.point.map((v) => (v * Math.PI) / 180),
    [bLat, bLon] = b.point.map((v) => (v * Math.PI) / 180);
  const h =
    Math.sin((aLat - bLat) / 2) ** 2 +
    Math.cos(aLat) * Math.cos(bLat) * Math.sin((aLon - bLon) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(Math.min(1, h)));
}
function mapPoint(p, city) {
  return (
    p.address ||
    (p.point ? p.point.join(",") : (p.english || p.name) + ", " + city.english)
  );
}
export function directions(a, b, mode, city) {
  const u = new URL("https://www.google.com/maps/dir/");
  u.searchParams.set("api", "1");
  if (a) u.searchParams.set("origin", mapPoint(a, city));
  u.searchParams.set("destination", mapPoint(b, city));
  u.searchParams.set("travelmode", mode);
  return u.href;
}
export function bookingURL(h, stay, party) {
  const u = new URL(h.booking);
  if (!stay.nights || !["cloudbeds", "synxis"].includes(h.engine))
    return u.href;
  const cb = h.engine === "cloudbeds";
  const args = cb
    ? {
        checkin: stay.checkIn,
        checkout: stay.checkOut,
        adults: party.adults,
        kids: party.children,
        currency: "usd",
      }
    : {
        arrive: stay.checkIn,
        depart: stay.checkOut,
        adult: party.adults,
        child: party.children,
        rooms: 1,
      };
  for (const [key, val] of Object.entries(args)) u.searchParams.set(key, val);
  return u.href;
}
export function feeAction(p) {
  if (/free-timed/i.test(p.kind))
    return t("Reserve free entry", "预约免费时段");
  if (/tickets|paid/i.test(p.kind))
    return t("Tickets & availability", "门票与可订时段");
  if (p.kind === "optional-undercroft")
    return t("Entry & optional tour", "参观及可选导览");
  return t("Visitor information", "参观信息");
}
export const modeName = (mode) =>
  ({
    walking: t("Walk", "步行"),
    transit: t("Public transit", "公共交通"),
    driving: t("Drive", "驾车"),
  }[mode]);
export function chosenMode(a, b, prefs) {
  const d = kmBetween(a, b);
  return prefs.mode === "walking" || prefs.mode === "driving"
    ? prefs.mode
    : d !== null && d <= (prefs.pace === "easy" ? 0.65 : 1.1)
    ? "walking"
    : "transit";
}
export function timeLabel(minute) {
  const m = ((minute % 1440) + 1440) % 1440;
  return (
    String(Math.floor(m / 60)).padStart(2, "0") +
    ":" +
    String(m % 60).padStart(2, "0") +
    (minute >= 1440 ? " (+" + Math.floor(minute / 1440) + ")" : "")
  );
}
export const defaultPrefs = {
  adults: 2,
  children: 0,
  ages: "",
  mode: "transit",
  pace: "balanced",
  startTime: "09:30",
  hotel: "",
};
export function partyAges(prefs) {
  const ages = String(prefs.ages || "")
    .trim()
    .split(/[,，\s]+/)
    .filter(Boolean);
  if (
    ages.length !== prefs.children ||
    ages.some((s) => !/^\d{1,2}$/.test(s) || Number(s) > 17)
  )
    return null;
  return ages.map(Number);
}
export function fareInfo(city, date) {
  if (city.id === "sf") {
    const next = date >= "2027-01-04";
    return {
      text:
        (next
          ? t(
              "Regular Muni $3 per adult ride. All-day Muni without cable cars $6.",
              "普通 Muni 成人单程 $3，不含缆车的一日通票 $6。"
            )
          : t(
              "Regular Muni $2.85 tap or $3 cash per adult ride. Day pass excluding cable cars $5.70.",
              "普通 Muni 成人刷卡 $2.85，现金 $3，不含缆车的一日通票 $5.70。"
            )) +
        t(
          " Ages 18 and under ride regular Muni free. Cable cars and BART have separate fares.",
          " 18 岁及以下乘普通 Muni 免费。缆车与 BART 另计。"
        ),
      url: next ? city.transit.source2 : city.transit.fares,
    };
  }
  if (city.id === "sea")
    return {
      text: t(
        "Link 1 and 2 Lines: $3 one way for ages 19–64. Ages 18 and under ride free. Separate operators and the Monorail have different fares.",
        "Link 1、2 号轻轨 19–64 岁单程 $3，18 岁及以下免费。其他运营商和单轨列车另计。"
      ),
      url: city.transit.fares,
    };
  return { text: city.transit.description, url: city.transit.fares };
}
export function transfer(a, b, prefs, city) {
  const distance = kmBetween(a, b),
    mode = chosenMode(a, b, prefs);
  const raw =
    distance === null
      ? 30
      : mode === "walking"
      ? (distance * 1.32) / 0.068 + 5
      : mode === "driving"
      ? (distance * 1.35) / 0.4 + 12
      : (distance * 1.4) / 0.33 + 20;
  return {
    mode,
    minutes: Math.max(5, Math.ceil(raw / 5) * 5),
    distance,
    url: directions(a, b, mode, city),
  };
}
function nearMeal(city, prev, next) {
  return [...city.meals].sort((a, b) => score(a) - score(b))[0];
  function score(m) {
    const d = kmBetween(prev, m),
      after = kmBetween(m, next);
    return (
      (d ?? (prev?.area === m.area ? 0 : 4)) +
      (after ?? (next?.area === m.area ? 0 : 4))
    );
  }
}
export function timeline(city, date, stops, prefs, meta = {}) {
  const items = [],
    places = stops
      .map((s) => ({ s, p: city.places.find((p) => p.id === s.id) }))
      .filter((x) => x.p);
  if (!places.length) return items;
  const [hour, min] = prefs.startTime.split(":").map(Number);
  const base = city.hotels.find((h) => h.id === prefs.hotel);
  let cursor = hour * 60 + min,
    last = base || null,
    lunched = false;
  function add(kind, minutes, bits) {
    items.push({
      kind,
      start: cursor,
      end: cursor + minutes,
      minutes,
      ...bits,
    });
    cursor += minutes;
  }
  function travelTo(p) {
    if (last && last.id !== p.id) {
      const leg = transfer(last, p, prefs, city);
      add("leg", leg.minutes, { from: last, to: p, ...leg });
    }
    last = p;
  }
  function lunch(prev, next) {
    const m =
      city.meals.find((x) => x.id === meta.mealId) ||
      nearMeal(city, prev, next);
    if (!m) return;
    const distance = kmBetween(prev, m);
    if (distance !== null && distance > 3 && !meta.mealId) {
      add("meal", 45, {
        place: {
          name: t("Lunch near ", "就近午餐 · ") + prev.name,
          detail: t(
            "Leave time for a nearby café. Open the map to compare current options and menus.",
            "预留就近用餐时间，在地图上核对附近餐厅与菜单。"
          ),
          url:
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(
              "food near " + (prev.english || prev.name) + ", " + city.english
            ),
        },
      });
      lunched = true;
      return;
    }
    travelTo(m);
    add("meal", m.minutes || 45, { place: m });
    lunched = true;
  }
  for (const [i, { p, s }] of places.entries()) {
    if (
      i > 0 &&
      !lunched &&
      (cursor >= 690 || i === Math.ceil(places.length / 2))
    )
      lunch(last, p);
    travelTo(p);
    const hours = p.dateHours?.[date] ||
      p.weekHours?.[new Date(date + "T12:00Z").getUTCDay()] || [
        p.opens,
        p.closes,
      ];
    if (Number.isFinite(hours[0]) && cursor < hours[0])
      add("wait", hours[0] - cursor, { place: p });
    const minutes =
      Number.isInteger(s.minutes) && s.minutes >= 20 && s.minutes <= 240
        ? s.minutes
        : p.minutes;
    add("visit", minutes, {
      place: p,
      stop: s,
      index: i,
      closed: closedOn(p, date),
      late: Number.isFinite(hours[1]) && cursor + minutes > hours[1],
    });
    if (prefs.pace === "easy" && i < places.length - 1) add("break", 15, {});
  }
  if (!lunched && cursor >= 705 && cursor <= 840) lunch(last, null);
  if (base && last && last.id !== base.id) travelTo(base);
  return items;
}
export function weatherWet(periods) {
  return (periods || []).some((p) =>
    /rain|shower|thunderstorm|drizzle|snow/i.test(p.summary || "")
  );
}
export function quickDraft(
  city,
  dates,
  prefs,
  interests,
  weather,
  brief = "",
  excluded = []
) {
  const used = new Set(excluded),
    result = {};
  for (const [i, date] of dates.entries()) {
    const wet = weatherWet(weather[date]),
      selected = [],
      chosen = [];
    const desired = prefs.pace === "easy" ? 2 : prefs.pace === "full" ? 4 : 3;
    const available = city.places.filter((p) => !closedOn(p, date));
    const unvisited = available.filter((p) => !used.has(p.id));
    const count = Math.max(
      1,
      Math.min(desired, Math.ceil(unvisited.length / (dates.length - i)))
    );
    for (let n = 0; n < count; n++) {
      const rank = (p) =>
        p.tags.filter((x) => interests.includes(x)).length * 4 +
        (wet && p.inside ? 6 : 0) +
        (p.inside && /(rain|雨)/i.test(brief) ? 0.5 : 0) +
        (/free|免费|budget/i.test(brief) && /free|walk-in|park/i.test(p.kind)
          ? 2
          : 0) -
        (used.has(p.id) ? 100 : 0) -
        (chosen.length ? (kmBetween(chosen.at(-1), p) ?? 3) * 1.6 : 0);
      const next = available
        .filter((p) => !chosen.includes(p))
        .sort((a, b) => rank(b) - rank(a))[0];
      if (!next) break;
      chosen.push(next);
      used.add(next.id);
      selected.push({
        id: next.id,
        reason:
          wet && next.inside
            ? "rain"
            : next.tags.find((x) => interests.includes(x)) || "explore",
        minutes: next.minutes,
      });
    }
    result[date] = {
      stops: selected,
      meta: {
        source: "guide",
        title: chosen
          .slice(0, 2)
          .map((p) => p.area)
          .filter((x, j, all) => all.indexOf(x) === j)
          .join(" + "),
      },
    };
  }
  return result;
}
export function validateDraft(raw, city, dates, preferences) {
  const bad = () =>
    new Error(
      t(
        "The proposed plan included a missing date, a closed or unknown venue, or invalid timing. Your saved trip is intact.",
        "建议中含缺失日期、闭馆或未知地点，或停留时长无效。已保存的行程仍可使用。"
      )
    );
  if (!Array.isArray(raw?.days) || raw.days.length !== dates.length)
    throw bad();
  const result = {};
  const prose = (v, max) =>
    typeof v === "string" &&
    v.trim().length <= max &&
    !/(https?:|[$¥￥€£]|\b(?:USD|costs?|opens? at|closes? at|depart(?:s|ures?) at|tickets? (?:are|is) available)\b|\d{1,2}[:：]\d{2}|\d+\s*(?:美元|元|美金)|售价|票价为|开馆时间|余票)/i.test(
      v
    )
      ? v.trim()
      : "";
  for (const d of raw.days) {
    if (
      !d ||
      !dates.includes(d.date) ||
      Object.hasOwn(result, d.date) ||
      !Array.isArray(d.stops) ||
      d.stops.length < 1 ||
      d.stops.length > 5 ||
      new Set(d.stops.map((s) => s?.id)).size !== d.stops.length
    )
      throw bad();
    const stops = d.stops.map((s) => {
      const p = city.places.find((x) => x.id === s?.id);
      if (
        !p ||
        closedOn(p, d.date) ||
        !Number.isInteger(s.minutes) ||
        s.minutes < 20 ||
        s.minutes > 240
      )
        throw bad();
      return {
        id: p.id,
        reason: "explore",
        minutes: s.minutes,
        focus: prose(s.focus, 260),
        focusLang: lang,
      };
    });
    if (d.mealId && !city.meals.some((m) => m.id === d.mealId)) throw bad();
    result[d.date] = {
      stops,
      meta: {
        source: "ai",
        title: prose(d.title, 95),
        language: lang,
        mealId: d.mealId || "",
      },
    };
    if (preferences) {
      const blocks = timeline(
        city,
        d.date,
        stops,
        preferences,
        result[d.date].meta
      );
      const span = blocks.at(-1).end - blocks[0].start;
      if (
        span >
          ({ easy: 480, balanced: 600, full: 720 }[preferences.pace] || 600) ||
        blocks.at(-1).end > 1440 ||
        blocks.some((b) => b.late)
      )
        throw new Error(
          t("Shorten or reorder the visits on ", "请缩短或调整当日安排 ") +
            d.date +
            t(
              " to fit the pace and published closing times.",
              "，以符合所选节奏和公布的闭馆时间。"
            )
        );
    }
  }
  return result;
}
export function budgetTotal(values, nights) {
  const entries = ["lodging", "food", "tickets", "transport"].map((k) => [
    k,
    k === "lodging" && !nights ? 0 : values?.[k],
  ]);
  const known = entries.filter(
    ([, v]) => typeof v === "number" && Number.isFinite(v) && v >= 0
  );
  return {
    sum: Math.round(known.reduce((n, [, v]) => n + v, 0) * 100) / 100,
    known: known.length,
    total: entries.length,
  };
}
