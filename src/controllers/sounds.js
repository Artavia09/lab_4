const audioMap = {
  hover: new Audio("/sounds/hover.wav"),
  click: new Audio("/sounds/click.wav"),
  success: new Audio("/sounds/success.wav"),
  error: new Audio("/sounds/error.wav"),
  laser: new Audio("/sounds/laser.wav")
};
export function play(name) {
  const a = audioMap[name];
  if (!a) return;
  try {
    a.currentTime = 0;
    const p = a.play();
    if (p && typeof p.then === "function") {
      p.then(function (){});
    }
  } catch (_e) {
    // Silencioso: sin catch en promesas; sólo flujo controlado.
  }
}
export function bindGlobalButtonSFX() {

  document.addEventListener("mouseover", onMouseOverGlobal);
  document.addEventListener("click", onClickGlobal);
}
function onMouseOverGlobal(ev) {
  const el = ev.target;
  if (!(el instanceof HTMLElement)) return;
  if (el.tagName === "BUTTON") {
    play("hover");
  }
}
function onClickGlobal(ev) {
  const el = ev.target;
  if (!(el instanceof HTMLElement)) return;
  if (el.tagName === "BUTTON") {
    play("click");
  }
}
