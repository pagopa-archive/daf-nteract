/**
 * @module rx-jupyter
 */
import { ajax, AjaxResponse } from "rxjs/ajax";
import { createAJAXSettings, ServerConfig as _ServerConfig } from "./base";

// Workaround an issue with re-exporting an interface by type aliasing it
export type ServerConfig = _ServerConfig;

import { Observable } from "rxjs";
import * as contents from "./contents";
import * as kernels from "./kernels";
import * as kernelspecs from "./kernelspecs";
import * as sessions from "./sessions";
import * as terminals from "./terminals";

/**
 * Get the version of the API for a given server.
 *
 * @param serverConfig The server configuration
 *
 * @returns An Observable containing the API version information
 */
export const apiVersion = (
  serverConfig: ServerConfig
): Observable<AjaxResponse> => ajax(createAJAXSettings(serverConfig, "/api"));

/**
 * Creates an AjaxObservable for shutting down a notebook server.
 *
 * @param serverConfig The server configuration
 *
 * @returns An Observable with the request/response
 */
export const shutdown = (
  serverConfig: ServerConfig
): Observable<AjaxResponse> =>
  ajax(createAJAXSettings(serverConfig, "/api/shutdown", { method: "POST" }));

export { kernels, kernelspecs, sessions, contents, terminals };
