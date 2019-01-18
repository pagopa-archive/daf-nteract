import React, { Fragment, PureComponent, MouseEvent, SyntheticEvent } from "react";
import { Button, Dialog, Intent, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import "./styles.css"
import DafDatasetListSelect from "../daf-dataset-list";

export interface IDafDatasetSearchState {
  isOverlayOpen: boolean
}

export type DafDatasetSearchProps = any

export class DafDatasetSearch extends PureComponent<
  DafDatasetSearchProps,
  IDafDatasetSearchState
> {
  constructor(props: DafDatasetSearchProps) {
    super(props)
    this.toggleOverlay = this.toggleOverlay.bind(this)
  }

  public state: IDafDatasetSearchState = { isOverlayOpen: false }

  private toggleOverlay(e: SyntheticEvent): void {
    const { isOverlayOpen } = this.state
    this.setState({ isOverlayOpen: !isOverlayOpen })
  }

  public render() {
    const { toggleOverlay, state: { isOverlayOpen } } = this
    // const { fetchDatasetSearch, hasLoaded, error } = this.props
    return (
      <Fragment>
        <Button
          onClick={toggleOverlay}
          minimal
          small
          icon={IconNames.SEARCH_TEMPLATE}
          intent={Intent.PRIMARY}
        />
        <Dialog
          isOpen={isOverlayOpen}
          onClose={toggleOverlay}
          title="DAF Dataset Search"
        >
          <div className={Classes.DIALOG_BODY}>
            <p>Hello World DAF!</p>
            <DafDatasetListSelect />
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button
                rightIcon={IconNames.SEARCH_TEMPLATE}
                intent={Intent.PRIMARY}
              >
                Cerca
              </Button>
            </div>
          </div>
        </Dialog>
      </Fragment>
    )
  }
}

export default DafDatasetSearch