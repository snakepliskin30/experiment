import express, { Router } from "express";
import { listTasks, getTask, createTask } from "./controller";
// import authenticateUsers from "../../../middleware/authenticate-users";
import authenticateUser from "../../../middleware/auth-zero-authentication";
import validateRequestBodySchema from "../../../middleware/validate-schema";
import { TaskInsertSchema } from "../../../db/schema";

const tasks: Router = express.Router();

tasks.use(authenticateUser);
tasks.get("/", listTasks);
tasks.get("/:id", getTask);
tasks.post("/", validateRequestBodySchema(TaskInsertSchema), createTask);

export default tasks;
