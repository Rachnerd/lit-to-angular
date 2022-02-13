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

const isObjectText = (s: string) => s[0] === "{";
const isArrayText = (s: string) => s[0] === "[";

const parseObjectText = (objectString: string) => {
  const obj = objectString
    .replace(
      /(\w+:)|(\w+ :)/g,
      (match) => `"${match.substring(0, match.length - 1)}":`
    )
    .replace(/\s/g, "")
    .replace("},}", "}}")
    .replace("},]", "}]");
  return JSON.parse(obj);
};

const parseText = (text: string) =>
  isObjectText(text) || isArrayText(text) ? parseObjectText(text) : text;

export const parsePropertyDeclaration = ({
  name,
  initializer,
  modifiers,
  decorators,
  type,
}: ts.PropertyDeclaration): ParsedProperty => {
  const initializerText = initializer?.getText();
  return {
    name: name.getText(),
    value: initializerText ? parseText(initializerText) : undefined,
    modifiers: modifiers?.map((modifier) => modifier.getText()) ?? [],
    decorators: decorators?.map(parseDecorator) ?? [],
    type: type?.getText() ?? TYPE_INFERENCE,
  };
};
