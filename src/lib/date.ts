const TIMEZONE = "Asia/Bangkok";
const BE_OFFSET = 543;

const THAI_MONTHS_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

function partsInBangkok(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

/** "13 ต.ค. 2569" */
export function formatDateThai(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const { year, month, day } = partsInBangkok(d);
  return `${day} ${THAI_MONTHS_SHORT[month - 1]} ${year + BE_OFFSET}`;
}

/** "13/10/2569" */
export function formatDateThaiShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const { year, month, day } = partsInBangkok(d);
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year + BE_OFFSET}`;
}

/** "13 ต.ค. 2569 14:30" */
export function formatDateTimeThai(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const { hour, minute } = partsInBangkok(d);
  return `${formatDateThai(d)} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatTimeThai(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const { hour, minute } = partsInBangkok(d);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
