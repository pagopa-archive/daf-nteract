import { commListenEpic } from "./comm";
import {
  autoSaveCurrentContentEpic,
  fetchContentEpic,
  saveContentEpic,
  updateContentEpic
} from "./contents";
import {
  executeAllCellsEpic,
  executeCellEpic,
  sendInputReplyEpic,
  updateDisplayEpic
} from "./execute";
import { publishToBookstore, publishToBookstoreAfterSave } from "./hosts";
import {
  acquireKernelInfoEpic,
  launchKernelWhenNotebookSetEpic,
  restartKernelEpic,
  watchExecutionStateEpic
} from "./kernel-lifecycle";
import { fetchKernelspecsEpic } from "./kernelspecs";
import {
  changeWebSocketKernelEpic,
  interruptKernelEpic,
  killKernelEpic,
  launchWebSocketKernelEpic,
  restartWebSocketKernelEpic
} from "./websocket-kernel";

// Because `@nteract/core` ends up being a commonjs import, we can't currently
// rely on `import { epics } from ""@nteract/core"`
// as it would collide the array with the named exports
const allEpics = [
  executeCellEpic,
  updateDisplayEpic,
  executeAllCellsEpic,
  commListenEpic,
  launchWebSocketKernelEpic,
  changeWebSocketKernelEpic,
  interruptKernelEpic,
  killKernelEpic,
  acquireKernelInfoEpic,
  watchExecutionStateEpic,
  launchKernelWhenNotebookSetEpic,
  restartKernelEpic,
  fetchKernelspecsEpic,
  fetchContentEpic,
  updateContentEpic,
  saveContentEpic,
  autoSaveCurrentContentEpic,
  publishToBookstore,
  publishToBookstoreAfterSave,
  restartWebSocketKernelEpic,
  sendInputReplyEpic
];

export {
  allEpics,
  executeCellEpic,
  updateDisplayEpic,
  executeAllCellsEpic,
  commListenEpic,
  launchWebSocketKernelEpic,
  changeWebSocketKernelEpic,
  interruptKernelEpic,
  killKernelEpic,
  acquireKernelInfoEpic,
  watchExecutionStateEpic,
  launchKernelWhenNotebookSetEpic,
  restartKernelEpic,
  fetchKernelspecsEpic,
  fetchContentEpic,
  updateContentEpic,
  saveContentEpic,
  autoSaveCurrentContentEpic,
  publishToBookstore,
  publishToBookstoreAfterSave,
  restartWebSocketKernelEpic,
  sendInputReplyEpic
};
