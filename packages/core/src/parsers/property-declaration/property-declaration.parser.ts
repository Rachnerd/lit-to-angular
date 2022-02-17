import * as ts from "typescript";
import { TYPE_INFERENCE } from "../../constants/type.constant";
import { ParsedDecorator, parseDecorator } from "../decorator/decorator.parser";
import {
  parseExpression,
  SupportedExpression,
} from "../expression/expression.parser";

export interface ParsedProperty {
  name: string;
  value: SupportedExpression;
  type: string;
  modifiers: string[];
  decorators: ParsedDecorator[];
}

export const parsePropertyDeclaration = ({
  name,
  initializer,
  modifiers,
  decorators,
  type,
}: ts.PropertyDeclaration): ParsedProperty => ({
  name: name.getText(),
  type: type?.getText() ?? TYPE_INFERENCE,
  value: initializer ? parseExpression(initializer) : undefined,
  modifiers: modifiers?.map((modifier) => modifier.getText()) ?? [],
  decorators: decorators?.map(parseDecorator) ?? [],
});
