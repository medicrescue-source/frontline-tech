// Promotions banner + "Current Offers" section, driven by promotions.json
(function () {
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  var now = new Date();
  var today = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());

  function active(p) {
    if (!p || p.enabled !== true) return false;
    if (p.start && today < p.start) return false;
    if (p.end && today > p.end) return false;
    return true;
  }

  function prettyDate(d) {
    var parts = d.split("-");
    var dt = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return dt.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  }

  function safeLink(href) {
    return href && !/^\s*javascript:/i.test(href);
  }

  function showBanner(b) {
    if (!active(b) || !b.text) return;
    var key = "promo-dismissed:" + b.text;
    try { if (sessionStorage.getItem(key)) return; } catch (e) {}

    var bar = document.createElement("div");
    bar.className = "promo-bar";

    var msg = document.createElement("span");
    msg.textContent = b.text;
    bar.appendChild(msg);

    if (safeLink(b.link) && b.linkText) {
      var a = document.createElement("a");
      a.href = b.link;
      a.textContent = b.linkText;
      bar.appendChild(a);
    }

    var close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", "Dismiss offer");
    close.textContent = "\u00d7";
    bar.appendChild(close);

    document.body.insertBefore(bar, document.body.firstChild);

    function setHeight() {
      document.documentElement.style.setProperty("--promo-h", bar.offsetHeight + "px");
    }
    setHeight();
    window.addEventListener("resize", setHeight);

    close.addEventListener("click", function () {
      bar.remove();
      document.documentElement.style.setProperty("--promo-h", "0px");
      window.removeEventListener("resize", setHeight);
      try { sessionStorage.setItem(key, "1"); } catch (e) {}
    });
  }

  function showPromos(list) {
    var section = document.getElementById("promos");
    var box = document.getElementById("promo-list");
    if (!section || !box || !Array.isArray(list)) return;

    var live = list.filter(active);
    if (!live.length) return;

    live.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "card show";

      var h = document.createElement("h3");
      h.textContent = p.title || "";
      card.appendChild(h);

      if (p.description) {
        var d = document.createElement("p");
        d.textContent = p.description;
        card.appendChild(d);
      }

      if (p.end) {
        var e = document.createElement("p");
        e.style.opacity = ".7";
        e.textContent = "Ends " + prettyDate(p.end);
        card.appendChild(e);
      }

      if (safeLink(p.link) && p.linkText) {
        var a = document.createElement("a");
        a.className = "btn";
        a.href = p.link;
        a.textContent = p.linkText;
        card.appendChild(a);
      }

      box.appendChild(card);
    });

    section.hidden = false;
  }

  fetch("promotions.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data) return;
      showBanner(data.banner);
      showPromos(data.promotions);
    })
    .catch(function () { /* if the file is missing or invalid, show nothing */ });
})();
