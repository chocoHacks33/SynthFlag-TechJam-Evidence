export const config = { api: { bodyParser: false } };
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST required" });
  const base = process.env.MODEL_API_URL;
  if (!base) return res.status(503).json({ error: "Model service is not configured" });
  const max = 17 * 1024 * 1024, length = Number(req.headers["content-length"] || 0);
  if (length > max) return res.status(413).json({ error: "Derived frames exceed 17 MB" });
  try {
    const chunks = []; let total = 0;
    for await (const chunk of req) { total += chunk.length; if (total > max) return res.status(413).json({ error: "Derived frames too large" }); chunks.push(chunk); }
    const r = await fetch(`${base.replace(/\/$/, "")}/v1/analyze-frames`, { method: "POST", headers: { "content-type": req.headers["content-type"] || "application/octet-stream" }, body: Buffer.concat(chunks), signal: AbortSignal.timeout(300000) });
    return res.status(r.status).json(await r.json());
  } catch { return res.status(502).json({ error: "Inference service unavailable" }); }
}
