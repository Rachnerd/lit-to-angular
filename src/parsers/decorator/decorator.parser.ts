import * as ts from "typescript";
import {
  parseExpression,
  SupportedExpression,
} from "../expression/expression.parser";

export interface ParsedDecorator {
  name: string;
  arguments: SupportedExpression[];
}

export const parseDecorator = (decorator: ts.Decorator): ParsedDecorator => {
  const { expression } = decorator;
  const name = expression.getChildAt(0).getText();
  return {
    name,
    arguments: parseDecoratorArguments(expression),
  };
};

const parseDecoratorArguments = (
  expression: ts.LeftHandSideExpression
): SupportedExpression[] => {
  if (expression.kind === ts.SyntaxKind.CallExpression) {
    const { arguments: args } = expression as ts.CallExpression;
    return args.map(parseExpression);
  }
  console.warn(
    `Decorator expression of kind ${
      ts.SyntaxKind[expression.kind]
    } not implemented. Fallback 'arguments' to [].`
  );
  return [];
};
