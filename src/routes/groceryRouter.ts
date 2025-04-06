import express from 'express';
import validationMiddleware from '../middlewares/validation.middleware';
import { GroceryCreateNewDto } from '../db/repository/grocery/groceryCreateNew/groceryCreateNew.dto';
import { addNewGroceryItem, getAllGroceryItemList, removeGroceryItem, updateGroceryItem, updateInventoryLevel } from '../controllers/grocery.controller';
import { GroceryUpdateItemDto } from '../db/repository/grocery/groceryUpdateItem/groceryUpdateItem.dto';
import { InventoryUpdateDTO } from '../db/repository/grocery/inventoryUpdate/inventoryUpdate.dto';
import { adminAuthorizationMiddleware } from '../middlewares/authorization.middleware';
const groceryRouter = express.Router();

groceryRouter.post('/admin/grocery', adminAuthorizationMiddleware, validationMiddleware(GroceryCreateNewDto), addNewGroceryItem);

groceryRouter.get('/admin/grocery', adminAuthorizationMiddleware, getAllGroceryItemList);

groceryRouter.delete('/admin/grocery/:id', adminAuthorizationMiddleware, removeGroceryItem);

groceryRouter.put('/admin/grocery/:id', adminAuthorizationMiddleware, validationMiddleware(GroceryUpdateItemDto), updateGroceryItem);

groceryRouter.put("/admin/grocery/:id/stock", adminAuthorizationMiddleware, validationMiddleware(InventoryUpdateDTO), updateInventoryLevel);

export default groceryRouter;