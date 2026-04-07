import { Router } from "express";
import { SearchController } from "./search.controller.js";
import { SearchRepository } from "./search.repository.js";
import { SearchService } from "./search.service.js";

const searchRouter: Router = Router();

const repo = new SearchRepository()
const service = new SearchService(repo)
const controller = new SearchController(service)

searchRouter.post("/search-medicine", controller.searchMedicine.bind(controller))

export default searchRouter;
