const MAX_BYTES = 10 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const base = process.env.MODEL_API_URL;
  if (req.method === "GET") {
    if (!base) return res.status(200).json({ status: "offline", message: "Model service disconnected" });
    try {
      const r = await fetch(`${base.replace(/\/$/, "")}/health`, { signal: AbortSignal.timeout(5000) });
      return res.status(r.ok ? 200 : 502).json(await r.json());
    } catch { return res.status(502).json({ status: "offline", message: "Model service unreachable" }); }
  }
  if (req.method !== "POST") return res.status(405).json({ error: "GET or POST required" });
  if (!base) return res.status(503).json({ error: "Model service is not configured" });
  const length = Number(req.headers["content-length"] || 0);
  if (length > MAX_BYTES + 1_000_000) return res.status(413).json({ error: "Upload exceeds 10 MB" });
  try {
    const chunks = []; let total = 0;
    for await (const chunk of req) { total += chunk.length; if (total > MAX_BYTES + 1_000_000) return res.status(413).json({ error: "Upload too large" }); chunks.push(chunk); }
    const r = await fetch(`${base.replace(/\/$/, "")}/v1/analyze`, { method: "POST", headers: { "content-type": req.headers["content-type"] || "application/octet-stream" }, body: Buffer.concat(chunks), signal: AbortSignal.timeout(300000) });
    return res.status(r.status).json(await r.json());
  } catch { return res.status(502).json({ error: "Inference service unavailable" }); }
}
