import { ImmutableExecuteResult, MediaBundle } from "@nteract/commutable";
import * as React from "react";

import { RichMedia } from "./rich-media";

interface Props {
  /**
   * The literal type of output, used for routing with the `<Output />` element
   */
  output_type: "execute_result";
  output?: ImmutableExecuteResult;

  /**
   * React elements that accept media bundle data, will get passed `data[mediaType]`
   */
  children: React.ReactNode;
}

export const ExecuteResult = (props: Partial<Props>) => {
  const { output, children } = props;
  if (!output) {
    return null;
  }

  return (
    <RichMedia data={output.data} metadata={output.metadata}>
      {children}
    </RichMedia>
  );
};

ExecuteResult.defaultProps = {
  output: null,
  output_type: "execute_result"
};
