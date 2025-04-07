import { NextFunction, Request, Response } from "express";
import sanitizeBody from "../middlewares/sanitizeBody.middleware";
import {
  registerModel,
  RegisterModelType,
} from "../db/repository/auth/register/registor.model";
import { catchAsyn } from "../utils/catchAsync";
import {
  createUser,
  findUserByEmailAndRole,
} from "../db/repository/auth/auth.db";
import { verifyPassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
import {
  loginModel,
  LoginModelType,
} from "../db/repository/auth/login/login.model";
import { createUserCart } from "../db/repository/cart/cart.db";
import {
  CreateSuccessResponse,
  SuccessResponse,
} from "../core/successResponse";
import { BadRequestResponse, NotFoundResponse } from "../core/failureResponse";

export const registerUser = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: RegisterModelType = sanitizeBody(
      registerModel,
      req.body
    ) as RegisterModelType;
    const existingUser = await findUserByEmailAndRole(body!.email, "USER");
    if (existingUser) {
      return new BadRequestResponse("User already exists").send(res);
    }
    const user = await createUser(body, "USER");
    await createUserCart(user);
    return new CreateSuccessResponse("success", user).send(res);
  }
);

export const registerAdmin = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: RegisterModelType = sanitizeBody(
      registerModel,
      req.body
    ) as RegisterModelType;
    const existingUser = await findUserByEmailAndRole(body!.email, "ADMIN");
    if (existingUser) {
      return new BadRequestResponse(
        "admin with this email already exists"
      ).send(res);
    }
    const admin = await createUser(body, "ADMIN");
    return new CreateSuccessResponse("admin Created", admin).send(res);
  }
);

export const loginUser = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: LoginModelType = sanitizeBody(
      loginModel,
      req.body
    ) as LoginModelType;
    const existingUser = await findUserByEmailAndRole(body!.email, "USER");
    if (!existingUser) {
      return new NotFoundResponse("User does not exists").send(res);
    }
    const verifyUser: boolean = await verifyPassword(
      body.password,
      existingUser.password
    );
    if (!verifyUser)
      return new BadRequestResponse("Incorrect Password").send(res);
    const token = generateToken(
      { email: body.email, id: existingUser.id },
      { expiresIn: "2H" }
    );
    return new SuccessResponse("success", { token }).send(res);
  }
);

export const loginAdmin = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: LoginModelType = sanitizeBody(
      loginModel,
      req.body
    ) as LoginModelType;
    const existingUser = await findUserByEmailAndRole(body!.email, "ADMIN");
    if (!existingUser) {
      return new NotFoundResponse("Admin does not exists").send(res);
    }
    const verifyUser: boolean = await verifyPassword(
      body.password,
      existingUser.password
    );
    if (!verifyUser)
      return new BadRequestResponse("Incorrect Password").send(res);
    const token = generateToken(
      { email: body.email, id: existingUser.id },
      { expiresIn: "2H" }
    );
    return new SuccessResponse("success", { token }).send(res);
  }
);
