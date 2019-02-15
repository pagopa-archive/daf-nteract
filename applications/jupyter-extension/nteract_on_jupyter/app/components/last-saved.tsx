/**
 * A simple contentRef aware component that renders a little lastSaved
 * display.
 *
 * import LastSaved from "./last-saved"
 * <LastSaved contentRef={someRef} />
 *
 * If the contentRef is available and has a lastSaved, will render something like:
 *
 * Last Saved: 2 minutes ago
 *
 */

import { AppState, selectors } from "@nteract/core";
import { LastSaved } from "@nteract/directory-listing";
import * as React from "react";
import { connect } from "react-redux";

interface LastSavedProps {
  lastModified?: Date | null;
}

interface OwnProps {
  contentRef: string;
}

/**
 * Create our state mapper using makeMapStateToProps
 * Following https://twitter.com/dan_abramov/status/719971882280361985?lang=en
 */
const makeMapStateToProps = (
  initialState: AppState,
  initialProps: OwnProps
) => {
  const { contentRef } = initialProps;

  const mapStateToProps = (state: AppState) => {
    const content = selectors.contentByRef(state).get(contentRef);
    if (!content || !content.lastSaved) {
      return { lastModified: null };
    }
    return { lastModified: content.lastSaved };
  };

  return mapStateToProps;
};

export default connect<LastSavedProps, typeof LastSaved, OwnProps, AppState>(
  makeMapStateToProps
)(LastSaved);
