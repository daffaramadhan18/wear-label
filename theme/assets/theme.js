/*
 * Theme behaviour.
 *
 * The React app had thirteen client islands. This file replaces the two the
 * shell needs — the header disclosure and the scroll reveals. Both mirror the
 * values in components/motion/tokens.ts, which mirror app/tokens.css: one token,
 * written three times because three runtimes need it.
 *
 * Everything is progressive enhancement. Nothing here is required for the page
 * to be usable: the disclosure panel ships OPEN and this script closes it, so a
 * failed or blocked script leaves the nav reachable rather than sealed shut.
 */
(function () {
  "use strict";

  /* --duration-enter / --duration-exit, in ms. */
  var DURATION_ENTER = 400;
  var DURATION_EXIT = 260;
  var EASE_ENTRANCE = "cubic-bezier(0.16, 1, 0.3, 1)";
  var EASE_EXIT = "cubic-bezier(0.4, 0, 1, 1)";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------------- *
   * Header disclosure
   *
   * A disclosure, not a modal: it opens in normal flow underneath the header.
   * Escape closes it and focus returns to the toggle. Background scroll is
   * deliberately NOT locked — the panel is part of the page, so locking it
   * would make the lower items unreachable on a short viewport.
   *
   * This is the one place that animates height rather than transform. A
   * disclosure that pushes the page down has to actually push it down, and
   * height is not a transform — so reduced motion collapses the duration to
   * zero instead of being handled by the compositor.
   * ---------------------------------------------------------------- */
  function initDisclosure(toggle) {
    var panel = document.getElementById(toggle.getAttribute("aria-controls"));
    if (!panel) return;

    var open = false;
    var animation = null;

    function setState(next, animate) {
      if (next === open) return;
      open = next;

      toggle.setAttribute("aria-expanded", String(open));
      panel.toggleAttribute("data-open", open);

      if (animation) animation.cancel();

      var target = open ? panel.scrollHeight : 0;
      var from = open ? 0 : panel.scrollHeight;
      var duration = !animate || reduceMotion.matches
        ? 0
        : open
          ? DURATION_ENTER
          : DURATION_EXIT;

      animation = panel.animate(
        [
          { height: from + "px", opacity: open ? 0 : 1 },
          { height: target + "px", opacity: open ? 1 : 0 },
        ],
        { duration: duration, easing: open ? EASE_ENTRANCE : EASE_EXIT, fill: "forwards" }
      );

      /* Once open, drop the fixed height so the panel can reflow — a rotated
         phone with a taller panel would otherwise stay clipped to the height
         measured before the rotation. */
      animation.onfinish = function () {
        if (open) {
          animation.cancel();
          panel.style.height = "";
          panel.style.opacity = "";
        }
      };
    }

    /* Ship closed. The markup renders open so a blocked script leaves the nav
       reachable; this is the only place that takes it away. */
    panel.style.overflow = "hidden";
    panel.style.height = "0px";
    panel.style.opacity = "0";
    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", function () {
      setState(!open, true);
      if (open) {
        var first = panel.querySelector("a, button");
        if (first) first.focus();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && open) {
        setState(false, true);
        toggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------------- *
   * Scroll reveals
   *
   * Replaces components/motion/reveal.tsx and stagger.tsx. Fires once,
   * slightly before the element is fully in view, so the motion has finished
   * by the time the reader's eye arrives — the same -12% margin the React
   * VIEWPORT constant used.
   *
   * The transition itself is CSS (see theme-src/theme.css), so only the
   * class toggle is scripted and the animated properties stay transform and
   * opacity — never a paint property.
   * ---------------------------------------------------------------- */
  function initReveals() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.setAttribute("data-revealed", "");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function init() {
    document.querySelectorAll("[data-disclosure-toggle]").forEach(initDisclosure);
    initReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
