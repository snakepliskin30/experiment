import { Request, Response } from "express";
import { db } from "../../../db";
import { eq, and } from "drizzle-orm";
import { projects, tasks } from "../../../db/schema";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";

export const listProjects = async (req: Request, res: Response) => {
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
