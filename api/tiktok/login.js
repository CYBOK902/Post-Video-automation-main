import { getRedirectUri, randomState, redirect, setSessionCookie } from "./_utils.js";

export default function handler(request, response) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) {
    const redirectUri = getRedirectUri(request);
    return response
      .status(503)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TikTok setup required | Postly</title>
    <style>
      body { margin: 0; padding: 48px 20px; background: #f6f7f2; color: #172238; font: 16px/1.6 system-ui, sans-serif; }
      main { max-width: 640px; margin: auto; padding: 32px; border-radius: 12px; background: white; box-shadow: 0 12px 40px #06162f15; }
      h1 { margin-top: 0; font-size: 28px; }
      code { overflow-wrap: anywhere; }
      a { color: #397a82; }
    </style>
  </head>
  <body>
    <main>
      <h1>TikTok connection is not configured yet</h1>
      <p>Add <code>TIKTOK_CLIENT_KEY</code> and <code>TIKTOK_CLIENT_SECRET</code> to the Vercel project's Production environment variables, then redeploy.</p>
      <p>Register this exact OAuth redirect URI in the TikTok developer app:</p>
      <p><code>${redirectUri}</code></p>
      <p>Keep the client secret private. Do not send it in chat or commit it to GitHub.</p>
      <p><a href="/">Return to Postly</a></p>
    </main>
  </body>
</html>`);
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
