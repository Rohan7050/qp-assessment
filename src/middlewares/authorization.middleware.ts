import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";
import { catchAsyn } from "../utils/catchAsync";
import { findUserByEmailAndRoleAndId } from "../db/repository/auth/auth.db";
import { RegisterModelType } from "../db/repository/auth/register/registor.model";

export const userAuthorizationMiddleware = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers?.authorization;
    if (!bearerToken)
      return res.status(401).json({ message: "Token required" });
    const token = bearerToken.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "Token required" });
    const verifyTokenData = verifyToken(token);
    if (!verifyTokenData)
      return res.status(403).json({ message: "Access denied" });
    const user: RegisterModelType | null = await findUserByEmailAndRoleAndId(
      verifyTokenData.email,
      verifyTokenData.id,
      "USER"
    );
    if (user === null)
      return res.status(403).json({ message: "Access denied" });
    next();
  }
);

export const adminAuthorizationMiddleware = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers?.authorization;
    if (!bearerToken)
      return res.status(401).json({ message: "Token required" });
    const token = bearerToken.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "Token required" });
    const verifyTokenData = verifyToken(token);
    if (!verifyTokenData)
      return res.status(403).json({ message: "Access denied" });
    const user: RegisterModelType | null = await findUserByEmailAndRoleAndId(
      verifyTokenData.email,
      verifyTokenData.id,
      "ADMIN"
    );
    if (user === null)
      return res.status(403).json({ message: "Access denied" });
    next();
  }
);
