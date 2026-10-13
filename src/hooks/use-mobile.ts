import * as React from "react"

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

// เซิร์ฟเวอร์ไม่รู้ขนาดจอจริง — คืนค่าคงที่เดียวกับที่ React ใช้ตอน hydrate ฝั่ง client
// รอบแรก เพื่อไม่ให้ markup ชนกัน (useSyncExternalStore จะ sync เป็นค่าจริงให้อัตโนมัติ
// หลัง mount โดยไม่ error แบบ useState+useEffect เดิม)
function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
