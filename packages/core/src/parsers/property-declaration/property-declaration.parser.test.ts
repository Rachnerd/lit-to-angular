import * as ts from "typescript";
import { parseDecorator } from "../decorator/decorator.parser";
import { parseExpression } from "../expression/expression.parser";
import { parsePropertyDeclaration } from "./property-declaration.parser";

jest.mock("../decorator/decorator.parser", () => ({
  parseDecorator: jest.fn(),
}));

jest.mock("../expression/expression.parser", () => ({
  parseExpression: jest.fn(),
}));

describe("Property declaration parser", () => {
  const PROPERTIES_EXAMPLE =
    "./src/parsers/property-declaration/property-declaration.parser.example.ts";

  const MOCKED_EXPRESSION = "MOCKED";

  let program: ts.Program;

  beforeEach(() => {
    program = ts.createProgram([PROPERTIES_EXAMPLE], {});
    program.getTypeChecker();
  });

  beforeEach(() => {
    (parseExpression as jest.Mock).mockReturnValue(MOCKED_EXPRESSION);
  });

  const parseNode = (source: ts.Node, parse: (node: ts.Node) => void) => {
    parse(source);
    source.forEachChild((node) => {
      parse(node);
      node.forEachChild((node) => parseNode(node, parse));
    });
  };

  const spy = jest.fn();

  beforeEach(() => {
    parseNode(program.getSourceFile(PROPERTIES_EXAMPLE), (node) => {
      if (node.kind === ts.SyntaxKind.PropertyDeclaration) {
        spy(parsePropertyDeclaration(node as ts.PropertyDeclaration));
      }
    });
  });

  it("should parse 11 properties", () => {
    expect(spy).toHaveBeenCalledTimes(11);
  });

  it("should parse modifiers", () => {
    expect(spy).toHaveBeenNthCalledWith(1, {
      decorators: [],
      modifiers: [],
      name: "propPublic",
      type: "any",
      value: undefined,
    });
    expect(spy).toHaveBeenNthCalledWith(2, {
      decorators: [],
      modifiers: ["private"],
      name: "propPrivate",
      type: "any",
      value: undefined,
    });
    expect(spy).toHaveBeenNthCalledWith(3, {
      decorators: [],
      modifiers: ["static"],
      name: "propStatic",
      type: "any",
      value: undefined,
    });
    expect(spy).toHaveBeenNthCalledWith(4, {
      decorators: [],
      modifiers: ["private", "static"],
      name: "propPrivateStatic",
      type: "any",
      value: undefined,
    });
  });

  it("should parse types", () => {
    expect(spy).toHaveBeenNthCalledWith(5, {
      decorators: [],
      modifiers: [],
      name: "typedWithValue",
      type: "string",
      value: MOCKED_EXPRESSION,
    });

    expect(spy).toHaveBeenNthCalledWith(6, {
      decorators: [],
      modifiers: [],
      name: "inlineInterfaceWithValue",
      type: `{
    key: string;
    value: number;
    inline: { key: string };
  }`,
      value: MOCKED_EXPRESSION,
    });

    expect(spy).toHaveBeenNthCalledWith(7, {
      decorators: [],
      modifiers: [],
      name: "nestedInlineInterfaceWithValue",
      type: `{
    key: string;
    value: number;
    inline: { key: { key: { key: string } } };
  }`,
      value: MOCKED_EXPRESSION,
    });

    expect(spy).toHaveBeenNthCalledWith(8, {
      decorators: [],
      modifiers: [],
      name: "collection",
      type: "string[]",
      value: MOCKED_EXPRESSION,
    });

    expect(spy).toHaveBeenNthCalledWith(9, {
      decorators: [],
      modifiers: [],
      name: "nestedCollection",
      type: "(string | string[])[]",
      value: MOCKED_EXPRESSION,
    });

    expect(spy).toHaveBeenNthCalledWith(10, {
      decorators: [],
      modifiers: [],
      name: "mixedCollection",
      type: "(string | number | { key: string })[]",
      value: MOCKED_EXPRESSION,
    });
  });

  it("should parse expressions", () => {
    expect(parseExpression).toHaveBeenCalledTimes(6);
  });

  it("should parse decorators", () => {
    expect(parseDecorator).toHaveBeenCalledTimes(1);
  });
});
