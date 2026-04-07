import { Router } from "express";
import { OcrService } from "./ocr.service.js";
import { OcrController } from "./ocr.controller.js";
import { SearchService } from "../search/search.service.js";
import { SearchRepository } from "../search/search.repository.js";

const ocrRouter: Router = Router()

const searchRepository = new SearchRepository()
const searchService = new SearchService(searchRepository)
const ocrService = new OcrService(searchService)
const controller = new OcrController(ocrService)

ocrRouter.post("/search-medicine", controller.extractText.bind(controller))

export default ocrRouter