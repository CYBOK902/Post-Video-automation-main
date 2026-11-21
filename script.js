const publishButton = document.querySelector("#publish-demo");
const loginButton = document.querySelector("#tiktok-login");
const accountLabel = document.querySelector("#connected-account");
const resultLabel = document.querySelector("#publish-result");

async function refreshTikTokStatus() {
  try {
    const response = await fetch("/api/tiktok/status", { credentials: "same-origin" });
    const status = await response.json();

    if (status.connected) {
      loginButton.textContent = "TikTok Connected";
      loginButton.disabled = true;
      accountLabel.textContent = status.open_id ? `TikTok ${status.open_id.slice(0, 8)}…` : "TikTok connected";
    }
  } catch {
    accountLabel.textContent = "Not connected";
  }
}

loginButton?.addEventListener("click", () => {
  window.location.assign("/api/tiktok/login");
});

publishButton?.addEventListener("click", async () => {
  const videoUrl = document.querySelector("#video-url").value.trim();
  const caption = document.querySelector("#video-caption").value.trim();
  const privacyLevel = document.querySelector("#visibility").value;

  if (!videoUrl) {
    resultLabel.textContent = "Enter a public HTTPS video URL.";
    return;
  }

  publishButton.disabled = true;
  publishButton.textContent = "Submitting…";
  resultLabel.textContent = "";

  try {
    const response = await fetch("/api/tiktok/publish", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl, caption, privacyLevel })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Publishing could not be started.");
    }

    resultLabel.textContent = `Submitted. Publish ID: ${data.publish_id}`;
  } catch (error) {
    resultLabel.textContent = error.message;
  } finally {
    publishButton.disabled = false;
    publishButton.innerHTML = 'Publish to TikTok <span aria-hidden="true">→</span>';
  }
});

refreshTikTokStatus();

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
