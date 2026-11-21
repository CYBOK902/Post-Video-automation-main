import { decodeSession, json } from "./_utils.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return json(response, 405, { error: "Method not allowed." });
  }

  const session = decodeSession(request);
  if (!session?.access_token) {
    return json(response, 401, { error: "Connect your TikTok account first." });
  }

  const { videoUrl, caption = "", privacyLevel = "PUBLIC_TO_EVERYONE" } = request.body || {};
  let parsedUrl;
  try {
    parsedUrl = new URL(videoUrl);
  } catch {
    return json(response, 400, { error: "Enter a valid public video URL." });
  }
  if (parsedUrl.protocol !== "https:") {
    return json(response, 400, { error: "The video URL must use HTTPS." });
  }

  const allowedPrivacy = new Set([
    "PUBLIC_TO_EVERYONE",
    "MUTUAL_FOLLOW_FRIENDS",
    "FOLLOWER_OF_CREATOR",
    "SELF_ONLY"
  ]);
  if (!allowedPrivacy.has(privacyLevel)) {
    return json(response, 400, { error: "Invalid privacy level." });
  }
  if (caption.length > 2200) {
    return json(response, 400, { error: "Caption exceeds 2200 characters." });
  }

  const publishResponse = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      post_info: {
        title: caption,
        privacy_level: privacyLevel,
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false
      },
      source_info: {
        source: "PULL_FROM_URL",
        video_url: parsedUrl.toString()
      }
    })
  });
  const publishData = await publishResponse.json();

  if (!publishResponse.ok || publishData.error?.code !== "ok") {
    return json(response, publishResponse.status || 400, {
      error: publishData.error?.message || "TikTok could not initialize publishing."
    });
  }

  json(response, 200, {
    publish_id: publishData.data?.publish_id,
    status: publishData.data?.status || "PROCESSING_DOWNLOAD"
  });
}
