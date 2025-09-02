const API_URL = "http://localhost:3000";
const toQuery = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

async function fetchJSON(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}
export async function getUsuarioPorId(userId) {
  const users = await fetchJSON(`/usuarios?id=${userId}`);
  return users[0] || null;
}
export async function login(userId, password) {
  const user = await getUsuarioPorId(userId);
  if (!user) return { ok: false, error: "Usuario no existe" };
  if (user.password !== password)
    return { ok: false, error: "Contraseña incorrecta" };
  return { ok: true, user };
}
export async function getSolicitudes(params = {}) {
  const { estado, userId, sort = "createdAt", order = "asc", q } = params;
  const query = toQuery({
    ...(estado ? { estado } : {}),
    ...(userId ? { userId } : {}),
    ...(q ? { q } : {}),
    _sort: sort,
    _order: order
  });
  return fetchJSON(`/solicitudes?${query}`);
}
export async function crearSolicitud(payload) {
  const nowIso = new Date().toISOString();
  const body = {
    ...payload,
    aceptaCondiciones: !!payload.aceptaCondiciones,
    createdAt: nowIso,
    estado: "pendiente"
  };
  return fetchJSON(`/solicitudes`, { method: "POST", body });
}
export async function actualizarSolicitud(id, patch) {
  return fetchJSON(`/solicitudes/${id}`, { method: "PATCH", body: patch });
}
export async function eliminarSolicitud(id) {
  const res = await fetch(`${API_URL}/solicitudes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`No se pudo eliminar: ${res.status}`);
  return true;
}
export async function atenderSolicitud(id, adminNotes) {
  const patch = {
    estado: "atendida",
    atendidaEn: new Date().toISOString(),
    ...(adminNotes ? { adminNotes } : {})
  };
  return actualizarSolicitud(id, patch);
}
export async function aprobarSolicitud(id, aprobadaPor, fechaAtencion) {
  const patch = {
    estado: "aprobada",
    aprobadaEn: new Date().toISOString(),
    aprobadaPor,
    ...(fechaAtencion ? { fechaAtencion } : {})
  };
  return actualizarSolicitud(id, patch);
}
export async function rechazarSolicitud(id, rechazadaPor, adminNotes) {
  const patch = {
    estado: "rechazada",
    rechazadaEn: new Date().toISOString(),
    rechazadaPor,
    ...(adminNotes ? { adminNotes } : {})
  };
  return actualizarSolicitud(id, patch);
}

/* HISTORIAL / STATS */
export async function historialPorEstudiante(userId, dias = 7) {
  const hasta = new Date();
  const desde = new Date(hasta);
  desde.setDate(hasta.getDate() - dias);
  const all = await getSolicitudes({ userId, sort: "createdAt", order: "desc" });
  return all.filter((s) => {
    const t = new Date(s.createdAt).getTime();
    return t >= desde.getTime() && t <= hasta.getTime();
  });
}
export async function resumenStats(dias = 3) {
  const hasta = new Date();
  const desde = new Date(hasta);
  desde.setDate(hasta.getDate() - dias + 1);
  const all = await getSolicitudes({ sort: "createdAt", order: "desc" });
  const dentroDeRango = all.filter((s) => {
    const t = new Date(s.createdAt).getTime();
    return t >= desde.getTime() && t <= hasta.getTime();
  });
  const porEstudiante = dentroDeRango.reduce((acc, s) => {
    acc[s.nombre] = (acc[s.nombre] || 0) + 1;
    return acc;
  }, {});
  const porEstado = dentroDeRango.reduce((acc, s) => {
    acc[s.estado] = (acc[s.estado] || 0) + 1;
    return acc;
  }, {});
  const recientes = dentroDeRango
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);
  return {
    desde: desde.toISOString(),
    hasta: hasta.toISOString(),
    porEstudiante,
    porEstado,
    recientes
  };
}
export async function buscarSolicitudes(q) {
  return getSolicitudes({ q, sort: "createdAt", order: "desc" });
}
