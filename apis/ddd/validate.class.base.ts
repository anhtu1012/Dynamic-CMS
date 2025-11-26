import { ZodError, ZodSchema, ZodIssue } from "zod";
import { ServiceResponse } from "./serviceResponse";

export class ValidateBaseClass {
  static validate<T extends object>(
    formData: T,
    typeForm: ZodSchema,
    isFormatMessage = true
  ) {
    try {
      typeForm.parse(formData);
    } catch (err) {
      let errorMessage = "";
      let errorObject = null;

      if (err instanceof ZodError) {
        const errors = err.issues;

        if (errors && errors.length > 0) {
          if (!isFormatMessage) {
            errorMessage = `Lỗi: ${errors
              .map((e: ZodIssue) => e.message)
              .join(", ")}`;
          } else {
            errorMessage = `Lỗi: ${errors
              .map((e: ZodIssue) => `${e.message}`)
              .join(", ")}`;
          }

          // Create error object with field-specific messages
          const fieldsMap = errors.reduce(
            (obj: Record<string, string>, e: ZodIssue) => {
              if (e.path.length > 0) {
                const fieldName = e.path.at(-1);
                obj[fieldName as string] = e.message;
              }
              return obj;
            },
            {} as Record<string, string>
          );

          // Include both issues array and fields map so callers can choose
          errorObject = {
            fields: fieldsMap,
            issues: errors,
          };
        } else {
          errorMessage = "Validation error";
        }
      } else {
        errorMessage = "Unknown validation error";
      }

      const serviceResponse = ServiceResponse.failure(
        errorMessage,
        null,
        errorObject
      );
      throw serviceResponse;
    }
  }
}
