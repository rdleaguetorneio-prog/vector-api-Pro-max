import formidable from "formidable";
import fs from "fs";
import { Posterizer, Potrace } from "potrace";

export const config = {
  api: { bodyParser: false }
};

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

  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Erro ao processar upload." });
      return;
    }

    const mode = fields.mode || "color";
    const colors = parseInt(fields.colors || "8", 10);

    const filePath = files.image[0].filepath;

    try {
      if (mode === "bw") {
        const trace = new Potrace();
        trace.loadImage(filePath, (err) => {
          if (err) return res.status(500).json({ error: "Falha no Potrace." });
          trace.setParameters({ threshold: 128 });
          trace.getSVG((err, svg) => {
            if (err) return res.status(500).json({ error: "Erro ao gerar SVG." });
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Content-Type", "image/svg+xml");
            res.status(200).send(svg);
          });
        });
      } else {
        const poster = new Posterizer({ steps: colors });
        poster.loadImage(filePath, (err) => {
          if (err) return res.status(500).json({ error: "Falha no Posterizer." });
          poster.getSVG((err, svg) => {
            if (err) return res.status(500).json({ error: "Erro ao gerar SVG colorido." });
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Content-Type", "image/svg+xml");
            res.status(200).send(svg);
          });
        });
      }
    } catch (e) {
      res.status(500).json({ error: "Erro inesperado." });
    }
  });
}
