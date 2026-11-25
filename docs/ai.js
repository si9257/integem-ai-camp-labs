import {
  el,
  btn,
  field,
  small,
  t,
  read,
  save,
  notice,
  message,
} from "./common.js";
let temporaryToken = "";
const defaults = window.CAMP_CONFIG || {};
let settings = {
  ...{ apiBase: defaults.apiBase || "", model: defaults.model || "" },
  ...read("ai", {}),
};
export const configured = () => Boolean(settings.apiBase && settings.model);
function endpoint(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw Error(
      t("Enter the full API base URL.", "请填写完整的 API Base URL。")
    );
  }
  if (
    url.protocol !== "https:" &&
    !(
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    )
  )
    throw Error(
      t(
        "Use HTTPS or an HTTP loopback address.",
        "请使用 HTTPS 或本机回环 HTTP 地址。"
      )
    );
  if (url.username || url.password || url.search || url.hash)
    throw Error(
      t(
        "Use an address without embedded credentials or query parameters.",
        "请填写不含凭证、查询参数和片段的地址。"
      )
    );
  let path = url.pathname.replace(/\/+$/, "");
  if (!path.endsWith("/chat/completions"))
    url.pathname = (path || "/v1") + "/chat/completions";
  return url.href;
}
export function openAISettings() {
  const dialog = el("dialog", {
    cls: "ai-dialog",
    "aria-labelledby": "ai-title",
  });
  const base = el("input", {
    type: "url",
    value: settings.apiBase,
    placeholder: "https://school.example/v1",
    autocomplete: "off",
    required: true,
  });
  const model = el("input", {
    value: settings.model,
    placeholder: t("School model ID", "学校的模型名称"),
    required: true,
    autocomplete: "off",
  });
  const token = el("input", {
    type: "password",
    autocomplete: "off",
    spellcheck: "false",
    value: temporaryToken,
  });
  const status = notice();
  const close = () => dialog.close();
  const form = el(
    "form",
    {
      onsubmit: (e) => {
        e.preventDefault();
        try {
          endpoint(base.value.trim());
          if (!model.value.trim())
            throw Error(t("Enter a model name.", "请填写模型名称。"));
          settings = { apiBase: base.value.trim(), model: model.value.trim() };
          temporaryToken = token.value.trim();
          const stored = save("ai", settings);
          if (!stored) {
            message(
              status,
              t(
                "Active for this visit. Browser storage is full or disabled.",
                "本次访问已生效。浏览器存储已满或停用。"
              )
            );
            return;
          }
          close();
        } catch (err) {
          message(status, err.message, true);
        }
      },
    },
    el("h2", { id: "ai-title" }, t("AI connection", "AI 连接设置")),
    small(
      t(
        "Use your school gateway. The two labs share this address and model on this device.",
        "请连接学校的网关。两个作品在本机共用该地址与模型。"
      )
    ),
    field("Base URL", base),
    field(t("Model", "模型名称"), model),
    field(
      t("Short-lived class credential (optional)", "短期班级凭证（可选）"),
      token
    ),
    small(
      t(
        "The credential stays in memory until you leave or refresh. Put a long-term provider key in the teacher’s Node relay. Your notes or trip preferences go to the configured service when you request AI.",
        "凭证只在此页内存中保留，离开或刷新即清除。长期服务商 Key 由教师填入 Node 转发程序。点击 AI 功能时才会将笔记或出行偏好发送到配置的服务。"
      )
    ),
    status,
    el(
      "div",
      { cls: "actions" },
      el(
        "button",
        { type: "submit", cls: "primary" },
        t("Save connection", "保存连接")
      ),
      btn(t("Cancel", "取消"), close),
      btn(
        t("Disconnect", "断开连接"),
        () => {
          temporaryToken = "";
          settings = { apiBase: "", model: defaults.model || "" };
          save("ai", settings);
          close();
        },
        "text-btn"
      )
    )
  );
  dialog.append(form);
  document.body.append(dialog);
  dialog.addEventListener("close", () => dialog.remove(), { once: true });
  dialog.showModal();
}
async function streamReply(response, onText, heartbeat) {
  const reader = response.body.getReader(),
    decoder = new TextDecoder();
  let buffer = "",
    output = "",
    events = [],
    finished = false,
    doneSignal = false;
  function event() {
    if (!events.length) return;
    const payload = events.join("\n");
    events = [];
    if (payload.trim() === "[DONE]") {
      doneSignal = true;
      return;
    }
    const packet = JSON.parse(payload);
    if (packet.error)
      throw Error(
        t(
          "The model stopped before finishing its reply. Please retry.",
          "模型在完成前停止返回，请重试。"
        )
      );
    const choice = packet.choices?.[0];
    if (choice?.finish_reason === "length")
      throw Error(
        t(
          "The model ran out of reply space. Try fewer questions or a larger output allowance.",
          "模型输出空间不足，请减少题量或提高网关的输出额度。"
        )
      );
    if (choice?.finish_reason === "stop") finished = true;
    if (typeof choice?.delta?.content === "string") {
      output += choice.delta.content;
      onText?.(output.length);
    }
  }
  function line(value) {
    const l = value.replace(/\r$/, "");
    if (!l) event();
    else if (l.startsWith("data:")) events.push(l.slice(5).replace(/^ /, ""));
  }
  try {
    while (!doneSignal) {
      const { value, done } = await reader.read();
      if (done) {
        buffer += decoder.decode();
        if (buffer) line(buffer);
        event();
        break;
      }
      heartbeat();
      buffer += decoder.decode(value, { stream: true });
      let split;
      while ((split = buffer.indexOf("\n")) >= 0) {
        line(buffer.slice(0, split));
        buffer = buffer.slice(split + 1);
      }
    }
    if (!(doneSignal || finished))
      throw Error(
        t(
          "The connection closed before the reply finished. Please retry.",
          "连接在回复完成前断开，请重试。"
        )
      );
    return output;
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
async function gatewayFailure(response) {
  const data = await response.json().catch(() => null),
    info =
      String(data?.error?.code || "") +
      " " +
      String(data?.error?.message || data?.error || "");
  const context =
    response.status === 413 ||
    ([400, 422].includes(response.status) &&
      /context[_ ]length|maximum context|too many (?:input )?tokens|input.{0,20}too long|prompt.{0,25}(?:too long|exceed)/i.test(
        info
      ));
  const hint = {
    400: t(
      "Check the model name and request limits.",
      "请检查模型名和请求限额。"
    ),
    401: t("Check or re-enter the class credential.", "请重新输入班级凭证。"),
    403: t(
      "Check the allowed origin or credential expiry.",
      "请检查允许的来源和凭证有效期。"
    ),
    429: t(
      "The request limit was reached. Wait and retry.",
      "已达到请求限制，请稍后重试。"
    ),
  };
  const e = Error(
    "HTTP " +
      response.status +
      " · " +
      (context
        ? t(
            "This request exceeds the model's input window. Choose a model with more room.",
            "此请求超过模型上下文窗口，可更换容量更大的模型。"
          )
        : hint[response.status] ||
          t(
            "The gateway could not complete the request.",
            "网关未能完成请求。"
          ))
  );
  e.contextLimit = context;
  e.noStream =
    [400, 422, 501].includes(response.status) &&
    /\bstream(?:ing)?\b/i.test(info) &&
    /unsupported|not supported|not permitted|must be false|not allowed|does not support|unknown (?:argument|parameter)|extra inputs/i.test(
      info
    );
  return e;
}
export async function chat(messages, { signal, onText } = {}) {
  if (!configured())
    throw Error(
      t(
        "Open AI settings to connect a class gateway.",
        "请打开 AI 设置，连接班级网关。"
      )
    );
  signal?.throwIfAborted();
  const controller = new AbortController();
  let timeout,
    timedOut = false;
  const stop = () => controller.abort();
  const heartbeat = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timedOut = true;
      stop();
    }, 100000);
  };
  signal?.addEventListener("abort", stop, { once: true });
  heartbeat();
  try {
    const headers = { "Content-Type": "application/json" };
    if (temporaryToken) headers.Authorization = "Bearer " + temporaryToken;
    const send = (stream) =>
      fetch(endpoint(settings.apiBase), {
        method: "POST",
        headers,
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        signal: controller.signal,
        body: JSON.stringify({ model: settings.model, messages, stream }),
      });
    let response = await send(Boolean(onText));
    if (!response.ok) {
      const err = await gatewayFailure(response);
      if (!onText || !err.noStream) throw err;
      response = await send(false);
      if (!response.ok) throw await gatewayFailure(response);
    }
    heartbeat();
    let text;
    if (
      /text\/event-stream/i.test(response.headers.get("content-type") || "") &&
      response.body
    ) {
      text = await streamReply(response, onText, heartbeat);
    } else {
      const data = await response.json();
      text = data.choices?.[0]?.message?.content;
    }
    if (typeof text !== "string" || !text.trim())
      throw Error(t("No text came back from the model.", "模型没有返回文本。"));
    return text.trim();
  } catch (error) {
    if (signal?.aborted) throw signal.reason;
    if (timedOut)
      throw Error(
        t(
          "The model stopped responding. Try again when the gateway is ready.",
          "等待模型响应超时，网关恢复后可重试。"
        )
      );
    if (error instanceof TypeError)
      throw Error(
        t(
          "Gateway unavailable. Check its URL, HTTPS and CORS settings.",
          "无法连接网关，请核对地址、HTTPS 和跨域设置。"
        )
      );
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", stop);
  }
}
