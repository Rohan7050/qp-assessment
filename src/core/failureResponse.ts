import { ApiResponse } from "./apiResponse";
import { ResponseStatus } from "./response.constant";
import { Response } from "express";

export class AuthFailureResponse extends ApiResponse {
  constructor(message = "Authentication Failure") {
    super(ResponseStatus.UNAUTHORIZED, message);
  }
}

export class AutherizationFailureResponse extends ApiResponse {
  constructor(message = "access denied") {
    super(ResponseStatus.FORBIDDEN, message);
  }
}

export class NotFoundResponse extends ApiResponse {
  private url: string | undefined;
  constructor(message = "Not Found") {
    super(ResponseStatus.NOT_FOUND, message);
  }

  send(res: Response): Response {
    this.url = res.req?.originalUrl;
    return super.prepare<NotFoundResponse>(res, this);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(message = "Internal Error") {
    super(ResponseStatus.INTERNAL_ERROR, message);
  }
}

export class AccessTokenErrorResponse extends ApiResponse {
  constructor(message = "Access token invalid") {
    super(ResponseStatus.UNAUTHORIZED, message);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(message = "Bad Parameters") {
    super(ResponseStatus.BAD_REQUEST, message);
  }
}

export class MethodNotFoundResponse extends ApiResponse {
  private url: string | undefined;
  constructor(message = "Method Not Found") {
    super(ResponseStatus.METHOD_NOT_FOUND, message);
  }

  override send(res: Response): Response {
    this.url = res.req.originalUrl;
    return super.prepare<MethodNotFoundResponse>(res, this);
  }
}
