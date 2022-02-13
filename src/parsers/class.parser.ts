import * as ts from "typescript";
import { ParsedDecorator, parseDecorator } from "./decorator.parser";

export interface ParsedClass {
  name: string;
  decorators: ParsedDecorator[];
}

export const parseClass = ({ decorators, name }: ts.ClassDeclaration) => ({
  decorators: decorators?.map(parseDecorator) ?? [],
  name: name.getText(),
});
