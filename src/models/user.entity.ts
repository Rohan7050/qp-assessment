import { Entity, Column, OneToMany, Index } from 'typeorm';
import { CommonEntity } from './common.entity';
import { OrderEntity } from './order.entity';

@Entity('user')
@Index(["email", "role"], { unique: true })
export class UserEntity extends CommonEntity {
  @Column({
    type: 'varchar', 
    length: 50,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar', 
    length: 100,
    nullable: false,
    unique: false,
  })
  email: string;

  @Column({
    type: 'varchar', 
    length: 500,
    nullable: false
  })
  password: string;

  @Column({
    type: 'enum',
    default: 'USER',
    enum: ['ADMIN', 'USER']
  })
  role: string;

  @OneToMany(() => OrderEntity, (order) => order.user, { cascade: true })
  orders: OrderEntity[];
}
