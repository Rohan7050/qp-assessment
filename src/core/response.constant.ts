export enum ResponseStatus {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_FOUND = 405,
  INTERNAL_ERROR = 500,
}

export type PaginationResType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
