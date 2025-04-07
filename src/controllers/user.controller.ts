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
  getUserOrder,
  placeOrderFromCart,
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
import { PlaceOrderModelType } from "../db/repository/cart/placeOrder/placeOrder.model";
import { OrderEntity } from "../models/order.entity";
import { SuccessMsgResponse, SuccessResponse } from "../core/successResponse";
import { BadRequestResponse, NotFoundResponse } from "../core/failureResponse";

// get list of grocery
export const getAllGroceryItemList = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const allItems: GroceryItemModelType[] = await getAllGroceryItems();
    return new SuccessResponse("success", allItems).send(res);
  }
);

// get user cart
export const getUserCart = catchAsyn(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const userId = req.user!.id;
    const userCart: CartEntity | null = await getUserCartById(userId);
    return new SuccessResponse("success", userCart).send(res);
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
      return new NotFoundResponse("item does not exists").send(res);
    if (isGroceryItemExists.stock <= 0)
      return new BadRequestResponse("item is out of stock").send(res);
    const isItemInCart = await checkItemInUserCart(
      userCart,
      isGroceryItemExists
    );
    if (isItemInCart)
      return new BadRequestResponse("item already in cart").send(res);
    await addItemInUserCart(userCart, isGroceryItemExists);
    return new SuccessMsgResponse("item added in cart").send(res);
  }
);

// Remove item from cart
export const deleteItemFromUserCart = catchAsyn(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const user = req.user;
    const groceryId = req.params.id;
    if (isNaN(parseInt(groceryId)))
      return new BadRequestResponse("invalid id").send(res);
    const userCart: CartEntity = (await getUserCartById(
      user!.id
    )) as CartEntity;
    const isGroceryItemExists = await getGroceryItemById(parseInt(groceryId));
    if (!isGroceryItemExists)
      return new NotFoundResponse("item does not exists").send(res);
    const removed = await removeItemFromUserCart(userCart, isGroceryItemExists);
    if (!removed) return new BadRequestResponse("item not in cart").send(res);
    return new SuccessMsgResponse("item remove from cart").send(res);
  }
);

// Clear cart
export const clearUserCart = catchAsyn(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const user = req.user;
    await emptyUserCart(user!.id);
    return new SuccessMsgResponse("clear user cart").send(res);
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
      return new NotFoundResponse("item does not exists").send(res);
    if (isGroceryItemExists.stock < body.quantity)
      return new NotFoundResponse(
        "item is out of stock, remaining items: " + isGroceryItemExists.stock
      ).send(res);
    const isItemInCart = await checkItemInUserCart(
      userCart,
      isGroceryItemExists
    );
    if (!isItemInCart)
      return new BadRequestResponse("item is not in cart").send(res);
    if (body.quantity === 0) {
      await removeItemFromUserCart(userCart, isGroceryItemExists);
    } else {
      await updateGroceryItemInUserCart(
        userCart,
        isGroceryItemExists,
        body.quantity
      );
    }
    const cart: CartEntity | null = await getUserCartById(user!.id);
    return new SuccessResponse("update cart item", cart).send(res);
  }
);

// Checkout / create order
export const placeOrder = catchAsyn(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const user = req.user;
    const order: PlaceOrderModelType = (await placeOrderFromCart(
      user!.id
    )) as PlaceOrderModelType;
    if (!order || order.error) {
      return new BadRequestResponse(order.message).send(res);
    }
    return new SuccessResponse(order.message, order.data).send(res);
  }
);

// get user order
export const getUserOrderList = catchAsyn(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const user = req.user;
    const order: OrderEntity[] = (await getUserOrder(
      user!.id
    )) as OrderEntity[];
    return new SuccessResponse("success", order).send(res);
  }
);
