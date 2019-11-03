import { mount, shallow } from "enzyme";
import React from "react";
import renderer from "react-test-renderer";

import { PureNotebookMenu } from "../src/notebook-menu";
import { MENU_ITEM_LABELS } from "../src/notebook-menu/constants";

describe("PureNotebookMenu", () => {
  describe("snapshots", () => {
    test("renders the default", () => {
      const component = renderer.create(<PureNotebookMenu />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
  describe("shallow", () => {
    test("renders the default", () => {
      const wrapper = shallow(<PureNotebookMenu />);
      expect(wrapper).not.toBeNull();
    });
  });
  describe("mount", () => {
    test("renders the default", () => {
      const wrapper = mount(<PureNotebookMenu />);
      expect(wrapper).not.toBeNull();
    });
    test("calls appropriate handlers on click", () => {
      const {
        DOWNLOAD_NOTEBOOK,
        EXECUTE_ALL_CELLS,
        EXECUTE_ALL_CELLS_BELOW,
        UNHIDE_ALL,
        CLEAR_ALL_OUTPUTS,
        CUT_CELL,
        COPY_CELL,
        PASTE_CELL,
        CREATE_MARKDOWN_CELL,
        CREATE_CODE_CELL,
        SET_CELL_TYPE_CODE,
        SET_CELL_TYPE_MARKDOWN,
        SET_THEME_LIGHT,
        SET_THEME_DARK,
        SAVE_NOTEBOOK,
        OPEN_ABOUT,
        INTERRUPT_KERNEL,
        RESTART_KERNEL,
        RESTART_AND_CLEAR_OUTPUTS,
        RESTART_AND_RUN_ALL_OUTPUTS,
        KILL_KERNEL
      } = MENU_ITEM_LABELS;
      const props = {
        // action functions
        executeCell: jest.fn(),
        executeAllCells: jest.fn(),
        executeAllCellsBelow: jest.fn(),
        unhideAll: jest.fn(),
        clearAllOutputs: jest.fn(),
        cutCell: jest.fn(),
        copyCell: jest.fn(),
        pasteCell: jest.fn(),
        createCellBelow: jest.fn(),
        changeCellType: jest.fn(),
        setTheme: jest.fn(),
        saveNotebook: jest.fn(),
        openAboutModal: jest.fn(),
        interruptKernel: jest.fn(),
        restartKernel: jest.fn(),
        restartKernelAndClearOutputs: jest.fn(),
        restartKernelAndRunAllOutputs: jest.fn(),
        killKernel: jest.fn(),
        downloadNotebook: jest.fn(),

        // document state (we mock out the implementation, so these are just
        // dummy variables.
        currentContentRef: "fake-content-ref",
        currentKernelRef: "fake-kernel-ref"
      };
      const wrapper = shallow(<PureNotebookMenu {...props} />);
      const eventMock = { preventDefault: () => null };

      const downloadNotebookItem = wrapper.find({ text: DOWNLOAD_NOTEBOOK });
      expect(props.downloadNotebook).not.toHaveBeenCalled();
      downloadNotebookItem.simulate("click", eventMock);
      expect(props.downloadNotebook).toHaveBeenCalledTimes(1);
      expect(props.downloadNotebook).toHaveBeenCalledWith({
        contentRef: props.currentContentRef
      });

      const executeAllCellsItem = wrapper.find({ text: EXECUTE_ALL_CELLS });
      expect(props.executeAllCells).not.toHaveBeenCalled();
      executeAllCellsItem.simulate("click", eventMock);
      expect(props.executeAllCells).toHaveBeenCalledTimes(1);
      expect(props.executeAllCells).toHaveBeenCalledWith({
        contentRef: props.currentContentRef
      });

      const executeAllCellsBelowItem = wrapper.find({
        text: EXECUTE_ALL_CELLS_BELOW
      });
      expect(props.executeAllCellsBelow).not.toHaveBeenCalled();
      executeAllCellsBelowItem.simulate("click", eventMock);
      expect(props.executeAllCellsBelow).toHaveBeenCalledTimes(1);
      expect(props.executeAllCellsBelow).toHaveBeenCalledWith({
        contentRef: props.currentContentRef
      });

      const unhideAllItem = wrapper.find({ text: UNHIDE_ALL });
      expect(props.unhideAll).not.toHaveBeenCalled();
      unhideAllItem.simulate("click", eventMock);
      expect(props.unhideAll).toHaveBeenCalledTimes(1);
      expect(props.unhideAll).toHaveBeenCalledWith({
        outputHidden: false,
        inputHidden: false,
        contentRef: props.currentContentRef
      });

      const clearAllOutputsItem = wrapper.find({ text: CLEAR_ALL_OUTPUTS });
      expect(props.clearAllOutputs).not.toHaveBeenCalled();
      clearAllOutputsItem.simulate("click", eventMock);
      expect(props.clearAllOutputs).toHaveBeenCalledTimes(1);
      expect(props.clearAllOutputs).toHaveBeenCalledWith({
        contentRef: props.currentContentRef
      });

      const cutCellItem = wrapper.find({ text: CUT_CELL });
      expect(props.cutCell).not.toHaveBeenCalled();
      cutCellItem.simulate("click", eventMock);
      expect(props.cutCell).toHaveBeenCalledTimes(1);
      expect(props.cutCell).toHaveBeenCalledWith({
        contentRef: props.currentContentRef
      });

      const copyCellItem = wrapper.find({ text: COPY_CELL });
      expect(props.copyCell).not.toHaveBeenCalled();
      copyCellItem.simulate("click", eventMock);
      expect(props.copyCell).toHaveBeenCalledTimes(1);
      expect(props.copyCell).toHaveBeenCalledWith({
        contentRef: props.currentContentRef
      });

      const pasteCellItem = wrapper.find({ text: PASTE_CELL });
      expect(props.pasteCell).not.toHaveBeenCalled();
      pasteCellItem.simulate("click", eventMock);
      expect(props.pasteCell).toHaveBeenCalledTimes(1);
      expect(props.pasteCell).toHaveBeenCalledWith({
        contentRef: props.currentContentRef
      });

      const createMarkdownCellItem = wrapper.find({
        text: CREATE_MARKDOWN_CELL
      });
      expect(props.createCellBelow).not.toHaveBeenCalled();
      createMarkdownCellItem.simulate("click", eventMock);
      expect(props.createCellBelow).toHaveBeenCalledTimes(1);
      expect(props.createCellBelow).toHaveBeenCalledWith({
        cellType: "markdown",
        contentRef: props.currentContentRef,
        source: ""
      });

      props.createCellBelow.mockClear();
      const createCodeCellItem = wrapper.find({ text: CREATE_CODE_CELL });
      expect(props.createCellBelow).not.toHaveBeenCalled();
      createCodeCellItem.simulate("click", eventMock);
      expect(props.createCellBelow).toHaveBeenCalledTimes(1);
      expect(props.createCellBelow).toHaveBeenCalledWith({
        cellType: "code",
        contentRef: props.currentContentRef,
        source: ""
      });

      const setCellTypeCodeItem = wrapper.find({ text: SET_CELL_TYPE_CODE });
      expect(props.changeCellType).not.toHaveBeenCalled();
      setCellTypeCodeItem.simulate("click", eventMock);
      expect(props.changeCellType).toHaveBeenCalledTimes(1);
      expect(props.changeCellType).toHaveBeenCalledWith({
        to: "code",
        contentRef: props.currentContentRef
      });

      props.changeCellType.mockClear();
      const setCellTypeMarkdownItem = wrapper.find({
        text: SET_CELL_TYPE_MARKDOWN
      });
      expect(props.changeCellType).not.toHaveBeenCalled();
      setCellTypeMarkdownItem.simulate("click", eventMock);
      expect(props.changeCellType).toHaveBeenCalledTimes(1);
      expect(props.changeCellType).toHaveBeenCalledWith({
        to: "markdown",
        contentRef: props.currentContentRef
      });

      const setThemeLightItem = wrapper.find({ text: SET_THEME_LIGHT });
      expect(props.setTheme).not.toHaveBeenCalled();
      setThemeLightItem.simulate("click", eventMock);
      expect(props.setTheme).toHaveBeenCalledTimes(1);
      expect(props.setTheme).toHaveBeenCalledWith("light");

      props.setTheme.mockClear();
      const setThemeDarkItem = wrapper.find({ text: SET_THEME_DARK });
      expect(props.setTheme).not.toHaveBeenCalled();
      setThemeDarkItem.simulate("click", eventMock);
      expect(props.setTheme).toHaveBeenCalledTimes(1);
      expect(props.setTheme).toHaveBeenCalledWith("dark");

      const saveNotebookItem = wrapper.find({ text: SAVE_NOTEBOOK });
      expect(props.saveNotebook).not.toHaveBeenCalled();
      saveNotebookItem.simulate("click", eventMock);
      expect(props.saveNotebook).toHaveBeenCalledTimes(1);
      expect(props.saveNotebook).toHaveBeenCalledWith({
        contentRef: props.currentContentRef
      });

      const openAboutItem = wrapper.find({ text: OPEN_ABOUT });
      expect(props.openAboutModal).not.toHaveBeenCalled();
      openAboutItem.simulate("click", eventMock);
      expect(props.openAboutModal).toHaveBeenCalledTimes(1);
      expect(props.openAboutModal).toHaveBeenCalledWith();

      const interruptKernelItem = wrapper.find({ text: INTERRUPT_KERNEL });
      expect(props.interruptKernel).not.toHaveBeenCalled();
      interruptKernelItem.simulate("click", eventMock);
      expect(props.interruptKernel).toHaveBeenCalledTimes(1);
      expect(props.interruptKernel).toHaveBeenCalledWith({
        contentRef: props.currentContentRef
      });

      const restartKernelItem = wrapper.find({ text: RESTART_KERNEL });
      expect(props.restartKernel).not.toHaveBeenCalled();
      restartKernelItem.simulate("click", eventMock);
      expect(props.restartKernel).toHaveBeenCalledTimes(1);
      expect(props.restartKernel).toHaveBeenCalledWith({
        outputHandling: "None",
        contentRef: props.currentContentRef,
      });

      const restartKernelAndClearOutputsItem = wrapper.find({
        text: RESTART_AND_CLEAR_OUTPUTS
      });
      expect(props.restartKernelAndClearOutputs).not.toHaveBeenCalled();
      restartKernelAndClearOutputsItem.simulate("click", eventMock);
      expect(props.restartKernelAndClearOutputs).toHaveBeenCalledTimes(1);
      expect(props.restartKernelAndClearOutputs).toHaveBeenCalledWith({
        contentRef: props.currentContentRef,
      });

      const restartKernelAndRunAllOutputsItem = wrapper.find({
        text: RESTART_AND_RUN_ALL_OUTPUTS
      });
      expect(props.restartKernelAndRunAllOutputs).not.toHaveBeenCalled();
      restartKernelAndRunAllOutputsItem.simulate("click", eventMock);
      expect(props.restartKernelAndRunAllOutputs).toHaveBeenCalledTimes(1);
      expect(props.restartKernelAndRunAllOutputs).toHaveBeenCalledWith({
        contentRef: props.currentContentRef,
      });

      const killKernelItem = wrapper.find({ text: KILL_KERNEL });
      expect(props.killKernel).not.toHaveBeenCalled();
      killKernelItem.simulate("click", eventMock);
      expect(props.killKernel).toHaveBeenCalledTimes(1);
      expect(props.killKernel).toHaveBeenCalledWith({
        kernelRef: props.currentKernelRef,
        contentRef: props.currentContentRef,
        restarting: false
      });
    });
  });
});
