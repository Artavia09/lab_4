import { initAuth } from "./controllers/authController.js";
import { initQueue } from "./controllers/queueController.js";
import { initStats } from "./controllers/statsController.js";
import { initRouter, showView } from "./router.js";

export function bootstrap() {
  initRouter();
  initAuth();
  initQueue();
  initStats();
  attachGlobalEvents();
}
export function attachGlobalEvents() {
  window.addEventListener("auth:login", handleLoggedIn, false);
  window.addEventListener("auth:logout", handleLoggedOut, false);
}
export function handleLoggedIn() { showView("#/cola"); }
export function handleLoggedOut() { showView("#/login"); }
document.addEventListener("DOMContentLoaded", bootstrap, false);
