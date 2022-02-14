import * as ts from "typescript";
import { parseCallExpression } from "../call-expression/call-expression.parser";
import {
  NUMBER_CONTRUCTOR,
  parseIdentifier,
  STRING_CONTRUCTOR,
} from "../identifier/identifier.parser";
import { parseObjectLiteral } from "../object-literal/objects-literal.parser";
import { parseTemplate } from "../template/template.parser";

export type SupportedExpression =
  | Array<SupportedExpression>
  | { [key: string]: SupportedExpression }
  | number
  | string
  | typeof NUMBER_CONTRUCTOR
  | typeof STRING_CONTRUCTOR;

export type ExpressionParser = (
  expression: ts.Expression
) => SupportedExpression;

export const parseExpression: ExpressionParser = (expression) => {
  const { kind } = expression;

  if (kind === ts.SyntaxKind.StringLiteral) {
    return (expression as ts.StringLiteral).text;
  }

  if (kind === ts.SyntaxKind.NumericLiteral) {
    return parseInt((expression as ts.NumericLiteral).text);
  }

  if (kind === ts.SyntaxKind.ObjectLiteralExpression) {
    return parseObjectLiteral(
      expression as ts.ObjectLiteralExpression,
      parseExpression
    );
  }

  if (kind === ts.SyntaxKind.ArrayLiteralExpression) {
    return (expression as ts.ArrayLiteralExpression).elements.map(
      parseExpression
    );
  }

  if (kind === ts.SyntaxKind.Identifier) {
    const result = parseIdentifier(expression as ts.Identifier);
    if (result) return result;
  }

  if (kind === ts.SyntaxKind.CallExpression) {
    const result = parseCallExpression(
      expression as ts.CallExpression,
      parseExpression
    );
    if (result) return result;
  }

  if (kind === ts.SyntaxKind.TaggedTemplateExpression) {
    const result = parseTemplate(
      expression as ts.TaggedTemplateExpression,
      parseExpression
    );
    if (result) return result;
  }

  console.warn(
    `Expression of kind ${
      ts.SyntaxKind[kind]
    } not implemented. Fallback to string literal: ${expression.getText()}.`
  );

  return (expression as ts.StringLiteral).text;
};
