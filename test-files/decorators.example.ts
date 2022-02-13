function empty(): any {}
function singleArgument(_: string): any {}
function twoArguments(_: Object, __: Object): any {}

@empty()
@singleArgument("text")
@twoArguments({}, { key: "key", value: 1 })
export class DecoratorsExample {
  @empty()
  @singleArgument("text")
  @twoArguments({}, { key: "key", value: 1 })
  decoratedProp: any;

  @empty()
  @singleArgument("text")
  @twoArguments({}, { key: "key", value: 1 })
  decoratedMethod(): any {}
}
