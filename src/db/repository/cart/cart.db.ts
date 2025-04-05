import { CartEntity } from "../../../models/cart.entity";
import { UserEntity } from "../../../models/user.entity";
import { AppDataSource } from "../../db.config";
import { CartItemEntity } from "../../../models/cartItem.entity";
import { GroceryEntity } from "../../../models/grocery.entity";

const cartRepository = AppDataSource.getRepository(CartEntity);
const cartItemRepository = AppDataSource.getRepository(CartItemEntity);

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