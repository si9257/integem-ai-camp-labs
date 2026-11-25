// Read-only OBO Travel hotel inventory. No model, payment or booking credentials are sent.
export const OBO = "https://onebookingonline.com/mcp";
export const quoteLifetime = 30 * 60 * 1000;
const cities = { sf: "San Francisco", sea: "Seattle", dc: "Washington, DC" };
const centers = {
  sf: [37.794, -122.415],
  sea: [47.608, -122.335],
  dc: [38.895, -77.036],
};
const destinationIds = {
  sf: "eyJ0IjoiY2l0eSIsIm4iOiJTYW4gRnJhbmNpc2NvIiwiYyI6IlVTIn0",
  sea: "eyJ0IjoiY2l0eSIsIm4iOiJTZWF0dGxlIiwiYyI6IlVTIn0",
};
function nearby(q, h) {
  const point = h.hotel || h,
    lat = point.latitude,
    lon = point.longitude;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  const [x, y] = centers[q.city];
  return (
    Math.hypot(
      (lat - x) * 111,
      (lon - y) * 111 * Math.cos((x * Math.PI) / 180)
    ) <= 13
  );
}
function day(s) {
  return (
    /^\d{4}-\d\d-\d\d$/.test(s) &&
    Number.isFinite(Date.parse(s + "T12:00Z")) &&
    new Date(s + "T12:00Z").toISOString().slice(0, 10) === s
  );
}
export function validSearch(q) {
  return Boolean(
    q &&
      Object.hasOwn(cities, q.city) &&
      day(q.checkIn) &&
      day(q.checkOut) &&
      q.checkOut > q.checkIn &&
      Date.parse(q.checkOut) - Date.parse(q.checkIn) <= 7 * 86400000 &&
      Number.isInteger(q.adults) &&
      q.adults >= 1 &&
      q.adults <= 6 &&
      Array.isArray(q.ages) &&
      q.ages.length <= 4 &&
      q.ages.every((n) => Number.isInteger(n) && n >= 0 && n <= 17)
  );
}
export function humanSearch(q) {
  const u = new URL("https://onebookingonline.com/search");
  u.searchParams.set("destination", cities[q.city]);
  u.searchParams.set("check_in", q.checkIn);
  u.searchParams.set("check_out", q.checkOut);
  u.searchParams.set("adults", q.adults);
  u.searchParams.set("rooms", "1");
  if (q.city === "sf") u.searchParams.set("city_id", "403198");
  if (q.city === "sea") u.searchParams.set("city_id", "159419");
  return u.href;
}
export function requestFor(q) {
  if (!validSearch(q)) throw Error("Invalid hotel search");
  return {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: "search_hotels",
      arguments: {
        ...(destinationIds[q.city]
          ? { destination_id: destinationIds[q.city] }
          : {}),
        latitude: centers[q.city][0],
        longitude: centers[q.city][1],
        max_distance_km: 12,
        country: "US",
        ...(Number.isFinite(q.budget) && q.budget > 0
          ? { max_total_price: q.budget }
          : {}),
        ...(q.refundable ? { refundable_only: true } : {}),
        check_in: q.checkIn,
        check_out: q.checkOut,
        adults: q.adults,
        children: q.ages.length,
        children_ages: q.ages,
        rooms: [{ adults: q.adults, children: q.ages }],
        currency: "USD",
        limit: 4,
        sort: "price_low_to_high",
      },
    },
  };
}
function externalOffer(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" &&
      ["onebookingonline.com", "www.onebookingonline.com"].includes(
        u.hostname
      ) &&
      !u.username &&
      !u.password &&
      u.port === ""
      ? value
      : null;
  } catch {
    return null;
  }
}
function parseEnvelope(text) {
  if (text.trimStart().startsWith("{")) return JSON.parse(text);
  for (const event of text.split(/\r?\n\r?\n/)) {
    const data = event
      .split(/\r?\n/)
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trimStart())
      .join("\n");
    if (data && data !== "[DONE]") {
      const v = JSON.parse(data);
      if (v.result || v.error) return v;
    }
  }
  throw Error("Unreadable supplier reply");
}
function noteText(value) {
  if (value == null || value === "") return "";
  if (typeof value === "string" || typeof value === "number")
    return String(value).slice(0, 650);
  if (Array.isArray(value))
    return value.slice(0, 8).map(noteText).filter(Boolean).join(" · ");
  if (typeof value === "object")
    return Object.entries(value)
      .slice(0, 10)
      .map(
        ([k, v]) =>
          k.replaceAll("_", " ") +
          ": " +
          (typeof v === "boolean" ? String(v) : noteText(v))
      )
      .join(", ")
      .slice(0, 650);
  return "";
}
export function parseOffers(text, now = Date.now(), q) {
  const packet = parseEnvelope(text);
  if (packet.error || packet.result?.isError || !packet.result)
    throw Error("Supplier search unavailable");
  let data = packet.result.structuredContent;
  if (!data) {
    const parts = (packet.result.content || []).filter(
      (v) => v.type === "text"
    );
    for (const part of parts) {
      try {
        data = JSON.parse(part.text);
        break;
      } catch {}
    }
  }
  if (data?.error || !data) throw Error("Unrecognized supplier result");
  if (
    q &&
    (data.ambiguous_destination === true ||
      (data.country && data.country !== "US") ||
      (data.check_in && data.check_in !== q.checkIn) ||
      (data.check_out && data.check_out !== q.checkOut) ||
      (data.stay &&
        (data.stay.adults !== q.adults ||
          data.stay.children !== q.ages.length)))
  )
    throw Error("Supplier returned a different stay");
  let root = data;
  for (let depth = 0; depth < 6 && !Array.isArray(root); depth++) {
    if (!root || typeof root !== "object") break;
    root =
      root.hotels ??
      root.results ??
      root.items ??
      root.offers ??
      root.data ??
      root.result ??
      root.properties;
  }
  if (!Array.isArray(root)) throw Error("Unrecognized inventory format");
  const prices = [];
  for (const h of root) {
    const url = externalOffer(h?.booking_url),
      name = h?.name || h?.hotel_name;
    const total =
      h?.total_price_usd ??
      (h?.currency === "USD" || h?.price_currency === "USD"
        ? h.total_price
        : undefined);
    if (
      (q && !nearby(q, h)) ||
      !url ||
      typeof name !== "string" ||
      total == null ||
      total === "" ||
      !Number.isFinite(Number(total)) ||
      Number(total) <= 0
    )
      continue;
    const fresh = [
      h?.price_checked_at,
      h?.quoted_at,
      h?.fetched_at,
      h?.freshness?.quoted_at,
      data?.freshness?.quoted_at,
      data?.price_checked_at,
    ]
      .map(Date.parse)
      .filter((n) => Number.isFinite(n) && n <= now);
    const quotedAt = Math.min(now, ...fresh);
    if (quotedAt + quoteLifetime <= now) continue;
    const notes =
      h.price?.inclusions_note ||
      Object.entries({ ...h, ...(h.price || {}) })
        .filter(([k]) =>
          /tax|fee|extra_charge|price_note|mandatory|pay_at_property/i.test(k)
        )
        .map(([k, v]) => k.replaceAll("_", " ") + ": " + noteText(v))
        .join(" · ")
        .slice(0, 900);
    prices.push({
      name: name.slice(0, 140),
      total: Number(total),
      currency: "USD",
      url,
      notes,
      quotedAt,
      location: String(h.location_line || "").slice(0, 150),
      room: String(h.cheapest_offer_summary?.room || "").slice(0, 180),
      onRequest: h.cheapest_offer_summary?.on_request === true,
    });
    if (prices.length === 4) break;
  }
  if (root.length && !prices.length)
    throw Error("No verifiable recent stay totals in the reply");
  return {
    partial: data.partial === true,
    received: now,
    expires: Math.min(now, ...prices.map((x) => x.quotedAt)) + quoteLifetime,
    offers: prices,
  };
}
export async function readInventory(q, signal) {
  const res = await fetch(OBO, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify(requestFor(q)),
    credentials: "omit",
    cache: "no-store",
    signal,
    redirect: "error",
  });
  if (!res.ok) {
    const e = Error("OBO HTTP " + res.status);
    e.status = res.status;
    throw e;
  }
  const reader = res.body.getReader(),
    decoder = new TextDecoder();
  let bytes = 0,
    text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 1048576) {
      await reader.cancel();
      throw Error("Supplier reply too large");
    }
    text += decoder.decode(value, { stream: true });
  }
  return parseOffers(text + decoder.decode(), Date.now(), q);
}
