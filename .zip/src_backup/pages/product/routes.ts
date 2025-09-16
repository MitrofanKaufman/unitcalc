// path: src/core/utils/search/routes.ts
import express from "express";
import { handleSuggest } from "@/pages/product/suggest";

const router = express.Router();

router.get("/api/suggest", handleSuggest);

export default router;
