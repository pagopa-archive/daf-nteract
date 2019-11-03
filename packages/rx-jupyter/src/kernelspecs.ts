import { Observable } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { ServerConfig } from "@nteract/types";
import { createAJAXSettings } from "./base";

/**
 * Creates an AjaxObservable for listing available kernelspecs.
 *
 * @param serverConfig The server configuration
 *
 * @return An Observable with the request response
 */
export const list = (serverConfig: ServerConfig): Observable<AjaxResponse> =>
  ajax(createAJAXSettings(serverConfig, "/api/kernelspecs", { cache: false }));

/**
 * Returns the specification of available kernels with the given
 * kernel name.
 *
 * @param serverConfig The server configuration
 * @param name The name of the kernel
 *
 * @returns An Observable with the request response
 */
export const get = (
  serverConfig: ServerConfig,
  name: string
): Observable<AjaxResponse> =>
  ajax(
    createAJAXSettings(serverConfig, `/api/kernelspecs/${name}`, {
      cache: false
    })
  );
