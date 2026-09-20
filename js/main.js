/* =====================================================================
   Daan — interactions (vanilla, no dependencies, runs with `defer`)
   ===================================================================== */

(function () {
  "use strict";

  document.querySelectorAll("[data-compare]").forEach(function (cs) {
    var range = cs.querySelector(".cs-range");
    if (!range) return;
    var set = function (v) {
      v = Math.max(0, Math.min(100, v));
      cs.style.setProperty("--p", v + "%");
      range.value = v;
    };
    set(parseFloat(range.value) || 50);
    range.addEventListener("input", function () { set(parseFloat(range.value)); });

    var dragTo = function (clientX) {
      var r = cs.getBoundingClientRect();
      set(((clientX - r.left) / r.width) * 100);
    };
    var down = false;
    cs.addEventListener("pointerdown", function (e) {
      if (e.target === range) return;
      down = true; dragTo(e.clientX);
    });
    window.addEventListener("pointermove", function (e) { if (down) dragTo(e.clientX); });
    window.addEventListener("pointerup", function () { down = false; });
  });
})();
