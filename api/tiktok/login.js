import { getRedirectUri, randomState, redirect, setSessionCookie, sign } from "./_utils.js";

export default function handler(request, response) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  if (!clientKey) {
    return response.status(500).send("TIKTOK_CLIENT_KEY is not configured.");
  }

  const state = randomState();
  setSessionCookie(response, { oauth_state: state });

  const parameters = new URLSearchParams({
    client_key: clientKey,
    scope: "video.publish",
    response_type: "code",
    redirect_uri: getRedirectUri(request),
    state
  });

  redirect(request, response, `https://www.tiktok.com/v2/auth/authorize/?${parameters}`);
}
