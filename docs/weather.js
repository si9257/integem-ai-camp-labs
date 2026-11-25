import {read,save,t,dateInZone} from "./common.js";
export const nws="https://api.weather.gov";
export const pointsURL=city=>nws+"/points/"+city.coords;
const key=city=>"nws-v1-"+city.coords;
export function cacheFor(city){const c=read(key(city),null);return c && Array.isArray(c.periods) && c.periods.length && validURL(c.url) ? c:null;}
function validURL(value){try{const u=new URL(value);return u.origin===nws && u.pathname.startsWith("/gridpoints/") && u.pathname.endsWith("/forecast");}catch{return false;}}
async function get(url,signal){
  const r=await fetch(url,{headers:{Accept:"application/geo+json"},signal,credentials:"omit",cache:"no-cache"});
  if(!r.ok)throw Error("NWS HTTP "+r.status);
  return (await r.json()).properties;
}
export async function fetchForecast(city,signal){
  const point=await get(pointsURL(city),signal);
  if(!validURL(point?.forecast))throw Error(t("NWS did not supply a forecast link.","NWS 未返回预报地址。"));
  const data=await get(point.forecast,signal);
  const periods=(data?.periods||[]).filter(p=>Number.isFinite(Date.parse(p.startTime)) && Number.isFinite(Date.parse(p.endTime)) && p.endTime>p.startTime && Number.isFinite(p.temperature) && ["F","C"].includes(p.temperatureUnit) && typeof p.shortForecast==="string").map(p=>({start:p.startTime,end:p.endTime,daytime:p.isDaytime===true,temp:p.temperature,unit:p.temperatureUnit,summary:p.shortForecast}));
  if(!periods.length)throw Error(t("NWS did not return forecast periods.","NWS 没有返回有效的预报时段。"));
  const c={url:point.forecast,updated:data.updateTime||data.generatedAt||null,fetched:new Date().toISOString(),periods};save(key(city),c);return c;
}
export function forDay(data,date,zone){
  // NWS night periods frequently cross midnight. Show that period on both covered dates.
  return (data?.periods||[]).filter(p=>dateInZone(new Date(p.start),zone)<=date && dateInZone(new Date(Date.parse(p.end)-1),zone)>=date);
}
export function range(data,zone){if(!data?.periods?.length)return "";return dateInZone(new Date(data.periods[0].start),zone)+" – "+dateInZone(new Date(Date.parse(data.periods.at(-1).end)-1),zone);}
