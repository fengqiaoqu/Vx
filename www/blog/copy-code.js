/* Copy button for <pre><code> blocks in Vx blog posts. */
(function () {
  function plainText(pre) {
    var code = pre.querySelector("code");
    return (code || pre).textContent;
  }

  function enhance(pre) {
    if (pre.closest(".code-block")) return;
    var wrap = document.createElement("div");
    wrap.className = "code-block";
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-code";
    btn.setAttribute("aria-label", "Copy code");
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      var text = plainText(pre);
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        return;
      }
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = "Copied";
        setTimeout(function () {
          btn.textContent = "Copy";
        }, 1600);
      });
    });
    wrap.appendChild(btn);
  }

  function run() {
    var root = document.querySelector("article.post") || document.querySelector("article");
    if (!root) return;
    root.querySelectorAll("pre").forEach(enhance);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
