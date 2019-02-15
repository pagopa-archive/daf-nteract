// javascript stores text as utf16 and string indices use "code units",
// which stores high-codepoint characters as "surrogate pairs",
// which occupy two indices in the javascript string.
// We need to translate cursor_pos in the protocol (in characters)
// to js offset (with surrogate pairs taking two spots).
let js_idx_to_char_idx: (js_idx: number, text: string) => number = (
  js_idx: number,
  text: string
): number => {
  let char_idx: number = js_idx;
  for (let i: number = 0; i + 1 < text.length && i < js_idx; i++) {
    const char_code: number = text.charCodeAt(i);
    // check for surrogate pair
    if (char_code >= 0xd800 && char_code <= 0xdbff) {
      const next_char_code: number = text.charCodeAt(i + 1);
      if (next_char_code >= 0xdc00 && next_char_code <= 0xdfff) {
        char_idx--;
        i++;
      }
    }
  }
  return char_idx;
};

let char_idx_to_js_idx: (char_idx: number, text: string) => number = (
  char_idx: number,
  text: string
): number => {
  let js_idx: number = char_idx;
  for (let i: number = 0; i + 1 < text.length && i < js_idx; i++) {
    const char_code: number = text.charCodeAt(i);
    // check for surrogate pair
    if (char_code >= 0xd800 && char_code <= 0xdbff) {
      const next_char_code: number = text.charCodeAt(i + 1);
      if (next_char_code >= 0xdc00 && next_char_code <= 0xdfff) {
        js_idx++;
        i++;
      }
    }
  }
  return js_idx;
};

// This is not a normal "a"!
if ("𝐚".length === 1) {
  // If javascript fixes string indices of non-BMP characters,
  // don't keep shifting offsets to compensate for surrogate pairs
  char_idx_to_js_idx = js_idx_to_char_idx = (idx: number, _text: string) => {
    return idx;
  };
}

export { char_idx_to_js_idx, js_idx_to_char_idx };
