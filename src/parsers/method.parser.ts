import * as ts from "typescript";
import { TYPE_INFERENCE } from "../constants/type.constant";

export interface ParsedMethod {
  name: string;
  modifiers: string[];
  body: string;
  arguments: { name: string; type: string }[];
  returnType: string;
}

export const parseMethod = (
  methodDeclaration: ts.MethodDeclaration
): ParsedMethod => {
  const body = methodDeclaration
    .getChildAt(methodDeclaration.getChildCount() - 1)
    .getText();

  const modifiers =
    methodDeclaration.modifiers?.map((modifier) => modifier.getText()) ?? [];

  const hasModifiers = modifiers.length > 0;

  const name = methodDeclaration.getChildAt(hasModifiers ? 1 : 0).getText();

  const returnType = methodDeclaration
    .getChildAt(methodDeclaration.getChildCount() - 2)
    .getText();

  const argsNode = methodDeclaration.getChildAt(hasModifiers ? 3 : 2);
  const args = argsNode
    .getChildren()
    /**
     * Filter out ","
     */
    .filter((_, index) => index % 2 === 0)
    .map(({ type, name }: ts.ParameterDeclaration) => ({
      type: type.getText(),
      name: name.getText(),
    }));

  return {
    name,
    modifiers,
    body,
    arguments: args,
    returnType: returnType !== ")" ? returnType : TYPE_INFERENCE,
  };
};
