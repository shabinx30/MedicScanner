import Express, { type Application } from "express";
import searchRouter from "./modules/search/search.route.js";
import { connectDB } from "./config/db.js";
import ocrRouter from "./modules/ocr/ocr.route.js";
import cors from "cors";
import cronRouter from "./modules/cron/cron.route.js";
import { allowedOrigins } from "./config/allowedOrigins.js";

const app: Application = Express();

const corsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
    ) => {
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
    credentials: false,
};

app.use(cors(corsOptions));

app.use(Express.json({ limit: "50mb" }));
app.use(Express.urlencoded({ limit: "50mb", extended: true }));

app.use("/", searchRouter);
app.use("/ocr", ocrRouter);
app.use("/cron", cronRouter);

app.listen(5000, async () => {
    await connectDB();
    console.log("server running on 5000");
});
