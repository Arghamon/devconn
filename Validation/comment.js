const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateCommentInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, { min: 1, max: 10 * 100 })) {
    errors.text = 'Comment is too large';
  }
  if (Validator.isEmpty(data.text)) {
    errors.text = 'Empty comment can not be published.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
