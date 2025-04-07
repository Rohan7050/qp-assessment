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
import {
  CreateSuccessResponse,
  SuccessMsgResponse,
  SuccessResponse,
} from "../core/successResponse";
import { BadRequestResponse, NotFoundResponse } from "../core/failureResponse";

// to do: add new grocery item
export const addNewGroceryItem = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const body: GroceryCreateNewModelType = sanitizeBody(
      groceryCreateNewModel,
      req.body
    ) as GroceryCreateNewModelType;
    const newItem = await createNewGroceryItem(body);
    return new CreateSuccessResponse("new Item Created", newItem).send(res);
  }
);

// to do: view all grocery items
export const getAllGroceryItemList = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const allItems: GroceryItemModelType[] = await getAllGroceryItems();
    return new SuccessResponse("success", allItems).send(res);
  }
);

// to do: remove grocery items
export const removeGroceryItem = catchAsyn(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const removeItem = await deleteGroceryItem(parseInt(id));
    if (!removeItem)
      return new NotFoundResponse("item does not exists").send(res);
    return new SuccessMsgResponse("success").send(res);
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
    if (!item) return new NotFoundResponse("item does not exists").send(res);
    const updateItem = await updateGroceryItemByEntity(body, item!);
    return new SuccessResponse("updated", updateItem).send(res);
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
    if (!item) return new NotFoundResponse("item does not exists").send(res);
    if (body.operation === "subtract" && item.stock - body.quantity < 0) {
      return new BadRequestResponse(
        "ubtract quantity is more than available quantity"
      ).send(res);
    }
    const updateItem = await itemInventoryUpdate(
      body.operation,
      body.quantity,
      item!
    );
    return new SuccessResponse("updated", updateItem).send(res);
  }
);
