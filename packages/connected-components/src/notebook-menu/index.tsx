import * as Immutable from "immutable";
import * as React from "react";
import Menu, { SubMenu, Divider, MenuItem } from "rc-menu";
import { CellType } from "@nteract/commutable";
import { actions, selectors } from "@nteract/core";
import {
  AppState,
  ContentRef,
  KernelRef,
  KernelspecsRef,
  KernelspecsByRefRecord
} from "@nteract/types";
import { connect } from "react-redux";

import { MODAL_TYPES } from "../modal-controller";

import { MENU_ITEM_ACTIONS, MENUS } from "./constants";
import StyleWrapper from "./styles";

// To allow actions that can take dynamic arguments (like selecting a kernel
// based on the host's kernelspecs), we have some simple utility functions to
// stringify/parse actions/arguments.
const createActionKey = (action: string, ...args: any[]) =>
  [action, ...args].join(":");
const parseActionKey = (key: string) => key.split(":");

type Props = {
  persistAfterClick?: boolean;
  defaultOpenKeys?: Array<string>;
  openKeys?: Array<string>;
  currentKernelRef?: KernelRef | null;
  saveNotebook?: (payload: object) => void;
  downloadNotebook?: (payload: object) => void;
  executeCell?: (payload: object) => void;
  executeAllCells?: (payload: object) => void;
  executeAllCellsBelow?: (payload: object) => void;
  clearAllOutputs?: (payload: object) => void;
  unhideAll?: (payload: object) => void;
  cutCell?: (payload: object) => void;
  copyCell?: (payload: object) => void;
  notebook: Immutable.Map<string, any>;
  pasteCell?: (payload: object) => void;
  createCellBelow?: (payload: object) => void;
  changeCellType?: (payload: object) => void;
  setTheme?: (theme?: string) => void;
  openAboutModal?: () => void;
  changeKernelByName?: (
    payload: {
      kernelSpecName: string;
      oldKernelRef?: KernelRef | null;
      contentRef: ContentRef;
    }
  ) => void;
  restartKernel?: (payload: object) => void;
  restartKernelAndClearOutputs?: (payload: object) => void;
  restartKernelAndRunAllOutputs?: (payload: object) => void;
  killKernel?: (payload: object) => void;
  interruptKernel?: (payload: object) => void;
  currentContentRef: ContentRef;
  currentKernelspecsRef?: KernelspecsRef | null;
  currentKernelspecs?: KernelspecsByRefRecord | null;
};

type State = {
  openKeys?: Array<string>;
};

class PureNotebookMenu extends React.Component<Props, State> {
  state: State = {};
  handleClick = ({ key }: { key: string }) => {
    const {
      persistAfterClick,
      saveNotebook,
      downloadNotebook,
      changeKernelByName,
      currentKernelRef,
      copyCell,
      createCellBelow,
      cutCell,
      executeAllCells,
      executeAllCellsBelow,
      clearAllOutputs,
      unhideAll,
      openAboutModal,
      pasteCell,
      setTheme,
      changeCellType,
      restartKernel,
      restartKernelAndClearOutputs,
      restartKernelAndRunAllOutputs,
      killKernel,
      interruptKernel,
      currentContentRef
    } = this.props;
    const [action, ...args] = parseActionKey(key);
    switch (action) {
      case MENU_ITEM_ACTIONS.SAVE_NOTEBOOK:
        if (saveNotebook) {
          saveNotebook({ contentRef: currentContentRef });
        }
        break;
      case MENU_ITEM_ACTIONS.DOWNLOAD_NOTEBOOK:
        if (downloadNotebook) {
          downloadNotebook({ contentRef: currentContentRef });
        }
        break;
      case MENU_ITEM_ACTIONS.COPY_CELL:
        if (copyCell) {
          copyCell({ contentRef: currentContentRef });
        }
        break;
      case MENU_ITEM_ACTIONS.CUT_CELL:
        if (cutCell) {
          cutCell({ contentRef: currentContentRef });
        }
        break;
      case MENU_ITEM_ACTIONS.PASTE_CELL:
        if (pasteCell) {
          pasteCell({ contentRef: currentContentRef });
        }
        break;
      case MENU_ITEM_ACTIONS.CREATE_CODE_CELL:
        if (createCellBelow) {
          createCellBelow({
            cellType: "code",
            source: "",
            contentRef: currentContentRef
          });
        }
        break;
      case MENU_ITEM_ACTIONS.CREATE_MARKDOWN_CELL:
        if (createCellBelow) {
          createCellBelow({
            cellType: "markdown",
            source: "",
            contentRef: currentContentRef
          });
        }
        break;
      case MENU_ITEM_ACTIONS.SET_CELL_TYPE_CODE:
        if (changeCellType) {
          changeCellType({
            to: "code",
            contentRef: currentContentRef
          });
        }
        break;
      case MENU_ITEM_ACTIONS.SET_CELL_TYPE_MARKDOWN:
        if (changeCellType) {
          changeCellType({
            to: "markdown",
            contentRef: currentContentRef
          });
        }
        break;
      case MENU_ITEM_ACTIONS.EXECUTE_ALL_CELLS:
        if (executeAllCells) {
          executeAllCells({ contentRef: currentContentRef });
        }
        break;
      case MENU_ITEM_ACTIONS.EXECUTE_ALL_CELLS_BELOW:
        if (executeAllCellsBelow) {
          executeAllCellsBelow({ contentRef: currentContentRef });
        }
        break;
      case MENU_ITEM_ACTIONS.UNHIDE_ALL:
        if (unhideAll) {
          unhideAll({
            outputHidden: false,
            inputHidden: false,
            contentRef: currentContentRef
          });
        }
        break;
      case MENU_ITEM_ACTIONS.CLEAR_ALL_OUTPUTS:
        if (clearAllOutputs) {
          clearAllOutputs({ contentRef: currentContentRef });
        }
        break;
      case MENU_ITEM_ACTIONS.SET_THEME_DARK:
        if (setTheme) {
          setTheme("dark");
        }
        break;
      case MENU_ITEM_ACTIONS.SET_THEME_LIGHT:
        if (setTheme) {
          setTheme("light");
        }
        break;
      case MENU_ITEM_ACTIONS.SET_THEME_DAF:
        if (setTheme) {
          setTheme("daf");
        }
        break;
      case MENU_ITEM_ACTIONS.OPEN_ABOUT:
        if (openAboutModal) {
          openAboutModal();
        }
        break;
      case MENU_ITEM_ACTIONS.INTERRUPT_KERNEL:
        if (interruptKernel) {
          interruptKernel({ kernelRef: currentKernelRef });
        }
        break;
      case MENU_ITEM_ACTIONS.RESTART_KERNEL:
        if (restartKernel) {
          restartKernel({
            kernelRef: currentKernelRef,
            contentRef: currentContentRef
          });
        }
        break;
      case MENU_ITEM_ACTIONS.RESTART_AND_CLEAR_OUTPUTS:
        if (restartKernelAndClearOutputs) {
          restartKernelAndClearOutputs({
            kernelRef: currentKernelRef,
            contentRef: currentContentRef
          });
        }
        break;
      case MENU_ITEM_ACTIONS.RESTART_AND_RUN_ALL_OUTPUTS:
        if (restartKernelAndRunAllOutputs) {
          restartKernelAndRunAllOutputs({
            kernelRef: currentKernelRef,
            contentRef: currentContentRef
          });
        }
        break;
      case MENU_ITEM_ACTIONS.KILL_KERNEL:
        if (killKernel) {
          killKernel({ kernelRef: currentKernelRef });
        }
        break;
      case MENU_ITEM_ACTIONS.CHANGE_KERNEL:
        if (changeKernelByName) {
          changeKernelByName({
            oldKernelRef: currentKernelRef,
            contentRef: currentContentRef,
            kernelSpecName: args[0]
          });
        }
        break;
      default:
        console.log(`unhandled action: ${action}`);
    }

    if (!persistAfterClick) {
      this.setState({ openKeys: [] });
    }
  };
  handleOpenChange = (openKeys: Array<string>) => {
    if (!this.props.persistAfterClick) {
      this.setState({ openKeys });
    }
  };
  componentWillMount() {
    // This ensures that we can still initially set defaultOpenKeys when
    // persistAfterClick is true.
    this.setState({ openKeys: this.props.defaultOpenKeys });
  }
  render() {
    const {
      currentKernelspecs,
      defaultOpenKeys,
      persistAfterClick
    } = this.props;
    const { openKeys } = this.state;
    const menuProps: { [key: string]: any } = {
      mode: "horizontal",
      onClick: this.handleClick,
      onOpenChange: this.handleOpenChange,
      defaultOpenKeys: defaultOpenKeys,
      selectable: false
    };
    if (!persistAfterClick) {
      menuProps.openKeys = openKeys;
    }
    return (
      <StyleWrapper>
        <Menu {...menuProps}>
          <SubMenu key={MENUS.FILE} title="File">
            <MenuItem>
              <a
                href="/nteract/edit"
                style={{
                  textDecoration: "none",
                  color: "currentColor"
                }}
                target="_blank"
              >
                Open...
              </a>
            </MenuItem>
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.SAVE_NOTEBOOK)}>
              Save
            </MenuItem>
            <MenuItem
              key={createActionKey(MENU_ITEM_ACTIONS.DOWNLOAD_NOTEBOOK)}
            >
              Download (.ipynb)
            </MenuItem>
          </SubMenu>
          <SubMenu key={MENUS.EDIT} title="Edit">
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.CUT_CELL)}>
              Cut Cell
            </MenuItem>
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.COPY_CELL)}>
              Copy Cell
            </MenuItem>
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.PASTE_CELL)}>
              Paste Cell Below
            </MenuItem>
            <Divider />
            <SubMenu key={MENUS.EDIT_SET_CELL_TYPE} title="Cell Type">
              <MenuItem
                key={createActionKey(MENU_ITEM_ACTIONS.SET_CELL_TYPE_CODE)}
              >
                Code
              </MenuItem>
              <MenuItem
                key={createActionKey(MENU_ITEM_ACTIONS.SET_CELL_TYPE_MARKDOWN)}
              >
                Markdown
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu key={MENUS.VIEW} title="View">
            <SubMenu key={MENUS.VIEW_THEMES} title="themes">
              <MenuItem
                key={createActionKey(MENU_ITEM_ACTIONS.SET_THEME_DAF)}
              >
                daf
              </MenuItem>
              <MenuItem
                key={createActionKey(MENU_ITEM_ACTIONS.SET_THEME_LIGHT)}
              >
                light
              </MenuItem>
              <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.SET_THEME_DARK)}>
                dark
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu key={MENUS.CELL} title="Cell">
            <MenuItem
              key={createActionKey(MENU_ITEM_ACTIONS.EXECUTE_ALL_CELLS)}
            >
              Run All Cells
            </MenuItem>
            <MenuItem
              key={createActionKey(MENU_ITEM_ACTIONS.EXECUTE_ALL_CELLS_BELOW)}
            >
              Run All Cells Below
            </MenuItem>
            <Divider />
            <SubMenu key={MENUS.CELL_CREATE_CELL} title="New Cell">
              <MenuItem
                key={createActionKey(MENU_ITEM_ACTIONS.CREATE_CODE_CELL)}
              >
                Code
              </MenuItem>
              <MenuItem
                key={createActionKey(MENU_ITEM_ACTIONS.CREATE_MARKDOWN_CELL)}
              >
                Markdown
              </MenuItem>
            </SubMenu>
            <Divider />

            <MenuItem
              key={createActionKey(MENU_ITEM_ACTIONS.CLEAR_ALL_OUTPUTS)}
            >
              Clear All Outputs
            </MenuItem>

            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.UNHIDE_ALL)}>
              Unhide All Input and Output
            </MenuItem>
          </SubMenu>

          <SubMenu key={MENUS.RUNTIME} title="Runtime">
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.INTERRUPT_KERNEL)}>
              Interrupt
            </MenuItem>
            <Divider />
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.KILL_KERNEL)}>
              Halt
            </MenuItem>
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.RESTART_KERNEL)}>
              Restart
            </MenuItem>
            <MenuItem
              key={createActionKey(MENU_ITEM_ACTIONS.RESTART_AND_CLEAR_OUTPUTS)}
            >
              Restart and Clear All Cells
            </MenuItem>
            <MenuItem
              key={createActionKey(
                MENU_ITEM_ACTIONS.RESTART_AND_RUN_ALL_OUTPUTS
              )}
            >
              Restart and Run All Cells
            </MenuItem>
            <Divider />
            <SubMenu
              key={MENUS.RUNTIME_CHANGE_KERNEL}
              title="Change Kernel"
              disabled={!currentKernelspecs}
            >
              {currentKernelspecs
                ? currentKernelspecs.byName
                    .keySeq()
                    .map(name => [
                      name,
                      currentKernelspecs.byName.getIn([name, "displayName"])
                    ])
                    .toArray()
                    .map(([name, displayName]) => {
                      return (
                        <MenuItem
                          key={createActionKey(
                            MENU_ITEM_ACTIONS.CHANGE_KERNEL,
                            name
                          )}
                        >
                          {displayName}
                        </MenuItem>
                      );
                    })
                : null}
            </SubMenu>
          </SubMenu>

          <SubMenu key={MENUS.HELP} title="Help">
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.OPEN_ABOUT)}>
              About
            </MenuItem>
          </SubMenu>
        </Menu>
        <style jsx>{`
          position: sticky;
          top: 0;
          /* TODO: this is getting ridiculous... */
          z-index: 10000;
        `}</style>
      </StyleWrapper>
    );
  }
}

const mapStateToProps = (
  state: AppState,
  { contentRef }: { contentRef: ContentRef }
) => {
  return {
    currentKernelRef: selectors.currentKernelRef(state),
    currentContentRef: contentRef,
    currentKernelspecsRef: selectors.currentKernelspecsRef(state),
    currentKernelspecs: selectors.currentKernelspecs(state)
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  saveNotebook: (payload: { contentRef: string }) =>
    dispatch(actions.save(payload)),
  downloadNotebook: (payload: { contentRef: string }) =>
    dispatch(actions.downloadContent(payload)),
  executeCell: (payload: { id: string; contentRef: string }) =>
    dispatch(actions.executeCell(payload)),
  executeAllCells: (payload: { contentRef: string }) =>
    dispatch(actions.executeAllCells(payload)),
  executeAllCellsBelow: (payload: { contentRef: string }) =>
    dispatch(actions.executeAllCellsBelow(payload)),
  clearAllOutputs: (payload: { contentRef: string }) =>
    dispatch(actions.clearAllOutputs(payload)),
  unhideAll: (payload: {
    outputHidden: boolean;
    inputHidden: boolean;
    contentRef: string;
  }) => dispatch(actions.unhideAll(payload)),
  cutCell: (payload: { id?: string; contentRef: string }) =>
    dispatch(actions.cutCell(payload)),
  copyCell: (payload: { id?: string; contentRef: string }) =>
    dispatch(actions.copyCell(payload)),
  pasteCell: (payload: { contentRef: string }) =>
    dispatch(actions.pasteCell(payload)),
  createCellBelow: (payload: {
    id?: string | undefined;
    cellType: CellType;
    source: string;
    contentRef: string;
  }) => dispatch(actions.createCellBelow(payload)),
  changeCellType: (payload: {
    id?: string | undefined;
    to: CellType;
    contentRef: string;
  }) => dispatch(actions.changeCellType(payload)),
  setTheme: (theme: string) => dispatch(actions.setTheme(theme)),
  openAboutModal: () =>
    dispatch(actions.openModal({ modalType: MODAL_TYPES.ABOUT })),
  changeKernelByName: (payload: {
    kernelSpecName: any;
    oldKernelRef?: string | undefined;
    contentRef: string;
  }) => dispatch(actions.changeKernelByName(payload)),
  restartKernel: (payload: {
    outputHandling: actions.RestartKernelOutputHandling;
    kernelRef: string;
    contentRef: string;
  }) => dispatch(actions.restartKernel(payload)),
  restartKernelAndClearOutputs: (payload: {
    kernelRef: string;
    contentRef: string;
  }) =>
    dispatch(
      actions.restartKernel({ ...payload, outputHandling: "Clear All" })
    ),
  restartKernelAndRunAllOutputs: (payload: {
    kernelRef: string;
    contentRef: string;
  }) =>
    dispatch(actions.restartKernel({ ...payload, outputHandling: "Run All" })),
  killKernel: (payload: { restarting: boolean; kernelRef: string }) =>
    dispatch(actions.killKernel(payload)),
  interruptKernel: (payload: { kernelRef: string }) =>
    dispatch(actions.interruptKernel(payload))
});

// $FlowFixMe: react-redux
const NotebookMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureNotebookMenu);

// We export this for testing purposes.
export { PureNotebookMenu };

export default NotebookMenu;
