import * as ts from "typescript";
import type {
  ExpressionParser,
  SupportedExpression,
} from "../expression/expression.parser";

export const parseObjectLiteral = (
  { properties }: ts.ObjectLiteralExpression,
  parseExpression: ExpressionParser
): { [key: string]: SupportedExpression } =>
  properties
    .map((property: ts.PropertyAssignment) => [
      property.name.getText(),
      parseExpression(property.initializer),
    ])
    .reduce(
      (acc, [key, value]: [string, SupportedExpression]) => ({
        ...acc,
        [key]: value,
      }),
      {}
    );
