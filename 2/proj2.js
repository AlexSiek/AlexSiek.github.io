/* Renders the Project 2 galleries and tables from RESULTS (see results.js),
   then wires up the lightbox and the magnifier lens. Same approach as the
   Project 1 page: the HTML holds the prose, this holds the layout, and
   results.js holds the data. */

(function () {
  "use strict";

  var MEDIA = "./media/";

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function hasImage(item) {
    return typeof item.file === "string" && item.file.length > 0;
  }

  /* ---------- figure galleries ---------- */

  function card(item, group) {
    var col = el("div", "col");
    var wrap = el("div", "card h-100");

    if (hasImage(item)) {
      var a = el("a", "shot glightbox");
      a.href = MEDIA + item.file;
      a.setAttribute("data-gallery", group);
      a.setAttribute("data-title", item.caption || "");
      var img = el("img");
      img.src = MEDIA + item.file;
      img.alt = item.caption || item.file;
      img.loading = "lazy";
      a.appendChild(img);
      wrap.appendChild(a);
    } else {
      /* Nothing rendered yet. Show what the page is waiting for rather than
         leaving a silent gap. */
      wrap.appendChild(el("div", "shot shot--pending",
        "pending &middot; " + MEDIA + (item.pending || "?")));
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

  function timing(mountId, items) {
    var mount = document.getElementById(mountId);
    if (!mount || !items) return;

    var t = el("table", "table table-sm align-middle checks");
    t.innerHTML = "<thead><tr><th>implementation</th><th>time</th><th></th></tr></thead>";
    var tb = el("tbody");
    items.forEach(function (i) {
      var tr = el("tr");
      tr.innerHTML =
        "<td>" + i.name + "</td>" +
        "<td class=\"value\">" + i.seconds.toFixed(3) + " s</td>" +
        "<td class=\"meta\">" + (i.note || "") + "</td>";
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    var scroller = el("div", "table-responsive");
    scroller.appendChild(t);
    mount.appendChild(scroller);
  }

  /* ---------- magnifier lens, same as the Project 1 page ---------- */

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

    timing("timing-table", RESULTS.timing);

    gallery("gallery-conv", RESULTS.conv, "conv");
    gallery("gallery-finite", RESULTS.finiteDiff, "finite", 4);
    gallery("gallery-thresholds", RESULTS.thresholds, "thresholds", 5);
    gallery("gallery-dog", RESULTS.dog, "dog", 4);
    gallery("gallery-sharpen", RESULTS.sharpenTaj, "sharpen", 4);
    gallery("gallery-alpha", RESULTS.sharpenAlpha, "alpha", 4);
    gallery("gallery-sharpen-mine", RESULTS.sharpenMine, "sharpenmine", 5);
    gallery("gallery-sharpen-tahoe", RESULTS.sharpenTahoe, "sharpentahoe", 5);
    gallery("gallery-hybrids", RESULTS.hybrids, "hybrids", 4);
    gallery("gallery-hybrids-mine", RESULTS.hybridsMine, "hybridsmine", 4);
    gallery("gallery-hybrids-animals", RESULTS.hybridsAnimals, "hybridsanimals", 4);
    gallery("gallery-blends", RESULTS.blends, "blends", 5);
    gallery("gallery-custom-blends", RESULTS.customBlends, "customblends", 4);
    gallery("gallery-irregular", RESULTS.irregularBlend, "irregular", 5);


    if (window.GLightbox) {
      GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true, zoomable: true });
    }

    magnifier();
  });
})();
