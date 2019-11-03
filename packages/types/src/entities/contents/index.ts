import * as Immutable from "immutable";

import { ContentRef } from "../../refs";

import { DirectoryContentRecord, DirectoryModelRecord } from "./directory";
import { DummyContentRecord, EmptyModelRecord } from "./dummy";
import { FileContentRecord, FileModelRecord } from "./file";
import { NotebookContentRecord, NotebookModel } from "./notebook";

export * from "./notebook";
export * from "./directory";
export * from "./dummy";
export * from "./file";

export interface AuthorObject {
  name: string;
}

export interface HeaderDataProps {
  authors: AuthorObject[];
  description: string;
  tags: string[];
  title: string;
}

export type ContentModel =
  | NotebookModel
  | DirectoryModelRecord
  | FileModelRecord
  | EmptyModelRecord;

export type ContentRecord =
  | NotebookContentRecord
  | DummyContentRecord
  | FileContentRecord
  | DirectoryContentRecord;

export interface ContentsRecordProps {
  byRef: Immutable.Map<ContentRef, ContentRecord>;
}

export const makeContentsRecord = Immutable.Record<ContentsRecordProps>({
  byRef: Immutable.Map<ContentRef, ContentRecord>()
});

export type ContentsRecord = Immutable.RecordOf<ContentsRecordProps>;
