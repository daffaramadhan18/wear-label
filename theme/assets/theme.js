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
 * The four rules that matter, in order:
 *   - hover and keyboard focus PAUSE, so a reader can finish the sentence they
 *     are on and reach the CTA without it moving;
 *   - an arrow, a dot or a horizontal DRAG stops it for the rest of the visit —
 *     a reader who has taken hold of the carousel has said what they want;
 *   - a vertical flick or a tap that goes nowhere is not taking hold, and
 *     rotation comes back afterwards. This used to be a `touchstart` handler
 *     calling the permanent stop, which on a phone meant the first scroll of the
 *     session ended rotation for the whole visit: the band is 70svh at the top
 *     of the page, so a scroll almost always begins inside it;
 *   - prefers-reduced-motion never starts it at all. An auto-advancing carousel
 *     is motion the reader did not ask for, which is what that setting is about.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* --duration-enter / --ease-entrance, mirrored from app/tokens.css exactly the
     way the header disclosure at the top of this file mirrors them, and for the
     same reason: the Web Animations API takes a number and a string, not a
     var(). The settle is the only thing here that animates from script — the
     auto-advance is the CSS transition on the slide itself. */
  var DURATION_ENTER = 400;
  var EASE_ENTRANCE = "cubic-bezier(0.16, 1, 0.3, 1)";

  /* Gesture thresholds. Deliberately NOT tokens — there is no design token for
     a gesture and inventing one would put an interaction constant in the palette
     file. 8px of travel is where a thumb stops being a tap and the axis can be
     decided; a quarter of the band, or 0.11 px/ms, is what commits a slide;
     80ms is how long a velocity sample stays worth reading, so a finger that
     came to rest before lifting is not credited with a flick. */
  var LOCK_PX = 8;
  var COMMIT_RATIO = 0.25;
  var FLICK_PX_PER_MS = 0.11;
  var STALE_SAMPLE_MS = 80;

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

    /* ---- Gesture ------------------------------------------------------- *
     * A pointer going down is not yet an intention, so nothing permanent
     * happens until the gesture says what it is: predominantly vertical was a
     * scroll and rotation comes back; predominantly horizontal is the reader
     * taking hold and ends rotation for the visit, exactly as an arrow or a dot
     * does; a tap that goes nowhere gives rotation back too. Only the explicit
     * controls keep the old unconditional stop, through go().
     *
     * DRAG. The section's own comment (hero-carousel.liquid:14-17) argues that a
     * touch should end rotation for good because "a slide that slid back out
     * from under a thumb is worse than one that stopped". That argument is about
     * a slide moving ON ITS OWN under a thumb, and it still holds — the drag
     * does not contradict it, it is the other half of it. Rotation is over
     * before the first pixel of drag: the slide moves WITH the thumb, 1:1, and
     * leaves only when the thumb has asked for it (a quarter of the band, or a
     * flick). Nothing ever slides out from under the reader.
     * -------------------------------------------------------------------- */
    var pointerId = null;   /* the pointer being followed, if any */
    var axis = "";          /* "" until the gesture resolves, then "x" or "y" */
    var startX = 0;
    var startY = 0;
    var lastX = 0;
    var lastT = 0;
    var vx = 0;             /* px/ms, signed */
    var dx = 0;
    var bandWidth = 1;
    var incoming = null;    /* the slide being pulled in */
    var incomingIndex = 0;
    var incomingSide = 0;   /* -1 it comes from the left, +1 from the right */
    var dragged = false;    /* a drag happened; swallow the click it leaves behind */
    var settling = false;

    function endGesture() {
      if (pointerId !== null && root.hasPointerCapture && root.hasPointerCapture(pointerId)) {
        root.releasePointerCapture(pointerId);
      }
      pointerId = null;
      axis = "";
      root.removeAttribute("data-dragging");
    }

    function beginDrag(step) {
      dragged = true;
      /* Taking hold is permanent — the same contract the arrows have. */
      stop();

      try {
        root.setPointerCapture(pointerId);
      } catch (e) {
        /* An already-released pointer. The window listeners below still track
           it, so the drag continues without capture. */
      }
      root.setAttribute("data-dragging", "");

      incomingIndex = (index + step + slides.length) % slides.length;
      incoming = slides[incomingIndex];
      incomingSide = step > 0 ? 1 : -1;

      /* THE HOLE, and the reason this is not four lines. render() parks every
         slide on the side it will ARRIVE from, so with two slides only one side
         is ever occupied: drag the other way and what comes in is the band's own
         bg-surface-muted. So the slide being pulled is moved to the side it is
         being pulled from before the drag's first frame — off screen, where the
         band clips, so the correction is never seen. With more than two slides
         the wrap already parks the neighbour on the right side and this is a
         no-op. */
      slides[index].style.transition = "none";
      incoming.style.transition = "none";
      incoming.style.transform = "translateX(" + incomingSide * 100 + "%)";
    }

    function drawDrag() {
      /* 1:1, in px, both slides moving as one strip. */
      slides[index].style.transform = "translateX(" + dx + "px)";
      incoming.style.transform = "translateX(" + (incomingSide * bandWidth + dx) + "px)";
    }

    function glide(slide, fromPx, toPx, duration) {
      return slide.animate(
        [
          { transform: "translateX(" + fromPx + "px)" },
          { transform: "translateX(" + toPx + "px)" },
        ],
        { duration: duration, easing: EASE_ENTRANCE, fill: "forwards" }
      );
    }

    function settle(commit) {
      var outgoing = slides[index];
      var from = dx;
      /* Reduced motion keeps the drag — that motion is the reader's own — and
         drops the settle, which is the machine's half of it. onfinish still
         fires at duration 0, so the cleanup below is the same either way. */
      var duration = reduceMotion.matches ? 0 : DURATION_ENTER;
      settling = true;

      var a = glide(outgoing, from, commit ? -incomingSide * bandWidth : 0, duration);
      var b = glide(incoming, incomingSide * bandWidth + from, commit ? 0 : incomingSide * bandWidth, duration);

      if (commit) {
        /* Focus cannot be left inside a subtree that is about to be inert.
           Dropping it deliberately beats letting `inert` drop it somewhere. */
        if (outgoing.contains(document.activeElement) && document.activeElement.blur) {
          document.activeElement.blur();
        }
        index = incomingIndex;
      }

      /* Both run on the same timing, so one finish covers the pair. */
      a.onfinish = function () {
        a.cancel();
        b.cancel();
        /* render() rewrites every transform, every inert flag and every dot — it
           is also what puts the reparented slide back where the wrap says it
           belongs, off screen. */
        render();
        /* Flush that before handing the CSS transition back, or restoring it
           would animate the correction just made. */
        void root.offsetWidth;
        slides.forEach(function (slide) {
          slide.style.transition = "";
        });
        incoming = null;
        settling = false;
      };
    }

    function onPointerDown(event) {
      /* The swallow below has had its turn by now: a click always arrives before
         the next pointerdown. Mid-drag it must not be cleared, though. */
      if (axis !== "x") dragged = false;

      if (settling) return;          /* let the settle land before the next one */
      if (pointerId !== null) return; /* a second finger is not a second drag */
      if (!event.isPrimary) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;

      pointerId = event.pointerId;
      axis = "";
      dx = 0;
      vx = 0;
      startX = event.clientX;
      startY = event.clientY;
      lastX = event.clientX;
      lastT = event.timeStamp;
      bandWidth = root.clientWidth || 1;

      /* Reversible. The gesture has not said what it is yet. */
      halt();
    }

    function onPointerMove(event) {
      if (pointerId === null || event.pointerId !== pointerId) return;

      dx = event.clientX - startX;
      var dy = event.clientY - startY;

      if (!axis) {
        if (Math.abs(dx) < LOCK_PX && Math.abs(dy) < LOCK_PX) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          /* A scroll. Get out of its way and give the timer back — this is the
             flick that used to end rotation for the whole visit. */
          endGesture();
          start();
          return;
        }
        axis = "x";
        beginDrag(dx < 0 ? 1 : -1);
      }

      var t = event.timeStamp;
      if (t > lastT) {
        vx = (event.clientX - lastX) / (t - lastT);
        lastX = event.clientX;
        lastT = t;
      }

      drawDrag();
    }

    function onPointerUp(event) {
      if (pointerId === null || event.pointerId !== pointerId) return;

      if (axis !== "x") {
        /* A tap that went nowhere is not a statement, so rotation comes back —
           unless it landed on a control, whose own click handler has the last
           word and stops for good. */
        var onControl = event.target && event.target.closest
          ? !!event.target.closest("a, button")
          : false;
        endGesture();
        if (!onControl) start();
        return;
      }

      /* A finger that has been still for longer than a frame or two is not
         flicking, however fast it was travelling before it stopped. */
      if (event.timeStamp - lastT > STALE_SAMPLE_MS) vx = 0;

      var far = Math.abs(dx) > bandWidth * COMMIT_RATIO;
      /* Speed only commits in the direction of the drag: a flick back the way it
         came is the reader changing their mind. */
      var flicked = Math.abs(vx) > FLICK_PX_PER_MS && (vx < 0) === (dx < 0);

      endGesture();
      settle(far || flicked);
    }

    function onPointerCancel(event) {
      if (pointerId === null || event.pointerId !== pointerId) return;
      var wasDrag = axis === "x";
      endGesture();
      /* A cancel before the axis resolved is the browser taking the gesture for
         a scroll, which is the vertical case arriving by another door. */
      if (wasDrag) { settle(false); } else { start(); }
    }

    /* A drag that ends over a link or a dot still gets a click: the pointer
       events were ours, the click is the browser's consolation prize. Take it in
       the capture phase and drop it. */
    root.addEventListener("click", function (event) {
      if (!dragged) return;
      dragged = false;
      event.preventDefault();
      event.stopPropagation();
    }, true);

    /* Hover pauses only where a real pointer hovers. A touch screen emits an
       emulated mouseenter after a tap and no mouseleave until the reader taps
       somewhere else, so the old mouseenter pair left the band paused for good
       on a phone — the same never-rotates bug the gesture work above is here to
       fix, arriving by another door. */
    root.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "mouse") pause();
    });
    root.addEventListener("pointerleave", function (event) {
      if (event.pointerType === "mouse") resume();
    });
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);

    /* Passive throughout: nothing here calls preventDefault. Horizontal drags
       are kept off the scroller by `touch-pan-y` on the band in
       hero-carousel.liquid; without that declaration the browser scrolls and
       cancels the pointer instead, which onPointerCancel reads as the scroll it
       was — so a band that loses the class degrades to no drag, never to a
       hijacked scroll.
       Move, up and cancel sit on the window rather than the band because a
       gesture that leaves the band still has to end — a pointerup we never hear
       about would leave rotation halted for the rest of the visit. */
    root.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerCancel, { passive: true });

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

/*
 * Product page behaviour: the gallery, the tabs, the quantity stepper and the
 * variant picker's pending state.
 *
 * All four are enhancements. The gallery ships showing the first angle, every
 * tab panel ships visible, the stepper's value lives in a real number input and
 * the picker is plain links — so with script blocked the page still shows every
 * photograph, every panel of copy, a working quantity field and a picker that
 * navigates.
 */
(function () {
  "use strict";

  /* ---- Gallery ---------------------------------------------------------- *
   * Thumbnails are buttons with aria-pressed, not links: choosing an angle is
   * not a navigation, and the main image gets the selected shot rather than the
   * page scrolling to it.
   * ---------------------------------------------------------------------- */
  function initGallery(root) {
    var thumbs = Array.prototype.slice.call(root.querySelectorAll("[data-gallery-thumb]"));
    var mains = Array.prototype.slice.call(root.querySelectorAll("[data-gallery-main]"));
    if (thumbs.length < 2) return;

    function show(index) {
      thumbs.forEach(function (thumb, i) {
        thumb.setAttribute("aria-pressed", String(i === index));
      });
      mains.forEach(function (main, i) {
        main.toggleAttribute("hidden", i !== index);
      });
    }

    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener("click", function () { show(i); });
    });
  }

  /* ---- Tabs ------------------------------------------------------------- *
   * Real ARIA tabs, so the keyboard contract is real: arrows move between tabs,
   * Home and End jump to the ends, and the strip is a single tab stop with Tab
   * moving on to the panel. A row of buttons that only responds to clicks looks
   * like this and is not this.
   * ---------------------------------------------------------------------- */
  function initTabs(root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (tab) {
      return document.getElementById(tab.getAttribute("aria-controls"));
    });
    if (!tabs.length) return;

    /* Every panel ships visible for the no-script case; this is what hides the
       inactive ones once tabbing actually works. */
    panels.forEach(function (panel) {
      if (panel) panel.removeAttribute("data-tab-hidden");
    });

    function select(index, moveFocus) {
      var next = (index + tabs.length) % tabs.length;
      tabs.forEach(function (tab, i) {
        tab.setAttribute("aria-selected", String(i === next));
        tab.setAttribute("tabindex", i === next ? "0" : "-1");
      });
      panels.forEach(function (panel, i) {
        if (panel) panel.toggleAttribute("hidden", i !== next);
      });
      if (moveFocus) tabs[next].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i, false); });
    });

    root.addEventListener("keydown", function (event) {
      var at = tabs.indexOf(document.activeElement);
      if (at === -1) return;

      if (event.key === "ArrowRight") { select(at + 1, true); }
      else if (event.key === "ArrowLeft") { select(at - 1, true); }
      else if (event.key === "Home") { select(0, true); }
      else if (event.key === "End") { select(tabs.length - 1, true); }
      else { return; }

      event.preventDefault();
    });

    select(0, false);
  }

  /* ---- Quantity stepper ------------------------------------------------- */
  function initStepper(root) {
    var field = root.querySelector("[data-stepper-value]");
    var down = root.querySelector("[data-stepper-down]");
    var up = root.querySelector("[data-stepper-up]");
    if (!field) return;

    var min = parseInt(field.getAttribute("min"), 10) || 1;
    var max = parseInt(field.getAttribute("max"), 10) || 10;

    function clamp() {
      var value = parseInt(field.value, 10);
      if (isNaN(value)) value = min;
      value = Math.min(max, Math.max(min, value));
      field.value = String(value);
      if (down) down.disabled = value <= min;
      if (up) up.disabled = value >= max;
    }

    function step(by) {
      field.value = String((parseInt(field.value, 10) || min) + by);
      clamp();
    }

    if (down) down.addEventListener("click", function () { step(-1); });
    if (up) up.addEventListener("click", function () { step(1); });
    field.addEventListener("change", clamp);
    clamp();
  }

  /* ---- Variant picker --------------------------------------------------- *
   * The picker is links to ?variant=<id> (snippets/product-purchase.liquid), so
   * every size and colourway tap is a full document load — a second or more on
   * 4G with nothing happening in between. This acknowledges the tap and nothing
   * else: the chip gets data-pending and its fieldset aria-busy, and the styling
   * of that state is CSS.
   *
   * It deliberately does NOT set aria-current. The navigation can still fail,
   * and a picker that says the selection landed when it did not is worse than
   * one that says nothing.
   *
   * The hooks are `data-variant-link` on the anchor and `data-variant-field` on
   * the fieldset, both in product-purchase.liquid. The href shape is kept as a
   * fallback for the same anchors, so a picker rendered before those attributes
   * landed still acknowledges a tap rather than silently doing nothing.
   * ---------------------------------------------------------------------- */
  function initVariantPicker() {
    /* Same guard the save button uses: no picker on the page, no listeners. */
    if (!document.querySelector('[data-variant-link], a[href*="variant="]')) return;

    document.addEventListener("click", function (event) {
      if (event.defaultPrevented) return;
      /* ctrl/cmd/shift/alt and the middle button open a new tab. This document
         is not going anywhere, so nothing may be marked pending. */
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      if (!event.target.closest) return;
      var link = event.target.closest('[data-variant-link], a[href*="variant="]');
      if (!link) return;
      var field = link.closest("[data-variant-field], fieldset");
      if (!field) return;

      link.setAttribute("data-pending", "");
      field.setAttribute("aria-busy", "true");
    });

    /* pageshow, not load: a back-forward cache restore replays the DOM exactly
       as it was left — pending chip included — and never fires load. */
    window.addEventListener("pageshow", function () {
      document.querySelectorAll("[data-pending]").forEach(function (el) {
        el.removeAttribute("data-pending");
      });
      /* Scoped to the picker's own fields: aria-busy elsewhere on the page is
         somebody else's state to clear. */
      document.querySelectorAll('[data-variant-field][aria-busy="true"], fieldset[aria-busy="true"]').forEach(function (el) {
        el.removeAttribute("aria-busy");
      });
    });
  }

  function init() {
    document.querySelectorAll("[data-gallery]").forEach(initGallery);
    document.querySelectorAll("[data-tabs]").forEach(initTabs);
    document.querySelectorAll("[data-stepper]").forEach(initStepper);
    initVariantPicker();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
