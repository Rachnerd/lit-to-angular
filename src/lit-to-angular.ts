import { readFileSync } from "fs";
import * as ts from "typescript";

export function parse(sourceFile: ts.SourceFile) {
  delintNode(sourceFile);

  function delintNode(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.PropertyAssignment:
        console.log("Prop assignment", node);
        break;
      case ts.SyntaxKind.PropertyDeclaration:
        console.log("Prop declaration", node);
        break;
    }

    ts.forEachChild(node, delintNode);
  }
}

const fileNames = process.argv.slice(2);
fileNames.forEach((fileName) => {
  const sourceFile = ts.createSourceFile(
    fileName,
    readFileSync(fileName).toString(),
    ts.ScriptTarget.ES2015
  );
  parse(sourceFile);
});
