import {
  IsNotEmpty,
  IsNumber,
} from "class-validator";

export class AddItemInCartDto {
  @IsNumber()
  @IsNotEmpty()
  groceryId!: string;
}
