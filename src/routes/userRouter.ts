import express from 'express';
import validationMiddleware from '../middlewares/validation.middleware';
import { userAuthorizationMiddleware } from '../middlewares/authorization.middleware';
import { addItemUserCart, clearUserCart, deleteItemFromUserCart, getAllGroceryItemList, getUserCart, getUserOrderList, placeOrder, updateUserCartItem } from '../controllers/user.controller';
import { AddItemInCartDto } from '../db/repository/cart/addItemInCart/addItemInCart.dto';
import { UpdateItemFromCartDto } from '../db/repository/cart/updateItemFromCart/updateItemFromCart.dto';
const userRouter = express.Router();

userRouter.get('/grocery', userAuthorizationMiddleware, getAllGroceryItemList);

// Get current cart
userRouter.get('/cart', userAuthorizationMiddleware, getUserCart);

// Add item to cart
userRouter.post('/cart', userAuthorizationMiddleware, validationMiddleware(AddItemInCartDto), addItemUserCart);

// Remove item from cart
userRouter.delete('/cart/:id', userAuthorizationMiddleware, deleteItemFromUserCart);

// Clear cart
userRouter.delete('/cart', userAuthorizationMiddleware, clearUserCart);

// Update quantity
userRouter.patch('/cart', userAuthorizationMiddleware, validationMiddleware(UpdateItemFromCartDto), updateUserCartItem);

// Checkout / create order
userRouter.post('/order', userAuthorizationMiddleware, placeOrder);

// get all order
userRouter.get('/order', userAuthorizationMiddleware, getUserOrderList);

export default userRouter;