import Express, { type Application } from "express";
import searchRouter from "./modules/search/search.route.js";

const app: Application = Express();

app.use(Express.json());

app.use("/", searchRouter);

app.listen(5000, () => {
    console.log("server running on 5000");
});
