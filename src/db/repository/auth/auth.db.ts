import { UserEntity } from "../../../models/user.entity";
import { encryptPassword } from "../../../utils/bcrypt";
import { AppDataSource } from "../../db.config";
import { RegisterModelType } from "./register/registor.model";

const userRepository = AppDataSource.getRepository(UserEntity);

export const findUserByEmailAndRole = async (
  email: string,
  role: string
): Promise<RegisterModelType | null> => {
  const user: RegisterModelType | null = await userRepository.findOneBy({
    email,
    role
  });
  if (user) return user;
  return null;
};

export const findUserByEmailAndRoleAndId = async (
  email: string,
  id: number,
  role: string
): Promise<RegisterModelType | null> => {
  const user: RegisterModelType | null = await userRepository.findOneBy({
    id,
    email,
    role
  });
  if (user) return user;
  return null;
};

export const createUser = async (body: RegisterModelType, role: string): Promise<void> => {
  console.log(body);
  const hashedPassword = await encryptPassword(body.password);
  const user = UserEntity.create({
    ...body,
    role,
    password: hashedPassword,
  });
  await user.save();
};
