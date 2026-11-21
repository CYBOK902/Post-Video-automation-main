const publishButton = document.querySelector("#publish-demo");

publishButton?.addEventListener("click", () => {
  const originalContent = publishButton.innerHTML;
  publishButton.textContent = "Requires TikTok authorization";
  publishButton.disabled = true;

  window.setTimeout(() => {
    publishButton.innerHTML = originalContent;
    publishButton.disabled = false;
  }, 2600);
});

const revealTargets = document.querySelectorAll(".feature-card, .workflow-panel, .security-card");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.animate(
          [
            { opacity: 0, transform: "translateY(16px)" },
            { opacity: 1, transform: "translateY(0)" }
          ],
          { duration: 500, easing: "ease-out", fill: "both" }
        );
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((target) => observer.observe(target));
}
