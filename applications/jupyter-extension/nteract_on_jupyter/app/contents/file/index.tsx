import { AppState, ContentRef, selectors } from "@nteract/core";
import { dirname } from "path";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { default as Notebook } from "../notebook";
import * as TextFile from "./text-file";

const PaddedContainer = styled.div`
  padding-left: var(--nt-spacing-l, 10px);
  padding-top: var(--nt-spacing-m, 10px);
  padding-right: var(--nt-spacing-m, 10px);
`;

const JupyterExtensionContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: stretch;
  height: -webkit-fill-available;
`;

const JupyterExtensionChoiceContainer = styled.div`
  flex: 1 1 auto;
  overflow: auto;
`;

interface FileProps {
  type: "notebook" | "file" | "dummy";
  contentRef: ContentRef;
  baseDir: string;
  appBase: string;
  displayName?: string;
  mimetype?: string | null;
  lastSavedStatement: string;
}

export class File extends React.PureComponent<FileProps> {
  getChoice = () => {
    let choice = null;

    // notebooks don't report a mimetype so we'll use the content.type
    if (this.props.type === "notebook") {
      choice = <Notebook contentRef={this.props.contentRef} />;
    } else if (this.props.type === "dummy") {
      choice = null;
    } else if (
      this.props.mimetype == null ||
      !TextFile.handles(this.props.mimetype)
    ) {
      // TODO: Redirect to /files/ endpoint for them to download the file or view
      //       as is
      choice = (
        <PaddedContainer>
          <pre>Can not render this file type</pre>
        </PaddedContainer>
      );
    } else {
      choice = <TextFile.default contentRef={this.props.contentRef} />;
    }

    return choice;
  };

  render(): JSX.Element {
    const choice = this.getChoice();

    // Right now we only handle one kind of editor
    // If/when we support more modes, we would case them off here
    return (
      <React.Fragment>
        <JupyterExtensionContainer>
          <JupyterExtensionChoiceContainer>
            {choice}
          </JupyterExtensionChoiceContainer>
        </JupyterExtensionContainer>
      </React.Fragment>
    );
  }
}

interface InitialProps {
  contentRef: ContentRef;
  appBase: string;
}

// Since the contentRef stays unique for the duration of this file,
// we use the makeMapStateToProps pattern to optimize re-render
const makeMapStateToProps = (
  initialState: AppState,
  initialProps: InitialProps
) => {
  const { contentRef, appBase } = initialProps;

  const mapStateToProps = (state: AppState) => {
    const content = selectors.content(state, initialProps);

    if (!content || content.type === "directory") {
      throw new Error(
        "The file component should only be used with files and notebooks"
      );
    }

    return {
      appBase,
      contentRef,
      baseDir: dirname(content.filepath),
      displayName: content.filepath.split("/").pop(),
      lastSavedStatement: "recently",
      mimetype: content.mimetype,
      type: content.type
    };
  };

  return mapStateToProps;
};

export const ConnectedFile = connect(makeMapStateToProps)(File);

export default ConnectedFile;
