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

/*
 * Save for later.
 *
 * Appended as its own IIFE rather than folded into the one above: it is the only
 * behaviour here that owns persistent state, and keeping it separate means the
 * disclosure and the reveals cannot be taken down by a storage exception.
 *
 * Same `wl:saved` key and same semantics as components/ui/save-button.tsx —
 * every button showing a handle updates together, and a change in another tab
 * arrives through the `storage` event.
 */
(function () {
  "use strict";

  var KEY = "wl:saved";

  function read() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter(function (e) { return typeof e === "string"; }) : [];
    } catch (e) {
      /* Storage can be blocked outright; an unreadable list is an empty one. */
      return [];
    }
  }

  function write(list) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {
      /* Private mode or a full quota. The list stays as it was, which is the
         honest outcome — better than a button that says "saved" for something
         that is not. */
      return false;
    }
    return true;
  }

  function sync() {
    var list = read();
    document.querySelectorAll("[data-save]").forEach(function (button) {
      var saved = list.indexOf(button.getAttribute("data-save")) !== -1;
      button.setAttribute("aria-pressed", String(saved));
      var label = button.querySelector("[data-save-label]");
      if (label) {
        var title = button.getAttribute("data-title") || "";
        /* Both strings come from the locale file via data attributes — the theme
           has one content contract and script is not allowed its own copy of it. */
        var word = button.getAttribute(saved ? "data-save-on" : "data-save-off") || "";
        label.textContent = word + (title ? ": " + title : "");
      }
    });
  }

  function init() {
    if (!document.querySelector("[data-save]")) return;

    document.addEventListener("click", function (event) {
      var button = event.target.closest("[data-save]");
      if (!button) return;

      var handle = button.getAttribute("data-save");
      var list = read();
      var at = list.indexOf(handle);
      if (at === -1) { list.push(handle); } else { list.splice(at, 1); }
      if (write(list)) sync();
    });

    /* `storage` only fires in OTHER tabs, which is exactly what it is for here. */
    window.addEventListener("storage", function (event) {
      if (event.key === KEY) sync();
    });

    sync();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/*
 * Hero carousel.
 *
 * Replaces components/home/hero-carousel.tsx. The React version held index,
 * paused and stopped in state; here they are three closure variables and the
 * only thing written to the DOM is each slide's transform, its inert flag and
 * the dots.
 *
 * The three rules that matter, in order:
 *   - hover and keyboard focus PAUSE, so a reader can finish the sentence they
 *     are on and reach the CTA without it moving;
 *   - a touch, an arrow or a dot STOPS it for the rest of the visit — a reader
 *     who has taken hold of the carousel has said what they want;
 *   - prefers-reduced-motion never starts it at all. An auto-advancing carousel
 *     is motion the reader did not ask for, which is what that setting is about.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function initCarousel(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-slide]"));
    if (slides.length < 2) return;

    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-carousel-dot]"));
    var index = 0;
    var paused = false;
    var stopped = false;
    var timer = null;
    var interval = (parseInt(root.getAttribute("data-interval"), 10) || 3) * 1000;

    function render() {
      slides.forEach(function (slide, i) {
        /* Where this slide sits, in band widths from the active one. Wrapping to
           the nearer side keeps the last slide from travelling the whole strip
           backwards on the way round to the first. */
        var offset = i - index;
        if (offset > slides.length / 2) offset -= slides.length;
        if (offset < -slides.length / 2) offset += slides.length;

        var active = i === index;
        slide.style.transform = "translateX(" + offset * 100 + "%)";
        slide.style.zIndex = active ? "2" : "1";
        slide.toggleAttribute("inert", !active);
        if (active) {
          slide.removeAttribute("aria-hidden");
        } else {
          slide.setAttribute("aria-hidden", "true");
        }
      });

      dots.forEach(function (dot, i) {
        var active = i === index;
        var bar = dot.querySelector("[data-carousel-bar]");
        if (active) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
        if (bar) {
          bar.classList.toggle("w-10", active);
          bar.classList.toggle("bg-brand", active);
          bar.classList.toggle("w-4.5", !active);
          bar.classList.toggle("bg-ink/35", !active);
        }
      });
    }

    function tick() {
      index = (index + 1) % slides.length;
      render();
    }

    function start() {
      if (timer || paused || stopped || reduceMotion.matches) return;
      timer = window.setInterval(tick, interval);
    }

    function halt() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    }

    /* Pause is reversible; stop is not. */
    function pause() { paused = true; halt(); }
    function resume() { paused = false; start(); }
    function stop() { stopped = true; halt(); }

    function go(next) {
      stop();
      index = (next + slides.length) % slides.length;
      render();
    }

    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);
    root.addEventListener("touchstart", stop, { passive: true });

    var prev = root.querySelector("[data-carousel-prev]");
    var next = root.querySelector("[data-carousel-next]");
    if (prev) prev.addEventListener("click", function () { go(index - 1); });
    if (next) next.addEventListener("click", function () { go(index + 1); });
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { go(i); });
    });

    render();
    start();
  }

  function init() {
    document.querySelectorAll("[data-carousel]").forEach(initCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
