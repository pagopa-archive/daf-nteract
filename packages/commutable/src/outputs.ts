import {
  fromJS as immutableFromJS,
  List as ImmutableList,
  Map as ImmutableMap,
  Record,
  RecordOf
} from "immutable";

import {
  createFrozenMediaBundle,
  demultiline,
  ExecutionCount,
  JSONObject,
  MediaBundle,
  MultiLineString,
  OnDiskMediaBundle,
  remultiline
} from "./primitives";

/** ExecuteResult Record Boilerplate */
export interface ExecuteResultParams {
  output_type: "execute_result";
  execution_count: ExecutionCount;
  data: Readonly<MediaBundle>;
  metadata?: any;
}

// Used for initializing all output records
const emptyMediaBundle = Object.freeze({});

export const makeExecuteResult = Record<ExecuteResultParams>({
  data: emptyMediaBundle,
  execution_count: null,
  metadata: ImmutableMap(),
  output_type: "execute_result"
});

export type ImmutableExecuteResult = RecordOf<ExecuteResultParams>;

/** DisplayData Record Boilerplate */

export interface DisplayDataParams {
  data: Readonly<MediaBundle>;
  output_type: "display_data";
  metadata?: any;
}

export const makeDisplayData = Record<DisplayDataParams>({
  data: emptyMediaBundle,
  metadata: ImmutableMap(),
  output_type: "display_data"
});

export type ImmutableDisplayData = RecordOf<DisplayDataParams>;

/** StreamOutput Record Boilerplate */

export interface StreamOutputParams {
  output_type: "stream";
  name: "stdout" | "stderr";
  text: string;
}

export const makeStreamOutput = Record<StreamOutputParams>({
  name: "stdout",
  output_type: "stream",
  text: ""
});

export type ImmutableStreamOutput = RecordOf<StreamOutputParams>;

/** ErrorOutput Record Boilerplate */

export interface ErrorOutputParams {
  output_type: "error";
  ename: string;
  evalue: string;
  traceback: ImmutableList<string>;
}

export const makeErrorOutput = Record<ErrorOutputParams>({
  ename: "",
  evalue: "",
  output_type: "error",
  traceback: ImmutableList()
});

export type ImmutableErrorOutput = RecordOf<ErrorOutputParams>;

//////////////

export type ImmutableOutput =
  | ImmutableExecuteResult
  | ImmutableDisplayData
  | ImmutableStreamOutput
  | ImmutableErrorOutput;

//////// OUTPUTS /////

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                             Output Types
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export interface OnDiskExecuteResult {
  output_type: "execute_result";
  execution_count: ExecutionCount;
  data: OnDiskMediaBundle;
  metadata: JSONObject;
  transient?: JSONObject;
}

export interface OnDiskDisplayData {
  output_type: "display_data";
  data: OnDiskMediaBundle;
  metadata: JSONObject;
  transient?: JSONObject;
}

export interface OnDiskStreamOutput {
  output_type: "stream";
  name: "stdout" | "stderr";
  text: MultiLineString;
}

export interface OnDiskErrorOutput {
  output_type: "error";
  ename: string;
  evalue: string;
  traceback: string[];
}

export type OnDiskOutput =
  | OnDiskExecuteResult
  | OnDiskDisplayData
  | OnDiskStreamOutput
  | OnDiskErrorOutput;

/**
 * Converts a mutable representation of an output to an immutable representation.
 *
 * @param output The mutable output that will be converted.
 *
 * @returns ImmutableOutput An immutable representation of the same output.
 */
export function createImmutableOutput(output: OnDiskOutput): ImmutableOutput {
  switch (output.output_type) {
    case "execute_result":
      return makeExecuteResult({
        data: createFrozenMediaBundle(output.data),
        execution_count: output.execution_count,
        metadata: immutableFromJS(output.metadata)
      });
    case "display_data":
      return makeDisplayData({
        data: createFrozenMediaBundle(output.data),
        metadata: immutableFromJS(output.metadata)
      });
    case "stream":
      return makeStreamOutput({
        name: output.name,
        text: demultiline(output.text)
      });
    case "error":
      return makeErrorOutput({
        ename: output.ename,
        evalue: output.evalue,
        output_type: "error",
        // Note: this is one of the cases where the Array of strings (for
        // traceback) is part of the format, not a multiline string
        traceback: ImmutableList(output.traceback)
      });
    default:
      // Since we're well typed, output is never. However we can still get new output types we don't handle
      // and need to fail hard instead of making indeterminate behavior
      const unknownOutput = output as any;
      if (unknownOutput.output_type) {
        throw new TypeError(
          `Output type ${(output as any).output_type} not recognized`
        );
      }
      throw new TypeError(
        `Output structure not known: ${JSON.stringify(output)}`
      );
  }
}
