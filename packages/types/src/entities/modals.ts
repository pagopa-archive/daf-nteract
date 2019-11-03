import * as Immutable from "immutable";

export interface ModalsRecordProps {
  modalType: string;
}

export type ModalsRecord = Immutable.RecordOf<ModalsRecordProps>;

export const makeModalsRecord = Immutable.Record<ModalsRecordProps>({
  modalType: ""
});
