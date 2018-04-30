jest.mock('./getPrettierInstance');
jest.mock('../editorInterface');

const isFileFormattable = require('./isFileFormattable');
const buildMockEditor = require('../../tests/mocks/textEditor');
const getPrettierInstance = require('./getPrettierInstance');
const { getCurrentFilePath } = require('../editorInterface');

const mockEditor = buildMockEditor();

beforeEach(() => {
  getCurrentFilePath.mockImplementation(() => 'xyz.js');
});

it('calls prettier.getFileInfo with the proper arguments', () => {
  const mockGetFileInfo = jest.fn(() => ({}));
  getPrettierInstance.mockImplementation(() => ({ getFileInfo: mockGetFileInfo }));

  isFileFormattable(mockEditor);

  expect(mockGetFileInfo).toHaveBeenCalledWith('xyz.js', {}, '.prettierignore');
});

it('returns true if the file is formattable', () => {
  getPrettierInstance.mockImplementation(() => ({
    getFileInfo: () => ({ exists: true, ignored: false, inferredParser: 'babylon' }),
  }));

  const actual = isFileFormattable(mockEditor);

  expect(actual).toEqual(true);
});

it('returns false if no editor is passed', () => {
  const actual = isFileFormattable();

  expect(actual).toEqual(false);
});

it('returns false if no filepath can be found', () => {
  getCurrentFilePath.mockImplementation(() => null);

  const actual = isFileFormattable(mockEditor);

  expect(actual).toEqual(false);
});

it('returns false if prettier does not find a file at that path', () => {
  getPrettierInstance.mockImplementation(() => ({ getFileInfo: () => ({ exists: false }) }));

  const actual = isFileFormattable(mockEditor);

  expect(actual).toEqual(false);
});

it('returns false if prettier is configured to ignore the file', () => {
  getPrettierInstance.mockImplementation(() => ({ getFileInfo: () => ({ exists: true, ignored: true }) }));

  const actual = isFileFormattable(mockEditor);

  expect(actual).toEqual(false);
});

it('returns false if prettier cannot infer a suitable parser', () => {
  getPrettierInstance.mockImplementation(() => ({
    getFileInfo: () => ({ exists: true, ignored: false, parser: null }),
  }));

  const actual = isFileFormattable(mockEditor);

  expect(actual).toEqual(false);
});
