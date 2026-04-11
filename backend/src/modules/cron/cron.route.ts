import { Router } from "express";
import { CronRepository } from "./cron.repository.js";
import { CronService } from "./cron.service.js";
import { CronController } from "./cron.controller.js";

const cronRouter: Router = Router()

const repository = new CronRepository()
const service = new CronService(repository)
const controller = new CronController(service)

cronRouter.post("/add-new-list", controller.addNewList.bind(controller))

export default cronRouter