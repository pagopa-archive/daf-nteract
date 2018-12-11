import React, { ChangeEvent } from "react";
import { KernelspecRecord } from "@nteract/types";

type KernelOptionProps = {
  kernelName: string;
};

class KernelOption extends React.Component<KernelOptionProps> {
  render() {
    const { kernelName } = this.props;
    return <option value={kernelName}>{kernelName}</option>;
  }
}

type KernelSelectorProps = {
  currentKernel: string;
  onChange(event: ChangeEvent<HTMLSelectElement>): void;
  kernelspecs: { [name: string]: KernelspecRecord };
};

class KernelSelector extends React.Component<KernelSelectorProps> {
  render() {
    const { kernelspecs, currentKernel, onChange } = this.props;
    return (
      <form>
        <select
          value={currentKernel}
          onBlur={onChange}
          onChange={onChange}
          title="Active Kernel"
        >
          {Object.keys(kernelspecs).map(kernelName => {
            return <KernelOption kernelName={kernelName} key={kernelName} />;
          })}
        </select>
        <style jsx>
          {`
            form label,
            form select {
              font-family: inherit;
              font-size: inherit;
            }
          `}
        </style>
      </form>
    );
  }
}

type KernelUIProps = {
  status: string;
  currentKernel: string;
  onChange(event: any): void;
  kernelspecs: { [name: string]: KernelspecRecord };
};

export class KernelUI extends React.Component<KernelUIProps> {
  render() {
    const { status, ...otherprops } = this.props; // eslint-disable-line no-unused-vars
    return (
      <div className="kernel-data">
        <div className="kernelSelector">
          <KernelSelector {...otherprops} />
        </div>
        <div className="kernelInfo">
          <span className="kernelStatus">Runtime: </span>
          {this.props.status}
        </div>
        <style jsx>{`
          .kernelInfo {
            color: #f1f1f1;
            line-height: var(--header-height);
            white-space: pre-wrap;
            word-wrap: break-word;
            vertical-align: middle;
            display: table-cell;
            padding-right: 20px;
          }
          .kernel-data {
            font-family: Monaco, monospace;
            font-size: 12px;
          }
          .kernelStatus {
            color: #888;
          }
          .kernelSelector {
            display: table-cell;
            vertical-align: middle;
            padding-right: 10px;
            font-family: inherit;
            font-size: inherit;
          }
        `}</style>
      </div>
    );
  }
}
