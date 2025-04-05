import { IsInt, Min, IsIn } from "class-validator";

export class InventoryUpdateDTO {
  @IsInt()
  @Min(0)
  quantity: number;

  @IsIn(["add", "subtract", "set"])
  operation: "add" | "subtract" | "set";
}
