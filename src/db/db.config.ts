import "reflect-metadata"
import { DataSource } from "typeorm"
import { UserEntity } from "../models/user.entity"
import { GroceryEntity } from "../models/grocery.entity"
import { OrderEntity } from "../models/order.entity"
import { OrderItemEntity } from "../models/orderItem.entity"
import { CartEntity } from "../models/cart.entity"
import { CartItemEntity } from "../models/cartItem.entity"
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [UserEntity, GroceryEntity, OrderEntity, OrderItemEntity, CartEntity, CartItemEntity]
})
