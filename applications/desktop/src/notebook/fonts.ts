import * as path from "path";
import { load } from "webfontloader";

const fontFolder = ["..", "node_modules", "nteract-assets", "fonts"];

load({
  custom: {
    families: ["Source Sans Pro", "Source Code Pro"],
    urls: [
      path.join(...fontFolder, "source-sans-pro", "source-sans-pro.css"),
      path.join(...fontFolder, "source-code-pro", "source-code-pro.css")
    ]
  }
});
