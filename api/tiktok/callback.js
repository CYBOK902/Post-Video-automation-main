import { decodeSession, getRedirectUri, json, setSessionCookie, clearSessionCookie } from "./_utils.js";

export default async function handler(request, response) {
  const code = request.query.code;
  const state = request.query.state;
  const session = decodeSession(request);

  if (!code) {
    clearSessionCookie(response);
    return json(response, 400, { error: "TikTok did not return an authorization code." });
  }
  if (!session?.oauth_state || state !== session.oauth_state) {
    clearSessionCookie(response);
    return json(response, 400, { error: "Invalid OAuth state." });
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) {
    return json(response, 500, { error: "TikTok OAuth credentials are not configured." });
  }

  const tokenResponse = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: getRedirectUri(request)
    })
  });
  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || tokenData.error) {
    return json(response, 400, {
      error: tokenData.error_description || "TikTok rejected the authorization code."
    });
  }

  setSessionCookie(response, {
    access_token: tokenData.access_token,
    open_id: tokenData.open_id,
    expires_in: tokenData.expires_in
  });
  response.status(302).setHeader("Location", "/#how-it-works").end();
}
