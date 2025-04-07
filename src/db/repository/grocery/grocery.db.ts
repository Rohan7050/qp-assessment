import { GroceryEntity } from "../../../models/grocery.entity";
import { AppDataSource } from "../../db.config";
import { GroceryCreateNewModelType } from "./groceryCreateNew/groceryCreateNew.model";
import { GroceryItemModelType } from "./groceryGetAll/groceryGetAll.model";
import { OperationType } from "./inventoryUpdate/inventoryUpdate.model";

const groceryRepository = AppDataSource.getRepository(GroceryEntity);

export const createNewGroceryItem = async (
  data: GroceryCreateNewModelType
): Promise<GroceryCreateNewModelType | null> => {
  const newItem = GroceryEntity.create({
    ...data,
  });
  const item = await groceryRepository.save(newItem);
  return item;
};

export const getAllGroceryItems = async (
  skip: number,
  limit: number
): Promise<{ data: GroceryItemModelType[]; total: number }> => {
  const [data, total] = await groceryRepository.findAndCount({
    where: { status: 1 },
    skip: skip,
    take: limit,
    order: { id: "ASC" },
  });
  // const allItems = await groceryRepository.find({ where: { status: 1 } });
  return { data, total };
};

export const deleteGroceryItem = async (id: number): Promise<number> => {
  const item = await groceryRepository.findOneBy({ id: id });
  if (!item) return 0;
  item.status = 0;
  await item.save();
  return 1;
};

export const getGroceryItemById = async (
  id: number
): Promise<GroceryEntity | null> => {
  const item: GroceryEntity | null = await groceryRepository.findOneBy({
    id: id,
  });
  return item;
};

export const updateGroceryItemByEntity = async (
  data: Partial<GroceryItemModelType>,
  item: GroceryEntity
): Promise<GroceryEntity> => {
  item.name = data?.name ? data.name : item.name;
  item.price = data?.price || data?.price == 0 ? data.price : item.price;
  item.stock = data?.stock || data?.stock == 0 ? data.stock : item.stock;
  return await item.save();
};

export const itemInventoryUpdate = async (
  operation: OperationType,
  quantity: number,
  item: GroceryEntity
): Promise<GroceryEntity> => {
  switch (operation) {
    case "add":
      item.stock += quantity;
      break;
    case "subtract":
      item.stock -= quantity;
      break;
    case "set":
      item.stock = quantity;
      break;
  }
  const updatedItem = await item.save();
  return updatedItem;
};
