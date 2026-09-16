import express, { Router } from "express";
import { listTasks, getTask } from "./controller";
// import authenticateUsers from "../../../middleware/authenticate-users";
import authenticateUser from "../../../middleware/auth-zero-authentication";

const tasks: Router = express.Router();

tasks.use(authenticateUser);
tasks.get("/", listTasks);
tasks.get("/:id", getTask);

export default tasks;
