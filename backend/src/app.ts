import Express, { type Application } from "express";
import searchRouter from "./modules/search/search.route.js";
import { connectDB } from "./config/db.js";
import ocrRouter from "./modules/ocr/ocr.route.js";

const app: Application = Express();

app.use(Express.json());

app.use("/", searchRouter);
app.use("/ocr", ocrRouter);

app.listen(5000, async () => {
    await connectDB();
    console.log("server running on 5000");
});
