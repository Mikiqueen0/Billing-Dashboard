/** วันที่ "ตอนนี้" ของข้อมูลตัวอย่างทั้งหมด — ใช้ค่าเดียวกันทุกที่เพื่อไม่ให้ตัวเลขขัดกัน */
export const MOCK_NOW = new Date("2026-10-13T23:59:59+07:00");

/** รูปแบบ YYYY-MM-DD ของ MOCK_NOW ตามปฏิทินไทย — เก็บแยกจาก Date object เพราะ
 * Date.toISOString() แปลงเป็น UTC แล้วอาจเลื่อนวันผิดเมื่อนำมาตัด substring ตรงๆ */
export const MOCK_TODAY = "2026-10-13";
