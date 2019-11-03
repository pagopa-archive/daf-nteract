import * as Immutable from "immutable";
import { AjaxRequest } from "rxjs/ajax";

import { HostId } from "../ids";
import { HostRef } from "../refs";

export interface Bookstore {
  version: string;
}

export interface ServerConfig {
  endpoint: string;
  url?: string;
  crossDomain?: boolean;
  token?: string;
  xsrfToken?: string;
  ajaxOptions?: Partial<AjaxRequest>;
  wsProtocol?: string | string[];
}

export interface EmptyHost {
  type: "empty";
  bookstoreEnabled?: boolean;
}
export type EmptyHostRecord = Immutable.RecordOf<EmptyHost>;
export const makeEmptyHostRecord = Immutable.Record<EmptyHost>({
  type: "empty",
  bookstoreEnabled: false
});

export interface BaseHostProps {
  id?: HostId | null;
  defaultKernelName: string;
  bookstoreEnabled?: boolean;
  showHeaderEditor?: boolean;
}

export type JupyterHostRecordProps = BaseHostProps & {
  type: "jupyter";
  token?: string | null;
  origin: string;
  basePath: string;
  bookstoreEnabled: boolean;
  showHeaderEditor: boolean;
  crossDomain?: boolean | null;
  ajaxOptions?: Partial<AjaxRequest>;
  wsProtocol?: string | string[];
};

export const makeJupyterHostRecord = Immutable.Record<JupyterHostRecordProps>({
  type: "jupyter",
  id: null,
  defaultKernelName: "python",
  token: null,
  origin: typeof location === "undefined" ? "" : location.origin,
  basePath: "/",
  crossDomain: false,
  ajaxOptions: undefined,
  wsProtocol: undefined,
  bookstoreEnabled: false,
  showHeaderEditor: false
});

export type JupyterHostRecord = Immutable.RecordOf<JupyterHostRecordProps>;

export type LocalHostRecordProps = BaseHostProps & {
  type: "local";
};

export const makeLocalHostRecord = Immutable.Record<LocalHostRecordProps>({
  type: "local",
  id: null,
  defaultKernelName: "python",
  bookstoreEnabled: false
});

export type LocalHostRecord = Immutable.RecordOf<LocalHostRecordProps>;

export type HostRecordProps = LocalHostRecordProps | JupyterHostRecordProps;

export type HostRecord = LocalHostRecord | JupyterHostRecord | EmptyHostRecord;

export interface HostsRecordProps {
  byRef: Immutable.Map<HostRef, HostRecord>;
  refs: Immutable.List<HostRef>;
}

export const makeHostsRecord = Immutable.Record<HostsRecordProps>({
  byRef: Immutable.Map(),
  refs: Immutable.List()
});
