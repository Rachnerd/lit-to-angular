import * as ts from "typescript";
import { parseClass } from "./class.parser";
import { parseDecorator } from "./decorator.parser";

jest.mock("./decorator.parser", () => ({
  parseDecorator: jest.fn(),
}));

const EMPTY_CLASS_EXAMPLE = "./test-files/empty-class.example.ts";
const DECORATORS_EXAMPLE = "./test-files/decorators.example.ts";

let program: ts.Program;

beforeAll(() => {
  program = ts.createProgram([EMPTY_CLASS_EXAMPLE, DECORATORS_EXAMPLE], {});
  program.getTypeChecker();
});

const FAKE_DECORATOR = {};

beforeEach(() => {
  (parseDecorator as jest.Mock).mockReturnValue(FAKE_DECORATOR);
});

afterEach(() => {
  (parseDecorator as jest.Mock).mockClear();
});

test("Parse empty class", () => {
  const spy = jest.fn();

  program.getSourceFile(EMPTY_CLASS_EXAMPLE).forEachChild((node) => {
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      spy(parseClass(node as ts.ClassDeclaration));
    }
  });

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith({
    name: "EmptyClassExample",
    decorators: [],
  });
  expect(parseDecorator).not.toHaveBeenCalled();
});

test("Parse class decorators", () => {
  const spy = jest.fn();

  program.getSourceFile(DECORATORS_EXAMPLE).forEachChild((node) => {
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      spy(parseClass(node as ts.ClassDeclaration));
    }
  });

  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith({
    name: "DecoratorsExample",
    decorators: [FAKE_DECORATOR, FAKE_DECORATOR, FAKE_DECORATOR],
  });
  expect(parseDecorator).toHaveBeenCalledTimes(3);
});
