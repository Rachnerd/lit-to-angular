import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { parseClass, ParsedClass } from "./parsers/class/class.parser";
import { ParsedMethod, parseMethod } from "./parsers/method/method.parser";
import {
  ParsedProperty,
  parsePropertyDeclaration,
} from "./parsers/property-declaration/property-declaration.parser";
import {
  ParsedVariable,
  parseVariable,
} from "./parsers/variable/variable.parser";
import {
  initNormalizedByName as initNormalizedSet,
  NormalizedByName,
  addToNormalizedSet,
} from "./utils/normalize-by-name.util";

const filename = "../lit-components/my-element.ts";
const program = ts.createProgram([filename], {});
const sourceFile = program.getSourceFile(filename);
/**
 * Stuff breaks if this line is removed;
 */
program.getTypeChecker();

interface ResultClass extends ParsedClass {
  properties: NormalizedByName<ParsedProperty>;
  methods: NormalizedByName<ParsedMethod>;
}

export interface ParsedSource {
  variables: NormalizedByName<ParsedVariable>;
  classes: NormalizedByName<ResultClass>;
}

const result: ParsedSource = {
  variables: initNormalizedSet(),
  classes: initNormalizedSet(),
};

const recursivelyParseNodes = (node: ts.Node, sourceFile: ts.SourceFile) => {
  /**
   * Parse variables defined in file scope.
   */
  if (node.kind === ts.SyntaxKind.VariableDeclaration) {
    addToNormalizedSet(
      result.variables,
      parseVariable(node as ts.VariableDeclaration)
    );
  }

  /**
   * Parse classes defined in file scope.
   */
  if (node.kind === ts.SyntaxKind.ClassDeclaration) {
    addToNormalizedSet(result.classes, {
      ...parseClass(node as ts.ClassDeclaration),
      properties: initNormalizedSet<ParsedProperty>(),
      methods: initNormalizedSet<ParsedMethod>(),
    });
  }

  /**
   * Parse instance properties of classes.
   */
  if (node.kind === ts.SyntaxKind.PropertyDeclaration) {
    const propertyDeclaration = node as ts.PropertyDeclaration;

    const parent = propertyDeclaration.parent.name.getText();

    addToNormalizedSet(
      result.classes.byName[parent].properties,
      parsePropertyDeclaration(propertyDeclaration)
    );
  }

  /**
   * Parse instance methods of classes.
   */
  if (node.kind === ts.SyntaxKind.MethodDeclaration) {
    const methodDeclaration = node as ts.MethodDeclaration;

    const parent = (
      methodDeclaration.parent as ts.ClassLikeDeclaration
    ).name.getText();

    addToNormalizedSet(
      result.classes.byName[parent].methods,
      parseMethod(methodDeclaration)
    );
  }

  node.forEachChild((child) => recursivelyParseNodes(child, sourceFile));
};

recursivelyParseNodes(sourceFile!, sourceFile!);

const filenameResult = path
  .resolve("../dist", filename.slice(1))
  .replace(".ts", ".json");

const filenameResultFragments = filenameResult.split("/");
const outputDir = filenameResultFragments
  .slice(0, filenameResultFragments.length - 1)
  .join("/");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
fs.writeFileSync(filenameResult, JSON.stringify(result, null, 2), "utf8");
