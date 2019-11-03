// Vendor modules
import {
  CellId,
  emptyNotebook,
  ImmutableCell,
  ImmutableNotebook
} from "@nteract/commutable";
import { NotebookV4 } from "@nteract/commutable/lib/v4";
import * as Immutable from "immutable";

// Local modules
import { InputRequestMessage, KernelRef } from "../..";

// The data model that `nteract/bookstore` accepts. For more info, see:
// https://jupyter-notebook.readthedocs.io/en/stable/extending/contents.html#data-model
export interface BookstoreDataModel {
  /**
   * Basename of the entity.
   */
  name: string | undefined;
  /**
   * Full (API-style)*def path to entity.
   * def => https://jupyter-notebook.readthedocs.io/en/stable/extending/contents.html#apipaths
   */
  path: string;
  /**
   * The entity type. One of "notebook", "file", or "directory".
   */
  type: "notebook";
  /**
   * Creation date of the entity.
   */
  created: string | undefined | null;
  /**
   * Last modified date of the entity.
   */
  last_modified: string | undefined | null;
  /**
   * The "content" of the entity.
   * See: https://jupyter-notebook.readthedocs.io/en/stable/extending/contents.html#filesystem-entities
   */
  content: NotebookV4;
  /**
   * The mimetype of `content`, if any.
   * See: https://jupyter-notebook.readthedocs.io/en/stable/extending/contents.html#filesystem-entities
   */
  mimetype: string | undefined | null;
  /**
   * The format of `content`, if any.
   * See: https://jupyter-notebook.readthedocs.io/en/stable/extending/contents.html#filesystem-entities
   */
  format: "json";
}

export interface DocumentRecordProps {
  type: "notebook";
  notebook: ImmutableNotebook;
  savedNotebook: ImmutableNotebook;
  // has the keypaths for updating displays
  transient: Immutable.Map<string, any>;
  // transient should be more fully typed (be a record itself)
  // right now it's keypaths and then it looks like it's able to handle any per
  // cell transient data that will be deleted when the kernel is restarted
  cellPagers: any;
  cellPrompts: Immutable.Map<CellId, InputRequestMessage>;
  editorFocused?: CellId | null;
  cellFocused?: CellId | null;
  copied: ImmutableCell | null;
  kernelRef?: KernelRef | null;
}

export const makeDocumentRecord = Immutable.Record<DocumentRecordProps>({
  type: "notebook",
  notebook: emptyNotebook,
  savedNotebook: emptyNotebook,
  transient: Immutable.Map({
    keyPathsForDisplays: Immutable.Map()
  }),
  cellPagers: Immutable.Map(),
  cellPrompts: Immutable.Map(),
  editorFocused: null,
  cellFocused: null,
  copied: null,
  kernelRef: null
});

export type NotebookModel = Immutable.RecordOf<DocumentRecordProps>;

export interface NotebookContentRecordProps {
  mimetype?: string | null;
  created?: Date | null;
  format: "json";
  lastSaved?: Date | null;
  model: NotebookModel;
  filepath: string;
  type: "notebook";
  writable: boolean;
  saving: boolean;
  loading: boolean;
  error?: object | null;
  showHeaderEditor?: boolean;
}

export const makeNotebookContentRecord = Immutable.Record<
  NotebookContentRecordProps
>({
  mimetype: null,
  created: null,
  format: "json",
  lastSaved: null,
  model: makeDocumentRecord(),
  filepath: "",
  type: "notebook",
  writable: true,
  saving: false,
  loading: false,
  error: null,
  showHeaderEditor: false
});

export type NotebookContentRecord = Immutable.RecordOf<
  NotebookContentRecordProps
>;
