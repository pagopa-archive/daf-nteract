import blockPlugin from "./block";
import inlinePlugin from "./inline";

export function mathPlugin(this: any, opts: object = {}) {
  blockPlugin.call(this, opts);
  inlinePlugin.call(this, opts);
}

export default mathPlugin;
