import crypto from "node:crypto";

const SESSION_COOKIE = "postly_tiktok_session";

export function getOrigin(request) {
  const forwarded = request.headers["x-forwarded-proto"];
  const protocol = forwarded?.split(",")[0] || (request.headers.host?.includes("localhost") ? "http" : "https");
  return `${protocol}://${request.headers.host}`;
}

export function redirect(request, response, location) {
  response.status(302).setHeader("Location", location).end();
}

export function json(response, status, payload) {
  response.status(status).setHeader("Content-Type", "application/json").json(payload);
}

export function getRedirectUri(request) {
  return process.env.TIKTOK_REDIRECT_URI || `${getOrigin(request)}/api/tiktok/callback`;
}

export function sign(value) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured.");
  const signature = crypto.createHmac("sha256", secret).update(value).digest("base64url");
  return `${value}.${signature}`;
}

export function verify(signedValue) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || !signedValue) return null;
  const separator = signedValue.lastIndexOf(".");
  if (separator < 1) return null;
  const value = signedValue.slice(0, separator);
  const signature = signedValue.slice(separator + 1);
  const expected = crypto.createHmac("sha256", secret).update(value).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return value;
}

export function encodeSession(session) {
  return sign(Buffer.from(JSON.stringify(session)).toString("base64url"));
}

export function decodeSession(request) {
  const cookieHeader = request.headers.cookie || "";
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  if (!cookie) return null;
  const signed = decodeURIComponent(cookie.slice(cookie.indexOf("=") + 1));
  const value = verify(signed);
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function setSessionCookie(response, session) {
  const secure = process.env.VERCEL === "1" ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${encodeURIComponent(encodeSession(session))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`
  );
}

export function clearSessionCookie(response) {
  const secure = process.env.VERCEL === "1" ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
  );
}

export function randomState() {
  return crypto.randomBytes(24).toString("base64url");
}
