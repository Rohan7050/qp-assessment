import { Request, Response, NextFunction } from "express";
import { catchAsyn } from "../utils/catchAsync";
import {
  getAllGroceryItems,
  getGroceryItemById,
} from "../db/repository/grocery/grocery.db";
import { GroceryItemModelType } from "../db/repository/grocery/groceryGetAll/groceryGetAll.model";
import { AuthRequest } from "../middlewares/authorization.middleware";
import { CartEntity } from "../models/cart.entity";
import {
  addItemInUserCart,
  checkItemInUserCart,
  emptyUserCart,
  getUserCartById,
  removeItemFromUserCart,
  updateGroceryItemInUserCart,
} from "../db/repository/cart/cart.db";
import sanitizeBody from "../middlewares/sanitizeBody.middleware";
import {
  addItemInCartModel,
  AddItemInCartModelType,
} from "../db/repository/cart/addItemInCart/addItemInCart.model";
import {
  updateItemFromCartModel,
  UpdateItemFromCartModelType,
} from "../db/repository/cart/updateItemFromCart/updateItemFromCart.model";

// get list of grocery
export const getAllGroceryItemList = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const allItems: GroceryItemModelType[] = await getAllGroceryItems();
    return res.status(201).send({ message: "success", data: allItems });
  }
);

// get user cart
export const getUserCart = catchAsyn(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user!.id;
    const userCart: CartEntity | null = await getUserCartById(userId);
    return res.status(200).send({ message: "success", data: userCart });
  }
);

// Add item to cart
export const addItemUserCart = catchAsyn(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const user = req.user;
    const body: AddItemInCartModelType = sanitizeBody(
      addItemInCartModel,
      req.body
    ) as AddItemInCartModelType;
    const userCart: CartEntity = (await getUserCartById(
      user!.id
    )) as CartEntity;
    const isGroceryItemExists = await getGroceryItemById(body.groceryId);
    if (!isGroceryItemExists)
      return res.status(404).send({ message: "item does not exists" });
    if (isGroceryItemExists.stock <= 0)
      return res.status(404).send({ message: "item is out of stock" });
    const isItemInCart = await checkItemInUserCart(
      userCart,
      isGroceryItemExists
    );
    if (isItemInCart)
      return res.status(400).send({ message: "item already in cart" });
    await addItemInUserCart(userCart, isGroceryItemExists);
    return res.status(200).send({ message: "item added in cart" });
  }
);

// Remove item from cart
export const deleteItemFromUserCart = catchAsyn(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const user = req.user;
    const groceryId = req.params.id;
    if (isNaN(parseInt(groceryId)))
      return res.status(400).send({ message: "invalid id" });
    const userCart: CartEntity = (await getUserCartById(
      user!.id
    )) as CartEntity;
    const isGroceryItemExists = await getGroceryItemById(parseInt(groceryId));
    if (!isGroceryItemExists)
      return res.status(404).send({ message: "item does not exists" });
    const removed = await removeItemFromUserCart(userCart, isGroceryItemExists);
    if (!removed) return res.status(400).send({ message: "item not in cart" });
    return res.status(200).send({ message: "item remove from cart" });
  }
);

// Clear cart
export const clearUserCart = catchAsyn(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const user = req.user;
    await emptyUserCart(user!.id);
    return res.status(200).send({ message: "clear user cart" });
  }
);

// Update quantity
export const updateUserCartItem = catchAsyn(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const user = req.user;
    const body: UpdateItemFromCartModelType = sanitizeBody(
      updateItemFromCartModel,
      req.body
    ) as UpdateItemFromCartModelType;
    const userCart: CartEntity = (await getUserCartById(
      user!.id
    )) as CartEntity;
    const isGroceryItemExists = await getGroceryItemById(body.groceryId);
    if (!isGroceryItemExists)
      return res.status(404).send({ message: "item does not exists" });
    if (isGroceryItemExists.stock < body.quantity)
      return res.status(404).send({ message: "item is out of stock, remaining items: " + isGroceryItemExists.stock });
    const isItemInCart = await checkItemInUserCart(
      userCart,
      isGroceryItemExists
    );
    if (!isItemInCart)
      return res.status(400).send({ message: "item is not in cart" });
    if(body.quantity === 0) {
      await removeItemFromUserCart(userCart, isGroceryItemExists);
    }else {
      await updateGroceryItemInUserCart(userCart, isGroceryItemExists, body.quantity); 
    }
    const cart: CartEntity | null = await getUserCartById(user!.id);
    return res.status(200).send({ message: "update cart item", data: cart });
  }
);

// Checkout / create order
