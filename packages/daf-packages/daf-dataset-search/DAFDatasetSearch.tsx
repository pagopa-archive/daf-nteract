import React, { Fragment, PureComponent } from "react";
import { Button, Dialog, Intent, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import "./styles.css"

export interface IDAFDatasetSearchState {
  isOverlayOpen: boolean;
}

export class DAFDatasetSearch extends PureComponent<any, IDAFDatasetSearchState> {
  constructor(props: any) {
    super(props)

    this.toggleOverlay = this.toggleOverlay.bind(this)
  }

  componentWillMount() {
    // this.props.fetchDatasetSearch()
  }

  // render() {
  //   return this.props.hasFetched ? (
  //     createOntologies(this.props.data)
  //   ) : this.props.error ? (
  //     <Error msg={ontologiesError} />
  //   ) : (
  //         <Loading />
  //       )
  // }

  public state: IDAFDatasetSearchState = { isOverlayOpen: false }

  private toggleOverlay(e: any): void {
    const { state: { isOverlayOpen } } = this
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

export default DAFDatasetSearch