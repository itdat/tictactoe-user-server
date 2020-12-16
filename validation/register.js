const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.passwordConfirm = !isEmpty(data.passwordConfirm)
    ? data.passwordConfirm
    : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 to 30 chars";
  }

  if (Validator.isEmpty(data.username)) {
    errors.name = "Name field is required";
  }

  if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.name = "Username must be between 2 to 30 chars";
  }

  if (Validator.isEmpty(data.username)) {
    errors.name = "Username field is required";
  }

  if (!Validator.isLength(data.password, { min: 2, max: 30 })) {
    errors.password = "Password must have 2 char";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  if (!Validator.isLength(data.passwordConfirm, { min: 2, max: 30 })) {
    errors.passwordConfirm = "Password must have 2 chars";
  }

  if (!Validator.equals(data.password, data.passwordConfirm)) {
    errors.passwordConfirm = "Password and Confirm Password must match";
  }

  if (Validator.isEmpty(data.passwordConfirm)) {
    errors.passwordConfirm = "Password confirm is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
