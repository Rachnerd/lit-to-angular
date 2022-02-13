import * as ts from "typescript";
import { parsePropertyDeclaration } from "./property-declaration.parser";

describe("Property declaration parser", () => {
  const MODIFIERS_EXAMPLE = "./test-files/modifiers.example.ts";
  const PROPERTIES_EXAMPLE = "./test-files/properties.example.ts";

  let program: ts.Program;

  beforeEach(() => {
    program = ts.createProgram([MODIFIERS_EXAMPLE, PROPERTIES_EXAMPLE], {});
    program.getTypeChecker();
  });

  const parseNode = (source: ts.Node, parse: (node: ts.Node) => void) => {
    parse(source);
    source.forEachChild((node) => {
      parse(node);
      node.forEachChild((node) => parseNode(node, parse));
    });
  };

  it("should parse modifiers", () => {
    const spy = jest.fn();

    parseNode(program.getSourceFile(MODIFIERS_EXAMPLE), (node) => {
      if (node.kind === ts.SyntaxKind.PropertyDeclaration) {
        spy(parsePropertyDeclaration(node as ts.PropertyDeclaration));
      }
    });

    expect(spy).toHaveBeenCalledTimes(6);
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
      modifiers: ["protected"],
      name: "propProtected",
      type: "any",
      value: undefined,
    });

    expect(spy).toHaveBeenNthCalledWith(4, {
      decorators: [],
      modifiers: ["static"],
      name: "propStatic",
      type: "any",
      value: undefined,
    });

    expect(spy).toHaveBeenNthCalledWith(5, {
      decorators: [],
      modifiers: ["private", "static"],
      name: "propPrivateStatic",
      type: "any",
      value: undefined,
    });

    expect(spy).toHaveBeenNthCalledWith(6, {
      decorators: [],
      modifiers: ["protected", "static"],
      name: "propProtectedStatic",
      type: "any",
      value: undefined,
    });
  });

  it("should parse types", () => {
    const spy = jest.fn();

    parseNode(program.getSourceFile(PROPERTIES_EXAMPLE), (node) => {
      if (node.kind === ts.SyntaxKind.PropertyDeclaration) {
        spy(parsePropertyDeclaration(node as ts.PropertyDeclaration));
      }
    });

    expect(spy).toHaveBeenCalledTimes(6);

    expect(spy).toHaveBeenNthCalledWith(1, {
      decorators: [],
      modifiers: [],
      name: "typedWithValue",
      type: "string",
      value: '"text"',
    });

    expect(spy).toHaveBeenNthCalledWith(2, {
      decorators: [],
      modifiers: [],
      name: "inlineInterfaceWithValue",
      type: `{
    key: string;
    value: number;
    inline: { key: string };
  }`,
      value: { key: "key", value: 1, inline: { key: "value" } },
    });

    expect(spy).toHaveBeenNthCalledWith(3, {
      decorators: [],
      modifiers: [],
      name: "nestedInlineInterfaceWithValue",
      type: `{
    key: string;
    value: number;
    inline: { key: { key: { key: string } } };
  }`,
      value: {
        key: "key",
        value: 1,
        inline: { key: { key: { key: "value" } } },
      },
    });

    expect(spy).toHaveBeenNthCalledWith(4, {
      decorators: [],
      modifiers: [],
      name: "collection",
      type: "string[]",
      value: ["1", "2", "3"],
    });

    expect(spy).toHaveBeenNthCalledWith(5, {
      decorators: [],
      modifiers: [],
      name: "nestedCollection",
      type: "(string | string[])[]",
      value: ["1", "2", ["1", "2"]],
    });

    expect(spy).toHaveBeenNthCalledWith(6, {
      decorators: [],
      modifiers: [],
      name: "mixedCollection",
      type: "(string | number | { key: string })[]",
      value: ["1", 2, { key: "value" }],
    });
  });
});
