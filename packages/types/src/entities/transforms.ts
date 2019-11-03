import Immutable from "immutable";

export interface TransformsRecordProps {
  displayOrder: Immutable.List<string>;
  byId: Immutable.Map<string, any>;
}

export type TransformsRecord = Immutable.RecordOf<TransformsRecordProps>;

export const makeTransformsRecord = Immutable.Record<TransformsRecordProps>({
  displayOrder: Immutable.List<string>(),
  byId: Immutable.Map<string, any>()
});
