import * as ts from "typescript";
import {
  NUMBER_CONTRUCTOR,
  parseIdentifier,
  STRING_CONTRUCTOR,
} from "./identifier.parser";

describe("Identifier parser", () => {
  const IDENTIEFIERS_EXAMPLE =
    "./src/parsers/identifier/identifier.parser.example.ts";

  let program: ts.Program;

  beforeEach(() => {
    program = ts.createProgram([IDENTIEFIERS_EXAMPLE], {});
    program.getTypeChecker();
  });

  const parseNode = (source: ts.Node, parse: (node: ts.Node) => void) => {
    parse(source);
    source.forEachChild((node) => {
      parse(node);
      node.forEachChild((node) => parseNode(node, parse));
    });
  };

  it("should parse constructors", () => {
    const spy = jest.fn();
    parseNode(program.getSourceFile(IDENTIEFIERS_EXAMPLE), (node: ts.Node) => {
      if (node.kind === ts.SyntaxKind.Identifier) {
        const identifier = parseIdentifier(node as ts.Identifier);
        identifier && spy(identifier);
      }
    });
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(1, NUMBER_CONTRUCTOR);
    expect(spy).toHaveBeenNthCalledWith(2, STRING_CONTRUCTOR);
  });

  it("should parse variables in css", () => {
    const spy = jest.fn();
    parseNode(program.getSourceFile(IDENTIEFIERS_EXAMPLE), (node: ts.Node) => {
      if (node.kind === ts.SyntaxKind.Identifier) {
        const identifier = parseIdentifier(node as ts.Identifier);
        identifier && spy(identifier);
      }
    });
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(
      3,
      '/*{{{"type":"Variable","name":"cssVariable"}}}*/'
    );
  });
});
