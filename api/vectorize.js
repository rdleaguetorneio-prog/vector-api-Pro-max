export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // SVG fixo para debug (círculo vermelho)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <circle cx="150" cy="150" r="100" fill="red" />
  </svg>`;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
}