import { Observable } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import urljoin from "url-join";

import { ServerConfig } from "@nteract/types";
import { createAJAXSettings, normalizeBaseURL } from "./base";

const formURI = (path: string) => urljoin("/api/terminals/", path);

/**
 * List all available running terminals.
 *
 * @param serverConfig The server configuration
 *
 * @returns An Observable with the request response
 */
export const list = (serverConfig: ServerConfig): Observable<AjaxResponse> =>
  ajax(
    createAJAXSettings(serverConfig, "/api/terminals/", {
      method: "GET"
    })
  );

/**
 * Create a terminal session.
 *
 * @param serverConfig The server configuration
 *
 * @return An Observable with the request response
 */
export const create = (serverConfig: ServerConfig): Observable<AjaxResponse> =>
  ajax(
    createAJAXSettings(serverConfig, "/api/terminals/", {
      method: "POST"
    })
  );

/**
 * Fetch a terminal session.
 *
 * @param serverConfig The server configuration.
 * @param id ID of the terminal to be fetched.
 *
 * @return An Observable with the request response
 */
export const get = (
  serverConfig: ServerConfig,
  id: string
): Observable<AjaxResponse> =>
  ajax(
    createAJAXSettings(serverConfig, formURI(id), {
      method: "GET"
    })
  );

/**
 * Delete a running terminal session.
 *
 * @param serverConfig The server configuration
 * @param id ID of the terminal to be fetched
 *
 * @return An Observable with the request response
 */
export const destroy = (
  serverConfig: ServerConfig,
  id: string
): Observable<AjaxResponse> =>
  ajax(
    createAJAXSettings(serverConfig, formURI(id), {
      method: "DELETE"
    })
  );

/**
 * Given a server configuration and a terminal ID, this function generates
 * a Websocket URL that can be used
 *
 * @param serverConfig The server configuration
 * @param id ID of the terminal to be fetched
 *
 * @returns A websocket URL for connecting to a terminal
 */
export const formWebSocketURL = (
  serverConfig: ServerConfig,
  id: string
): string => {
  const baseURL = normalizeBaseURL(serverConfig.endpoint || serverConfig.url);
  const url = `${baseURL}/terminals/websocket/${id}`;
  return url.replace(/^http(s)?/, "ws$1");
};
