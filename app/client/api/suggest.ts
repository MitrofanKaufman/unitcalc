// path: src/api/suggest.ts
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/suggest", async (req, res) => {
  const query = req.query.q;
  if (!query || typeof query !== "string") return res.status(400).json({ error: "No query" });

  try {
    const url = `https://suggests.wb.ru/suggests/api/v7/hint?query=${encodeURIComponent(query)}&locale=kz&lang=ru&appType=1`;
    const wbRes = await fetch(url);
    const data = await wbRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "WB Suggest failed" });
  }
});

export default router;
