jest.mock('../helpers');

const { isFileFormattable } = require('../helpers');
const updateStatusTileScope = require('./updateStatusTileScope');

const buildMockHtmlElement = () => ({ dataset: {} });

it('sets the match-scope data attribute to "true" if the current file can be formatted', () => {
  isFileFormattable.mockImplementation(() => true);
  const mockHtmlElement = buildMockHtmlElement();
  const mockEditor = {};

  updateStatusTileScope(mockHtmlElement, mockEditor);

  expect(mockHtmlElement.dataset.prettierCanFormatFile).toBe('true');
});

it('sets the match-scope data attribute to "false" if the editor is not formattable', () => {
  isFileFormattable.mockImplementation(() => false);
  const mockHtmlElement = buildMockHtmlElement();
  const mockEditor = {};

  updateStatusTileScope(mockHtmlElement, mockEditor);

  expect(mockHtmlElement.dataset.prettierCanFormatFile).toBe('false');
});

it('sets the match-scope data attribute to "false" if there is no active editor', () => {
  isFileFormattable.mockImplementation(() => true);
  const mockHtmlElement = buildMockHtmlElement();
  const mockEditor = null;

  updateStatusTileScope(mockHtmlElement, mockEditor);

  expect(mockHtmlElement.dataset.prettierCanFormatFile).toBe('false');
});
