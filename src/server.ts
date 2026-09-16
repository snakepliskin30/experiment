import express, { Request, Response } from "express";
import cors from "cors";
import config from "./config";
import v1 from "./routes/v1";
import errorHandler from "./middleware/error-handler";
import morganMiddleware from "./middleware/morgan-middleware";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morganMiddleware)
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors());

  app.get("/health", (req: Request, res: Response) => {
    res.json({ ok: true, environment: config.env });
  });

  app.post("/payment", (req: Request, res: Response) => {
    const body = req.body;
    console.log("body", body);
    res.json({ body });
  });

  app.use("/v1", v1);

  app.use(errorHandler);

  return app;
};
