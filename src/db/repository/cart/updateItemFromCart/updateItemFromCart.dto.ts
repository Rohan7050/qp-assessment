import {
  IsNotEmpty,
  IsNumber,
  Min,
} from "class-validator";

export class UpdateItemFromCartDto {
  @IsNumber()
  @IsNotEmpty()
  groceryId!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;
}
