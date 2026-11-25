export const $ = (selector, root = document) => root.querySelector(selector);
export function el(tag, attrs = {}, ...kids) {
  const item = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === "cls") item.className = value;
    else if (key.startsWith("on")) item.addEventListener(key.slice(2), value);
    else if (key === "value") item.value = value;
    else item.setAttribute(key, value === true ? "" : String(value));
  }
  item.append(...kids.flat().filter(x => x != null && x !== false));
  return item;
}
const scope = new URL(".", import.meta.url).pathname;
export function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(scope + key)) ?? fallback; } catch { return fallback; }
}
export function save(key, value) {
  try { localStorage.setItem(scope + key, JSON.stringify(value)); return true; }
  catch { return false; }
}
export const lang = read("language","en") === "zh" ? "zh" : "en";
export const t = (en, zh) => lang === "zh" ? zh : en;
export const btn = (text, fn, cls = "") => el("button",{type:"button",cls,onclick:fn},text);
export const link = (text, href, external = false) => el("a",{href,target:external?"_blank":null,rel:external?"noopener noreferrer":null},text);
export const field = (label, control) => el("label",{cls:"field"},el("span",{},label),control);
export const card = (title, ...content) => el("section",{cls:"panel"},el("h2",{},title),...content);
export const small = text => el("p",{cls:"muted small"},text);
export function message(where, text, error = false) {
  where.textContent = text;
  where.classList.toggle("error",error);
}
export function download(name, contents) {
  const url = URL.createObjectURL(new Blob(["\uFEFF",contents],{type:"text/markdown;charset=utf-8"}));
  const a = el("a",{href:url,download:name}); document.body.append(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
}
export function init(page, connect) {
  document.documentElement.lang = t("en","zh-CN");
  const root = page === "home" ? "./" : "../";
  const brand = el("a",{href:root,cls:"brand"},el("i",{"aria-hidden":"true",cls:"sigil"}),"Integem",el("span",{},"Camp Labs"));
  const nav = el("nav",{"aria-label":t("Courses","课程")},...["study","travel"].map((route,i)=>el("a",{href:root+route+"/","aria-current":page===route?"page":null},["Study Desk","Field Trip Atlas"][i])));
  const language = btn(t("中文","English"),()=>{if(save("language",t("zh","en"))) location.reload(); else alert(t("Browser storage is unavailable.","浏览器存储不可用。"));},"language");
  const tools = el("div",{cls:"toolbar"},language);
  if(connect) tools.append(btn(t("AI settings","AI 设置"),connect,"settings"));
  $("#mast").replaceChildren(el("a",{href:"#app",cls:"skip"},t("Skip to workspace","跳到工作区")),el("div",{cls:"mast-inner"},brand,nav,tools));
}
export function hero(kind, meta, title, desc) {
  const art = el("div",{cls:"hero-art "+kind,"aria-hidden":"true"},el("i",{cls:"shape a"}),el("i",{cls:"shape b"}),el("i",{cls:"shape c"}),el("i",{cls:"shape d"}));
  return el("section",{cls:"hero"},el("div",{},el("p",{cls:"eyebrow"},meta),el("h1",{},title),el("p",{cls:"intro"},desc)),art);
}
export const notice = () => el("p",{cls:"notice",role:"status","aria-live":"polite"});
export function prettyTime(value, zone) {
  if(!value || !Number.isFinite(Date.parse(value))) return "—";
  return new Intl.DateTimeFormat(t("en-US","zh-CN"),{dateStyle:"medium",timeStyle:"short",timeZone:zone}).format(new Date(value));
}
export function dateInZone(date, zone) {
  const chunks = new Intl.DateTimeFormat("en-US",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:zone}).formatToParts(date);
  const part = key => chunks.find(x=>x.type===key).value;
  return [part("year"),part("month"),part("day")].join("-");
}
export function plusDays(iso, amount) {
  const d = new Date(iso+"T12:00:00Z"); d.setUTCDate(d.getUTCDate()+amount); return d.toISOString().slice(0,10);
}
export function parseJSON(raw) {
  const val = raw.trim().replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/,"");
  try { return JSON.parse(val); } catch { throw Error(t("The model did not return readable JSON. Try again.","模型返回的 JSON 无法读取，请重试。")); }
}
