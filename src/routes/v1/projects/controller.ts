import { Request, Response } from "express";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { projects, tasks } from "@/db/schema";
import EntityNotFoundError from "@/errors/EntityNotFoundError";
import logger from "@/logger";

export const listProjects = async (req: Request, res: Response) => {
  logger.debug("Requesting all projects");
  logger
    .child({
      logMetadata: `User ${req?.auth?.payload.sub}`,
    })
    .debug("is requesting all projects");

  const allProjects = await db.query.projects.findMany({
    where: eq(projects.userId, req.auth?.payload.sub as string),
  });
  if (allProjects.length === 0) {
    throw new EntityNotFoundError({
      message: "Entity not found",
      statusCode: 404,
      code: "ERR_NF",
    });
  }

  res.status(200).json(allProjects);
};

export const getProject = async (req: Request, res: Response) => {
  const id = req.params.id;

  logger.debug("Requesting a project");
  logger
    .child({
      logMetadata: `User ${req?.auth?.payload.sub}`,
    })
    .debug("is requesting a project");

  const project = await db.query.projects.findFirst({
    where: and(
      eq(projects.id, id),
      eq(projects.userId, req.auth?.payload.sub as string),
    ),
  });

  if (!project) {
    throw new EntityNotFoundError({
      message: "Entity not found",
      statusCode: 404,
      code: "ERR_NF",
    });
  }

  res.status(200).json(project);
};

export const listProjectTasks = async (req: Request, res: Response) => {
  const projectId = req.params.id;

  logger.debug("Requesting a project");
  logger
    .child({
      logMetadata: `User ${req?.auth?.payload.sub}`,
    })
    .debug("is requesting a project");

  const projectTasks = await db.query.tasks.findMany({
    where: and(
      eq(tasks.projectId, projectId),
      eq(tasks.userId, req.auth?.payload.sub as string),
    ),
  });

  if (projectTasks.length === 0) {
    throw new EntityNotFoundError({
      message: "Entity not found",
      statusCode: 404,
      code: "ERR_NF",
    });
  }

  res.status(200).json(projectTasks);
};

export const createProject = async (req: Request, res: Response) => {
  logger.debug("creating a project");
  logger
    .child({
      logMetadata: `Create project data ${req.body.toString()}`,
    })
    .debug("request body");

  await db
    .insert(projects)
    .values({ ...req.body, userId: req?.auth?.payload.sub });

  res.status(200).json({ message: "Task successfuly created." });
};
