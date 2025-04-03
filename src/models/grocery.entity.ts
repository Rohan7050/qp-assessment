import { Entity, Column, OneToMany } from "typeorm";
import { CommonEntity } from "./common.entity";
import { OrderItemEntity } from "./orderItem.entity";

@Entity("grocery")
export class GroceryEntity extends CommonEntity {
  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: "decimal",
    nullable: false,
  })
  price: number;

  @Column({
    type: "int",
    nullable: false,
  })
  stock: number;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.grocery, {
    cascade: true,
  })
  orderItems: OrderItemEntity[];
}
