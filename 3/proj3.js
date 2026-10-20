/* Renders the Project 3 galleries and check tables from RESULTS (see
   results.js), then wires up the lightbox and the magnifier lens. Same split as
   the Project 1 and 2 pages: the HTML holds the prose, this holds the layout,
   and results.js holds the data.

   One addition over the Project 2 renderer. The notebooks had not been run when
   this page was written, so an image that is not in ./media/ yet falls back to a
   placeholder naming the file it wants instead of showing a broken icon. Drop
   the PNGs in and the figures appear with no edit to this file or to the
   manifest. */

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
      var a = el("a", "shot glightbox" + (item.flip ? " shot--flip" : ""));
      a.href = MEDIA + item.file;
      a.setAttribute("data-gallery", group);
      a.setAttribute("data-title", item.caption || "");

      var img = el("img");
      img.alt = item.caption || item.file;
      img.loading = "lazy";
      /* Not rendered yet: swap the whole anchor for the placeholder, so the
         lightbox never opens onto a missing file either. */
      img.onerror = function () {
        if (a.parentNode) a.parentNode.replaceChild(pendingBox(item.pending || item.file), a);
      };
      img.src = MEDIA + item.file;

      a.appendChild(img);
      wrap.appendChild(a);

      /* Anagrams rotate on hover. A button as well, because touch screens have
         no hover, and because a latched flip can be studied rather than held.
         The click has to be stopped or it opens the lightbox instead. */
      if (item.flip) {
        wrap.classList.add("card--flip");
        var btn = el("button", "flip-btn", "flip");
        btn.type = "button";
        btn.setAttribute("aria-pressed", "false");
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var on = wrap.classList.toggle("is-flipped");
          btn.setAttribute("aria-pressed", on ? "true" : "false");
        });
        wrap.appendChild(btn);
      }
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

  /* Composite panels from the notebooks are long strips, so they get the full
     column width stacked rather than a grid. */
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

  /* ---------- check tables ---------- */

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

  /* ---------- magnifier lens, same as the Project 1 and 2 pages ---------- */

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
      var img = e.target.closest ? e.target.closest(".shot img, .figure-wide img") : null;
      /* The lens paints from the raw file, so over a rotating anagram it would
         show the upright reading while the image on the page is upside down.
         Leave those to the flip instead. */
      if (img && img.closest(".shot--flip")) img = null;
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
    checks("checks-a", RESULTS.checksA);
    checks("checks-recon", RESULTS.reconstruction, "mean squared error");
    checks("checks-b", RESULTS.checksB);

    /* Part A */
    wide("fig-a11", RESULTS.a11, "a11");
    gallery("fig-a12", RESULTS.a12, "a12", 3);
    gallery("fig-a13", RESULTS.a13, "a13", 3);
    gallery("fig-a14-original", RESULTS.a14original, "a14o", 3);
    wide("fig-a14", RESULTS.a14, "a14");
    wide("fig-a15", RESULTS.a15, "a15");
    wide("fig-a16-panel", RESULTS.a16panel, "a16p");
    gallery("fig-a16", RESULTS.a16, "a16", 5);
    wide("fig-a21-panel", RESULTS.a21panel, "a21p");
    gallery("fig-a21", RESULTS.a21, "a21", 5);
    wide("fig-a31", RESULTS.a31, "a31");
    wide("fig-a31-creative", RESULTS.a31creative, "a31c");
    wide("fig-a32", RESULTS.a32, "a32");
    wide("fig-a33", RESULTS.a33, "a33");
    gallery("fig-a33-full", RESULTS.a33full, "a33f", 2);
    gallery("fig-a34", RESULTS.a34, "a34", 2);
    wide("fig-a34-far", RESULTS.a34far, "a34far");

    /* Part B */
    wide("fig-b12", RESULTS.b12noise, "b12");
    wide("fig-b121", RESULTS.b121, "b121");
    wide("fig-b122", RESULTS.b122, "b122");
    wide("fig-b123", RESULTS.b123, "b123");
    wide("fig-b22", RESULTS.b22, "b22");
    wide("fig-b23", RESULTS.b23, "b23");
    gallery("fig-b25", RESULTS.b25, "b25", 2);
    wide("fig-b26", RESULTS.b26, "b26");
    wide("fig-b26-ablation", RESULTS.b26ablation, "b26a");

    if (window.GLightbox) {
      GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true, zoomable: true });
    }

    magnifier();
  });
})();
