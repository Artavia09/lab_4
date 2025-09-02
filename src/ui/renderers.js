
// renderers.js
import { fmtDateTime, capitalize } from "../utils/format.js";
import { clearChildren } from "../utils/dom.js";

export function renderStats(container, stats) {
  if (!container || !stats) return;
  const desde = fmtDateTime(stats.desde);
  const hasta = fmtDateTime(stats.hasta);
  const html = `<div class="stats">
    <div><strong>Rango:</strong> ${desde} → ${hasta}</div>
    <div class="grid">
      ${renderKPI("Pendientes", stats.porEstado.pendiente || 0)}
      ${renderKPI("Atendidas", stats.porEstado.atendida || 0)}
      ${renderKPI("Aprobadas", stats.porEstado.aprobada || 0)}
      ${renderKPI("Rechazadas", stats.porEstado.rechazada || 0)}
    </div>
  </div>`;
  container.innerHTML = html;
}

export function renderSolicitudesList(container, solicitudes) {
  if (!container) return;
  clearChildren(container);
  const frag = document.createDocumentFragment();
  let i = 0;
  const len = Array.isArray(solicitudes) ? solicitudes.length : 0;
  while (i < len) {
    const s = solicitudes[i];
    frag.appendChild(makeSolicitudCard(s));
    i += 1;
  }
  container.appendChild(frag);
}

export function renderSelectOptions(selectEl, arr) {
  if (!selectEl) return;
  clearChildren(selectEl);
  let i = 0;
  const len = Array.isArray(arr) ? arr.length : 0;
  while (i < len) {
    const opt = document.createElement("option");
    opt.value = arr[i];
    opt.textContent = arr[i];
    selectEl.appendChild(opt);
    i += 1;
  }
}

export function renderKPI(label, value) {
  return `<div class="kpi"><div class="kpi-value">${value}</div><div class="kpi-label">${capitalize(label)}</div></div>`;
}

export function makeSolicitudCard(s) {
  const card = document.createElement("article");
  card.className = "card glass";

  const estado = capitalize(s.estado);
  const fecha = fmtDateTime(s.createdAt);
  const detalle = 
  `<header class="card-header">
    <h4>${s.nombre} — ${s.computadoraCodigo}</h4>
    <span class="estado estado-${s.estado}">${estado}</span>
  </header>
  <div class="card-body">
    <div><strong>Sede:</strong> ${s.sede}</div>
    <div><strong>Motivo:</strong> ${s.motivo}</div>
    <div><strong>Inicio:</strong> ${fmtDateTime(s.fechaInicio)}</div>
    <div><strong>Fin:</strong> ${fmtDateTime(s.fechaFin)}</div>
    ${s.fechaAtencion ? `<div><strong>Atención:</strong> ${fmtDateTime(s.fechaAtencion)}</div>` : ""}
  </div>
  <footer class="card-footer">
    <small>Creado: ${fecha}</small>
    <div class="card-actions" data-id="${s.id}">
      <button class="btn btn-attend">Atender</button>
      <button class="btn btn-approve">Aprobar</button>
      <button class="btn btn-reject">Rechazar</button>
    </div>
  </footer>`;

  card.innerHTML = detalle;
  return card;
}
