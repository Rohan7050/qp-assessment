export const inventoryUpdateModel = {
  quantity: 5,
  operation: ""
};

export type OperationType = "add" | "subtract" | "set";

export type InventoryUpdateModelType = {
    quantity: number,
    operation: OperationType
}