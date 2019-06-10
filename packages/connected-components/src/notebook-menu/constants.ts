// Note, we can reuse keys, but all paths need to be unique in the menu.

// These actions map to a case in a switch handler. They are meant to cause a
// unique action from the menu.
export const MENU_ITEM_ACTIONS = {
  SAVE_NOTEBOOK: "save-notebook",
  DOWNLOAD_NOTEBOOK: "download-notebook",
  EXECUTE_ALL_CELLS: "execute-all-cells",
  EXECUTE_ALL_CELLS_BELOW: "execute-all-cells-below",
  RESTART_KERNEL: "restart-kernel",
  RESTART_AND_CLEAR_OUTPUTS: "restart-kernel-and-clear-outputs",
  RESTART_AND_RUN_ALL_OUTPUTS: "restart-kernel-and-run-all-outputs",
  CLEAR_ALL_OUTPUTS: "clear-all-outputs",
  CHANGE_KERNEL: "change-kernel",
  UNHIDE_ALL: "unhide-all",
  CREATE_CODE_CELL: "create-code-cell",
  CREATE_MARKDOWN_CELL: "create-markdown-cell",
  SET_CELL_TYPE_CODE: "set-cell-type-code",
  SET_CELL_TYPE_MARKDOWN: "set-cell-type-markdown",
  COPY_CELL: "copy-cell",
  CUT_CELL: "cut-cell",
  PASTE_CELL: "paste-cell",
  SET_THEME_DARK: "set-theme-dark",
  SET_THEME_LIGHT: "set-theme-light",
  TOGGLE_EDITOR: "toggle-editor",
  OPEN_ABOUT: "open-about",
  KILL_KERNEL: "kill-kernel",
  INTERRUPT_KERNEL: "interrupt-kernel",
  PUBLISH_TO_BOOKSTORE: "publish-to-bookstore"
};

export const MENU_ITEM_LABELS = {
  SAVE_NOTEBOOK: "Save",
  DOWNLOAD_NOTEBOOK: "Download (.ipynb)",
  PUBLISH_TO_BOOKSTORE: "Publish",
  CUT_CELL: "Cut Cell",
  COPY_CELL: "Copy Cell",
  PASTE_CELL: "Paste Cell Below",
  SET_CELL_TYPE_CODE: "To Code",
  SET_CELL_TYPE_MARKDOWN: "To Markdown",
  TOGGLE_EDITOR: "Notebook Header",
  SET_THEME_LIGHT: "Light",
  SET_THEME_DARK: "Dark",
  EXECUTE_ALL_CELLS: "Run All Cells",
  EXECUTE_ALL_CELLS_BELOW: "Run All Cells Below",
  CREATE_CODE_CELL: "Code Cell",
  CREATE_MARKDOWN_CELL: "Markdown Cell",
  CLEAR_ALL_OUTPUTS: "Clear All Outputs",
  // CHANGE_KERNEL: "change-kernel",
  UNHIDE_ALL: "Unhide All Input and Output",
  INTERRUPT_KERNEL: "Interrupt",
  KILL_KERNEL: "Halt",
  RESTART_KERNEL: "Restart",
  RESTART_AND_CLEAR_OUTPUTS: "Restart and Clear All Cells",
  RESTART_AND_RUN_ALL_OUTPUTS: "Restart and Run All Cells",
  OPEN_ABOUT: "About"
};
