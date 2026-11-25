import { el, btn, t } from "./common.js";

export function startGeneration(title, initial) {
  if (!document.querySelector("link[data-generation-style]"))
    document.head.append(
      el("link", {
        rel: "stylesheet",
        href: new URL("./generation.css", import.meta.url).href,
        "data-generation-style": "",
      })
    );
  const controller = new AbortController(),
    started = Date.now();
  const heading = el("h2", { id: "generation-title" }, title),
    phase = el(
      "p",
      {
        class: "gen-stage",
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "true",
      },
      initial
    );
  const clock = el("span"),
    received = el("span"),
    metrics = el(
      "div",
      { cls: "gen-metrics", "aria-live": "off" },
      received,
      clock
    );
  const visual = el(
    "div",
    { cls: "gen-visual", "aria-hidden": "true" },
    el("i"),
    el("i"),
    el("i"),
    el("div", { cls: "gen-page" }, el("b"), el("b"), el("b"))
  );
  const stop = () => controller.abort();
  const dialog = el("dialog", {
    cls: "gen-dialog",
    "aria-labelledby": "generation-title",
    "aria-describedby": "generation-warning",
  });
  dialog.append(
    visual,
    heading,
    phase,
    metrics,
    el(
      "p",
      { id: "generation-warning", cls: "gen-warning" },
      t(
        "Keep this page open. Refreshing or leaving will interrupt this request and discard its unfinished result.",
        "请耐心等待并保持页面打开。刷新或离开会中断本次生成，尚未完成的结果将丢失。"
      )
    ),
    btn(t("Stop generating", "停止生成"), stop, "gen-stop")
  );
  const guard = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  const tick = () => {
    const seconds = Math.floor((Date.now() - started) / 1000);
    clock.textContent =
      Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
  };
  tick();
  const timer = setInterval(tick, 1000);
  window.addEventListener("beforeunload", guard);
  window.addEventListener("pagehide", stop, { once: true });
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    stop();
  });
  document.body.append(dialog);
  dialog.showModal();
  let frame = 0,
    chars = 0;
  function stage(text) {
    phase.textContent = text;
    received.textContent = "";
    chars = 0;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }
  function onText(n) {
    chars = n;
    if (!frame)
      frame = requestAnimationFrame(() => {
        frame = 0;
        received.textContent =
          t("Received ", "已收到 ") +
          chars.toLocaleString() +
          t(" characters", " 个字符");
      });
  }
  function finish() {
    clearInterval(timer);
    cancelAnimationFrame(frame);
    window.removeEventListener("beforeunload", guard);
    window.removeEventListener("pagehide", stop);
    if (dialog.open) dialog.close();
    dialog.remove();
  }
  controller.signal.addEventListener("abort", finish, { once: true });
  return { signal: controller.signal, stage, onText, finish };
}

export function untilCancelled(promise, signal) {
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const stopped = () => reject(signal.reason);
    signal.addEventListener("abort", stopped, { once: true });
    Promise.resolve(promise)
      .then(resolve, reject)
      .finally(() => signal.removeEventListener("abort", stopped));
  });
}
