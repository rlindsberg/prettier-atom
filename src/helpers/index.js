// @flow
const getPrettierInstance = require('./getPrettierInstance');
const general = require('./general');
const atomRelated = require('./atomRelated');
const isFileFormattable = require('./isFileFormattable');

module.exports = {
  ...general,
  ...atomRelated,
  getPrettierInstance,
  isFileFormattable,
};
