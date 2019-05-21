import {
  Button,
  Classes,
  EditableText,
  Icon,
  Intent,
  Label,
  Overlay
} from "@blueprintjs/core";
import * as React from "react";
import styled from "styled-components";

interface IEditableTitleOverlayProps {
  defaultValue: string | undefined;
  isOpen: boolean;
  onCancel: (isCancelled: boolean) => void;
  onSave: (value: string) => void;
}

interface IEditableTitleOverlayState {
  value: string;
}

// styled blueprintjs `Icon`
const CloseIcon = styled(Icon)`
  cursor: pointer;
`;

export class EditableTitleOverlay extends React.PureComponent<
  IEditableTitleOverlayProps,
  IEditableTitleOverlayState
> {
  // Needs to track the input value because in order to handle save
  // when the save button is clicked, we need to know what the last
  // entered value is.
  state: IEditableTitleOverlayState = {
    value: this.props.defaultValue || ""
  };

  handleChange = (value: string): void => this.setState({ value });

  handleClose = (): void => this.props.onCancel(true);

  handleSave = (): void => this.props.onSave(this.state.value);

  render(): JSX.Element {
    return (
      <Overlay
        canEscapeKeyClose
        canOutsideClickClose
        usePortal={false}
        isOpen={this.props.isOpen}
        onClose={this.handleClose}
      >
        <div className="bp3-dialog-container">
          <div className="bp3-dialog">
            <div className="bp3-dialog-header">
              <h4 className="bp3-heading">Rename Notebook</h4>
              <CloseIcon icon="small-cross" onClick={this.handleClose} />
            </div>
            <div className="bp3-dialog-body">
              <Label>Enter a new notebook name:</Label>
              <EditableText
                className={Classes.INPUT}
                disabled={false}
                defaultValue={this.props.defaultValue}
                minWidth={500}
                intent={"none"}
                selectAllOnFocus
                confirmOnEnterKey
                onChange={this.handleChange}
                onConfirm={this.handleSave}
              />
            </div>
            <div className="bp3-dialog-footer">
              <div className="bp3-dialog-footer-actions">
                <Button onClick={this.handleClose}>Cancel</Button>
                <Button intent={Intent.PRIMARY} onClick={this.handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Overlay>
    );
  }
}
