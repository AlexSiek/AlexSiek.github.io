/* Renders the Project 4 galleries, wipers and tables from RESULTS (see
   results.js), then wires up the lightbox and the magnifier lens. Same split as
   the earlier project pages: the HTML holds the prose, this holds the layout,
   and results.js holds the data.

   Any figure whose file is missing from ./media/ falls back to a placeholder
   naming the file it wants, instead of showing a broken icon.

   Two renderers over the project 3 set. compare() is the before/after wiper
   lifted from the project 1 page, for nearest neighbour against bilinear and
   for a naive seam against a blended one. matrices() prints a recovered
   homography as a block of numbers, since A.2 asks for the matrix itself.

   Part B adds no renderer. Its figures are the same four shapes: wide figures
   for the matplotlib panels, a matrix block for the automatic homographies,
   and check tables for the per join numbers. The manual and automatic mosaics
   go in one wide list in reading order rather than through the wiper, because
   the two canvases are different sizes and the wiper overlays them. */

(function () {
  "use strict";

  var MEDIA = "./media/";

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function pendingBox(name) {
    return el("div", "shot shot--pending", "pending &middot; " + MEDIA + (name || "?"));
  }

  /* ---------- figure galleries ---------- */

  function card(item, group) {
    var col = el("div", "col");
    var wrap = el("div", "card h-100");

    if (item.file) {
      var a = el("a", "shot glightbox");
      a.href = MEDIA + item.file;
      a.setAttribute("data-gallery", group);
      a.setAttribute("data-title", item.caption || "");

      var img = el("img");
      img.alt = item.caption || item.file;
      img.loading = "lazy";
      /* Not shot yet: swap the whole anchor for the placeholder, so the
         lightbox never opens onto a missing file either. */
      img.onerror = function () {
        if (a.parentNode) a.parentNode.replaceChild(pendingBox(item.pending || item.file), a);
      };
      img.src = MEDIA + item.file;

      a.appendChild(img);
      wrap.appendChild(a);
    } else {
      wrap.appendChild(pendingBox(item.pending));
    }

    var body = el("div", "card-body");
    body.appendChild(el("p", "shot-name", item.caption || ""));
    if (item.note) body.appendChild(el("p", "shot-note", item.note));
    wrap.appendChild(body);
    col.appendChild(wrap);
    return col;
  }

  function gallery(mountId, items, group, perRow) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    if (!items || !items.length) {
      mount.appendChild(el("p", "meta", "Nothing recorded yet."));
      return;
    }
    var cols = perRow || 3;
    var row = el("div", "row row-cols-1 row-cols-sm-2 row-cols-lg-" + cols + " g-3");
    items.forEach(function (item) { row.appendChild(card(item, group)); });
    mount.appendChild(row);
  }

  /* Panoramas and composite strips are long, so they get the full column width
     stacked rather than a grid. */
  function wide(mountId, items, group) {
    var mount = document.getElementById(mountId);
    if (!mount || !items) return;

    items.forEach(function (item) {
      var fig = el("figure", "figure-wide");

      if (item.file) {
        var a = el("a", "glightbox");
        a.href = MEDIA + item.file;
        a.setAttribute("data-gallery", group);
        a.setAttribute("data-title", item.caption || "");

        var img = el("img");
        img.alt = item.caption || item.file;
        img.loading = "lazy";
        img.onerror = function () {
          if (a.parentNode) a.parentNode.replaceChild(pendingBox(item.pending || item.file), a);
        };
        img.src = MEDIA + item.file;

        a.appendChild(img);
        fig.appendChild(a);
      } else {
        fig.appendChild(pendingBox(item.pending));
      }

      var cap = el("figcaption", "figure-caption", item.caption || "");
      if (item.note) cap.innerHTML += " <span class=\"shot-note\">" + item.note + "</span>";
      fig.appendChild(cap);
      mount.appendChild(fig);
    });
  }

  /* ---------- before / after wiper ---------- */

  function compare(mountId, items) {
    var mount = document.getElementById(mountId);
    if (!mount || !items) return;

    items.forEach(function (item) {
      if (item.caption) mount.appendChild(el("p", "shot-name", item.caption));

      if (!item.before || !item.after) {
        mount.appendChild(el("div", "shot shot--pending",
          "pending &middot; " + MEDIA + (item.before || "?") +
          " and " + MEDIA + (item.after || "?")));
        if (item.note) mount.appendChild(el("p", "shot-note", item.note));
        return;
      }

      var c = el("div", "compare");
      var missing = false;

      var base = el("img");
      base.src = MEDIA + item.before;
      base.alt = (item.caption || "") + ", " + (item.beforeLabel || "before");
      base.loading = "lazy";

      var after = el("div", "compare__after");
      var top = el("img");
      top.src = MEDIA + item.after;
      top.alt = (item.caption || "") + ", " + (item.afterLabel || "after");
      top.loading = "lazy";
      after.appendChild(top);

      /* Either half missing and the wiper is meaningless, so replace the whole
         widget rather than showing one image under a draggable handle. */
      function fallback() {
        if (missing || !c.parentNode) return;
        missing = true;
        c.parentNode.replaceChild(
          el("div", "shot shot--pending",
             "pending &middot; " + MEDIA + item.before + " and " + MEDIA + item.after), c);
      }
      base.onerror = fallback;
      top.onerror = fallback;

      c.appendChild(base);
      c.appendChild(after);
      c.appendChild(el("span", "compare__tag compare__tag--before", item.beforeLabel || "before"));
      c.appendChild(el("span", "compare__tag compare__tag--after", item.afterLabel || "after"));
      c.appendChild(el("div", "compare__handle"));
      mount.appendChild(c);

      mount.appendChild(el("p", "shot-note",
        (item.note ? item.note + " " : "") + "Drag the handle to wipe between the two."));
    });

    wireCompare(mount);
  }

  function wireCompare(scope) {
    scope.querySelectorAll(".compare").forEach(function (c) {
      var after = c.querySelector(".compare__after");
      var handle = c.querySelector(".compare__handle");
      var dragging = false;

      function set(clientX) {
        var box = c.getBoundingClientRect();
        var pct = ((clientX - box.left) / box.width) * 100;
        pct = Math.max(0, Math.min(100, pct));
        after.style.clipPath = "inset(0 0 0 " + pct + "%)";
        handle.style.left = pct + "%";
      }

      c.addEventListener("pointerdown", function (e) {
        dragging = true;
        c.setPointerCapture(e.pointerId);
        set(e.clientX);
      });
      c.addEventListener("pointermove", function (e) { if (dragging) set(e.clientX); });
      c.addEventListener("pointerup", function () { dragging = false; });
      c.addEventListener("pointercancel", function () { dragging = false; });
    });
  }

  /* ---------- recovered homographies ---------- */

  function matrices(mountId, items) {
    var mount = document.getElementById(mountId);
    if (!mount || !items) return;

    items.forEach(function (item) {
      if (item.caption) mount.appendChild(el("p", "shot-name", item.caption));

      if (!item.rows) {
        mount.appendChild(el("div", "todo",
          "<strong>Pending:</strong> the recovered matrix for " +
          (item.caption || "this pair") + " goes in results.js once computeH runs."));
        return;
      }

      /* Fixed width per column so the decimal points line up. */
      var body = item.rows.map(function (r) {
        return "  " + r.map(function (v) {
          var s = (typeof v === "number") ? v.toFixed(6) : String(v);
          return (s.indexOf("-") === 0 ? "" : " ") + s;
        }).join("   ");
      }).join("\n");

      mount.appendChild(el("div", "matrix", body));
      if (item.note) mount.appendChild(el("p", "shot-note", item.note));
    });
  }

  /* ---------- check and settings tables ---------- */

  function checks(mountId, items, valueHeading) {
    var mount = document.getElementById(mountId);
    if (!mount || !items) return;

    var t = el("table", "table table-sm align-middle checks");
    t.innerHTML = "<thead><tr><th>check</th><th>" +
      (valueHeading || "result") + "</th><th></th></tr></thead>";

    var tb = el("tbody");
    items.forEach(function (i) {
      var shown = (i.value === null || i.value === undefined)
        ? "<span class=\"meta\">pending</span>" : i.value;
      var cls = (i.value === "exact") ? "value ok" : "value";
      var tr = el("tr");
      tr.innerHTML =
        "<td>" + i.name + "</td>" +
        "<td class=\"" + cls + "\">" + shown + "</td>" +
        "<td class=\"meta\">" + (i.note || "") + "</td>";
      tb.appendChild(tr);
    });

    t.appendChild(tb);
    var scroller = el("div", "table-responsive");
    scroller.appendChild(t);
    mount.appendChild(scroller);
  }

  /* ---------- magnifier lens, same as the earlier project pages ---------- */

  function magnifier() {
    var toggle = document.getElementById("magnify-toggle");
    var zoomInput = document.getElementById("magnify-zoom");
    var zoomLabel = document.getElementById("magnify-zoom-label");
    if (!toggle || !zoomInput) return;

    var lens = el("div", "magnifier");
    document.body.appendChild(lens);
    document.body.classList.toggle("magnify-on", toggle.checked);

    var SIZE = 200;
    var zoom = parseFloat(zoomInput.value);
    var active = null;

    function paint(img, clientX, clientY) {
      var box = img.getBoundingClientRect();
      var rx = (clientX - box.left) / box.width;
      var ry = (clientY - box.top) / box.height;

      lens.style.display = "block";
      lens.style.left = clientX - SIZE / 2 + "px";
      lens.style.top = clientY - SIZE / 2 + "px";
      lens.style.backgroundImage = "url('" + img.src + "')";
      lens.style.backgroundSize = box.width * zoom + "px " + box.height * zoom + "px";
      lens.style.backgroundPosition =
        -(rx * box.width * zoom - SIZE / 2) + "px " + -(ry * box.height * zoom - SIZE / 2) + "px";
    }

    zoomInput.addEventListener("input", function () {
      zoom = parseFloat(zoomInput.value);
      if (zoomLabel) zoomLabel.textContent = zoom.toFixed(1) + "x";
      if (active) paint(active.img, active.x, active.y);
    });

    toggle.addEventListener("change", function () {
      document.body.classList.toggle("magnify-on", toggle.checked);
      if (!toggle.checked) {
        lens.style.display = "none";
        active = null;
      }
    });

    document.addEventListener("mousemove", function (e) {
      if (!toggle.checked) return;
      /* Inside a wiper the visible image depends on where the handle sits, and
         the lens paints from one file, so it would show the hidden half. Take
         whichever layer the cursor is actually over. */
      var img = e.target.closest
        ? e.target.closest(".shot img, .figure-wide img, .compare img")
        : null;
      if (!img) {
        lens.style.display = "none";
        active = null;
        return;
      }
      active = { img: img, x: e.clientX, y: e.clientY };
      paint(img, e.clientX, e.clientY);
    });

    document.addEventListener("mouseleave", function () { lens.style.display = "none"; });
  }

  /* ---------- boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    if (typeof RESULTS === "undefined") return;

    checks("run-table", RESULTS.run, "setting");

    /* A.1 */
    gallery("fig-a1-set1", RESULTS.a1set1, "a1s1", 3);
    gallery("fig-a1-set2", RESULTS.a1set2, "a1s2", 3);
    gallery("fig-a1-set3", RESULTS.a1set3, "a1s3", 3);

    /* A.2 */
    gallery("fig-a2-corr", RESULTS.a2corr, "a2c", 2);
    matrices("fig-a2-matrices", RESULTS.a2matrices);
    checks("checks-a2", RESULTS.checksA2, "value");

    /* A.3 */
    gallery("fig-a3-rect", RESULTS.a3rect, "a3r", 2);
    compare("fig-a3-interp", RESULTS.a3interp);
    gallery("fig-a3-detail", RESULTS.a3detail, "a3d", 2);
    checks("checks-a3", RESULTS.checksA3, "milliseconds");

    /* A.4 */
    gallery("fig-a4-sources", RESULTS.a4sources, "a4s", 3);
    wide("fig-a4-mosaics", RESULTS.a4mosaics, "a4m");
    compare("fig-a4-blend", RESULTS.a4blend);

    /* Part B. The corner, descriptor and match figures are already two panels
       wide out of matplotlib, so they go through wide() rather than into a
       grid that would shrink them past reading. */
    checks("run-table-b", RESULTS.runB, "setting");

    /* B.1 */
    wide("fig-b1-corners", RESULTS.b1corners, "b1c");
    checks("checks-b1", RESULTS.b1spread, "nearest neighbour spacing");

    /* B.2 */
    wide("fig-b2-desc", RESULTS.b2desc, "b2d");
    checks("checks-b2", RESULTS.checksB2, "value");

    /* B.3 */
    wide("fig-b3-matches", RESULTS.b3matches, "b3m");
    checks("checks-b3", RESULTS.checksB3, "matches proposed");

    /* B.4 */
    checks("checks-b4", RESULTS.checksB4, "inliers");
    matrices("fig-b4-matrices", RESULTS.b4matrices);
    wide("fig-b4-mosaics", RESULTS.b4mosaics, "b4m");

    if (window.GLightbox) {
      GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true, zoomable: true });
    }

    magnifier();
  });
})();
