import * as ts from "typescript";
import { parseDecorator } from "./decorator.parser";

describe("Decorator parser", () => {
  const DECORATORS_EXAMPLE =
    "./src/parsers/decorator/decorator.parser.example.ts";

  let program: ts.Program;

  beforeEach(() => {
    program = ts.createProgram([DECORATORS_EXAMPLE], {
      experimentalDecorators: true,
    });
    program.getTypeChecker();
  });

  const parseNode = (source: ts.Node, parse: (node: ts.Node) => void) => {
    parse(source);
    source.forEachChild((node) => {
      parse(node);
      node.forEachChild((node) => parseNode(node, parse));
    });
  };

  it("should parse decorators", () => {
    const spy = jest.fn();

    parseNode(program.getSourceFile(DECORATORS_EXAMPLE), (node) => {
      if (
        node.kind === ts.SyntaxKind.ClassDeclaration ||
        node.kind === ts.SyntaxKind.PropertyDeclaration ||
        node.kind === ts.SyntaxKind.MethodDeclaration
      ) {
        expect(node.decorators.map(parseDecorator)).toEqual([
          { name: "empty", arguments: [] },
          { name: "singleArgument", arguments: ["text"] },
          { name: "twoArguments", arguments: [{}, { key: "key", value: 1 }] },
        ]);
        spy(node.kind);
      }
    });

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(ts.SyntaxKind.ClassDeclaration);
    expect(spy).toHaveBeenCalledWith(ts.SyntaxKind.PropertyDeclaration);
    expect(spy).toHaveBeenCalledWith(ts.SyntaxKind.MethodDeclaration);
  });
});
