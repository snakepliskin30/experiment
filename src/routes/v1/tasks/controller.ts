import { NextFunction, Request, Response } from "express";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";
import { db } from "../../../db";
import { tasks } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

export const listTasks = async (req: Request, res: Response) => {
  const allTasks = await db.query.tasks.findMany();

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
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
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
