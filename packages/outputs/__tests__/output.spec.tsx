import { shallow } from "enzyme";
import * as React from "react";

import {
  DisplayData,
  ExecuteResult,
  KernelOutputError,
  Output,
  StreamText
} from "../src";

describe("Output", () => {
  it("handles stream data", () => {
    const output = { output_type: "stream", name: "stdout", text: "hey" };

    const component = shallow(
      <Output output={output}>
        <StreamText />
      </Output>
    );

    expect(component.type()).toEqual(StreamText);
  });

  it("handles errors/tracebacks", () => {
    const output = {
      output_type: "error",
      traceback: ["Yikes, Will is in the upsidedown again!"],
      ename: "NameError",
      evalue: "Yikes!"
    };

    const component = shallow(
      <Output output={output}>
        <KernelOutputError />
      </Output>
    );

    expect(component.find("KernelOutputError")).not.toBeNull();

    const outputNoTraceback = {
      output_type: "error",
      ename: "NameError",
      evalue: "Yikes!"
    };

    const component2 = shallow(
      <Output output={outputNoTraceback}>
        <KernelOutputError />
      </Output>
    );
    expect(component2.find("KernelOutputError")).not.toBeNull();
  });
  it("handles display_data messages", () => {
    const output = {
      output_type: "display_data",
      data: { "text/plain": "Cheese is the best food." }
    };

    const Plain = props => <pre>{props.data}</pre>;
    Plain.defaultProps = {
      mediaType: "text/plain"
    };

    const component = shallow(
      <Output output={output}>
        <DisplayData>
          <Plain />
        </DisplayData>
      </Output>
    );

    expect(component.type()).toEqual(DisplayData);
  });
  it("handles an execute result message", () => {
    const output = {
      output_type: "execute_result",
      data: {
        "text/plain": "42 is the answer to life, the universe, and everything."
      }
    };

    const Plain = props => <pre>{props.data}</pre>;
    Plain.defaultProps = {
      mediaType: "text/plain"
    };

    const component = shallow(
      <Output output={output}>
        <ExecuteResult>
          <Plain />
        </ExecuteResult>
      </Output>
    );

    expect(component.type()).toEqual(ExecuteResult);
  });
});
