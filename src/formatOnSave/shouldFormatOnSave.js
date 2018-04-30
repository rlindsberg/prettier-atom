// @flow
const _ = require('lodash/fp');
const { getPrettierInstance, someGlobsMatchFilePath, isFileFormattable } = require('../helpers');
const { getCurrentFilePath } = require('../editorInterface');
const {
  getExcludedGlobs,
  getWhitelistedGlobs,
  isFormatOnSaveEnabled,
  isDisabledIfNotInPackageJson,
  isDisabledIfNoConfigFile,
  shouldRespectEslintignore,
} = require('../atomInterface');
const isFilePathEslintIgnored = require('./isFilePathEslintIgnored');
const isPrettierInPackageJson = require('./isPrettierInPackageJson');

const hasFilePath = (editor: TextEditor) => !!getCurrentFilePath(editor);

const filePathDoesNotMatchBlacklistGlobs: (editor: TextEditor) => boolean = _.flow(
  getCurrentFilePath,
  (filePath: ?FilePath) => _.negate(someGlobsMatchFilePath)(getExcludedGlobs(), filePath),
);

// $FlowFixMe
const noWhitelistGlobsPresent: () => boolean = _.flow(getWhitelistedGlobs, _.isEmpty);

const isFilePathWhitelisted: (editor: TextEditor) => boolean = _.flow(
  getCurrentFilePath,
  (filePath: ?FilePath) => someGlobsMatchFilePath(getWhitelistedGlobs(), filePath),
);

const isEslintIgnored: (editor: TextEditor) => boolean = _.flow(getCurrentFilePath, isFilePathEslintIgnored);

const isResolveConfigDefined = (editor: TextEditor): boolean =>
  // $FlowFixMe
  !!getPrettierInstance(editor).resolveConfig.sync;

const isResolveConfigSuccessful = (editor: TextEditor): boolean =>
  // $FlowFixMe
  _.flow(getCurrentFilePath, getPrettierInstance(editor).resolveConfig.sync, _.negate(_.isNil))(editor);

const isPrettierConfigPresent: TextEditor => boolean = _.overEvery([
  isResolveConfigDefined,
  isResolveConfigSuccessful,
]);

const shouldFormatOnSave: (editor: TextEditor) => boolean = _.overEvery([
  isFormatOnSaveEnabled,
  hasFilePath,
  _.overSome([
    isFilePathWhitelisted,
    _.overEvery([noWhitelistGlobsPresent, filePathDoesNotMatchBlacklistGlobs]),
  ]),
  _.overSome([_.negate(shouldRespectEslintignore), _.negate(isEslintIgnored)]),
  _.overSome([_.negate(isDisabledIfNotInPackageJson), isPrettierInPackageJson]),
  _.overSome([_.negate(isDisabledIfNoConfigFile), isPrettierConfigPresent]),
  isFileFormattable,
]);

module.exports = shouldFormatOnSave;
