
// validate.js
export function isNonEmptyString(v) { return typeof v === "string" && v.trim().length > 0; }
export function isPositiveInt(n) { return Number.isInteger(n) && n > 0; }
export function isISODateString(s) {
  if (!isNonEmptyString(s)) return false;
  const d = new Date(s);
  return !isNaN(d.getTime());
}
export function validateLogin(userId, password) {
  const okId = isPositiveInt(Number(userId));
  const okPwd = isNonEmptyString(password);
  return okId && okPwd;
}
export function validateSolicitudPayload(p) {
  const fieldsOk =
    isPositiveInt(Number(p.userId)) &&
    isNonEmptyString(p.nombre) &&
    isNonEmptyString(p.sede) &&
    isNonEmptyString(p.computadoraCodigo) &&
    isNonEmptyString(p.motivo) &&
    isISODateString(p.fechaInicio) &&
    isISODateString(p.fechaFin);
  return fieldsOk === true;
}
