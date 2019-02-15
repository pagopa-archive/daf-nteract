import * as kernelspecs from "../src/kernelspecs";
import { AjaxObservable } from "./types";

const serverConfig = {
  endpoint: "http://localhost:8888",
  crossDomain: true,
  token: "secret-token"
};

describe("kernelspecs", () => {
  describe("list", () => {
    test("creates an AjaxObservable for listing the kernelspecs", () => {
      const kernelSpec$ = kernelspecs.list(serverConfig) as AjaxObservable;
      const request = kernelSpec$.request;
      expect(request.url).toEqual(
        expect.stringContaining("http://localhost:8888/api/kernelspecs?_=")
      );
      expect(request.method).toBe("GET");
    });
  });

  describe("get", () => {
    test("creates an AjaxObservable for getting a kernelspec", () => {
      const kernelSpec$ = kernelspecs.get(
        serverConfig,
        "python3000"
      ) as AjaxObservable;
      const request = kernelSpec$.request;
      expect(request.url).toEqual(
        expect.stringContaining(
          "http://localhost:8888/api/kernelspecs/python3000?_="
        )
      );
      expect(request.method).toBe("GET");
    });
  });
});
