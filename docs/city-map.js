import { el, btn, link, t } from "./common.js";
import { setting } from "./places.js";

const TILE = 256;
const MIN_ZOOM = 9;
const MAX_ZOOM = 18;
const NS = "http://www.w3.org/2000/svg";
const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value));
const worldSize = (zoom) => TILE * 2 ** zoom;

// Fractional Web Mercator coordinates. Multiplying by the world size gives
// the same pixels as the official OSM raster tile grid at a given zoom.
export function project([lat, lon]) {
  const rad = (clamp(lat, -85.0511, 85.0511) * Math.PI) / 180;
  return [(lon + 180) / 360, (1 - Math.asinh(Math.tan(rad)) / Math.PI) / 2];
}
export function osmPlaceURL(place) {
  const [lat, lon] = place.point;
  return (
    "https://www.openstreetmap.org/?mlat=" +
    lat +
    "&mlon=" +
    lon +
    "#map=16/" +
    lat +
    "/" +
    lon
  );
}
function vector(tag, attrs) {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attrs))
    node.setAttribute(key, String(value));
  return node;
}
export function createPlaceMap(addStop) {
  const surface = el("div", {
    cls: "atlas-map-surface",
    tabindex: "0",
    role: "region",
    "aria-label": t(
      "Interactive street map. Use arrow keys to pan and plus or minus to zoom.",
      "互动街道地图。方向键平移，加减键缩放。"
    ),
  });
  const images = el("div", { cls: "map-tiles", "aria-hidden": "true" });
  const lines = vector("svg", { class: "map-lines", "aria-hidden": "true" });
  const pinLayer = el("div", { cls: "map-pins" });
  surface.append(images, lines, pinLayer);
  const retry = btn(t("Retry map", "重试地图"), retryTiles, "map-retry");
  const statusText = el("span");
  const status = el(
    "div",
    { cls: "map-status", role: "status" },
    statusText,
    retry
  );
  const zoomIn = btn("+", () => zoomAt(zoom + 1), "zoom-btn"),
    zoomOut = btn("−", () => zoomAt(zoom - 1), "zoom-btn");
  zoomIn.setAttribute("aria-label", t("Zoom in", "放大地图"));
  zoomOut.setAttribute("aria-label", t("Zoom out", "缩小地图"));
  const fitCity = btn(t("Fit city", "全城景点"), () => fit("city"), "map-tool");
  const fitDay = btn(t("Fit day", "当天景点"), () => fit("day"), "map-tool");
  const scene = el(
    "div",
    { cls: "map-scene" },
    surface,
    el("div", { cls: "map-zoom" }, zoomIn, zoomOut),
    status
  );
  const inspector = el("div", {
    cls: "map-inspector",
    hidden: true,
    role: "region",
    "aria-label": t("Selected place", "已选景点"),
  });
  scene.append(inspector);
  const picker = el("select", {
    "aria-label": t("Find a place on the map", "在地图上查找景点"),
    onchange: (e) => {
      if (e.target.value) select(e.target.value);
    },
  });
  const credit = el(
    "div",
    { cls: "map-credit" },
    el("span", {}, t("Street map", "街道地图")),
    link(
      "© OpenStreetMap contributors",
      "https://www.openstreetmap.org/copyright",
      true
    )
  );
  const heading = el("h2", {}, t("City map", "城市地图"));
  const element = el(
    "section",
    { cls: "panel map-panel", "aria-label": t("City map", "城市地图") },
    el(
      "div",
      { cls: "map-head" },
      heading,
      el("div", { cls: "map-tools" }, fitCity, fitDay)
    ),
    picker,
    scene,
    credit,
    el(
      "p",
      { cls: "map-help" },
      t(
        "Letters mark places. Numbers and the dashed line show your stop order. Open directions in My trip for street routes.",
        "字母表示景点，数字与虚线表示游览顺序。实际街道路线上「行程」查看。"
      )
    )
  );
  let view = null,
    selected = null,
    center = [0.5, 0.5],
    zoom = 12,
    pendingFit = "city",
    pendingFocus = null;
  let visible = false,
    frame = 0,
    needsTiles = false,
    gesture = null,
    scope = "city";
  const tileNodes = new Map(),
    pinNodes = new Map(),
    pointers = new Map();
  function fit(mode) {
    scope = mode;
    pendingFit = mode;
    pendingFocus = null;
    redraw(true);
  }
  function redraw(tiles) {
    if (visible && view && surface.clientWidth) draw(tiles);
    else schedule(tiles);
  }
  function schedule(tiles) {
    needsTiles ||= tiles;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!visible || !view || surface.clientWidth < 1) return;
      const load = needsTiles;
      needsTiles = false;
      draw(load);
    });
  }
  function fitNow(mode, w, h) {
    const points =
      mode === "day"
        ? view.stops
            .map((s) => view.places.find((p) => p.id === s.id))
            .filter(Boolean)
        : view.places;
    const pins = (points.length ? points : view.places).map((p) =>
      project(p.point)
    );
    const xs = pins.map((p) => p[0]),
      ys = pins.map((p) => p[1]);
    const left = Math.min(...xs),
      right = Math.max(...xs),
      top = Math.min(...ys),
      bottom = Math.max(...ys);
    center = [(left + right) / 2, (top + bottom) / 2];
    const scale = Math.min(
      (w - 88) / Math.max(right - left, 1e-8),
      (h - 100) / Math.max(bottom - top, 1e-8)
    );
    zoom = clamp(
      Math.floor(Math.log2(Math.max(scale, TILE) / TILE)),
      MIN_ZOOM,
      points.length === 1 ? 16 : 15
    );
  }
  function zoomAt(
    next,
    x = surface.clientWidth / 2,
    y = surface.clientHeight / 2
  ) {
    const z = clamp(next, MIN_ZOOM, MAX_ZOOM);
    if (z === zoom) return;
    const dx = x - surface.clientWidth / 2,
      dy = y - surface.clientHeight / 2;
    const change = 1 / worldSize(zoom) - 1 / worldSize(z);
    center = [center[0] + dx * change, center[1] + dy * change];
    zoom = z;
    pendingFit = null;
    scope = "custom";
    redraw(true);
  }
  function refreshStatus() {
    if (!tileNodes.size) {
      status.hidden = true;
      return;
    }
    const states = [...tileNodes.values()].map((o) => o.state);
    const loading = states.includes("loading"),
      failed = states.includes("error");
    status.hidden = !failed && (!loading || states.includes("loaded"));
    retry.hidden = !failed;
    statusText.textContent = failed
      ? t(
          "Some streets could not load. Place pins still work.",
          "部分街道未加载，仍可使用景点标记。"
        )
      : t("Loading streets…", "正在加载街道…");
  }
  function retryTiles() {
    for (const [id, item] of tileNodes)
      if (item.state === "error") {
        item.img.remove();
        tileNodes.delete(id);
      }
    schedule(true);
  }
  function tilesForView(left, top, w, h, load) {
    const last = 2 ** zoom - 1,
      requested = new Set();
    const x0 = clamp(Math.floor(left / TILE), 0, last),
      x1 = clamp(Math.floor((left + w - 1) / TILE), 0, last);
    const y0 = clamp(Math.floor(top / TILE), 0, last),
      y1 = clamp(Math.floor((top + h - 1) / TILE), 0, last);
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const id = zoom + "/" + x + "/" + y;
        requested.add(id);
        let item = tileNodes.get(id);
        if (!item && load) {
          const img = el("img", {
            alt: "",
            draggable: "false",
            decoding: "async",
            width: TILE,
            height: TILE,
            referrerpolicy: "strict-origin-when-cross-origin",
          });
          item = { img, state: "loading" };
          tileNodes.set(id, item);
          const finish = (state) => {
            if (tileNodes.get(id) === item) {
              item.state = state;
              refreshStatus();
            }
          };
          img.onload = () => finish("loaded");
          img.onerror = () => finish("error");
          img.src = "https://tile.openstreetmap.org/" + id + ".png";
          images.append(img);
        }
        if (item)
          item.img.style.transform =
            "translate(" +
            Math.round(x * TILE - left) +
            "px," +
            Math.round(y * TILE - top) +
            "px)";
      }
    for (const [id, item] of tileNodes)
      if (!requested.has(id)) {
        item.img.remove();
        tileNodes.delete(id);
      }
    refreshStatus();
  }
  function draw(load) {
    const w = surface.clientWidth,
      h = surface.clientHeight;
    if (!w || !h) return;
    if (pendingFit) {
      fitNow(pendingFit, w, h);
      pendingFit = null;
      load = true;
    }
    if (pendingFocus) {
      center = project(pendingFocus.point);
      zoom = Math.max(zoom, 15);
      pendingFocus = null;
      load = true;
    }
    const size = worldSize(zoom);
    center = [clamp(center[0], 0, 1), clamp(center[1], 0, 1)];
    const left = center[0] * size - w / 2,
      top = center[1] * size - h / 2;
    tilesForView(left, top, w, h, load);
    const screen = (place) => {
      const [x, y] = project(place.point);
      return [x * size - left, y * size - top];
    };
    const order = view.stops.map((s) => s.id);
    const route = order
      .map((id) => view.places.find((p) => p.id === id))
      .filter(Boolean)
      .map(screen);
    lines.setAttribute("viewBox", "0 0 " + w + " " + h);
    lines.replaceChildren();
    if (route.length > 1)
      lines.append(
        vector("polyline", {
          class: "visit-path",
          points: route.map((x) => x.join(",")).join(" "),
        })
      );
    const used = [];
    view.places.forEach((p, i) => {
      let pin = pinNodes.get(p.id);
      if (!pin) {
        pin = btn("", () => select(p.id, false), "atlas-pin");
        let down = null;
        pin.addEventListener("pointerdown", (e) => {
          if (e.button === 0) {
            down = [e.clientX, e.clientY];
            e.stopPropagation();
            pin.setPointerCapture?.(e.pointerId);
          }
        });
        pin.addEventListener("pointercancel", () => {
          down = null;
        });
        pin.addEventListener("pointerup", (e) => {
          if (
            down &&
            Math.hypot(e.clientX - down[0], e.clientY - down[1]) < 12
          ) {
            select(p.id, false);
            e.stopPropagation();
          }
          down = null;
        });
        pinLayer.append(pin);
        pinNodes.set(p.id, pin);
      }
      const [x, y] = screen(p);
      const n = order.indexOf(p.id);
      pin.hidden = x < 0 || x > w || y < 0 || y > h;
      if (pin.hidden) return;
      // Keep close Seattle Center / Golden Gate stops individually selectable.
      const candidates = [
        [0, 0],
        [0, -39],
        [39, 0],
        [-39, 0],
        [0, 39],
        [32, 32],
        [-32, -32],
        [32, -32],
        [-32, 32],
      ];
      const offset = candidates.find(
        ([dx, dy]) =>
          x + dx >= 18 &&
          x + dx <= w - 18 &&
          y + dy >= 18 &&
          y + dy <= h - 18 &&
          (x + dx < w - 65 || y + dy > 112) &&
          used.every(([u, v]) => Math.hypot(u - x - dx, v - y - dy) >= 36)
      ) || [0, 0];
      const px = x + offset[0],
        py = y + offset[1];
      used.push([px, py]);
      if (offset[0] || offset[1])
        lines.append(
          vector("line", { x1: x, y1: y, x2: px, y2: py, class: "pin-leader" }),
          vector("circle", { cx: x, cy: y, r: 3, class: "pin-anchor" })
        );
      pin.style.left = px + "px";
      pin.style.top = py + "px";
      pin.classList.toggle("planned", n >= 0);
      pin.setAttribute("aria-pressed", String(selected === p.id));
      pin.setAttribute(
        "aria-label",
        t("Select map pin: ", "选择地图标记：") +
          p.name +
          (n < 0 ? "" : " · " + t("Stop ", "第几站 ") + (n + 1))
      );
      pin.title = p.name;
      const glyph = n < 0 ? String.fromCharCode(65 + i) : String(n + 1);
      if (pin.textContent !== glyph) pin.textContent = glyph;
    });
    zoomIn.disabled = zoom >= MAX_ZOOM;
    zoomOut.disabled = zoom <= MIN_ZOOM;
  }
  function renderInspector() {
    if (!view) return;
    const place = view.places.find((p) => p.id === selected);
    inspector.hidden = !place;
    picker.value = place?.id || "";
    if (!place) {
      inspector.replaceChildren(
        el(
          "p",
          { cls: "map-help" },
          t(
            "Choose a pin to see a place. Numbers show your visit order for this day.",
            "点标记查看景点。数字表示当天的游览顺序。"
          )
        )
      );
      return;
    }
    const n = view.stops.findIndex((s) => s.id === place.id);
    const add = btn(
      n < 0
        ? t("Add to day ", "添加到第 ") + (view.day + 1)
        : t("Added · stop ", "已添加 · 第 ") + (n + 1),
      () => addStop(place.id),
      "map-add"
    );
    add.disabled = n >= 0;
    const clear = btn(
      "×",
      () => {
        const last = selected;
        selected = null;
        renderInspector();
        schedule(false);
        pinNodes.get(last)?.focus();
      },
      "map-close"
    );
    clear.setAttribute("aria-label", t("Close place details", "关闭景点详情"));
    inspector.replaceChildren(
      el(
        "div",
        { cls: "map-place-top" },
        el(
          "div",
          {},
          el(
            "span",
            { cls: "place-meta" },
            setting(place) + " · " + place.minutes + " min · " + place.area
          ),
          el("h3", {}, place.name)
        ),
        clear
      ),
      el("p", { cls: "pin-activity" }, place.description),
      el(
        "div",
        { cls: "map-detail-actions" },
        add,
        link(t("Tickets / visit ↗", "门票／参观 ↗"), place.booking, true),
        link(
          t("OpenStreetMap ↗", "在 OpenStreetMap 查看 ↗"),
          osmPlaceURL(place),
          true
        )
      )
    );
  }
  function select(id, focus = true) {
    if (!view) return;
    const place = view.places.find((p) => p.id === id);
    if (!place) return;
    selected = id;
    if (focus) {
      pendingFocus = place;
      pendingFit = null;
      scope = "custom";
    }
    renderInspector();
    redraw(focus);
  }
  function update(next) {
    const moved = !view || view.city !== next.city;
    const changedDay = !view || view.date !== next.date;
    const newOrder = next.stops.map((s) => s.id).join("|");
    const changedOrder = !view || view.order !== newOrder;
    view = { ...next, order: newOrder };
    if (moved) {
      selected = null;
      picker.replaceChildren(
        el(
          "option",
          { value: "" },
          t("Find a place on this map…", "在地图上查找景点…")
        ),
        ...next.places.map((p, i) =>
          el(
            "option",
            { value: p.id },
            String.fromCharCode(65 + i) + " · " + p.name
          )
        )
      );
      pinNodes.forEach((n) => n.remove());
      pinNodes.clear();
      fit("city");
    } else if (scope === "day" && (changedDay || changedOrder))
      fit(next.stops.length ? "day" : "city");
    fitDay.disabled = !next.stops.length;
    renderInspector();
    redraw(moved);
  }
  function locationOf(e) {
    const rect = surface.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
  }
  function resetGesture() {
    const p = [...pointers.values()];
    if (!p.length) {
      gesture = null;
      surface.classList.remove("dragging");
      schedule(true);
      return;
    }
    const a = p[0],
      b = p[1] || a;
    gesture = {
      mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
      dist: Math.hypot(a[0] - b[0], a[1] - b[1]),
      center: [...center],
      zoom,
    };
  }
  surface.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest("button")) return;
    pointers.set(e.pointerId, locationOf(e));
    surface.setPointerCapture(e.pointerId);
    surface.classList.add("dragging");
    resetGesture();
  });
  surface.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId) || !gesture) return;
    pointers.set(e.pointerId, locationOf(e));
    const [a, b = a] = [...pointers.values()];
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const dist = Math.hypot(a[0] - b[0], a[1] - b[1]);
    zoom = clamp(
      gesture.zoom +
        (gesture.dist > 0 && dist > 0
          ? Math.round(Math.log2(dist / gesture.dist))
          : 0),
      MIN_ZOOM,
      MAX_ZOOM
    );
    const half = [surface.clientWidth / 2, surface.clientHeight / 2];
    center = half.map(
      (dim, i) =>
        gesture.center[i] +
        (gesture.mid[i] - dim) / worldSize(gesture.zoom) -
        (mid[i] - dim) / worldSize(zoom)
    );
    scope = "custom";
    pendingFit = null;
    schedule(false);
  });
  const end = (e) => {
    if (pointers.delete(e.pointerId)) resetGesture();
  };
  surface.addEventListener("pointerup", end);
  surface.addEventListener("pointercancel", end);
  surface.addEventListener("lostpointercapture", end);
  surface.addEventListener("dblclick", (e) => {
    if (!e.target.closest("button")) zoomAt(zoom + 1, ...locationOf(e));
  });
  surface.addEventListener(
    "wheel",
    (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoomAt(zoom + (e.deltaY < 0 ? 1 : -1), ...locationOf(e));
    },
    { passive: false }
  );
  scene.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && selected)
      inspector.querySelector(".map-close")?.click();
  });
  surface.addEventListener("keydown", (e) => {
    if (e.target !== surface) return;
    const dirs = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (dirs[e.key]) {
      e.preventDefault();
      center = center.map(
        (c, i) => c + (dirs[e.key][i] * 85) / worldSize(zoom)
      );
      scope = "custom";
      schedule(true);
    }
    if (["+", "=", "-"].includes(e.key)) {
      e.preventDefault();
      zoomAt(zoom + (e.key === "-" ? -1 : 1));
    }
  });
  let lastWidth = 0,
    lastHeight = 0;
  new ResizeObserver(() => {
    const w = surface.clientWidth,
      h = surface.clientHeight;
    if (w && h && (w !== lastWidth || h !== lastHeight)) {
      lastWidth = w;
      lastHeight = h;
      if (scope !== "custom") pendingFit = scope;
      schedule(true);
    }
  }).observe(surface);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule(true);
  }).observe(surface);
  status.hidden = true;
  return { element, update, select };
}
