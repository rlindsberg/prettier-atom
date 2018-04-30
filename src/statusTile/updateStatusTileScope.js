// @flow
const { isFileFormattable } = require('../helpers');

const updateStatusTileScope = (element: HTMLElement, editor: ?TextEditor) => {
  // The editor can be undefined if there is no active editor (e.g. closed all tabs).
  // eslint-disable-next-line no-param-reassign
  element.dataset.prettierCanFormatFile = editor && isFileFormattable(editor) ? 'true' : 'false';
};

module.exports = updateStatusTileScope;
