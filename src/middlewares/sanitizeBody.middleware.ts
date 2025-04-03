/**
 * Filter properties from req.body by comparing an object
 * @param classModel any
 * @param body any
 */
function sanitizeBody(classModel: Record<string, string | number | boolean>, body: Record<string, string | number | boolean>): Record<string, string | number | boolean> {
  return Object.keys(body).reduce((sanitized: Record<string, string | number | boolean>, key: string) => {
    if (Object.prototype.hasOwnProperty.call(classModel, key)) {
      sanitized[key] = body[key]; // Keep only valid keys
    }
    return sanitized;
  }, {});
};

export default sanitizeBody;
