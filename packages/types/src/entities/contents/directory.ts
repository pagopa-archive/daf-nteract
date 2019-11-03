import * as Immutable from "immutable";

import { ContentRef } from "../../refs";

export interface DirectoryModelRecordProps {
  type: "directory";
  sortedBy?: "created" | "lastSaved" | "type" | "name";
  groupedBy?: "type" | "mimetype";
  items: Immutable.List<ContentRef>;
}
export const makeDirectoryModel = Immutable.Record<DirectoryModelRecordProps>({
  type: "directory",
  items: Immutable.List()
});
export type DirectoryModelRecord = Immutable.RecordOf<
  DirectoryModelRecordProps
>;

export interface DirectoryContentRecordProps {
  mimetype: null;
  type: "directory";
  created: Date | null;
  format: "json";
  lastSaved: Date | null;
  filepath: string;
  model: DirectoryModelRecord;
  saving: boolean;
  loading: boolean;
  error?: object | null;
}
export const makeDirectoryContentRecord = Immutable.Record<
  DirectoryContentRecordProps
>({
  mimetype: null,
  type: "directory",
  created: null,
  format: "json",
  lastSaved: null,
  filepath: "",
  model: makeDirectoryModel(),
  saving: false,
  loading: false,
  error: null
});
export type DirectoryContentRecord = Immutable.RecordOf<
  DirectoryContentRecordProps
>;
