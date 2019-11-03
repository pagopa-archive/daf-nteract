// Due to the on-disk format needing to be written out in an explicit order,
// we disable ordering for this file
// tslint:disable:object-literal-sort-keys.

/**
 * Functions in this module are provided for converting from Jupyter Notebook
 * Format v4 to nteract's in-memory format, affectionately referred to as
 * commutable.
 *
 * See: https://github.com/jupyter/nbformat/blob/62d6eb8803616d198eaa2024604d1fe923f2a7b3/nbformat/v4/nbformat.v4.schema.json
 *
 * The main goal here is consistency and compliance with the v4 spec. The types
 * contained in here (non Immutable ones) are constrained to the disk based
 * notebook format.
 *
 */

// Vendor modules
import {
  fromJS as immutableFromJS,
  List as ImmutableList,
  Map as ImmutableMap,
  Record,
  Set as ImmutableSet
} from "immutable";

// Local modules
import {
  ImmutableCell,
  ImmutableCodeCell,
  ImmutableMarkdownCell,
  ImmutableRawCell,
  makeCodeCell,
  makeMarkdownCell,
  makeRawCell
} from "./cells";
import {
  ImmutableNotebook,
  makeNotebookRecord,
  NotebookRecordParams
} from "./notebook";
import {
  createImmutableOutput,
  ImmutableOutput,
  OnDiskOutput
} from "./outputs";
import {
  CellId,
  createOnDiskMediaBundle,
  demultiline,
  ExecutionCount,
  JSONObject,
  MultiLineString,
  remultiline
} from "./primitives";
import { appendCell, CellStructure } from "./structures";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                              Cell Types
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export interface CodeCell {
  cell_type: "code";
  metadata: JSONObject;
  execution_count: ExecutionCount;
  source: MultiLineString;
  outputs: OnDiskOutput[];
}

export interface MarkdownCell {
  cell_type: "markdown";
  metadata: JSONObject;
  source: MultiLineString;
}

export interface RawCell {
  cell_type: "raw";
  metadata: JSONObject;
  source: MultiLineString;
}

export type Cell = CodeCell | MarkdownCell | RawCell;

export interface NotebookV4 {
  cells: Cell[];
  metadata: JSONObject;
  nbformat: 4;
  nbformat_minor: number;
}

/**
 * Converts a mutable representation of metadata to an immutable representation.
 *
 * @param metadata A JSON representation of notebook metadata.
 *
 * @returns ImmutableMetadata An immutable representation of the metadata.
 */
function createImmutableMetadata(metadata: JSONObject): ImmutableMap<any, any> {
  return ImmutableMap(metadata).map((v, k: string) => {
    if (k !== "tags") {
      return v;
    }

    if (Array.isArray(v)) {
      return ImmutableSet(v);
    }

    // The notebook spec requires that this field is an Array of strings
    return ImmutableSet();
  });
}

function createImmutableRawCell(cell: RawCell): ImmutableRawCell {
  return makeRawCell({
    cell_type: cell.cell_type,
    source: demultiline(cell.source),
    metadata: createImmutableMetadata(cell.metadata)
  });
}

function createImmutableMarkdownCell(
  cell: MarkdownCell
): ImmutableMarkdownCell {
  return makeMarkdownCell({
    cell_type: cell.cell_type,
    source: demultiline(cell.source),
    metadata: createImmutableMetadata(cell.metadata)
  });
}

function createImmutableCodeCell(cell: CodeCell): ImmutableCodeCell {
  return makeCodeCell({
    cell_type: cell.cell_type,
    source: demultiline(cell.source),
    outputs: ImmutableList(cell.outputs.map(createImmutableOutput)),
    execution_count: cell.execution_count,
    metadata: createImmutableMetadata(cell.metadata)
  });
}

/**
 * Converts a JSON representation of a cell of any type to the correct
 * immutable representation, per the v4 nbformat specification.
 *
 * @param cell A JSON representation of a cell.
 *
 * @returns An immutable representation of the same cell.
 */
function createImmutableCell(cell: Cell): ImmutableCell {
  switch (cell.cell_type) {
    case "markdown":
      return createImmutableMarkdownCell(cell);
    case "code":
      return createImmutableCodeCell(cell);
    case "raw":
      return createImmutableRawCell(cell);
    default:
      throw new TypeError(`Cell type ${(cell as any).cell_type} unknown`);
  }
}

export function fromJS(
  notebook: NotebookV4
): Record<NotebookRecordParams> & Readonly<NotebookRecordParams> {
  if (!isNotebookV4(notebook)) {
    notebook = notebook as any;
    throw new TypeError(
      `Notebook is not a valid v4 notebook. v4 notebooks must be of form 4.x
       It lists nbformat v${notebook.nbformat}.${notebook.nbformat_minor}`
    );
  }

  // Since we're doing N cell operations all at once, switch to mutable then
  // switch back after.
  const starterCellStructure: CellStructure = {
    cellOrder: ImmutableList<CellId>().asMutable(),
    cellMap: ImmutableMap<CellId, ImmutableCell>().asMutable()
  };

  const cellStructure = notebook.cells.reduce(
    (cellStruct, cell) => appendCell(cellStruct, createImmutableCell(cell)),
    starterCellStructure
  );

  return makeNotebookRecord({
    cellOrder: cellStructure.cellOrder.asImmutable(),
    cellMap: cellStructure.cellMap.asImmutable(),
    nbformat_minor: notebook.nbformat_minor,
    nbformat: 4,
    metadata: immutableFromJS(notebook.metadata)
  });
}

function metadataToJS(immMetadata: ImmutableMap<string, any>): JSONObject {
  return immMetadata.toJS() as JSONObject;
}

function outputToJS(output: ImmutableOutput): OnDiskOutput {
  switch (output.output_type) {
    case "execute_result":
      return {
        output_type: output.output_type,
        execution_count: output.execution_count,
        data: createOnDiskMediaBundle(output.data),
        metadata: output.metadata.toJS()
      };
    case "display_data":
      return {
        output_type: output.output_type,
        data: createOnDiskMediaBundle(output.data),
        metadata: output.metadata.toJS()
      };
    case "stream":
      return {
        output_type: output.output_type,
        name: output.name,
        text: remultiline(output.text)
      };
    case "error":
      return {
        output_type: output.output_type,
        ename: output.ename,
        evalue: output.evalue,
        // Note: this is one of the cases where the Array of strings (for
        // traceback) is part of the format, not a multiline string
        traceback: output.traceback.toJS()
      };
  }
}

function markdownCellToJS(immCell: ImmutableMarkdownCell): MarkdownCell {
  return {
    cell_type: "markdown",
    source: remultiline(immCell.source),
    metadata: metadataToJS(immCell.metadata)
  };
}

/**
 * Converts an immutable representation of a code cell to a JSON representation.
 *
 * @param immCell An immutable representation of a code cell.
 *
 * @returns A JSON representation of the same code cell.
 */
function codeCellToJS(immCell: ImmutableCodeCell): CodeCell {
  return {
    cell_type: "code",
    source: remultiline(immCell.source),
    outputs: immCell.outputs.map(outputToJS).toArray(),
    execution_count: immCell.execution_count,
    metadata: metadataToJS(immCell.metadata)
  };
}

/**
 * Converts an immutable representation of a raw cell to a JSON representation.
 *
 * @param immCell An immutable representation of a raw cell.
 *
 * @returns A JSON representation of the same raw cell.
 */
function rawCellToJS(immCell: ImmutableRawCell): RawCell {
  return {
    cell_type: "raw",
    source: remultiline(immCell.source),
    metadata: metadataToJS(immCell.get("metadata", ImmutableMap()))
  };
}

/**
 * Converts an immutable cell to a JSON cell.
 *
 * @param immCell An immutable representation of a cell.
 *
 * @returns A JSON representation of the same cell.
 */
function cellToJS(immCell: ImmutableCell): Cell {
  switch (immCell.cell_type) {
    case "markdown":
      return markdownCellToJS(immCell);
    case "code":
      return codeCellToJS(immCell);
    case "raw":
      return rawCellToJS(immCell);
    default:
      throw new TypeError("Cell type unknown at runtime");
  }
}

/**
 * Converts an immutable representation of a notebook to a JSON representation.
 *
 * @param immnb The immutable representation of a notebook.
 *
 * @returns The JSON representation of a notebook.
 */
export function toJS(immnb: ImmutableNotebook): NotebookV4 {
  const plainNotebook = immnb.toObject();
  const plainCellOrder: string[] = plainNotebook.cellOrder.toArray();
  const plainCellMap: {
    [key: string]: ImmutableCell;
  } = plainNotebook.cellMap.toObject();

  const cells = plainCellOrder.map((cellId: string) =>
    cellToJS(plainCellMap[cellId])
  );

  return {
    cells,
    metadata: plainNotebook.metadata.toJS() as JSONObject,
    nbformat: 4,
    nbformat_minor: plainNotebook.nbformat_minor
  };
}

export function isNotebookV4(value: any): value is NotebookV4 {
  return (
    value &&
    typeof value === "object" &&
    value.nbformat === 4 &&
    value.nbformat_minor >= 0
  );
}
