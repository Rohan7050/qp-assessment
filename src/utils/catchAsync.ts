import { NextFunction, Request, Response } from "express";

export const catchAsyn = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    fn(req, res, next).catch((err: unknown) => {
        console.log(err)
      return res.status(500).send({message: "Something Went Wrong."});
    });
  };
};
