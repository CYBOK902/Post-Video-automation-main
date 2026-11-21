const publishButton = document.querySelector("#publish-demo");
const loginButton = document.querySelector("#tiktok-login");
const accountLabel = document.querySelector("#connected-account");
const resultLabel = document.querySelector("#publish-result");
const isGitHubPages = window.location.hostname === "cybok902.github.io";
const appUrl = "https://postly-tiktok-live.vercel.app";

async function readJson(response) {
  const contentType = response.headers.get("content-type") || "";
  const body = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error("The publishing service returned an unexpected response. Open the Vercel dashboard and try again.");
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error("The publishing service returned invalid data. Please try again later.");
  }
}

async function refreshTikTokStatus() {
  if (isGitHubPages) {
    accountLabel.textContent = "Connect in the secure publishing dashboard";
    loginButton.textContent = "Open publishing app";
    return;
  }

  try {
    const response = await fetch("/api/tiktok/status", { credentials: "same-origin" });
    const status = await readJson(response);

    if (status.connected) {
      loginButton.textContent = "TikTok Connected";
      loginButton.disabled = true;
      accountLabel.textContent = status.open_id ? `TikTok ${status.open_id.slice(0, 8)}…` : "TikTok connected";
    }
  } catch (error) {
    accountLabel.textContent = error.message;
  }
}

loginButton?.addEventListener("click", () => {
  if (isGitHubPages) {
    window.location.assign(`${appUrl}/#how-it-works`);
    return;
  }
  window.location.assign("/api/tiktok/login");
});

publishButton?.addEventListener("click", async () => {
  if (isGitHubPages) {
    window.location.assign(`${appUrl}/#how-it-works`);
    return;
  }

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
    const data = await readJson(response);

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
