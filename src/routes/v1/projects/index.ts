import express, { Router } from "express";
import { listProjects, getProject, listProjectTasks } from "./controller";
// import authenticateUsers from "../../../middleware/authenticate-users";
import authenticateUser from "../../../middleware/auth-zero-authentication";

const projects = express.Router();

projects.use(authenticateUser);
projects.get("/", listProjects);
projects.get("/:id", getProject);
projects.get("/:id/tasks", listProjectTasks);

export default projects;
