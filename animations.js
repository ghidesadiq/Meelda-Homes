/* ============================================
   SCROLL-REVEAL ANIMATIONS
   Any element with class="reveal" will fade/slide
   up into view the first time it scrolls into the
   viewport. Add the class to any section on any
   page to reuse this — no extra JS needed elsewhere.
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
    var revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    // Older-browser fallback: just show everything immediately
    if (!("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("in-view"); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target); // only animate once
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
});
