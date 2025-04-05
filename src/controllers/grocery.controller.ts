import { Request, Response, NextFunction } from "express";
import { catchAsyn } from "../utils/catchAsync";
import sanitizeBody from "../middlewares/sanitizeBody.middleware";
import {
  GroceryCreateNewModelType,
  groceryCreateNewModel,
} from "../db/repository/grocery/groceryCreateNew/groceryCreateNew.model";
import {
  createNewGroceryItem,
  deleteGroceryItem,
  getAllGroceryItems,
  getGroceryItemById,
  itemInventoryUpdate,
  updateGroceryItemByEntity,
} from "../db/repository/grocery/grocery.db";
import { GroceryItemModelType } from "../db/repository/grocery/groceryGetAll/groceryGetAll.model";
import {
  groceryUpdateItemModel,
  GroceryUpdateItemModelType,
} from "../db/repository/grocery/groceryUpdateItem/groceryUpdateItem.model";
import { GroceryEntity } from "../models/grocery.entity";
import {
  inventoryUpdateModel,
  InventoryUpdateModelType,
} from "../db/repository/grocery/inventoryUpdate/inventoryUpdate.model";

// to do: add new grocery item
export const addNewGroceryItem = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: GroceryCreateNewModelType = sanitizeBody(
      groceryCreateNewModel,
      req.body
    ) as GroceryCreateNewModelType;
    const newItem = await createNewGroceryItem(body);
    return res.status(201).send({ message: "new Item Created", data: newItem });
  }
);

// to do: view all grocery items
export const getAllGroceryItemList = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const allItems: GroceryItemModelType[] = await getAllGroceryItems();
    return res.status(201).send({ message: "success", data: allItems });
  }
);

// to do: remove grocery items
export const removeGroceryItem = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const removeItem = await deleteGroceryItem(parseInt(id));
    if (!removeItem)
      return res.status(400).send({ message: "item does not exists" });
    return res.status(201).send({ message: "success" });
  }
);

export const updateGroceryItem = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: GroceryUpdateItemModelType = sanitizeBody(
      groceryUpdateItemModel,
      req.body
    ) as GroceryUpdateItemModelType;
    const { id } = req.params;
    const item: GroceryEntity | null = await getGroceryItemById(parseInt(id));
    if (!item) return res.status(404).send({ message: "item does not exists" });
    const updateItem = await updateGroceryItemByEntity(body, item!);
    return res.status(200).send({ message: "updated", data: updateItem });
  }
);

export const updateInventoryLevel = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: InventoryUpdateModelType = sanitizeBody(
      inventoryUpdateModel,
      req.body
    ) as InventoryUpdateModelType;
    const { id } = req.params;
    const item: GroceryEntity | null = await getGroceryItemById(parseInt(id));
    if (!item) return res.status(404).send({ message: "item does not exists" });
    if(body.operation === "subtract" && item.stock - body.quantity < 0) {
      return res.status(400).send({ message: "subtract quantity is more than available quantity" });
    }
    const updateItem = await itemInventoryUpdate(body.operation, body.quantity, item!);
    return res.status(200).send({ message: "updated", data: updateItem });
  }
);
