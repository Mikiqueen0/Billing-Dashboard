const thb = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  currencyDisplay: "symbol",
});

const thbCompact = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatMoney(amount: number): string {
  return thb.format(amount);
}

/** Compact form for KPI tiles, e.g. ฿1.2M — pair with a title attr showing formatMoney for the full value. */
export function formatMoneyCompact(amount: number): string {
  return thbCompact.format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("th-TH").format(value);
}

export function formatPercent(value: number, options?: { signed?: boolean }): string {
  const sign = options?.signed && value > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

/** จำนวนเงินเป็นตัวอักษรไทย เช่น "หนึ่งร้อยบาทถ้วน" — ใช้ในเอกสาร PDF */
export function moneyToThaiText(amount: number): string {
  const digits = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const positions = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  function convert(numStr: string): string {
    const len = numStr.length;
    if (len === 0 || Number(numStr) === 0) return "";
    if (len > 7) {
      const millionsPart = numStr.slice(0, len - 6);
      const restPart = numStr.slice(len - 6);
      return convert(millionsPart) + "ล้าน" + convert(restPart);
    }
    let result = "";
    for (let i = 0; i < len; i++) {
      const digit = Number(numStr[i]);
      const place = len - i - 1;
      if (digit === 0) continue;
      if (place === 0 && digit === 1 && len > 1) {
        result += "เอ็ด";
      } else if (place === 1 && digit === 1) {
        result += "สิบ";
      } else if (place === 1 && digit === 2) {
        result += "ยี่สิบ";
      } else {
        result += digits[digit] + positions[place];
      }
    }
    return result;
  }

  const baht = Math.floor(amount);
  const satang = Math.round((amount - baht) * 100);
  const bahtText = baht === 0 ? "ศูนย์" : convert(String(baht));
  const satangText = satang === 0 ? "ถ้วน" : `${convert(String(satang))}สตางค์`;
  return `${bahtText}บาท${satangText}`;
}
