import { remultiline } from "../src/primitives";

// In order to make jest output read well, show 🇳🇱 instead of newlines
function flagNewlines(s: string) {
  // NOTE: This function can be thought of mentally as Netherlines
  return s.replace(/\n/g, "🇳🇱");
}

describe("remultiline", () => {
  it("correctly splits strings by newline", () => {
    const testString = "this\nis\na\ntest\n";
    const multilined = remultiline(testString);
    expect(multilined).toEqual(["this\n", "is\n", "a\n", "test\n"]);
  });

  it("can handle repeated newlines", () => {
    expect(remultiline("test\n\n\nthis\n\nout").map(flagNewlines)).toEqual(
      ["test\n", "\n\n", "this\n", "\nout"].map(flagNewlines)
    );

    expect(
      remultiline("test\n\n\nthis\n\nout\n\n\n\n\n\nwhat").map(flagNewlines)
    ).toEqual(
      // This shows the super weird case with ours which is a bunch of
      // newlines before the last line...
      ["test\n", "\n\n", "this\n", "\n", "out\n", "\n\n\n\n\nwhat"].map(
        flagNewlines
      )
    );
  });

  it("keeps multiline arrays the same", () => {
    expect(remultiline(["test\n", "this"])).toEqual(["test\n", "this"]);
  });
});
