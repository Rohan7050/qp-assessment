import "reflect-metadata"
import { DataSource } from "typeorm"
import { UserEntity } from "../models/user.entity"
import { GroceryEntity } from "../models/grocery.entity"
import { OrderEntity } from "../models/order.entity"
import { OrderItemEntity } from "../models/orderItem.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "postgres",
    password: "postgres",
    database: "qp_database",
    synchronize: true,
    logging: false,
    entities: [UserEntity, GroceryEntity, OrderEntity, OrderItemEntity],
    migrations: [],
    subscribers: [],
})
