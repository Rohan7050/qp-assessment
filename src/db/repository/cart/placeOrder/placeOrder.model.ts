import { OrderEntity } from "../../../../models/order.entity";

export type PlaceOrderModelType = {
  error: boolean;
  message: string;
  data: OrderEntity | null;
};
