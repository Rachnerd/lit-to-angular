import * as ts from "typescript";
import { TYPE_INFERENCE } from "../constants/type.constant";
import { ParsedDecorator, parseDecorator } from "./decorator.parser";

export interface ParsedProperty {
  name: string;
  value: string;
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
  value: initializer?.getText(),
  modifiers: modifiers?.map((modifier) => modifier.getText()) ?? [],
  decorators: decorators?.map(parseDecorator) ?? [],
  type: type?.getText() ?? TYPE_INFERENCE,
});
