import * as Immutable from "immutable";
import uuid from "uuid/v4";

export type ExecutionCount = number | null;

// Mutable JSON types
export type PrimitiveImmutable = string | number | boolean | null;
export type JSONType = PrimitiveImmutable | JSONObject | JSONArray;
export interface JSONObject {
  [key: string]: JSONType;
}
export interface JSONArray extends Array<JSONType> {}

export type CellId = string;
export function createCellId(): CellId {
  return uuid();
}

// On disk multi-line strings are used to accomodate line-by-line diffs in tools
// like git and GitHub. They get converted to strings for the in-memory format.
export type MultiLineString = string | string[];

export type ImmutableJSONType =
  | PrimitiveImmutable
  | ImmutableJSONMap
  | ImmutableJSONList;

// Can't (easily) write circularly referenced types so this'll have to do for
// now
export type ImmutableJSONMap = Immutable.Map<string, any>;
export type ImmutableJSONList = Immutable.List<any>;

// tslint:disable:max-line-length
/**
 * Media Bundles as they exist on disk from the notebook format
 * See https://nbformat.readthedocs.io/en/latest/format_description.html#display-data for docs
 * and https://github.com/jupyter/nbformat/blob/master/nbformat/v4/nbformat.v4.schema.json for the schema
 */
// tslint:enable:max-line-length
export interface OnDiskMediaBundle {
  "text/plain"?: MultiLineString;
  "text/html"?: MultiLineString;
  "text/latex"?: MultiLineString;
  "text/markdown"?: MultiLineString;
  "application/javascript"?: MultiLineString;
  "image/png"?: MultiLineString;
  "image/jpeg"?: MultiLineString;
  "image/gif"?: MultiLineString;
  "image/svg+xml"?: MultiLineString;

  // The JSON mimetype has some corner cases because of the protocol / format
  // assuming the values in a media bundle are either:
  //
  //   * A string; which would be deserialized
  //   * An array; which would have to be assumed to be a multiline string
  //
  "application/json"?: string | string[] | {};
  "application/vdom.v1+json"?: {};
  "application/vnd.dataresource+json"?: {};
  "text/vnd.plotly.v1+html"?: MultiLineString | {};
  "application/vnd.plotly.v1+json"?: {};
  "application/geo+json"?: {};
  "application/x-nteract-model-debug+json"?: {};
  "application/vnd.vega.v2+json"?: {};
  "application/vnd.vega.v3+json"?: {};
  "application/vnd.vega.v4+json"?: {};
  "application/vnd.vega.v5+json"?: {};
  "application/vnd.vegalite.v1+json"?: {};
  "application/vnd.vegalite.v2+json"?: {};
  "application/vnd.vegalite.v3+json"?: {};

  [key: string]: string | string[] | {} | undefined;
}

// Enumerating over all the media types we currently accept
export interface MediaBundle {
  "text/plain"?: string;
  "text/html"?: string;
  "text/latex"?: string;
  "text/markdown"?: string;
  "application/javascript"?: string;
  "image/png"?: string;
  "image/jpeg"?: string;
  "image/gif"?: string;
  "image/svg+xml"?: string;
  // All our JSON types can only be JSON Objects
  "application/json"?: { [key: string]: any };
  "application/vdom.v1+json"?: { [key: string]: any };
  "application/vnd.dataresource+json"?: { [key: string]: any };
  "text/vnd.plotly.v1+html"?: string | { [key: string]: any };
  "application/vnd.plotly.v1+json"?: { [key: string]: any };
  "application/geo+json"?: { [key: string]: any };
  "application/x-nteract-model-debug+json"?: { [key: string]: any };
  "application/vnd.vega.v2+json"?: { [key: string]: any };
  "application/vnd.vega.v3+json"?: { [key: string]: any };
  "application/vnd.vega.v4+json"?: { [key: string]: any };
  "application/vnd.vega.v5+json"?: { [key: string]: any };
  "application/vnd.vegalite.v1+json"?: { [key: string]: any };
  "application/vnd.vegalite.v2+json"?: { [key: string]: any };
  "application/vnd.vegalite.v3+json"?: { [key: string]: any };
  // Other media types can also come in that we don't recognize
  [key: string]: string | string[] | {} | undefined;
}

/**
 * Turn nbformat multiline strings (arrays of strings for simplifying diffs)
 * into strings
 */
export function demultiline(s: string | string[]): string {
  if (Array.isArray(s)) {
    return s.join("");
  }
  return s;
}

/**
 * Split string into a list of strings delimited by newlines; useful for on-disk
 * git comparisons; and is the expectation for jupyter notebooks on disk
 */
export function remultiline(s: string | string[]): string[] {
  if (Array.isArray(s)) {
    // Assume already multiline string
    return s;
  }
  // Split on newline and retain newline char
  return s.split(/(.*?(?:\r\n|\n))/g).filter(x => x !== "");
}

function isJSONKey(key: string): boolean {
  return /^application\/(.*\+)json$/.test(key);
}

// A type with all ownPropertyNames also readonly; works for all JSON types
type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };

// tslint:disable-next-line:max-line-length
// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
export function deepFreeze<T>(object: T): DeepReadonly<T> {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self
  for (const name of propNames) {
    // getOwnPropertyNames assures us we can index on name
    const value = (object as any)[name];

    (object as any)[name] =
      value && typeof value === "object" ? deepFreeze(value) : value;
  }

  return (Object.freeze(object) as unknown) as DeepReadonly<T>;
}

export function createFrozenMediaBundle(
  mediaBundle: OnDiskMediaBundle
): Readonly<MediaBundle> {
  // Map over all the mimetypes; turning them into our in-memory format
  //
  // {
  //   "application/json": {"a": 3; "b": 2};
  //   "text/html": ["<p>\n"; "Hey\n"; "</p>"];
  //   "text/plain": "Hey"
  // }
  //
  // to
  //
  // {
  //   "application/json": {"a": 3; "b": 2};
  //   "text/html": "<p>\nHey\n</p>";
  //   "text/plain": "Hey"
  // }

  // Since we have to convert from one type to another that has conflicting
  // types; we need to hand convert it in a way that flow is able to verify
  // correctly.
  // FIXME: Is above comment still valid with the move from flow to ts?
  //
  // The way we do that is create a new object that we declare with the type
  // we want; set the keys and values we need; then seal the object with
  // Object.freeze
  const bundle: MediaBundle = {};

  for (const key in mediaBundle) {
    if (typeof mediaBundle[key] === "string") {
      // Strings are immutable and can be just taken as-is.
      //
      // N.B.: This is even true of strings sent directly as the JSON root
      // object -- which Bokeh's output_notebook() is known to do -- so we
      // have to check for them even in the JSON case, as deepFreeze will fail
      // on strings.
      bundle[key] = mediaBundle[key] as string;
    } else if (!isJSONKey(key) && Array.isArray(mediaBundle[key])) {
      bundle[key] = demultiline(mediaBundle[key] as MultiLineString);
    } else {
      // we now know it's an Object of some kind (or a JSON array)
      bundle[key] = deepFreeze(mediaBundle[key]!);
    }
  }

  return Object.freeze(bundle);
}

export function createOnDiskMediaBundle(
  mediaBundle: Readonly<MediaBundle>
): OnDiskMediaBundle {
  // Technically we could return just the mediaBundle as is
  // return mediaBundle;
  // However for the sake of on-disk readability we write out remultilined
  // versions of the array and string ones

  const freshBundle: OnDiskMediaBundle = {};
  for (const key in mediaBundle) {
    if (
      !isJSONKey(key) &&
      (typeof mediaBundle[key] === "string" || Array.isArray(mediaBundle[key]))
    ) {
      freshBundle[key] = remultiline(mediaBundle[key] as MultiLineString);
    } else {
      freshBundle[key] = mediaBundle[key];
    }
  }
  return freshBundle;
}
