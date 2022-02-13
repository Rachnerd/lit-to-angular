import * as ts from "typescript";
import { TYPE_INFERENCE } from "../constants/type.constant";

export interface ParsedVariable {
  name: string;
  value: string;
  type: string;
}

export const parseVariable = (
  variableDeclaration: ts.VariableDeclaration
): ParsedVariable => ({
  name: variableDeclaration.getFirstToken()?.getText(),
  value: variableDeclaration
    .getChildAt(variableDeclaration.getChildCount() - 1)
    .getText(),
  type: variableDeclaration.type?.getText() ?? TYPE_INFERENCE,
});
