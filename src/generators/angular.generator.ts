import { writeFileSync } from "fs";
import { TYPE_INFERENCE } from "../constants/type.constant";
import { ParsedProperty } from "../parsers/property-declaration.parser";
import { toCollection } from "../utils/normalize-by-name.util";
import { ParsedSource } from "./source.generator";
const prettier = require("prettier");
import { JSDOM } from "jsdom";

const {
  variables,
  classes,
}: ParsedSource = require("../../dist/lit-components/my-element.json");

const componentClass = toCollection(classes).find(({ decorators }) =>
  decorators.some(({ name }) => name === "customElement")
);

if (!componentClass) {
  console.error("No component detected");
}

const {
  arguments: [selector],
} = componentClass.decorators.find(({ name }) => name === "customElement");

const { body } = componentClass.methods.byName["render"];

const html = prettier.format(/`([^`]*)`;/g.exec(body)[1], {
  parser: "html",
});

const { value: stylesValue } = componentClass.properties.byName["styles"];

const css = prettier.format(/`([^`]*)`/g.exec(stylesValue)[1], {
  parser: "css",
});

const inputs = toCollection(componentClass.properties).filter(
  ({ decorators }) => decorators.some(({ name }) => name === "property")
);

const dom = new JSDOM(html);
const document = dom.window.document;

const TEXT_NODE_TYPE: undefined = undefined;

type Transformer = (value: string) => string;

const transformStrings =
  (regex: RegExp) => (transformer: Transformer) => (raw: string) => {
    let matches = [];
    let parsed = raw;
    while ((matches = regex.exec(raw))) {
      const [original, value] = matches;
      parsed = parsed.replace(original, transformer(value));
    }
    return parsed;
  };

/**
 * ${<value>}
 */
const INTERPOLATION_REGEX = /\${(.*?)}/g;

const transformInterpolatedVariablesFactory =
  transformStrings(INTERPOLATION_REGEX);

const transformInterpolatedVariables = transformInterpolatedVariablesFactory(
  (value) => `{{ ${value.replace("this.", "")} }}`
);

/**
 * @<value>
 */
const EVENT_HANDLER_REGEX = /data-event-(.*?)=/g;
const transformEventHandlerDeclarationsFactory =
  transformStrings(EVENT_HANDLER_REGEX);

const transformEventHandlerDeclarations =
  transformEventHandlerDeclarationsFactory((event: string) => `(${event})=`);

const transformEventHandlerExpressionFactory =
  transformStrings(INTERPOLATION_REGEX);

const transformEventHandlerExpression = transformEventHandlerExpressionFactory(
  (value) => value.replace("this.", "") + "($event)"
);

const parseDomNode = (node: HTMLElement) => {
  if (node.tagName === TEXT_NODE_TYPE) {
    node.textContent = transformInterpolatedVariables(node.textContent);
  } else {
    if (node.hasAttributes?.()) {
      const { attributes } = node;
      for (let i = 0; i < attributes.length; i++) {
        const { name, value } = attributes[i];
        if (name[0] === "@") {
          node.removeAttribute(name);
          const parsedValue = transformEventHandlerExpression(value);
          node.setAttribute(`data-event-${name.slice(1)}`, parsedValue);
        }
      }
    }
  }

  return node.childNodes.forEach(parseDomNode);
};

parseDomNode(document.body);

const template = transformEventHandlerDeclarations(document.body.innerHTML);

const toInputs = (properties: ParsedProperty[]) =>
  properties
    .map(
      ({ name, type, value }) =>
        `@Input() ${name}${
          type === TYPE_INFERENCE
            ? value !== undefined
              ? ` = ${value};`
              : ""
            : `: ${type}${value !== undefined ? ` = ${value};` : ""}`
        }`
    )
    .join("\n  ");

console.log(
  prettier.format(
    `
@Component({
  selector: ${selector},
    template: \`\n${template}\`,
  style: \`\n${css}\`
})
export class ${componentClass.name} {
  ${toInputs(inputs)}
}
`,
    { parser: "typescript" }
  )
);
