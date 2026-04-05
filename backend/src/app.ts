import Express, { type Application } from "express";
import searchRouter from "./modules/search/search.route.js";
import { connectDB } from "./config/db.js";

const app: Application = Express();

app.use(Express.json());

app.use("/", searchRouter);

app.listen(5000, async () => {
    await connectDB();
    console.log("server running on 5000");
});
