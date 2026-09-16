import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import DataValidationError from "../errors/DataValidationError";

function validateRequestBodySchema(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestBody = req.body;
    const validated = schema.safeParse(requestBody);
    if (!validated.success) {
      throw new DataValidationError({
        message: `Field: ${validated.error.issues[0].path} -- ${validated.error.issues[0].message}`,
        code: "ERR_VALIDATION",
        statusCode: 400,
      });
    }

    req.body = validated.data;
    next();
  };
}

export default validateRequestBodySchema;
