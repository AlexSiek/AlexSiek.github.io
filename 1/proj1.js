/* Renders every gallery and table on the Project 1 page from RESULTS
   (see results.js), then wires up the lightbox, the magnifier lens and the
   before/after sliders. */

(function () {
  "use strict";

  var MEDIA = "./media/";

  /* ---------- helpers ---------- */

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function vec(v) {
    return Array.isArray(v) ? "(" + v[0] + ", " + v[1] + ")" : "pending";
  }

  function hasImage(item) {
    return typeof item.file === "string" && item.file.length > 0;
  }

  /* ---------- gallery ---------- */

  function card(item, group) {
    var col = el("div", "col");
    var wrap = el("div", "card h-100");

    if (hasImage(item)) {
      var a = el("a", "shot glightbox");
      a.href = MEDIA + item.file;
      a.setAttribute("data-gallery", group);
      a.setAttribute("data-title", item.name);
      var img = el("img");
      img.src = MEDIA + item.file;
      img.alt = "Colorized result for " + item.name;
      img.loading = "lazy";
      a.appendChild(img);
      wrap.appendChild(a);
    } else {
      wrap.appendChild(el("div", "shot shot--pending", MEDIA + (item.file || item.name + ".jpg")));
    }

    var body = el("div", "card-body");
    body.appendChild(el("p", "shot-name", item.name));

    var chips = el("div", "offsets");
    chips.appendChild(el("span", "offset-chip g", "G <b>" + vec(item.g) + "</b>"));
    chips.appendChild(el("span", "offset-chip r", "R <b>" + vec(item.r) + "</b>"));
    if (item.seconds != null) {
      chips.appendChild(el("span", "offset-chip", item.seconds + "s"));
    }
    body.appendChild(chips);

    if (item.sourceUrl) {
      var src = el("p", "shot-note");
      var link = el("a", null, "source plate");
      link.href = item.sourceUrl;
      link.target = "_blank";
      link.rel = "noopener";
      src.appendChild(link);
      body.appendChild(src);
    }

    wrap.appendChild(body);
    col.appendChild(wrap);
    return col;
  }

  function gallery(mountId, items, group) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    if (!items || !items.length) {
      mount.appendChild(el("p", "meta", "Nothing recorded yet."));
      return;
    }
    var row = el("div", "row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3");
    items.forEach(function (item) { row.appendChild(card(item, group)); });
    mount.appendChild(row);
  }

  /* ---------- offsets table ---------- */

  function table(mountId, items) {
    var mount = document.getElementById(mountId);
    if (!mount || !items || !items.length) return;

    var t = el("table", "table table-sm align-middle");
    t.innerHTML =
      "<thead><tr><th>image</th><th>green (dx, dy)</th><th>red (dx, dy)</th>" +
      "<th>time</th></tr></thead>";

    var tb = el("tbody");
    items.forEach(function (i) {
      var tr = el("tr");
      tr.innerHTML =
        "<td><code>" + i.name + "</code></td>" +
        "<td>" + vec(i.g) + "</td>" +
        "<td>" + vec(i.r) + "</td>" +
        "<td>" + (i.seconds != null ? i.seconds + "s" : "pending") + "</td>";
      tb.appendChild(tr);
    });
    t.appendChild(tb);

    var scroller = el("div", "table-responsive");
    scroller.appendChild(t);
    mount.appendChild(scroller);
  }

  /* ---------- failures ---------- */

  function failures(mountId, items) {
    var mount = document.getElementById(mountId);
    if (!mount) return;
    if (!items || !items.length) {
      mount.appendChild(el("p", null, "Every image in the set aligned without visible defects."));
      return;
    }
    items.forEach(function (f) {
      var row = el("div", "row g-3 mb-4 align-items-start");
      var left = el("div", "col-md-4");
      if (hasImage(f)) {
        var a = el("a", "shot glightbox");
        a.href = MEDIA + f.file;
        a.setAttribute("data-gallery", "failures");
        var img = el("img");
        img.src = MEDIA + f.file;
        img.alt = "Failed alignment for " + f.name;
        img.loading = "lazy";
        a.appendChild(img);
        left.appendChild(a);
      } else {
        left.appendChild(el("div", "shot shot--pending", MEDIA + f.name + ".jpg"));
      }
      var right = el("div", "col-md-8");
      right.appendChild(el("p", "shot-name", f.name));
      right.appendChild(el("p", null, "<b>What goes wrong:</b> " + (f.what || "")));
      right.appendChild(el("p", null, "<b>Why:</b> " + (f.why || "")));
      row.appendChild(left);
      row.appendChild(right);
      mount.appendChild(row);
    });
  }

  /* ---------- bells and whistles, with before/after sliders ---------- */

  function bells(mountId, items) {
    var mount = document.getElementById(mountId);
    var section = document.getElementById("bells");
    if (!mount) return;
    if (!items || !items.length) {
      if (section) section.style.display = "none";
      return;
    }

    items.forEach(function (b) {
      mount.appendChild(el("h3", null, b.title));
      mount.appendChild(el("p", null, b.summary || ""));

      if (b.before && b.after) {
        var c = el("div", "compare");
        var base = el("img");
        base.src = MEDIA + b.before;
        base.alt = b.title + ", before";
        base.loading = "lazy";

        var after = el("div", "compare__after");
        var top = el("img");
        top.src = MEDIA + b.after;
        top.alt = b.title + ", after";
        top.loading = "lazy";
        after.appendChild(top);

        c.appendChild(base);
        c.appendChild(after);
        c.appendChild(el("span", "compare__tag compare__tag--before", "before"));
        c.appendChild(el("span", "compare__tag compare__tag--after", "after"));
        c.appendChild(el("div", "compare__handle"));
        mount.appendChild(c);
        mount.appendChild(el("p", "meta", "Drag the handle to wipe between before and after."));
      } else {
        mount.appendChild(el("div", "shot shot--pending",
          "before/after images pending, drop them in " + MEDIA));
      }
    });

    wireCompare();
  }

  function wireCompare() {
    document.querySelectorAll(".compare").forEach(function (c) {
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

  /* ---------- magnifier lens ---------- */

  function magnifier() {
    var toggle = document.getElementById("magnify-toggle");
    var zoomInput = document.getElementById("magnify-zoom");
    var zoomLabel = document.getElementById("magnify-zoom-label");
    if (!toggle || !zoomInput) return;

    var lens = el("div", "magnifier");
    document.body.appendChild(lens);

    /* the checkbox ships checked, so mirror that onto the body straight away
       rather than waiting for the first change event */
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
      var img = e.target.closest ? e.target.closest(".shot img, .compare img") : null;
      if (!img) {
        lens.style.display = "none";
        active = null;
        return;
      }
      active = { img: img, x: e.clientX, y: e.clientY };
      paint(img, e.clientX, e.clientY);
    });

    /* the lens is a hover affordance, so hide it when the pointer leaves the page */
    document.addEventListener("mouseleave", function () { lens.style.display = "none"; });
  }

  /* ---------- boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    if (typeof RESULTS === "undefined") return;

    var conf = RESULTS.config || {};
    Object.keys(conf).forEach(function (k) {
      var node = document.querySelector('[data-config="' + k + '"]');
      if (node) node.textContent = conf[k];
    });

    gallery("gallery-single", RESULTS.singleScale, "single");
    table("table-single", RESULTS.singleScale);

    gallery("gallery-pyramid", RESULTS.pyramid, "pyramid");
    table("table-pyramid", RESULTS.pyramid);

    gallery("gallery-chained", RESULTS.chained, "chained");
    table("table-chained", RESULTS.chained);

    failures("failures", RESULTS.failures);
    bells("bells-body", RESULTS.bells);

    var provided = RESULTS.pyramid || [];
    var done = provided.filter(hasImage).length;
    var counter = document.getElementById("pyramid-count");
    if (counter) counter.textContent = done + " of " + provided.length;

    if (window.GLightbox) {
      GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true, zoomable: true });
    }

    magnifier();
  });
})();
