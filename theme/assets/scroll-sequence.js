/*
 * Scroll-linked image sequence — the driver for sections/scroll-sequence.liquid.
 *
 * Preload every frame, pin the canvas, map scroll position to a frame index,
 * draw frame by frame as the reader scrolls. The section comment carries the
 * reasoning about the artwork, the sampling and the payload; this file is the
 * mechanism, and the four things below are the ones that decide whether it
 * stutters.
 *
 * NOT IN theme.js, deliberately. Everything in theme.js runs on every page of
 * the site. This runs on one section, needs 117KB of GSAP to run at all, and is
 * loaded by that section rather than by the layout — so a product page pays
 * nothing for it. Same reason it is `defer`-loaded after gsap and ScrollTrigger
 * rather than importing them: three tags in document order, no bundler, which is
 * the constraint this theme is built under.
 *
 * 1. NOTHING DRAWS UNTIL EVERYTHING IS DECODED. Preloading the bytes is not
 *    enough — an <img> that has downloaded but not decoded still costs a
 *    synchronous decode the first time it is drawn, and a 1120x630 decode inside
 *    a scroll handler is exactly the frame drop this technique is famous for. So
 *    `img.decode()` is awaited on every frame before ScrollTrigger is created at
 *    all. The reader sees the poster until then.
 *
 * 2. THE SCROLLTRIGGER IS CREATED LAST, which is also what keeps the fallback
 *    honest. The pin is what creates the section's extra scroll distance, so
 *    before the frames are in there is no distance and the section is simply one
 *    screen of poster. It grows once, when the sequence is ready, while the
 *    section is still at least a screen below the fold — the page below it moves
 *    down, out of sight, and the reader's own scroll offset never changes.
 *
 * 3. `scrub` IS A NUMBER, NOT `true`. `true` ties the playhead rigidly to the
 *    scroll offset, so every jitter in a trackpad or a phone's inertia lands on
 *    the canvas as a visible twitch. A number is a catch-up time in seconds:
 *    GSAP eases the playhead toward the scroll position on its own ticker, which
 *    both smooths the input and decouples drawing from the scroll event.
 *
 * 4. THE BACKING STORE IS CAPPED, at 2x device pixel ratio and 2600px wide. A
 *    canvas at native ratio on a 4K display is a 33-megapixel surface to clear
 *    and fill twice per frame, and past 2x nobody can see the difference anyway.
 *
 * The crossfade is why 54 frames is enough: the playhead is fractional, so the
 * frame below it is drawn opaque and the frame above it at the fraction's own
 * alpha. Both are opaque and both cover the canvas, so there is no clear() and
 * no compositing cost beyond the second drawImage.
 */
(function () {
  "use strict";

  /* Below this width the sequence loads every 2nd frame. It is the same
     breakpoint `md:` compiles to, so it lines up with where the layout changes. */
  var SMALL_VIEWPORT = 768;

  /* Backing-store ceilings. See note 4 above. */
  var MAX_DPR = 2;
  var MAX_WIDTH = 2600;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /*
   * Reasons not to load 5.6MB of photographs, in the order they are cheapest to
   * check. Reduced motion is first because it is a stated preference rather than
   * an inference, and a pinned canvas that only moves when you scroll is still
   * three screens of scroll-jacking.
   */
  function shouldSkip() {
    if (reduceMotion.matches) return true;

    var conn =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      if (conn.saveData) return true;
      /* 3g is deliberately allowed through — it is the common case in this
         market and 2.9MB over 3g is slow, not broken. 2g is not. */
      if (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g") return true;
    }

    return false;
  }

  function init(section) {
    var stage = section.querySelector("[data-sequence-stage]");
    var canvas = section.querySelector("[data-sequence-canvas]");
    var source = section.querySelector("[data-sequence-frames]");
    if (!stage || !canvas || !source) return;
    if (section.hasAttribute("data-sequence-init")) return;

    var urls;
    try {
      urls = JSON.parse(source.textContent);
    } catch (error) {
      return;
    }
    if (!Array.isArray(urls) || urls.length < 2) return;

    if (shouldSkip()) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    section.setAttribute("data-sequence-init", "");

    /*
     * The phone half-set. Index 0 kept, then every other one — which lands on
     * the last entry too, because the list is odd-length and that entry is the
     * poster. Decided once: re-deciding on rotation would mean fetching the half
     * of the sequence that was skipped, mid-scroll.
     */
    if (window.innerWidth < SMALL_VIEWPORT) {
      urls = urls.filter(function (_, i) {
        return i % 2 === 0;
      });
    }

    var io = new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        preload(urls, function (frames) {
          start(section, stage, canvas, frames);
        });
      },
      /* Two viewports of warning. At 3g that is roughly the time it takes to
         pull the half-set, so the common case is that it is ready on arrival. */
      { rootMargin: "200% 0px" }
    );
    io.observe(section);
  }

  function preload(urls, done) {
    var images = urls.map(function (url) {
      var img = new Image();
      img.decoding = "async";
      img.src = url;
      return img;
    });

    /*
     * decode() rather than onload: onload fires when the bytes are in, decode()
     * resolves when the bitmap exists. Failures resolve rather than reject the
     * batch — one missing frame should cost that frame, not the section.
     */
    var settled = images.map(function (img) {
      if (img.decode) {
        return img.decode().then(
          function () {},
          function () {}
        );
      }
      return new Promise(function (resolve) {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    Promise.all(settled).then(function () {
      var frames = images.filter(function (img) {
        return img.naturalWidth > 0;
      });
      if (frames.length < 2) return;
      done(frames);
    });
  }

  function start(section, stage, canvas, frames) {
    var ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    var length = parseFloat(section.getAttribute("data-sequence-length")) || 3;
    var state = { t: 0 };

    /* Cover, centred. The frame is scaled by whichever axis needs more and the
       overflow is split evenly, so the middle of the composition is the middle
       of the stage at every aspect ratio — which is what keeps the reveal's
       centre polaroid centred on a phone. */
    function draw(img, alpha) {
      var bw = canvas.width;
      var bh = canvas.height;
      var scale = Math.max(bw / img.naturalWidth, bh / img.naturalHeight);
      var dw = img.naturalWidth * scale;
      var dh = img.naturalHeight * scale;

      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (bw - dw) / 2, (bh - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    }

    function render() {
      var position = state.t * (frames.length - 1);
      var index = Math.floor(position);
      var fraction = position - index;

      if (index >= frames.length - 1) {
        index = frames.length - 1;
        fraction = 0;
      }

      draw(frames[index], 1);
      /* The crossfade. Skipped below a thousandth so the last frame of the
         scrub is drawn once, not twice. */
      if (fraction > 0.001 && frames[index + 1]) {
        draw(frames[index + 1], fraction);
      }
    }

    /* Returns whether the surface changed — setting canvas.width clears it, so
       the caller has to redraw when it does. */
    function resize() {
      var rect = stage.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      var width = Math.max(1, Math.round(rect.width * dpr));
      var height = Math.max(1, Math.round(rect.height * dpr));

      if (width > MAX_WIDTH) {
        height = Math.max(1, Math.round((height * MAX_WIDTH) / width));
        width = MAX_WIDTH;
      }

      if (canvas.width === width && canvas.height === height) return false;

      canvas.width = width;
      canvas.height = height;
      return true;
    }

    /* Reveal before the first measure: the canvas is display:none until the
       section is ready, and getBoundingClientRect on a hidden box is zero. */
    section.setAttribute("data-sequence-ready", "");
    resize();
    render();

    window.gsap.registerPlugin(window.ScrollTrigger);

    /*
     * ignoreMobileResize is what stops the sequence resetting when a phone hides
     * its URL bar. That changes window.innerHeight, which is the end distance
     * below — without this, scrolling into the section refreshes the trigger and
     * jumps the playhead. The stage itself is sized in `svh`, which is the CSS
     * half of the same problem.
     */
    window.ScrollTrigger.config({ ignoreMobileResize: true });

    window.gsap.to(state, {
      t: 1,
      ease: "none",
      onUpdate: render,
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: function () {
          return "+=" + Math.round(window.innerHeight * length);
        },
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        /* Seconds of catch-up. See note 3 at the top. */
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: function () {
          if (resize()) render();
        },
      },
    });

    var pending = false;
    window.addEventListener(
      "resize",
      function () {
        /* ScrollTrigger's own refresh covers most of this, but it deliberately
           ignores mobile resizes (above) and a rotation still changes the
           surface. rAF-throttled so a drag-resize does not queue a redraw per
           event. */
        if (pending) return;
        pending = true;
        requestAnimationFrame(function () {
          pending = false;
          if (resize()) render();
        });
      },
      { passive: true }
    );
  }

  function initAll(root) {
    (root || document).querySelectorAll("[data-sequence]").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initAll();
    });
  } else {
    initAll();
  }

  /*
   * The theme editor replaces a section's markup in place. Without these two the
   * editor accumulates a pin and a tween per settings change, each one still
   * holding a canvas that is no longer in the document.
   */
  document.addEventListener("shopify:section:load", function (event) {
    initAll(event.target);
  });

  document.addEventListener("shopify:section:unload", function () {
    if (!window.ScrollTrigger) return;
    window.ScrollTrigger.getAll().forEach(function (trigger) {
      if (trigger.trigger && !document.body.contains(trigger.trigger)) trigger.kill();
    });
  });
})();
