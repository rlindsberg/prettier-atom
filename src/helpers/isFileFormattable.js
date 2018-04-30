// @flow
const _ = require('lodash/fp');
const getPrettierInstance = require('./getPrettierInstance');
const { getCurrentFilePath } = require('../editorInterface');

const isFileFormattable = (editor: ?TextEditor): boolean =>
  !!editor &&
  !!getCurrentFilePath(editor) &&
  _.flow(
    getCurrentFilePath,
    // $FlowFixMe: getFileInfo is not yet added to flow typed
    filePath => getPrettierInstance().getFileInfo(filePath, {}, '.prettierignore'),
    fileInfo => fileInfo.exists && !fileInfo.ignored && !!fileInfo.inferredParser,
  )(editor);

module.exports = isFileFormattable;
