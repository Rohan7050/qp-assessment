import { ApiResponse } from "./apiResponse";
import { PaginationResType, ResponseStatus } from "./response.constant";



export class SuccessMsgResponse extends ApiResponse {
  constructor(message: string = "success") {
    super(ResponseStatus.SUCCESS, message);
  }
}

export class SuccessResponse<T> extends ApiResponse {
  constructor(message: string = "success", private data: T) {
    super(ResponseStatus.SUCCESS, message);
  }
}

export class SuccessPaginatedResponse<T> extends ApiResponse {
  constructor(message: string = "success", private data: T, private pagination: PaginationResType) {
    super(ResponseStatus.SUCCESS, message);
  }
}

export class CreateSuccessResponse<T> extends ApiResponse {
  constructor(message: string = "created successfully", private data: T) {
    super(ResponseStatus.CREATED, message);
  }
}
