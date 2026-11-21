import { clearSessionCookie, redirect } from "./_utils.js";

export default function handler(request, response) {
  clearSessionCookie(response);
  redirect(request, response, "/");
}
