/* Two schematic animations for the Approach section.
 *
 * These are diagrams, not real runs. No plate is loaded and no NCC is computed.
 * The score field is a synthetic peak at a chosen "true" offset, so each search
 * behaves the way the real one does without needing the data. The structure
 * mirrors colorize.py:
 *
 *   single scale   search_displacements(radius=15), every shift in one window
 *   pyramid        downsample until the image is small, one full search there,
 *                  then double the estimate and refine at every level on the
 *                  way back up
 *
 * Both run on their own loop, with no controls.
 */

(function () {
  "use strict";

  var RADIUS = 15;        // SEARCH_RADIUS in colorize.py

  var COLD = [35, 33, 30];
  var HOT = [240, 160, 106];

  /* ---------- synthetic scoring ---------- */

  /* A smooth peak at (tx, ty) plus a deterministic wobble, so the heat map has
     the lumpy look of a real NCC surface without any randomness between runs. */
  function scoreAt(dx, dy, tx, ty, spread) {
    var d2 = (dx - tx) * (dx - tx) + (dy - ty) * (dy - ty);
    var peak = Math.exp(-d2 / (2 * spread * spread));
    var wobble = 0.12 * Math.sin(dx * 1.7) * Math.cos(dy * 1.3);
    return Math.max(0, Math.min(1, peak + wobble * (1 - peak)));
  }

  function heat(v) {
    var c = "rgb(";
    for (var i = 0; i < 3; i++) {
      c += Math.round(COLD[i] + (HOT[i] - COLD[i]) * v) + (i < 2 ? "," : "");
    }
    return c + ")";
  }

  /* Starts a loop that only burns frames while the figure is on screen. */
  function loop(root, tick) {
    var running = false;

    function frame() {
      if (!running) return;
      tick();
      requestAnimationFrame(frame);
    }

    function play() {
      if (running) return;
      running = true;
      requestAnimationFrame(frame);
    }

    play();

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) play();
          else running = false;
        });
      }, { threshold: 0 }).observe(root);
    }
  }

  /* ---------- animation 1: single scale exhaustive search ----------
   *
   * Green searches against blue, locks onto its offset, then red fades in and
   * searches while green stays put, then the whole thing starts over.
   * colorize.py calls align() once per channel in exactly that order.
   */

  function singleScale(root) {
    var span = 2 * RADIUS + 1;               // 31
    var total = span * span;                 // 961
    var canvas = root.querySelector("[data-heat]");
    var ctx = canvas.getContext("2d");

    var PX = 3;               // screen px per pixel of shift
    var PER_FRAME = 3;        // candidates per frame, kept slow on purpose
    var HOLD_CHANNEL = 70;    // frames to hold on a locked channel
    var HOLD_CYCLE = 120;     // frames before the loop starts over

    /* Green settles down and to the right, red up and to the left, so the two
       locked squares stay clear of each other instead of stacking up on blue.
       The heat map peak follows these targets, so its hot spot moves to the
       matching corner when the channel changes. */
    var PHASES = [
      { el: root.querySelector("[data-plate-g]"), tx: 2, ty: 5 },
      { el: root.querySelector("[data-plate-r]"), tx: -3, ty: -12 },
    ];

    var phase, i, best, bestScore, hold, pending;

    canvas.width = span;
    canvas.height = span;

    function startPhase(n) {
      phase = n;
      i = 0;
      best = { dx: 0, dy: 0 };
      bestScore = -1;
      ctx.clearRect(0, 0, span, span);
      PHASES[n].el.style.transform = "translate(0px, 0px)";
      /* the channel being searched is the one on screen */
      PHASES[n].el.style.opacity = "1";
    }

    function restart() {
      PHASES.forEach(function (p, idx) {
        p.el.style.transform = "translate(0px, 0px)";
        /* only blue and green are up while green searches, so the first pass
           reads as green being compared against blue on its own */
        p.el.style.opacity = idx === 0 ? "1" : "0";
      });
      startPhase(0);
    }

    function advance() {
      var p = PHASES[phase];

      /* raster order over the window, matching the nested dy/dx loops */
      var dy = Math.floor(i / span) - RADIUS;
      var dx = (i % span) - RADIUS;
      var s = scoreAt(dx, dy, p.tx, p.ty, 4.5);

      ctx.fillStyle = heat(s);
      ctx.fillRect(dx + RADIUS, dy + RADIUS, 1, 1);
      p.el.style.transform = "translate(" + dx * PX + "px, " + dy * PX + "px)";

      if (s > bestScore) {
        bestScore = s;
        best = { dx: dx, dy: dy };
      }

      i++;

      if (i >= total) {
        /* settle on the winner, mark it, and queue up whatever comes next */
        p.el.style.transform = "translate(" + best.dx * PX + "px, " + best.dy * PX + "px)";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(best.dx + RADIUS - 1.5, best.dy + RADIUS - 1.5, 4, 4);

        if (phase < PHASES.length - 1) {
          hold = HOLD_CHANNEL;
          pending = function () { startPhase(phase + 1); };
        } else {
          hold = HOLD_CYCLE;
          pending = restart;
        }
      }
    }

    function tick() {
      if (hold > 0) {
        hold--;
        if (hold === 0 && pending) {
          var next = pending;
          pending = null;
          next();
        }
        return;
      }
      for (var n = 0; n < PER_FRAME && !hold; n++) advance();
    }

    hold = 0;
    pending = null;
    restart();
    loop(root, tick);
  }

  /* ---------- animation 2: coarse to fine pyramid ----------
   *
   * The plate keeps the same size on screen while its sampling grid changes,
   * so downsampling reads as the picture going blocky rather than as a square
   * quietly getting smaller. 64 cells across is full resolution, 4 across is
   * the coarsest level, which is where the one expensive search happens.
   *
   * Because the cells double in size as the grid halves, a shift of k cells
   * covers the same distance on screen at every level. That is exactly what
   * the doubling step in align_pyramid buys: the estimate carries straight
   * over, and each level only has to correct it by about a cell.
   */

  function pyramid(root) {
    var refCanvas = root.querySelector("[data-plate-ref]");
    var movCanvas = root.querySelector("[data-plate-mov]");
    var heatCanvas = root.querySelector("[data-heat]");
    var refCtx = refCanvas.getContext("2d");
    var movCtx = movCanvas.getContext("2d");
    var heatCtx = heatCanvas.getContext("2d");

    var SIZE = 200;                          // on-screen size of a plate
    var GRIDS = [4, 8, 16, 32, 64];          // cells across, coarsest first
    var TOP = GRIDS.length - 1;              // index of full resolution

    /* The misalignment, as a fraction of the plate, chosen so it lands on
       exactly 1 cell at the coarsest level and 16 at the finest. */
    var SHIFT = 0.25;

    var FRAMES_DOWN = 26;                    // per downsampling step
    var FRAMES_CANDIDATE = 6;                // per candidate tried
    var FRAMES_PROMOTE = 22;                 // per doubling step on the way up
    var FRAMES_HOLD = 130;                   // before the loop restarts
    var COARSE = 2;                          // half width of the coarse search

    /* A stand-in for the plate: two blobs and a ripple, enough structure that
       throwing away resolution visibly destroys it. */
    function scene(u, v) {
      var a = Math.exp(-((u - 0.34) * (u - 0.34) + (v - 0.38) * (v - 0.38)) / 0.030);
      var b = Math.exp(-((u - 0.72) * (u - 0.72) + (v - 0.66) * (v - 0.66)) / 0.014);
      var c = 0.5 + 0.5 * Math.sin(11 * u + 7 * v);
      return Math.max(0, Math.min(1, 0.22 * c + 0.85 * a + 0.95 * b));
    }

    /* Draw one plate at `cells` resolution. `shift` offsets what the plate is
       looking at, so the moving plate is genuinely misregistered rather than
       just displaced on screen. */
    function paint(ctx, cells, tint, shift) {
      var size = SIZE / cells;
      ctx.clearRect(0, 0, SIZE, SIZE);
      for (var j = 0; j < cells; j++) {
        for (var i = 0; i < cells; i++) {
          var value = scene((i + 0.5) / cells + shift, (j + 0.5) / cells + shift);
          ctx.fillStyle = "rgba(" + tint + "," + (0.10 + 0.85 * value).toFixed(3) + ")";
          ctx.fillRect(i * size, j * size, Math.ceil(size), Math.ceil(size));
        }
      }
    }

    var level, estimate, queue, qi, frames;

    function cellSize() { return SIZE / GRIDS[level]; }

    /* the true offset at this level, in cells: 1 at the coarsest, doubling up */
    function trueCells() { return Math.round(SHIFT * GRIDS[level]); }

    function place(dx, dy) {
      movCanvas.style.transform =
        "translate(" + dx * cellSize() + "px, " + dy * cellSize() + "px)";
    }

    function render() {
      paint(refCtx, GRIDS[level], "77,155,245", 0);
      paint(movCtx, GRIDS[level], "81,207,102", SHIFT);
    }

    function resetHeat(span) {
      heatCanvas.width = span;
      heatCanvas.height = span;
      heatCtx.clearRect(0, 0, span, span);
    }

    /* ---- the sequence, rebuilt each cycle ---- */

    function build() {
      var steps = [];
      var L, dx, dy;

      /* start at full resolution, then halve down to the coarsest level */
      steps.push({ frames: FRAMES_DOWN, start: function () {
        level = TOP;
        estimate = { dx: 0, dy: 0 };
        render();
        place(0, 0);
        resetHeat(1);
      } });

      for (L = TOP - 1; L >= 0; L--) {
        (function (target) {
          steps.push({ frames: FRAMES_DOWN, start: function () {
            level = target;
            render();
            place(0, 0);
          } });
        })(L);
      }

      /* the one full search, at the coarsest level */
      steps.push({ frames: 1, start: function () { resetHeat(2 * COARSE + 1); } });
      for (dy = -COARSE; dy <= COARSE; dy++) {
        for (dx = -COARSE; dx <= COARSE; dx++) {
          (function (x, y) {
            steps.push({ frames: FRAMES_CANDIDATE, start: function () {
              var t = trueCells();
              var s = scoreAt(x, y, t, t, 1.15);
              heatCtx.fillStyle = heat(s);
              heatCtx.fillRect(x + COARSE, y + COARSE, 1, 1);
              place(x, y);
            } });
          })(dx, dy);
        }
      }

      steps.push({ frames: FRAMES_CANDIDATE * 2, start: function () {
        estimate = { dx: trueCells(), dy: trueCells() };
        place(estimate.dx, estimate.dy);
        heatCtx.strokeStyle = "#fff";
        heatCtx.lineWidth = 1;
        heatCtx.strokeRect(estimate.dx + COARSE - 0.5, estimate.dy + COARSE - 0.5, 2, 2);
      } });

      /* climb back up: double the estimate, then nudge by at most one cell */
      for (L = 1; L <= TOP; L++) {
        (function (target) {
          steps.push({ frames: FRAMES_PROMOTE, start: function () {
            level = target;
            estimate = { dx: estimate.dx * 2, dy: estimate.dy * 2 };
            render();
            place(estimate.dx, estimate.dy);
            resetHeat(3);
          } });

          for (var j = -1; j <= 1; j++) {
            for (var i = -1; i <= 1; i++) {
              (function (x, y) {
                steps.push({ frames: FRAMES_CANDIDATE, start: function () {
                  var t = trueCells();
                  var s = scoreAt(estimate.dx + x, estimate.dy + y, t, t, 0.9);
                  heatCtx.fillStyle = heat(s);
                  heatCtx.fillRect(x + 1, y + 1, 1, 1);
                  place(estimate.dx + x, estimate.dy + y);
                } });
              })(i, j);
            }
          }

          steps.push({ frames: FRAMES_CANDIDATE, start: function () {
            estimate = { dx: trueCells(), dy: trueCells() };
            place(estimate.dx, estimate.dy);
          } });
        })(L);
      }

      steps.push({ frames: FRAMES_HOLD, start: function () {} });
      return steps;
    }

    function restart() {
      queue = build();
      qi = -1;
      frames = 0;
    }

    function tick() {
      if (frames > 0) { frames--; return; }
      qi++;
      if (qi >= queue.length) { restart(); return; }
      queue[qi].start();
      frames = queue[qi].frames;
    }

    refCanvas.width = SIZE;
    refCanvas.height = SIZE;
    movCanvas.width = SIZE;
    movCanvas.height = SIZE;

    restart();
    loop(root, tick);
  }

  /* ---------- boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    var a = document.getElementById("anim-single");
    var b = document.getElementById("anim-pyramid");
    if (a) singleScale(a);
    if (b) pyramid(b);
  });
})();
