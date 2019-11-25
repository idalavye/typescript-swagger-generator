export const validateOptions = options => {
  if (!options) {
    throw new Error("'options' is required.");
  } else if (!options.swaggerDefinition) {
    throw new Error("'swaggerDefinition' is required.");
  }
};
