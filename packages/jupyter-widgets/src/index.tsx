import * as React from "react";
import { connect } from "react-redux";
import { selectors, AppState } from "@nteract/core";

import Manager from "./manager";
import { WidgetModel } from "@jupyter-widgets/base";

interface JupyterWidgetData {
  model_id: string;
  version_major: number;
  version_minor: number;
}

interface Props {
  data: JupyterWidgetData;
  model: WidgetModel;
}

/**
 * The WidgetDisplay takes a model_id, which is returned by the
 * display_data payload that is returned from the execution of a
 * cell containing an ipywidget. This model_id is used to retrieve
 * the initial model for the widget from the comms state in the
 * core state model.
 */
export class WidgetDisplay extends React.Component<Props> {
  static MIMETYPE = "application/vnd.jupyter.widget-view+json";

  render() {
    return (
      <Manager model={this.props.model} model_id={this.props.data.model_id} />
    );
  }
}

const mapStateToProps = (state: AppState, props: Props) => {
  const {
    data: { model_id }
  } = props;
  return {
    model: selectors.modelById(state, { commId: model_id })
  };
};

export default connect(
  mapStateToProps,
  null
)(WidgetDisplay);
