import * as selectors from "@nteract/selectors";
import { AppState, ContentRef } from "@nteract/types";
import path from "path";
import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";

interface Props {
  filePath: string | null;
}

export class NotebookHelmet extends React.PureComponent<Props> {
  render(): JSX.Element {
    return (
      <React.Fragment>
        <Helmet>
          <base href={this.props.filePath || "."} />
        </Helmet>
      </React.Fragment>
    );
  }
}

interface InitialProps {
  contentRef: ContentRef;
}

const makeMapStateToProps = (
  initialState: AppState,
  initialProps: InitialProps
): ((state: AppState) => Props) => {
  const { contentRef } = initialProps;

  const mapStateToProps = (state: AppState) => {
    const filePath = selectors.filepath(state, { contentRef });
    return {
      filePath
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(NotebookHelmet);
