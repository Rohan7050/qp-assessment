import {
  Entity,
  Column,
  ManyToOne,
} from "typeorm";
import { OrderEntity } from "./order.entity";
import { GroceryEntity } from "./grocery.entity";
import { CommonEntity } from "./common.entity";

@Entity("order_items") // Table name
export class OrderItemEntity extends CommonEntity{

  @ManyToOne(() => OrderEntity, (order) => order.orderItems, {
    nullable: false,
    onDelete: "CASCADE",
  })
  order: OrderEntity;

  @ManyToOne(() => GroceryEntity, (grocery) => grocery.orderItems, {
    nullable: false,
    onDelete: "CASCADE",
  })
  grocery: GroceryEntity;

  @Column({
    type: "int",
    nullable: false,
  })
  quantity: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;
}
