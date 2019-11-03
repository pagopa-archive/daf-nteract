import * as Immutable from "immutable";

export interface FileModelRecordProps {
  type: "file";
  text: string;
}
export const makeFileModelRecord = Immutable.Record<FileModelRecordProps>({
  type: "file",
  text: ""
});
export type FileModelRecord = Immutable.RecordOf<FileModelRecordProps>;

export interface FileContentRecordProps {
  type: "file";
  mimetype?: string | null;
  created?: Date | null;
  format: "json";
  lastSaved: null;
  filepath: string;
  model: FileModelRecord;
  saving: boolean;
  loading: boolean;
  error?: object | null;
}
export const makeFileContentRecord = Immutable.Record<FileContentRecordProps>({
  type: "file",
  mimetype: null,
  created: null,
  format: "json",
  lastSaved: null,
  filepath: "",
  model: makeFileModelRecord(),
  saving: false,
  loading: false,
  error: null
});

export type FileContentRecord = Immutable.RecordOf<FileContentRecordProps>;
