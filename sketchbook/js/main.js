/* =====================================================================
   Folio — interactions (vanilla, no dependencies, runs with `defer`)
   ===================================================================== */

(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- scroll reveal (with safety net) ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var showAll = function () { revealEls.forEach(function (el) { el.classList.add("in"); }); };

  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
    window.addEventListener("load", function () { setTimeout(showAll, 2500); });
  } else {
    showAll();
  }

  /* ---------- header colour vs. chapter underneath ---------- */
  var header = document.querySelector("[data-header]");
  var chapters = document.querySelectorAll("[data-chapter]");
  if (header && chapters.length && "IntersectionObserver" in window) {
    var chapSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        header.classList.toggle("on-light", entry.target.dataset.chapter === "light");
      });
    }, { rootMargin: "-76px 0px -90% 0px" });
    chapters.forEach(function (c) { chapSpy.observe(c); });
  }

  /* ---------- word cycler ---------- */
  var cycler = document.querySelector(".cycler");
  if (cycler && !reduce) {
    // re-read data-words each tick so a language switch (i18n.js) takes effect
    var readWords = function () {
      return (cycler.dataset.words || "").split(",")
        .map(function (w) { return w.trim(); })
        .filter(Boolean);
    };
    if (readWords().length > 1) {
      var wi = 0;
      setInterval(function () {
        var words = readWords();
        if (words.length < 2) return;
        cycler.classList.add("is-swap");
        setTimeout(function () {
          wi = (wi + 1) % words.length;
          cycler.textContent = words[wi];
          cycler.classList.remove("is-swap");
        }, 180);
      }, 2000);
    }
  }

  /* ---------- work filtering ---------- */
  var board = document.querySelector(".board");
  var filters = document.querySelectorAll(".filter");
  var photos = board ? board.querySelectorAll(".photo") : [];
  var empty = document.querySelector(".gallery-empty");

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.dataset.filter;
      filters.forEach(function (f) {
        var on = f === btn;
        f.classList.toggle("is-active", on);
        f.setAttribute("aria-selected", String(on));
      });
      var shown = 0;
      photos.forEach(function (p) {
        var match = val === "all" || p.dataset.category === val;
        p.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  });

  /* ---------- checklist ticks on scroll ---------- */
  var checkItems = document.querySelectorAll("[data-check]");
  if (checkItems.length && "IntersectionObserver" in window && !reduce) {
    var checkSpy = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        checkItems.forEach(function (li, i) {
          setTimeout(function () { li.classList.add("is-checked"); }, 260 * (i + 1));
        });
      });
    }, { threshold: 0.6 });
    checkSpy.observe(checkItems[0]);
  } else {
    checkItems.forEach(function (li) { li.classList.add("is-checked"); });
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduce) {
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var strength = 0.35;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + mx * strength + "px," + my * strength + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- draggable stickers / photos ---------- */
  var draggables = document.querySelectorAll("[data-drag]");
  var zTop = 50;

  draggables.forEach(function (el) {
    var startX = 0, startY = 0, baseX = 0, baseY = 0, dragging = false, moved = 0;

    var down = function (e) {
      if (e.button != null && e.button !== 0) return;
      dragging = true; moved = 0;
      startX = e.clientX; startY = e.clientY;
      var m = /translate\(\s*(-?[\d.]+)px[ ,]+(-?[\d.]+)px/.exec(el.style.transform || "");
      baseX = m ? parseFloat(m[1]) : 0;
      baseY = m ? parseFloat(m[2]) : 0;
      el.classList.add("is-dragging");
      el.style.zIndex = String(++zTop);
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
    };
    var move = function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      moved = Math.max(moved, Math.abs(dx) + Math.abs(dy));
      el.style.transform =
        "translate(" + (baseX + dx) + "px," + (baseY + dy) + "px) rotate(var(--r,0deg))";
    };
    var up = function (e) {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-dragging");
      el.releasePointerCapture && el.releasePointerCapture(e.pointerId);
      if (moved > 6) {
        // suppress the click that follows a real drag
        var kill = function (ev) { ev.preventDefault(); ev.stopPropagation(); };
        el.addEventListener("click", kill, { capture: true, once: true });
        setTimeout(function () { el.removeEventListener("click", kill, true); }, 0);
      }
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  });

  /* ---------- drag-to-compare sliders (3D render ⇄ built) ---------- */
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

    // let a pointer anywhere on the image drag the divider
    var dragTo = function (clientX) {
      var r = cs.getBoundingClientRect();
      set(((clientX - r.left) / r.width) * 100);
    };
    var down = false;
    cs.addEventListener("pointerdown", function (e) {
      if (e.target === range) return;      // the range handles its own drag
      down = true; dragTo(e.clientX);
    });
    window.addEventListener("pointermove", function (e) { if (down) dragTo(e.clientX); });
    window.addEventListener("pointerup", function () { down = false; });
  });

  /* ---------- cursor ---------- */
  var cursor = document.querySelector("[data-cursor]");
  if (cursor && finePointer && !reduce) {
    document.documentElement.classList.add("has-cursor");
    var cx = 0, cy = 0, rx = 0, ry = 0, raf = null;
    var loop = function () {
      rx += (cx - rx) * 0.2;
      ry += (cy - ry) * 0.2;
      cursor.style.left = rx + "px";
      cursor.style.top = ry + "px";
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", function (e) {
      cx = e.clientX; cy = e.clientY;
      cursor.classList.add("is-on");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    document.addEventListener("pointerleave", function () { cursor.classList.remove("is-on"); });

    document.addEventListener("pointerover", function (e) {
      var drag = e.target.closest("[data-drag]");
      var hot = e.target.closest('a, button, [data-magnetic], [role="tab"]');
      cursor.classList.toggle("is-grab", !!drag);
      cursor.classList.toggle("is-hot", !!hot && !drag);
    });
  }
})();
