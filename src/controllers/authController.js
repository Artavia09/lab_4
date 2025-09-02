import { login } from "../api/fetch.js";
import { getState, setUser, resetState } from "../state/store.js";
import { byId, on, valueOf, setText } from "../utils/dom.js";
import { validateLogin } from "../utils/validate.js";
const formId = "form-login";
const userFieldId = "login-user";
const passFieldId = "login-pass";
const userNameLabelId = "current-user-name";
export function initAuth() {
  const form = byId(formId);
  on(form, "submit", handleSubmitLogin);
}
export function handleSubmitLogin(e) {
  e.preventDefault();
  const userId = Number(valueOf(byId(userFieldId)));
  const password = valueOf(byId(passFieldId));
  const valid = validateLogin(userId, password);
  if (!valid) { alert("Completa usuario y contraseña válidos."); return; }
  login(userId, password)
    .then(applyLoginResult)
    .catch(handleLoginError);
}
export function applyLoginResult(result) {
  if (!result.ok) { alert(result.error || "No se pudo iniciar sesión"); return; }
  setUser(result.user);
  const state = getState();
  const label = byId(userNameLabelId);
  setText(label, state.user.nombre);
  window.dispatchEvent(new CustomEvent("auth:login"));
}
export function handleLoginError(err) { console.error(err); alert("Error de red al iniciar sesión"); }
export function logout() { resetState(); window.dispatchEvent(new CustomEvent("auth:logout")); }