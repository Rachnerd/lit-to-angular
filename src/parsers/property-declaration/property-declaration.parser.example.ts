function empty(): any {}

export class PropertiesExample {
  propPublic: any;
  private propPrivate: any;

  static propStatic: any;
  private static propPrivateStatic: any;

  typedWithValue: string = "text";
  inlineInterfaceWithValue: {
    key: string;
    value: number;
    inline: { key: string };
  } = {
    key: "key",
    value: 1,
    inline: { key: "value" },
  };

  nestedInlineInterfaceWithValue: {
    key: string;
    value: number;
    inline: { key: { key: { key: string } } };
  } = {
    key: "key",
    value: 1,
    inline: { key: { key: { key: "value" } } },
  };

  collection: string[] = ["1", "2", "3"];

  nestedCollection: (string | string[])[] = ["1", "2", ["1", "2"]];

  mixedCollection: (string | number | { key: string })[] = [
    "1",
    2,
    { key: "value" },
  ];

  @empty()
  withDecorator: any;
}
