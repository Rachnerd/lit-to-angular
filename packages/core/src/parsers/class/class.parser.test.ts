import * as ts from "typescript";
import { parseClass } from "./class.parser";
import { parseDecorator } from "../decorator/decorator.parser";

jest.mock("../decorator/decorator.parser", () => ({
  parseDecorator: jest.fn(),
}));

describe("Class parser", () => {
  const CLASS_EXAMPLE = "./src/parsers/class/class.parser.example.ts";

  let program: ts.Program;

  beforeAll(() => {
    program = ts.createProgram([CLASS_EXAMPLE], {});
    program.getTypeChecker();
  });

  const FAKE_DECORATOR = {};

  beforeEach(() => {
    (parseDecorator as jest.Mock).mockReturnValue(FAKE_DECORATOR);
  });

  it("should parse a class", () => {
    const spy = jest.fn();

    program.getSourceFile(CLASS_EXAMPLE).forEachChild((node) => {
      if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        spy(parseClass(node as ts.ClassDeclaration));
      }
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      name: "ClassExample",
      decorators: [FAKE_DECORATOR],
    });
  });

  it("should parse class decorators", () => {
    const spy = jest.fn();

    program.getSourceFile(CLASS_EXAMPLE).forEachChild((node) => {
      if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        spy(parseClass(node as ts.ClassDeclaration));
      }
    });

    expect(parseDecorator).toHaveBeenCalledTimes(1);
  });
});
