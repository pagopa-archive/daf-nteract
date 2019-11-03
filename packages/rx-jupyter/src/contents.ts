import { Notebook } from "@nteract/commutable";
import querystring from "querystring";
import { Observable } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import urljoin from "url-join";
import { ServerConfig } from "@nteract/types";
import { createAJAXSettings, JupyterAjaxResponse } from "./base";

const formURI = (path: string) => urljoin("/api/contents/", path);

const formCheckpointURI = (path: string, checkpointID: string) =>
  urljoin("/api/contents/", path, "checkpoints", checkpointID);

export type FileType = "directory" | "file" | "notebook";

/*********************************************
 * Contents API request and response payloads
 *********************************************/

/**
 * Just the Stat call portion of the contents API
 * (no content property)
 */
export interface IStatContent<FT extends FileType = FileType> {
  name: string;
  path: string;
  type: FT;
  writable: boolean;
  created: string;
  last_modified: string;
  mimetype: string;
  format: string;
}

/**
 * For directory listings and when a GET is performed against content with ?content=0
 * the content field is null
 */
export interface IEmptyContent<FT extends FileType = FileType>
  extends IStatContent<FT> {
  content: null;
}

/**
 * Full Payloads from the contents API
 */
export interface IContent<FT extends FileType = FileType>
  extends IStatContent<FT> {
  content: FT extends "file"
    ? string
    : FT extends "notebook"
    ? Notebook
    : FT extends "directory"
    ? Array<IEmptyContent<FT>>
    : null;
}

/**
 * Creates an AjaxObservable for removing content.
 *
 * @param serverConfig The server configuration
 * @param path The path to the content
 *
 * @returns An Observable with the request response
 */
export const remove = (serverConfig: ServerConfig, path: string) =>
  ajax(
    createAJAXSettings(serverConfig, formURI(path), {
      method: "DELETE"
    })
  );

interface IGetParams {
  type: "file" | "directory" | "notebook";
  format: "text" | "base64" | string;
  content: 0 | 1;
}

/**
 * Creates an AjaxObservable for getting content at a path
 *
 * @param serverConfig The server configuration
 * @param path The content to fetch
 * @param params type, format, content
 * @param params.type file type, one of 'file', 'directory', 'notebook'
 * @param params.format How file content should be returned, e.g. 'text', 'base64'
 * @param params.content Return content or not (0 => no content, 1 => content please)
 *
 * @returns An Observable with the request response
 */
export function get(
  serverConfig: ServerConfig,
  path: string,
  params: Partial<IGetParams> = {}
) {
  let uri = formURI(path);
  const query = querystring.stringify(params);
  if (query.length > 0) {
    uri = `${uri}?${query}`;
  }

  // NOTE: If the user requests with params.content === 0
  // Then the response is IEmptyContent
  return ajax(
    createAJAXSettings(serverConfig, uri, { cache: false })
  ) as Observable<JupyterAjaxResponse<IContent<FileType>>>;
}

/**
 * Creates an AjaxObservable for renaming a file.
 *
 * @param serverConfig The server configuration
 * @param path The content to rename.
 * @param model The data to send in the server request
 *
 * @returns An Observable with the request response
 */
export function update<FT extends FileType>(
  serverConfig: ServerConfig,
  path: string,
  model: Partial<IContent>
) {
  return ajax(
    createAJAXSettings(serverConfig, formURI(path), {
      body: model,
      headers: {
        "Content-Type": "application/json"
      },
      method: "PATCH"
    })
  );
}

/**
 * Creates an AjaxObservable for creating content
 *
 * @param serverConfig The server configuration
 * @param path The path to the content
 * @param model The data to send in the server request
 *
 * @returns An Observable with the request response
 */
export function create<FT extends FileType>(
  serverConfig: ServerConfig,
  path: string,
  model: Partial<IContent<FT>> & { type: FT }
): Observable<AjaxResponse> {
  return ajax(
    createAJAXSettings(serverConfig, formURI(path), {
      body: model,
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    })
  );
}

/**
 * Creates an AjaxObservable for saving the file in the location specified by
 * name and path in the model.
 *
 * @param serverConfig  The server configuration
 * @param path The path to the content
 * @param model The data to send in the server request
 *
 * @returns An Observable with the request response
 */
export function save<FT extends FileType>(
  serverConfig: ServerConfig,
  path: string,
  model: Partial<IContent<FT>>
) {
  return ajax(
    createAJAXSettings(serverConfig, formURI(path), {
      body: model,
      headers: {
        "Content-Type": "application/json"
      },
      method: "PUT"
    })
  ) as Observable<
    JupyterAjaxResponse<{ path: string; [property: string]: string }>
  >;
}

/**
 * Creates an AjaxObservable for listing checkpoints for a given file.
 *
 * @param serverConfig The server configuration
 * @param path The content containing checkpoints to be listed.
 *
 * @returns An Observable with the request response
 */
export const listCheckpoints = (serverConfig: ServerConfig, path: string) =>
  ajax(
    createAJAXSettings(serverConfig, formCheckpointURI(path, ""), {
      cache: false,
      method: "GET"
    })
  );

/**
 * Creates an AjaxObservable for creating a new checkpoint with the current state of a file.
 * With the default Jupyter FileContentsManager, only one checkpoint is supported,
 * so creating new checkpoints clobbers existing ones.
 *
 * @param serverConfig The server configuration
 * @param path The content containing the checkpoint to be created
 *
 * @returns An Observable with the request response
 */
export const createCheckpoint = (serverConfig: ServerConfig, path: string) =>
  ajax(
    createAJAXSettings(serverConfig, formCheckpointURI(path, ""), {
      method: "POST"
    })
  );

/**
 * Creates an AjaxObservable for deleting a checkpoint for a given file.
 *
 * @param  serverConfig The server configuration
 * @param  path The content containing the checkpoint to be deleted
 * @param  checkpointID ID of checkpoint to be deleted
 *
 * @returns An Observable with the request response
 */
export const deleteCheckpoint = (
  serverConfig: ServerConfig,
  path: string,
  checkpointID: string
) =>
  ajax(
    createAJAXSettings(serverConfig, formCheckpointURI(path, checkpointID), {
      method: "DELETE"
    })
  );

/**
 * Creates an AjaxObservable for restoring a file to a specified checkpoint.
 *
 * @param serverConfig The server configuration
 * @param path The content to restore to a previous checkpoint
 * @param checkpointID ID of checkpoint to be used for restoration
 *
 * @returns An Observable with the request response
 */
export const restoreFromCheckpoint = (
  serverConfig: ServerConfig,
  path: string,
  checkpointID: string
) =>
  ajax(
    createAJAXSettings(serverConfig, formCheckpointURI(path, checkpointID), {
      method: "POST"
    })
  );
