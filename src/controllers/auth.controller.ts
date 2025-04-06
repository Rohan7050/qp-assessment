import { NextFunction, Request, Response } from "express";
import sanitizeBody from "../middlewares/sanitizeBody.middleware";
import {
  registerModel,
  RegisterModelType,
} from "../db/repository/auth/register/registor.model";
import { catchAsyn } from "../utils/catchAsync";
import { createUser, findUserByEmailAndRole } from "../db/repository/auth/auth.db";
import { verifyPassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
import { loginModel, LoginModelType } from "../db/repository/auth/login/login.model";
import { createUserCart } from "../db/repository/cart/cart.db";

export const registerUser = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: RegisterModelType = sanitizeBody(registerModel, req.body) as RegisterModelType;
    const existingUser = await findUserByEmailAndRole(body!.email, "USER");
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }
    const user = await createUser(body, "USER");
    await createUserCart(user);
    return res.status(201).send({ message: "User Created" });
  }
);

export const registerAdmin = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: RegisterModelType = sanitizeBody(registerModel, req.body) as RegisterModelType;
    const existingUser = await findUserByEmailAndRole(body!.email, "ADMIN");
    if (existingUser) {
      return res.status(400).send({ message: "admin with this email already exists" });
    }
    await createUser(body, "ADMIN");
    return res.status(201).send({ message: "admin Created" });
  }
);

export const loginUser = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: LoginModelType = sanitizeBody(loginModel, req.body) as LoginModelType;
    const existingUser = await findUserByEmailAndRole(body!.email, "USER");
    if (!existingUser) {
      return res.status(400).send({ message: "User does not exists" });
    }
    const verifyUser: boolean = await verifyPassword(
      body.password,
      existingUser.password
    );
    if (!verifyUser)
      return res.status(400).send({ message: "Incorrect Password" });
    const token = generateToken({ email: body.email, id: existingUser.id }, {expiresIn: '2H'});
    return res.status(201).send({ message: "success", token });
  }
);


export const loginAdmin = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: LoginModelType = sanitizeBody(loginModel, req.body) as LoginModelType;
    const existingUser = await findUserByEmailAndRole(body!.email, "ADMIN");
    if (!existingUser) {
      return res.status(400).send({ message: "admin does not exists" });
    }
    const verifyUser: boolean = await verifyPassword(
      body.password,
      existingUser.password
    );
    if (!verifyUser)
      return res.status(400).send({ message: "Incorrect Password" });
    const token = generateToken({ email: body.email, id: existingUser.id }, {expiresIn: '2H'});
    return res.status(201).send({ message: "success", token });
  }
);