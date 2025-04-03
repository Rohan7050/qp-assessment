import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from "class-validator";

export class LoginAdminDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsNotEmpty()
  password!: string;
}
