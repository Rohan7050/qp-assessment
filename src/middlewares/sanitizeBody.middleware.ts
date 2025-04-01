/**
 * Filter properties from req.body by comparing an object
 * @param classModel any
 * @param body any
 */
const sanitizeBody = (classModel: Record<string, unknown>, body: Record<string, unknown>): Record<string, unknown> => {
  return Object.keys(body).reduce((sanitized: Record<string, unknown>, key: string) => {
    if (Object.prototype.hasOwnProperty.call(classModel, key)) {
      sanitized[key] = body[key]; // Keep only valid keys
    }
    return sanitized;
  }, {});
};

export default sanitizeBody;
