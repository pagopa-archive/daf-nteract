import * as Immutable from "immutable";

import { ContentsRecordProps, makeContentsRecord } from "./contents";
import { HostsRecordProps, makeHostsRecord } from "./hosts";
import { KernelsRecordProps, makeKernelsRecord } from "./kernels";
import { KernelspecsRecordProps, makeKernelspecsRecord } from "./kernelspecs";
import { makeModalsRecord, ModalsRecordProps } from "./modals";
import { makeTransformsRecord, TransformsRecordProps } from "./transforms";

export * from "./contents";
export * from "./hosts";
export * from "./kernels";
export * from "./kernel-info";
export * from "./kernelspecs";
export * from "./modals";
export * from "./transforms";

export interface EntitiesRecordProps {
  contents: Immutable.RecordOf<ContentsRecordProps>;
  hosts: Immutable.RecordOf<HostsRecordProps>;
  kernels: Immutable.RecordOf<KernelsRecordProps>;
  kernelspecs: Immutable.RecordOf<KernelspecsRecordProps>;
  modals: Immutable.RecordOf<ModalsRecordProps>;
  transforms: Immutable.RecordOf<TransformsRecordProps>;
}

export type EntitiesRecord = Immutable.RecordOf<EntitiesRecordProps>;

export const makeEntitiesRecord = Immutable.Record<EntitiesRecordProps>({
  contents: makeContentsRecord(),
  hosts: makeHostsRecord(),
  kernels: makeKernelsRecord(),
  kernelspecs: makeKernelspecsRecord(),
  modals: makeModalsRecord(),
  transforms: makeTransformsRecord()
});
