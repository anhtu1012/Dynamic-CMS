import type { FieldFormData } from "@/lib/schemas/entity/entity.schema";

/**
 * Parse TypeScript interface code and convert it to field definitions
 */
export function parseInterfaceToFields(interfaceCode: string): FieldFormData[] {
  const fields: FieldFormData[] = [];

  // Remove comments and clean up the code
  const cleanCode = interfaceCode
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
    .replace(/\/\/.*/g, ""); // Remove single-line comments

  // Extract interface body
  const interfaceMatch = cleanCode.match(
    /interface\s+\w+\s*(?:extends\s+[\w\s,]+)?\s*\{([^}]+)\}/
  );

  if (!interfaceMatch) {
    throw new Error(
      "Invalid interface format. Please provide a valid TypeScript interface."
    );
  }

  const interfaceBody = interfaceMatch[1];

  // Split by semicolon or newline to get individual field definitions
  const fieldLines = interfaceBody
    .split(/[;\n]/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let fieldOrder = 0;

  for (const line of fieldLines) {
    // Skip if line doesn't contain a colon (not a field definition)
    if (!line.includes(":")) continue;

    // Parse field: fieldName?: type
    const fieldMatch = line.match(/^(\w+)(\?)?:\s*(.+)$/);

    if (!fieldMatch) continue;

    const [, fieldName, isOptional, typeStr] = fieldMatch;
    const isRequired = !isOptional;

    // Parse type and determine field type
    const { fieldType, isArray } = parseTypeString(typeStr);

    // Create field configuration
    const field: FieldFormData = {
      name: fieldName,
      label: formatLabel(fieldName),
      type: fieldType,
      description: "",
      showInList: true,
      showInForm: true,
      sortable: fieldType !== "json" && fieldType !== "array",
      searchable: fieldType === "text" || fieldType === "string",
      order: fieldOrder++,
      validation: {
        required: isRequired,
      },
    };

    // Add array-specific handling
    if (isArray && fieldType !== "array") {
      field.type = "array";
      field.description = `Array of ${fieldType}`;
    }

    fields.push(field);
  }

  return fields;
}

/**
 * Parse TypeScript type string and determine the appropriate field type
 */
function parseTypeString(typeStr: string): {
  fieldType: FieldFormData["type"];
  isArray: boolean;
} {
  const cleanType = typeStr.trim();
  let isArray = false;

  // Check for array types
  if (cleanType.endsWith("[]") || cleanType.startsWith("Array<")) {
    isArray = true;
  }

  // Extract base type if array
  let baseType = cleanType;
  if (cleanType.endsWith("[]")) {
    baseType = cleanType.slice(0, -2);
  } else if (cleanType.startsWith("Array<") && cleanType.endsWith(">")) {
    baseType = cleanType.slice(6, -1);
  }

  baseType = baseType.trim().toLowerCase();

  // Map TypeScript types to field types
  const typeMapping: Record<string, FieldFormData["type"]> = {
    string: "string",
    number: "number",
    boolean: "boolean",
    date: "date",
    datetime: "datetime",
    object: "json",
    any: "json",
    unknown: "json",
  };

  let fieldType = typeMapping[baseType] || "text";

  // If it's an array of primitives, use array type
  if (isArray) {
    fieldType = "array";
  }

  return { fieldType, isArray };
}

/**
 * Convert camelCase or snake_case to Title Case label
 */
function formatLabel(fieldName: string): string {
  // Convert camelCase to spaces
  let label = fieldName.replace(/([A-Z])/g, " $1");
  // Convert snake_case to spaces
  label = label.replace(/_/g, " ");
  // Capitalize first letter of each word
  label = label
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();

  return label;
}

/**
 * Advanced parser that handles comments and JSDoc
 */
export function parseInterfaceWithComments(
  interfaceCode: string
): FieldFormData[] {
  const fields: FieldFormData[] = [];
  const lines = interfaceCode.split("\n");

  let currentComment = "";
  let insideInterface = false;
  let fieldOrder = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Track if we're inside interface
    if (line.match(/interface\s+\w+/)) {
      insideInterface = true;
      continue;
    }

    if (!insideInterface) continue;

    // End of interface
    if (line === "}") {
      break;
    }

    // Capture comments
    if (line.startsWith("//")) {
      currentComment = line.replace(/^\/\/\s*/, "");
      continue;
    }

    // Parse field definition
    if (line.includes(":")) {
      const fieldMatch = line.match(/^(\w+)(\?)?:\s*(.+?)[;,]?\s*$/);

      if (fieldMatch) {
        const [, fieldName, isOptional, typeStr] = fieldMatch;
        const isRequired = !isOptional;
        const { fieldType, isArray } = parseTypeString(typeStr);

        const field: FieldFormData = {
          name: fieldName,
          label: formatLabel(fieldName),
          type: fieldType,
          description: currentComment,
          showInList: true,
          showInForm: true,
          sortable: fieldType !== "json" && fieldType !== "array",
          searchable: fieldType === "text" || fieldType === "string",
          order: fieldOrder++,
          validation: {
            required: isRequired,
          },
        };

        if (isArray && fieldType !== "array") {
          field.type = "array";
          field.description = currentComment || `Array of ${fieldType}`;
        }

        fields.push(field);
        currentComment = ""; // Reset comment
      }
    }
  }

  return fields;
}
