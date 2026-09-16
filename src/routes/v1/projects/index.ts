import express, { Router } from "express";
import { listProjects, getProject, listProjectTasks } from "./controller";
import authenticateUsers from "../../../middleware/authenticate-users";

const projects = express.Router();

projects.use(authenticateUsers);
projects.get("/", listProjects);
projects.get("/:id", getProject);
projects.get("/:id/tasks", listProjectTasks);

export default projects;
