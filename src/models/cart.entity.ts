import { Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { CommonEntity } from "./common.entity";
import { CartItemEntity } from "./cartItem.entity";

@Entity("cart")
export class CartEntity extends CommonEntity {
  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (item) => item.cart, {
    cascade: true,
  })
  items: CartItemEntity[];
}
