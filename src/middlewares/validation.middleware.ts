import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { RequestHandler } from "express";

function validationMiddleware<T extends object>(
  type: ClassConstructor<T>,
  skipMissingProperties = false
): RequestHandler {
  return (req, res, next) => {
    validate(plainToInstance(type, req.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          let feilds = "";
          const detailMsg = errors.map((error: ValidationError) => {
            feilds += error.property + ", ";
            return {
              [error.property]: Object.values(error?.constraints || "").join(
                ". "
              ),
            };
          });
          const message: string = `please fill ${feilds}fields properly`;
          return res.status(404).json({ message, detailMsg });
        } else {
          next();
        }
      }
    );
  };
}

export default validationMiddleware;
