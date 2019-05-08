// TODO: There is the potential to have a Flash-of-Unstyled-Content since this is
//       now async
import { load } from "webfontloader";

load({
  google: {
    families: ["Source Sans Pro", "Source Serif Pro", "Source Code Pro"]
  }
});
