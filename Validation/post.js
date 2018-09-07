const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Empty post can not be published.';
  }
  if (!Validator.isLength(data.text, { min: 1, max: 10 * 1000 })) {
    errors.text = 'Text is too large';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
