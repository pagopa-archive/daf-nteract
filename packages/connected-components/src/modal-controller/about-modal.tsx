// We need to allow to allow escape from the modal from an inner element.
/* eslint jsx-a11y/no-noninteractive-tabindex: 0 */

// TODO: we can remove this if we knew an appropriate role for the modal shadow.
// We want to allow the user to click on the modal-backdrop to escape.
/* eslint jsx-a11y/no-static-element-interactions: 0 */

import { actions, selectors } from "@nteract/core";
import { AppState } from "@nteract/types";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

export interface Props {
  appVersion?: string;
  hostType: "local" | "empty" | "jupyter" | null;
  closeModal?: () => void;
}

// We need to do this so that you can immediately `Escape` out of the dialog.
// Otherwise, we'd need to (a) put an event listener on the document or (b)
// require that the user clicks the content first before attempting to escape.
const focusOnRender = (el: HTMLDialogElement) => el && el.focus();

const TOP_OFFSET = "20px";
const ModalContentDialog = styled.dialog`
  width: initial;
  height: initial;
  margin: initial;
  background: initial;

  align-items: stretch;
  background-color: var(--theme-app-bg);
  color: var(--theme-app-fg);
  border-radius: 4px;
  border: var(--theme-app-border) 1px solid;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  left: 400px;
  max-height: calc(100vh - ${TOP_OFFSET} * 2);
  outline: none;
  overflow: auto;
  padding: 20px;
  position: absolute;
  right: 400px;
  top: ${TOP_OFFSET};
  z-index: 10000;

  .modal--content--header {
    padding: 0 20px 20px 20px;
    border-bottom: var(--theme-app-border) 1px solid;
  }
  .modal--content--body {
    padding: 20px;
  }
  .modal--content--body--field {
    font-weight: bold;
    margin-right: 5px;
  }
  .modal--content--body--value {
    font-family: monospace;
  }

  @media only screen and (max-width: 1500px) {
    left: 200px;
    right: 200px;
  }
  @media only screen and (max-width: 1000px) {
    left: 100px;
    right: 100px;
  }
  @media only screen and (max-width: 600px) {
    left: 40px;
    right: 40px;
  }
`;

const ModalContentOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 10000;
`;

class PureAboutModal extends React.Component<Props> {
  handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { closeModal } = this.props;
    const { key, metaKey, altKey, ctrlKey, repeat, shiftKey } = event;
    if (
      key === "Escape" &&
      !(metaKey || altKey || ctrlKey || repeat || shiftKey) &&
      closeModal
    ) {
      closeModal();
    }
  };
  handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { closeModal } = this.props;
    if (closeModal && event.target && event.target === event.currentTarget) {
      closeModal();
    }
  };
  render() {
    const { appVersion, hostType } = this.props;
    return (
      <div>
        <ModalContentOverlay
          className="modal--overlay"
          onClick={this.handleOverlayClick}
          onKeyDown={this.handleKeyDown}
          tabIndex={-1}
        >
          <ModalContentDialog
            tabIndex={0}
            className="modal--content"
            ref={focusOnRender}
          >
            <div className="modal--content--header">
              <h2>About nteract on Jupyter</h2>
              <p>You are using an nteract-rendered notebook on Jupyter.</p>
            </div>
            <div className="modal--content--body">
              <p>
                <span className="modal--content--body--field">Version:</span>
                <span className="modal--content--body--value">
                  {appVersion}
                </span>
              </p>
              <p>
                <span className="modal--content--body--field">Host Type:</span>
                <span className="modal--content--body--value">{hostType}</span>
              </p>
            </div>
          </ModalContentDialog>
        </ModalContentOverlay>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  appVersion: selectors.appVersion(state),
  hostType: selectors.currentHostType(state)
});

const mapDispatchToProps = {
  closeModal: actions.closeModal
};

const AboutModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(PureAboutModal);

// We export this for testing purposes.
export { PureAboutModal };

export default AboutModal;
