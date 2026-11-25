import { el, btn, field, small, t, notice, message } from "./common.js";
import {
  defaultModel,
  resetModel,
  latestConnection,
  isConfigured,
  hasCredential,
  saveConnection,
  authorization,
} from "./ai-connection.js";
import {
  unsuitable,
  unsuitableMessages,
  withClassroomPolicy,
} from "./classroom-safety.js";
const forbidden = () => window.CAMP_CONFIG?.blockedTerms || [];
export const classroomNotice = () =>
  t(
    "This content isn’t suitable for this student app. Please choose another topic.",
    "这项内容不适用于学生课堂，请换一个主题。"
  );
export const allowedInClass = (value) => !unsuitable(value, forbidden());
export function checkClassroomText(value) {
  if (!allowedInClass(value)) throw Error(classroomNotice());
}
export const configured = isConfigured;
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
export async function openAISettings() {
  const settings = await latestConnection();
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
    placeholder: hasCredential(settings)
      ? t("Saved for this URL", "已为此网址保存")
      : "",
  });
  base.addEventListener("input", () => {
    if (!hasCredential(settings)) return;
    let same = false;
    try {
      same = endpoint(base.value.trim()) === endpoint(settings.apiBase);
    } catch {
      /* URL is being typed. */
    }
    token.placeholder = same
      ? t("Saved for this URL", "已为此网址保存")
      : t("Enter a key for this URL", "请输入此网址的 Key");
  });
  const status = notice();
  const close = () => dialog.close();
  const form = el(
    "form",
    {
      onsubmit: async (e) => {
        e.preventDefault();
        try {
          const normalized = endpoint(base.value.trim());
          const stored = await saveConnection(
            base.value.trim(),
            model.value.trim() || defaultModel,
            token.value.trim(),
            normalized
          );
          token.value = "";
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
        "Both labs remember the same connection in this browser profile.",
        "两个作品会在当前浏览器中共用并记住这组连接设置。"
      )
    ),
    field("Base URL", base),
    field(t("Model", "模型名称"), model),
    field(t("Class API key (optional)", "班级 API Key（可选）"), token),
    small(
      t(
        "Saved class keys stay on this browser profile through refreshes. Leave this field blank to keep the key for the same URL. Disconnect removes it. Put a long-term provider key in the teacher’s relay.",
        "班级 Key 在当前浏览器中保存，刷新和切换作品后继续使用。网址相同时，留空保留已有 Key；点“断开连接”可移除。长期服务商 Key 由老师放在转发程序中。"
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
        async () => {
          if (await saveConnection("", resetModel, "")) close();
          else
            message(
              status,
              t(
                "Could not remove the saved connection. Clear this site's data in browser settings.",
                "未能删除已存连接，请在浏览器设置里清除此站点的数据。"
              ),
              true
            );
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
function checkReplyLength(reason) {
  if (reason === "content_filter" || reason === "safety")
    throw Error(classroomNotice());
  if (reason === "length")
    throw Error(
      t(
        "The model ran out of reply space. Use a shorter task or raise the gateway's output allowance.",
        "模型输出空间不足，请缩短任务或提高网关的输出额度。"
      )
    );
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
    if (packet.choices?.[0]?.delta?.refusal) throw Error(classroomNotice());
    if (packet.error)
      throw Error(
        t(
          "The model stopped before finishing its reply. Please retry.",
          "模型在完成前停止返回，请重试。"
        )
      );
    const choice = packet.choices?.[0];
    checkReplyLength(choice?.finish_reason);
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
  if (
    data?.error?.code === "classroom_unsuitable" ||
    /content_filter|content_policy_violation|safety_block/i.test(info)
  )
    return Error(classroomNotice());
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
  if (unsuitableMessages(messages, forbidden())) throw Error(classroomNotice());
  messages = withClassroomPolicy(messages);
  const settings = await latestConnection();
  if (!settings.apiBase || !settings.model)
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
    const credential = await authorization(settings);
    if (credential) headers.Authorization = "Bearer " + credential;
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
      const choice = data.choices?.[0];
      if (choice?.message?.refusal) throw Error(classroomNotice());
      checkReplyLength(choice?.finish_reason);
      text = choice?.message?.content;
    }
    if (typeof text !== "string" || !text.trim())
      throw Error(t("No text came back from the model.", "模型没有返回文本。"));
    checkClassroomText(text);
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
