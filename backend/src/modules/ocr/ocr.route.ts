import { Router } from "express";
import { OcrService } from "./ocr.service.js";
import { OcrController } from "./ocr.controller.js";

const ocrRouter: Router = Router()

const service = new OcrService()
const controller = new OcrController(service)

ocrRouter.post("/search-medicine", controller.extractText.bind(controller))

export default ocrRouter