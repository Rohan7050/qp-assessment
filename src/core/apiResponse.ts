import { Response } from "express";
import { ResponseStatus } from "./response.constant";

export abstract class ApiResponse {
  constructor(
    protected statusCode: ResponseStatus,
    protected message: string
  ) {}

  public send(res: Response): Response {
    return this.prepare<ApiResponse>(res, this);
  }

  public prepare<T extends ApiResponse>(
    res: Response,
    responseBody: T
  ): Response {
    const cloneRes: T = {} as T;
    Object.assign(cloneRes, responseBody);
    return res.status(this.statusCode).send(cloneRes);
  }
}