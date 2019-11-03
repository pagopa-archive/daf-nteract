import {
  fromJS as immutableFromJS,
  List as ImmutableList,
  Map as ImmutableMap,
  RecordOf
} from "immutable";

import {
  CellId,
  createFrozenMediaBundle,
  demultiline,
  JSONObject,
  MediaBundle,
  MultiLineString
} from "./primitives";

import { makeNotebookRecord } from "./notebook";

import {
  CodeCellParams,
  ImmutableCell,
  ImmutableCodeCell,
  ImmutableMarkdownCell,
  ImmutableRawCell,
  makeCodeCell,
  makeMarkdownCell,
  makeRawCell,
  MarkdownCellParams,
  RawCellParams
} from "./cells";

import {
  ImmutableOutput,
  makeDisplayData,
  makeErrorOutput,
  makeExecuteResult,
  makeStreamOutput
} from "./outputs";

import { appendCell, CellStructure } from "./structures";
import { MarkdownCell, RawCell } from "./v4";

const VALID_MIMETYPES = {
  text: "text/plain",
  latex: "text/latex",
  png: "image/png",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  html: "text/html",
  javascript: "application/x-javascript",
  json: "application/javascript",
  pdf: "application/pdf"
};
type MimeTypeKey = keyof typeof VALID_MIMETYPES;
type MimePayload = { [P in MimeTypeKey]?: MultiLineString };

interface MimeOutput<T extends string = string> extends MimePayload {
  output_type: T;
  prompt_number?: number;
  metadata: object;
}

export interface ExecuteResult extends MimeOutput<"pyout"> {}
export interface DisplayData extends MimeOutput<"display_data"> {}
export interface ErrorOutput {
  output_type: "error" | "pyerr";
  ename: string;
  evalue: string;
  traceback: string[];
}

export interface StreamOutput {
  output_type: "stream";
  stream: string;
  text: MultiLineString;
}

export type Output = ExecuteResult | DisplayData | StreamOutput | ErrorOutput;

export interface HeadingCell {
  cell_type: "heading";
  metadata: JSONObject;
  source: MultiLineString;
  level: number;
}

export interface CodeCell {
  cell_type: "code";
  language: string;
  collapsed: boolean;
  metadata: JSONObject;
  input: MultiLineString;
  prompt_number: number;
  outputs: Output[];
}

export type Cell = RawCell | MarkdownCell | HeadingCell | CodeCell;

export interface Worksheet {
  cells: Cell[];
  metadata: object;
}

export interface NotebookV3 {
  worksheets: Worksheet[];
  metadata: object;
  nbformat: 3;
  nbformat_minor: number;
}

function createImmutableMarkdownCell(
  cell: MarkdownCell
): ImmutableMarkdownCell {
  return makeMarkdownCell({
    cell_type: cell.cell_type,
    source: demultiline(cell.source),
    metadata: immutableFromJS(cell.metadata)
  });
}

/**
 * Handle the old v3 version of the media
 */
function createImmutableMediaBundle(output: MimeOutput): Readonly<MediaBundle> {
  const mediaBundle: { [key: string]: MultiLineString | undefined } = {};
  for (const key of Object.keys(output)) {
    // v3 had non-media types for rich media
    if (key in VALID_MIMETYPES) {
      mediaBundle[VALID_MIMETYPES[key as MimeTypeKey]] =
        output[key as keyof MimePayload];
    }
  }
  return createFrozenMediaBundle(mediaBundle);
}

function createImmutableOutput(output: Output): ImmutableOutput {
  switch (output.output_type) {
    case "pyout":
      return makeExecuteResult({
        execution_count: output.prompt_number,
        // Note strangeness with v4 API
        data: createImmutableMediaBundle(output),
        metadata: immutableFromJS(output.metadata)
      });
    case "display_data":
      return makeDisplayData({
        data: createImmutableMediaBundle(output),
        metadata: immutableFromJS(output.metadata)
      });
    case "stream":
      // Default to stdout in all cases unless it's stderr
      const name = output.stream === "stderr" ? "stderr" : "stdout";

      return makeStreamOutput({
        name,
        text: demultiline(output.text)
      });
    case "pyerr":
      return makeErrorOutput({
        ename: output.ename,
        evalue: output.evalue,
        traceback: ImmutableList(output.traceback)
      });
    default:
      throw new TypeError(`Output type ${output.output_type} not recognized`);
  }
}

function createImmutableCodeCell(cell: CodeCell): ImmutableCodeCell {
  return makeCodeCell({
    cell_type: cell.cell_type,
    source: demultiline(cell.input),
    outputs: ImmutableList(cell.outputs.map(createImmutableOutput)),
    execution_count: cell.prompt_number,
    metadata: immutableFromJS(cell.metadata)
  });
}

function createImmutableRawCell(cell: RawCell): ImmutableRawCell {
  return makeRawCell({
    cell_type: cell.cell_type,
    source: demultiline(cell.source),
    metadata: immutableFromJS(cell.metadata)
  });
}

function createImmutableHeadingCell(cell: HeadingCell): ImmutableMarkdownCell {
  // v3 heading cells are just markdown cells in v4+
  return makeMarkdownCell({
    cell_type: "markdown",
    source: Array.isArray(cell.source)
      ? demultiline(
          cell.source.map(line =>
            Array(cell.level)
              .join("#")
              .concat(" ")
              .concat(line)
          )
        )
      : cell.source,
    metadata: immutableFromJS(cell.metadata)
  });
}

function createImmutableCell(cell: Cell): any {
  switch (cell.cell_type) {
    case "markdown":
      return createImmutableMarkdownCell(cell);
    case "code":
      return createImmutableCodeCell(cell);
    case "raw":
      return createImmutableRawCell(cell);
    case "heading":
      return createImmutableHeadingCell(cell);
    default:
      throw new TypeError(`Cell type ${(cell as any).cell_type} unknown`);
  }
}

export function fromJS(notebook: NotebookV3): any {
  if (!isNotebookV3(notebook)) {
    notebook = notebook as any;
    throw new TypeError(
      `Notebook is not a valid v3 notebook. v3 notebooks must be of form 3.x
      It lists nbformat v${notebook.nbformat}.${notebook.nbformat_minor}`
    );
  }

  const starterCellStructure: CellStructure = {
    cellOrder: ImmutableList<CellId>().asMutable(),
    cellMap: ImmutableMap<CellId, ImmutableCell>().asMutable()
  };

  const cellStructure = ([] as CellStructure[]).concat.apply(
    [],
    notebook.worksheets.map(worksheet =>
      worksheet.cells.reduce(
        (cellStruct, cell) => appendCell(cellStruct, createImmutableCell(cell)),
        starterCellStructure
      )
    )
  )[0];

  return makeNotebookRecord({
    cellOrder: cellStructure.cellOrder.asImmutable(),
    cellMap: cellStructure.cellMap.asImmutable(),
    nbformat_minor: notebook.nbformat_minor,
    nbformat: 4,
    metadata: immutableFromJS(notebook.metadata)
  });
}

export function isNotebookV3(value: any): value is NotebookV3 {
  return (
    value &&
    typeof value === "object" &&
    value.nbformat === 3 &&
    value.nbformat_minor >= 0
  );
}
