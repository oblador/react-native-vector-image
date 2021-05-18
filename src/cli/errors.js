class VectorImageError extends Error {}

class TransformationError extends VectorImageError {}

class InputError extends VectorImageError {}

class ArgumentError extends VectorImageError {}

module.exports = {
  VectorImageError,
  TransformationError,
  InputError,
  ArgumentError,
};
