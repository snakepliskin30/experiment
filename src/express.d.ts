import "express";
import "express-oauth2-jwt-bearer";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        payload: JwtPayload;
        token: string;
      };
    }
    interface VerifyJwtResult {
      header?: JWSHeaderParameters;
      payload: JWTPayload;
      token: string;
    }
  }
}
