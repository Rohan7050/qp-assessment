import { Entity, ManyToOne, Column } from "typeorm";
import { CartEntity } from "./cart.entity";
import { GroceryEntity } from "./grocery.entity";
import { CommonEntity } from "./common.entity";

@Entity()
export class CartItemEntity extends CommonEntity {
  @ManyToOne(() => CartEntity, (cart) => cart.items)
  cart: CartEntity;

  @ManyToOne(() => GroceryEntity)
  grocery: GroceryEntity;

  @Column({
    type: "int",
    default: 1,
    nullable: false,
  })
  quantity: number;
}
