/**
 *
 * This is the top level data structure for in memory data structures,
 * and allows converting from on-disk v4 and v3 Jupyter Notebooks
 *
 */
import * as v3 from "./v3";
import * as v4 from "./v4";

import { List as ImmutableList, Map as ImmutableMap, Record } from "immutable";

import { ImmutableCell } from "./cells";
import { CellId, JSONType } from "./primitives";

export interface NotebookRecordParams {
  cellOrder: ImmutableList<CellId>;
  cellMap: ImmutableMap<CellId, ImmutableCell>;
  nbformat_minor: number;
  nbformat: number;
  metadata: ImmutableMap<string, any>;
}

export const makeNotebookRecord = Record<NotebookRecordParams>({
  cellOrder: ImmutableList(),
  cellMap: ImmutableMap(),
  nbformat_minor: 0,
  nbformat: 4,
  metadata: ImmutableMap()
});

export type ImmutableNotebook = Record<NotebookRecordParams> &
  Readonly<NotebookRecordParams>;

function freezeReviver<T extends JSONType>(_k: string, v: T): Readonly<T> {
  return Object.freeze(v);
}

export type Notebook = v4.NotebookV4 | v3.NotebookV3;

/**
 * Converts a string representation of a notebook into a JSON representation.
 *
 * @param notebookString A string representation of a notebook.
 *
 * @returns A JSON representation of the same notebook.
 */
export function parseNotebook(notebookString: string): Notebook {
  return JSON.parse(notebookString, freezeReviver);
}

export function fromJS(notebook: Notebook | ImmutableNotebook): any {
  if (Record.isRecord(notebook)) {
    if (notebook.has("cellOrder") && notebook.has("cellMap")) {
      return notebook;
    }
    throw new TypeError(`
      commutable was passed an Immutable.Record 
      structure that is not a notebook
    `);
  }

  if (v4.isNotebookV4(notebook)) {
    if (
      Array.isArray(notebook.cells) &&
      typeof notebook.metadata === "object"
    ) {
      return v4.fromJS(notebook);
    }
  } else if (v3.isNotebookV3(notebook)) {
    return v3.fromJS(notebook);
  }

  if (notebook.nbformat) {
    throw new TypeError(
      `nbformat v${notebook.nbformat}.${notebook.nbformat_minor} not recognized`
    );
  }

  throw new TypeError("This notebook format is not supported");
}

/**
 * Converts an immutable representation of a notebook
 * to a JSON representation of the notebook using the
 * v4 of the nbformat specification.
 *
 * @param immnb The immutable representation of a notebook.
 *
 * @returns The JSON representation of a notebook.
 */
export function toJS(immnb: ImmutableNotebook): v4.NotebookV4 {
  const minorVersion: number | null = immnb.get("nbformat_minor", null);

  if (
    immnb.get("nbformat") === 4 &&
    typeof minorVersion === "number" &&
    minorVersion >= 0
  ) {
    return v4.toJS(immnb);
  }
  throw new TypeError("Only notebook formats 3 and 4 are supported!");
}

/**
 * Converts a JSON representation of a notebook into a string representation.
 *
 * @param notebook The JSON representation of a notebook.
 *
 * @returns A string containing the notebook data.
 */
export function stringifyNotebook(notebook: Notebook): string {
  return JSON.stringify(notebook, null, 2);
}
