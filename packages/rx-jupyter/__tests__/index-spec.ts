import * as jupyter from "../src";
import { AjaxObservable } from "./types";

describe("rx-jupyter", () => {
  // Mostly a dummy "have we exported all the things" test
  test("exports kernels and kernelspecs", () => {
    expect(jupyter.kernels).not.toBeNull();
    expect(jupyter.kernelspecs).not.toBeNull();
  });

  describe("apiVersion", () => {
    test("creates an AjaxObservable for getting the notebook server version", () => {
      const apiVersion$ = jupyter.apiVersion({
        endpoint: "https://somewhere.com",
        crossDomain: true
      }) as AjaxObservable;
      const request = apiVersion$.request;
      expect(request.url).toBe("https://somewhere.com/api");
      expect(request.method).toBe("GET");
      expect(request.headers).toEqual({});
    });
    test("creates an AjaxObservable with the correct custom options", () => {
      const apiVersion$ = jupyter.apiVersion({
        endpoint: "https://somewhere.com",
        crossDomain: true,
        ajaxOptions: {
          headers: {
            From: "test@tester.com"
          }
        }
      }) as AjaxObservable;
      const request = apiVersion$.request;
      expect(request.url).toBe("https://somewhere.com/api");
      expect(request.method).toBe("GET");
      expect(request.headers).toEqual({ From: "test@tester.com" });
    });
  });
  describe("shutdown", () => {
    test(" Creates an AjaxObservable for shutting down a notebook server", () => {
      const shutdown$ = jupyter.shutdown({
        endpoint: "https://somewhere.com",
        crossDomain: true
      }) as AjaxObservable;
      const request = shutdown$.request;
      expect(request.url).toBe("https://somewhere.com/api/shutdown");
      expect(request.method).toBe("POST");
    });
  });
});
