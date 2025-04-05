import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class GroceryCreateNewDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name!: string;

  @IsNumber()
  @Min(0, { message: "Price cannot be negative" })
  @IsNotEmpty()
  price!: number;

  @IsNumber()
  @Min(0, { message: "Stock cannot be negative" })
  @IsNotEmpty()
  stock!: string;
}
