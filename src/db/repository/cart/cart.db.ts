import { CartEntity } from "../../../models/cart.entity";
import { UserEntity } from "../../../models/user.entity";
import { AppDataSource } from "../../db.config";
import { CartItemEntity } from "../../../models/cartItem.entity";
import { GroceryEntity } from "../../../models/grocery.entity";
import { OrderEntity } from "../../../models/order.entity";
import { OrderItemEntity } from "../../../models/orderItem.entity";
import { PlaceOrderModelType } from "./placeOrder/placeOrder.model";

const cartRepository = AppDataSource.getRepository(CartEntity);
const cartItemRepository = AppDataSource.getRepository(CartItemEntity);
const orderRepository = AppDataSource.getRepository(OrderEntity);

export const createUserCart = async (
  user: UserEntity
): Promise<CartEntity | null> => {
  const newItem = CartEntity.create({
    user,
  });
  const cart = await cartRepository.save(newItem);
  return cart;
};

export const getUserCartById = async (
  userId: number
): Promise<CartEntity | null> => {
  const userCart = await cartRepository.findOne({
    where: { user: { id: userId } },
    relations: { items: { grocery: true } },
  });
  return userCart;
};

export const checkItemInUserCart = async (
  cart: CartEntity,
  grocery: GroceryEntity
): Promise<boolean> => {
  const cartItem = await cartItemRepository.findOne({
    where: {
      cart: { id: cart.id },
      grocery: { id: grocery.id },
    },
  });
  if (cartItem) return true;
  return false;
};

export const addItemInUserCart = async (
  cart: CartEntity,
  grocery: GroceryEntity
): Promise<CartItemEntity> => {
  const cartItem = CartItemEntity.create({ cart, grocery });
  const saveItem = await cartItemRepository.save(cartItem);
  return saveItem;
};

export const removeItemFromUserCart = async (
  cart: CartEntity,
  grocery: GroceryEntity
): Promise<boolean> => {
  const cartItem = await cartItemRepository.findOne({
    where: {
      cart: { id: cart.id },
      grocery: { id: grocery.id },
    },
  });
  if (!cartItem) return false;
  await cartItem.remove();
  return true;
};

export const emptyUserCart = async (userId: number) => {
  const cart = await cartRepository.findOne({
    where: { user: { id: userId } },
    relations: { items: true },
  });
  if (!cart || cart.items.length === 0) return true;
  await cartItemRepository.remove(cart.items);
  return true;
};

export const updateGroceryItemInUserCart = async (
  cart: CartEntity,
  grocery: GroceryEntity,
  quantity: number
): Promise<boolean> => {
  const cartItem = await cartItemRepository.findOne({
    where: {
      cart: { id: cart.id },
      grocery: { id: grocery.id },
    },
  });
  if (!cartItem) return false;
  cartItem.quantity = quantity;
  await cartItem.save();
  return true;
};

export const placeOrderFromCart = async (
  userId: number
): Promise<PlaceOrderModelType> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const cartRepository = queryRunner.manager.getRepository(CartEntity);
    const groceryRepository = queryRunner.manager.getRepository(GroceryEntity);
    const orderRepository = queryRunner.manager.getRepository(OrderEntity);
    const orderItemRepository =
      queryRunner.manager.getRepository(OrderItemEntity);
    const cartItemRepository =
      queryRunner.manager.getRepository(CartItemEntity);

    const cart = await cartRepository.findOne({
      where: { user: { id: userId } },
      relations: { items: { grocery: true } },
    });

    if (!cart || cart.items.length === 0) {
      await queryRunner.rollbackTransaction();
      return { error: true, message: "Cart is empty", data: null };
    }
    const order: OrderEntity = orderRepository.create({
      user: { id: userId } as UserEntity,
      totalprice: 0,
    });
    const userOrder = await orderRepository.save(order);
    let total = 0;
    const orderItems: OrderItemEntity[] = [];
    for (const cartItem of cart.items) {
      const grocery = cartItem.grocery;

      if (grocery.stock < cartItem.quantity) {
        await queryRunner.rollbackTransaction();
        return {
          error: true,
          message: `Insufficient stock for item: ${grocery.name}`,
          data: null,
        };
      }

      grocery.stock -= cartItem.quantity;
      await groceryRepository.save(grocery);
      const orderItem = orderItemRepository.create({
        order: userOrder,
        grocery,
        quantity: cartItem.quantity,
        price: grocery.price,
      });

      total += grocery.price * cartItem.quantity;
      orderItems.push(orderItem);
    }
    userOrder.totalprice = total;
    await orderRepository.save(userOrder);
    await orderItemRepository.save(orderItems);
    await cartItemRepository.remove(cart.items);
    await queryRunner.commitTransaction();
    return {
      error: false,
      message: "Order placed successfully",
      data: order,
    };
  } catch (error: unknown) {
    await queryRunner.rollbackTransaction();
    console.error(error);
    return { error: true, message: "Internal Server Error", data: null };
  } finally {
    await queryRunner.release();
  }
};

export const getUserOrder = async (userId: number): Promise<OrderEntity[]> => {
  const order = await orderRepository.find({
    where: { user: 
      {
         id: userId
      } 
    },
    relations: 
    { orderItems :
      {
        grocery: true
      } 
    },
  });
  return order;
};
