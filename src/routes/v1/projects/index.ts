import express, { Router } from "express";
import {
  listProjects,
  getProject,
  listProjectTasks,
  createProject,
} from "./controller";
// import authenticateUsers from "../../../middleware/authenticate-users";
import authenticateUser from "../../../middleware/auth-zero-authentication";
import validateRequestBodySchema from "../../../middleware/validate-schema";
import { ProjectInsertSchema } from "../../../db/schema";

const projects = express.Router();

projects.use(authenticateUser);
projects.get("/", listProjects);
projects.get("/:id", getProject);
projects.get("/:id/tasks", listProjectTasks);
projects.post(
  "/",
  validateRequestBodySchema(ProjectInsertSchema),
  createProject,
);

export default projects;
