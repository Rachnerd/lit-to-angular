import * as ts from "typescript";

export const NUMBER_CONTRUCTOR = "_NumberContructor";
export const STRING_CONTRUCTOR = "_StringContructor";

export const parseIdentifier = ({ text, parent }: ts.Identifier) => {
  if (text === "Number") {
    return NUMBER_CONTRUCTOR;
  }
  if (text === "String") {
    return STRING_CONTRUCTOR;
  }
  if (parent.kind === ts.SyntaxKind.TemplateSpan) {
    return {
      type: "Variable",
      name: text,
    };
  }
};
