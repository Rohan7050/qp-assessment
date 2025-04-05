import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class GroceryUpdateItemDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  @IsOptional()
  name!: string;

  @IsNumber()
  @Min(0, { message: "Price cannot be negative" })
  @IsOptional()
  price!: number;

  @IsNumber()
  @Min(0, { message: "Stock cannot be negative" })
  @IsOptional()
  stock!: string;
}
