// расположение: ./tests/server.ts
// path: unittest/server.js
import express from "express";
const app = express();
const port = 3000;
app.get("/product/:id", (req, res) => {
    res.json({ productId: req.params.id, name: "Test product" });
});
app.listen(port, () => {
    console.log(`Test API server listening at http://localhost:${port}`);
});
