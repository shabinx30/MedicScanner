import { Router } from "express";
import { SearchController } from "./search.controller.js";
import { SearchRepository } from "./search.repository.js";
import { searchService } from "./search.service.js";

const searchRouter: Router = Router();

const repo = new SearchRepository()
const service = new searchService(repo)
const controller = new SearchController(service)

searchRouter.get("/search-medicine", controller.searchMedicine.bind(controller))

export default searchRouter;
