// path: src/core/utils/search/server.ts
import express from "express";
import cors from "cors";
import suggestRoutes from "@utils/search/routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(suggestRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
