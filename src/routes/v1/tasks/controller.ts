import { NextFunction, Request, Response } from "express";
import EntityNotFoundError from "@/errors/EntityNotFoundError";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import logger from "@/logger";

export const listTasks = async (req: Request, res: Response) => {
  logger.debug("Requesting all tasks");
  logger
    .child({
      logMetadata: `User ${req?.auth?.payload.sub}`,
    })
    .debug("is requesting all tasks");

  const allTasks = await db.query.tasks.findMany({
    where: eq(tasks.userId, req?.auth?.payload?.sub as string),
  });

  if (allTasks.length === 0) {
    throw new EntityNotFoundError({
      message: "Entity not found",
      statusCode: 404,
      code: "ERR_NF",
    });
  }

  res.status(200).json(allTasks);
};

export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  logger.debug("Requesting a tasks");
  logger
    .child({
      logMetadata: `User ${req?.auth?.payload.sub}`,
    })
    .debug("is requesting a tasks");

  const task = await db.query.tasks.findFirst({
    where: and(
      eq(tasks.id, id),
      eq(tasks.userId, req?.auth?.payload?.sub as string),
    ),
  });

  if (!task) {
    throw new EntityNotFoundError({
      message: "Entity not found",
      statusCode: 404,
      code: "ERR_NF",
    });
  }
  res.status(200).json(task);
};

export const createTask = async (req: Request, res: Response) => {
  logger.debug("creating a task");
  logger
    .child({
      logMetadata: `Create task data ${req.body.toString()}`,
    })
    .debug("request body");

  await db
    .insert(tasks)
    .values({ ...req.body, userId: req?.auth?.payload.sub });

  res.status(200).json({ message: "Task successfuly created." });
};
