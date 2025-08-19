export function getMode() {
  const p = new URLSearchParams(location.search);
  return p.get('mode') || 'replication'; // ถ้าไม่ส่ง mode มาก็ใช้ replication
}
export function $ (sel, root=document){ return root.querySelector(sel); }
