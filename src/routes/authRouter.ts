import express from 'express';
import validationMiddleware from '../middlewares/validation.middleware';
import { LoginUserDto } from '../db/repository/auth/login/login.user.dto';
import { RegisterUserDto } from '../db/repository/auth/register/registor.user.dto';
import { loginAdmin, loginUser, registerAdmin, registerUser } from '../controllers/auth.controller';
import { RegisterAdminDto } from '../db/repository/auth/register/registor.admin.dto';
import { LoginAdminDto } from '../db/repository/auth/login/login.admin.dto';

const authRouter = express.Router();

authRouter.post('/register', validationMiddleware(RegisterUserDto), registerUser);

authRouter.post('/login', validationMiddleware(LoginUserDto), loginUser);

authRouter.post('/admin/register', validationMiddleware(RegisterAdminDto), registerAdmin);

authRouter.post('/admin/login', validationMiddleware(LoginAdminDto), loginAdmin);

export default authRouter;