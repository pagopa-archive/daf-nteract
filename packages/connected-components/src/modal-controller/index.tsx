import * as React from "react";
import { connect } from "react-redux";
import { AppState, selectors } from "@nteract/core";
import { DafAppState } from "../../../daf-packages/daf-core";

import { MODAL_TYPES } from "./constants";
import AboutModal from "./about-modal";

interface Props {
  modalType: string;
}

class ModalController extends React.Component<Props> {
  getModal = () => {
    const { modalType } = this.props;
    switch (modalType) {
      case MODAL_TYPES.ABOUT:
        return AboutModal;
      default:
        return null;
    }
  };
  render() {
    const Modal = this.getModal();
    // $FlowFixMe
    return Modal ? <Modal /> : null;
  }
}

const mapStateToProps = (state: DafAppState) => ({
  modalType: selectors.modalType(state)
});

export { MODAL_TYPES };

export default connect(mapStateToProps)(ModalController);
