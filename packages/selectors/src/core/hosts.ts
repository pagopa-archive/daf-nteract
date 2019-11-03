import {
  AppState,
  JupyterHostRecord,
  ServerConfig,
  HostRef
} from "@nteract/types";

import { createSelector } from "reselect";

import { currentKernelType } from "./kernels";

/**
 * Creates a server configuration from details about a given Jupyter host.
 *
 * @param   host    The Jupyter host we are connected to
 *
 * @returns         An object contain the endpoint, token
 */
export const serverConfig = (host: JupyterHostRecord): ServerConfig => {
  return {
    endpoint: host.origin + host.basePath,
    crossDomain: host.crossDomain ? host.crossDomain : undefined,
    token: host.token ? host.token : undefined,
    ajaxOptions: host.ajaxOptions ? host.ajaxOptions : undefined,
    wsProtocol: host.wsProtocol ? host.wsProtocol : undefined
  };
};

/**
 * Returns the host the nteract application is connected to.
 */
export const currentHost = (state: AppState) => state.app.host;

/**
 * Returns the type of host the nteract application is currently connected
 * to. This is set to "jupyter" by default.
 */
export const currentHostType = createSelector(
  [currentHost],
  host => {
    if (host && host.type) {
      return host.type;
    }
    return null;
  }
);

/**
 * Returns true if the host we are currently connected to is a Jupyter
 * kernel.
 */
export const isCurrentHostJupyter = createSelector(
  currentHostType,
  hostType => hostType === "jupyter"
);

/**
 * Returns whether or not we are currently connected to the kernel through
 * a websocket connection.
 */
export const isCurrentKernelJupyterWebsocket = createSelector(
  [currentHostType, currentKernelType],
  (hostType, kernelType) => {
    return hostType === "jupyter" && kernelType === "websocket";
  }
);

/**
 * Returns whether or not we are currently connected to the kernel through
 * a ZeroMQ connection.
 */
export const isCurrentKernelZeroMQ = createSelector(
  [currentHostType, currentKernelType],
  (hostType, kernelType) => {
    return hostType === "local" && kernelType === "zeromq";
  }
);

/**
 * Returns the hosts currently registered on the application by their refs.
 *
 * @param state   The crrent application state
 */
export const hostsByRef = (state: AppState) => state.core.entities.hosts.byRef;

/**
 * Returns the HostRef associated with a HostRecord.
 *
 * ```
 * const host = makeJupyterHostRecord({ endpoint: "https://example.com "});
 * const ref = selectors.hostRefByHostRecord(state, { host });
 * ```
 *
 * @param state     The current application state
 * @param { host }  An object containing the hostRecord to retrieve an HostRef for
 */
export const hostRefByHostRecord = (
  state: AppState,
  { host }: { host: JupyterHostRecord }
) => hostsByRef(state).findKey((record, ref) => record.equals(host));

/**
 * Returns the HostRecord associated with a hostRef.
 *
 * ```
 * const hostRef = "someHostRef";
 * const hostRecord = selectors.hostRecordByHostRef(state, { hostRef });
 * ```
 * @param state         The current application sate
 * @param { hostRef }   An object containing the hostRef to retrieve a record for
 */
export const hostRecordByHostRef = (
  state: AppState,
  { hostRef }: { hostRef: HostRef }
) => hostsByRef(state).get(hostRef);
