// расположение: ./api/v1/routes/json/seller.ts
import { Router } from "express";
import scrapeSellerById from "@api/seller";
const router = Router();
router.get("/seller", async (req, res) => {
  const id = (req.query.id || "").match(/^\d+$/)?.[0];
  if (!id)
    return res.status(400).json({ error: "Invalid id" });
  try {
    const data = await scrapeSellerById(id);
    res.json(data);
  }
  catch (e) {
    res.status(500).json({ error: e.message });
  }
});
export default router;
