import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity";
import { CommonEntity } from "./common.entity";
import { OrderItemEntity } from "./orderItem.entity";

@Entity("orders") // Table name
export class OrderEntity extends CommonEntity {
  @ManyToOne(() => UserEntity, (user) => user.orders, {
    nullable: false,
    onDelete: "CASCADE",
  })
  user: UserEntity;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: false,
  })
  totalprice: number;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order, {
    cascade: true,
  })
  orderItems: OrderItemEntity[];
}
