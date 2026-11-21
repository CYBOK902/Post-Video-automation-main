import { decodeSession, json } from "./_utils.js";

export default function handler(request, response) {
  const session = decodeSession(request);
  json(response, 200, {
    connected: Boolean(session?.access_token),
    open_id: session?.open_id || null
  });
}
