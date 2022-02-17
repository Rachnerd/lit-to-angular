import * as ts from "typescript";
import type {
  ExpressionParser,
  SupportedExpression,
} from "../expression/expression.parser";

export const parseTemplate = (
  { template }: ts.TaggedTemplateExpression,
  parseExpression: ExpressionParser
): SupportedExpression[] => {
  if (template.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
    return [template.text];
  }
  if (template.kind === ts.SyntaxKind.TemplateExpression) {
    const { head, templateSpans } = template as ts.TemplateExpression;
    return [
      head.text,
      ...templateSpans
        .map(({ expression, literal }) => [
          parseExpression(expression),
          literal.text,
        ])
        .reduce((acc, pieces) => [...acc, ...pieces], []),
    ];
  }
};
