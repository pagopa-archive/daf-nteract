import { Subject, Subscriber } from "rxjs";
import { ajax } from "rxjs/ajax";
import { webSocket } from "rxjs/webSocket";
import urljoin from "url-join";
import URLSearchParams from "url-search-params";
import { createAJAXSettings } from "./base";

import { ServerConfig } from "@nteract/types";
import { JupyterMessage } from "@nteract/messaging";

/**
 * Creates an AjaxObservable for listing running kernels.
 *
 * @param serverConfig The server configuration
 *
 * @returns An Observable with the request response
 */
export const list = (serverConfig: ServerConfig) =>
  ajax(createAJAXSettings(serverConfig, "/api/kernels", { cache: false }));

/**
 * Creates an AjaxObservable for getting info about a kernel.
 *
 * @param serverConfig The server configuration
 * @param id The id of the kernel to fetch
 *
 * @returns An Observable with the request response
 */
export const get = (serverConfig: ServerConfig, id: string) =>
  ajax(
    createAJAXSettings(serverConfig, `/api/kernels/${id}`, {
      cache: false
    })
  );

/**
 * Creates an AjaxObservable for starting a kernel.
 *
 * @param serverConfig The server configuration
 * @param name The name of the kernel to start
 * @param path The path to start the kernel in
 *
 * @returns An Observable with the request response
 */
export const start = (serverConfig: ServerConfig, name: string, path: string) =>
  ajax(
    createAJAXSettings(serverConfig, "/api/kernels", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: { path, name }
    })
  );

/**
 * Creates an AjaxObservable for killing a kernel.
 *
 * @param serverConfig The server configuration
 * @param id The id of the kernel to kill
 *
 * @returns An Observable with the request response
 */
export const kill = (serverConfig: ServerConfig, id: string) =>
  ajax(
    createAJAXSettings(serverConfig, `/api/kernels/${id}`, { method: "DELETE" })
  );

/**
 * Creates an AjaxObservable for interrupting a kernel.
 *
 * @param serverConfig The server configuration
 * @param id The id of the kernel to interrupt
 *
 * @returns An Observable with the request response
 */
export const interrupt = (serverConfig: ServerConfig, id: string) =>
  ajax(
    createAJAXSettings(serverConfig, `/api/kernels/${id}/interrupt`, {
      method: "POST"
    })
  );

/**
 * Creates an AjaxObservable for restarting a kernel.
 *
 * @param serverConfig The server configuration
 * @param id The id of the kernel to restart
 *
 * @returns An Observable with the request response
 */
export const restart = (serverConfig: ServerConfig, id: string) =>
  ajax(
    createAJAXSettings(serverConfig, `/api/kernels/${id}/restart`, {
      method: "POST"
    })
  );

/**
 * Creates a Websocket URL that can be used to initialize a
 * connection with a kernel.
 *
 * @param serverConfig The server configuration
 * @param kernelID The ID of the kernel to connect to
 * @param sessionID The ID of the session to connect as
 *
 * @returns A string with the fully formed Websocket URL
 */
export const formWebSocketURL = (
  serverConfig: ServerConfig,
  kernelID: string,
  sessionID?: string
): string => {
  const params = new URLSearchParams();
  if (serverConfig.token) {
    params.append("token", serverConfig.token);
  }
  if (sessionID) {
    params.append("session_id", sessionID);
  }

  const q = params.toString();
  const suffix = q !== "" ? `?${q}` : "";

  const url = urljoin(
    serverConfig.endpoint || "",
    `/api/kernels/${kernelID}/channels${suffix}`
  );

  return url.replace(/^http(s)?/, "ws$1");
};

/**
 * Creates a connection to a kernel with the given kernelID scoped under
 * a particular sessionID.
 *
 * @param serverConfig The server configuration
 * @param kernelID The ID of the kernel to connect to
 * @param sessionID The ID of the session to connect as
 *
 * @returns A websocket Subject that can be subscribed to
 */
export const connect = (
  serverConfig: ServerConfig,
  kernelID: string,
  sessionID?: string
): Subject<any> => {
  const wsSubject = webSocket<JupyterMessage>({
    url: formWebSocketURL(serverConfig, kernelID, sessionID),
    protocol: serverConfig.wsProtocol
  });

  // Create a subject that does some of the handling inline for the session
  // and ensuring it's serialized
  return Subject.create(
    Subscriber.create(
      (message?: JupyterMessage) => {
        if (typeof message === "object") {
          const sessionizedMessage = {
            ...message,
            header: {
              session: sessionID,
              ...message.header
            }
          };

          wsSubject.next(sessionizedMessage);
        } else {
          console.error("Message must be an object, the app sent", message);
        }
      },
      (e: Error) => wsSubject.error(e),
      () => wsSubject.complete()
    ), // Subscriber
    // Subject.create takes a subscriber and an observable. We're only
    // overriding the subscriber here so we pass the subject on as an
    // observable as the second argument to Subject.create (since it's
    // _also_ an observable)
    wsSubject
  );
};
