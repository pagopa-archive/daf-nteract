import FileSaver from "file-saver";

import { stringifyNotebook } from "@nteract/commutable";

import { fixtureJSON } from "@nteract/fixtures";
import { downloadString } from "../src/contents";

describe("downloadString", () => {
  it("calls FileSaver.saveAs with notebook and filename", () => {
    const filename = "/here/there/awesome.ipynb";
    const expectedData = fixtureJSON;
    expect(FileSaver.saveAs).not.toHaveBeenCalled();
    downloadString(
      stringifyNotebook(fixtureJSON),
      filename,
      "application/json"
    );
    expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
    const actualMockBlobResponse = (FileSaver.saveAs as any).mock.calls[0][0];
    const actualFilename = (FileSaver.saveAs as any).mock.calls[0][1];

    expect(actualMockBlobResponse).toEqual({
      content: [stringifyNotebook(expectedData)],
      options: { type: "application/json" }
    });

    expect(actualFilename).toBe("awesome.ipynb");
  });
});
