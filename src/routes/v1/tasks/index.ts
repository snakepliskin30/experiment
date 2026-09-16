import express, { Router } from "express";
import { listTasks, getTask } from "./controller";
import authenticateUsers from "../../../middleware/authenticate-users";

const tasks: Router = express.Router();

tasks.use(authenticateUsers);
tasks.get("/", listTasks);
tasks.get("/:id", getTask);

export default tasks;
