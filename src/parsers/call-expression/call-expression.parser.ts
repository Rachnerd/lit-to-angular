import * as ts from "typescript";
import type { ExpressionParser } from "../expression/expression.parser";

export const parseCallExpression = (
  { parent, arguments: args, expression: methodExpression }: ts.CallExpression,
  parseExpression: ExpressionParser
) => {
  if (parent.kind === ts.SyntaxKind.TemplateSpan) {
    const methodCall = {
      type: "MethodCall",
      name: methodExpression.getText(),
      arguments: args.map(parseExpression),
    };
    return `/*--${JSON.stringify(methodCall)}--*/`;
  }
};
