import { css } from "lit";

const numberConstructor = Number;
const stringConstructor = String;

const cssVariable = css`
  .variable {
  }
`;

const cssTemplate = css`
  .template {
    ${cssVariable}
  }
`;
