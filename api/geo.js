// Vercel function: tells the app which country the visitor is in (free, no third party).
export default function handler(req, res) {
  res.setHeader("Cache-Control", "private, max-age=3600");
  res.status(200).json({ country: req.headers["x-vercel-ip-country"] || null, city: decodeURIComponent(req.headers["x-vercel-ip-city"] || "") });
}
