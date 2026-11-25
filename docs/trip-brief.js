const months =
  "january february march april may june july august september october november december".split(
    " "
  );
const monthPart = months
  .map((m) => m.slice(0, 3) + "(?:" + m.slice(3) + ")?")
  .join("|");
const named = new RegExp(
  "\\b(" +
    monthPart +
    ")\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:\\s*,?\\s+(\\d{4}))?\\b",
  "i"
);
export function tripDate(text) {
  let year, month, day;
  const iso = text.match(/(?:^|[^\d])(\d{4})-(\d{1,2})-(\d{1,2})(?!\d)/);
  const cn = text.match(
    /(?:(\d{4})\s*年\s*)?(\d{1,2})\s*月\s*(\d{1,2})\s*[日号]/
  );
  const us = text.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{4}|\d{2}))?\b/);
  const en = text.match(named);
  if (iso || cn) [, year, month, day] = iso || cn;
  else if (en) {
    year = en[3];
    day = en[2];
    month =
      months.findIndex(
        (m) => m.slice(0, 3) === en[1].slice(0, 3).toLowerCase()
      ) + 1;
  } else if (us) [, month, day, year] = us;
  else return {};
  if (!year || String(year).length !== 4) return { problem: "year" };
  const nums = [Number(year), Number(month), Number(day)];
  const d = new Date(Date.UTC(nums[0], nums[1] - 1, nums[2], 12));
  if (
    d.getUTCFullYear() !== nums[0] ||
    d.getUTCMonth() + 1 !== nums[1] ||
    d.getUTCDate() !== nums[2]
  )
    return { problem: "invalid" };
  return { date: d.toISOString().slice(0, 10) };
}
