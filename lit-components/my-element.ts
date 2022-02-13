import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

const hi: string = "123";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement("my-element")
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property()
  name: string = "World";

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0;

  render() {
    return html`
      <h1>Hello, ${this.name} ${this.foo}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <slot></slot>
    `;
  }

  private static _onClick() {
    this.count++;
  }

  private foo(foo: string, bar: { type: string }): string {
    return "foo";
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}

const foo: Object = {
  test: () => "123",
};
