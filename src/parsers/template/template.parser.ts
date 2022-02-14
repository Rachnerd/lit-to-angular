import * as ts from "typescript";
import type { ExpressionParser } from "../expression/expression.parser";

export const parseTemplate = (
  { template }: ts.TaggedTemplateExpression,
  parseExpression: ExpressionParser
): string => {
  if (template.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
    return template.text;
  }
  if (template.kind === ts.SyntaxKind.TemplateExpression) {
    const { head, templateSpans } = template as ts.TemplateExpression;
    const templateStart = head.text.trim();
    const templateEnd = templateSpans
      .map(
        ({ expression, literal }) => parseExpression(expression) + literal.text
      )
      .join("\n");

    return `${templateStart}\n${templateEnd}`;
  }
};
