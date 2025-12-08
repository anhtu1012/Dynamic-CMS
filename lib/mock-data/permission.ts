/**
 * Permission limits configuration
 * Defines the maximum number of resources a user can create
 */
export const permissionLimits = {
  /**
   * Maximum number of databases a user can create
   */
  databaseLimits: 3,

  /**
   * Maximum number of entities per database
   */
  entityLimits: 5,

  /**
   * Maximum number of data records per entity
   */
  dataLimits: 50,
};

/**
 * Permission limits as JSON structure
 * Can be used for API requests or configuration
 */
export const permissionLimitsJSON = {
  limits: {
    databases: {
      max: 3,
      description: "Maximum databases per user",
    },
    entities: {
      max: 5,
      description: "Maximum entities per database",
    },
    data: {
      max: 50,
      description: "Maximum data records per entity",
    },
  },
  restrictions: {
    canCreateDatabase: true,
    canCreateEntity: true,
    canCreateData: true,
    canDeleteDatabase: true,
    canDeleteEntity: true,
    canDeleteData: true,
  },
};
