import * as ts from "typescript";

export interface ParsedDecorator {
  name: string;
  arguments: string[];
}

export const parseDecorator = ({
  expression,
}: ts.Decorator): ParsedDecorator => {
  const name = expression.getChildAt(0).getText();
  const decoratorArguments = expression
    .getChildren()
    /**
     * Removes child: ")".
     */
    .slice(0, expression.getChildCount() - 1)
    /**
     * Removes child: "<name> and "(".
     */
    .splice(2)
    .map((child) => child.getText())
    .filter((text) => text);

  return {
    name,
    arguments: decoratorArguments,
  };
};
