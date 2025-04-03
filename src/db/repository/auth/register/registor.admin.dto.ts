import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @IsNotEmpty()
  username!: string;

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