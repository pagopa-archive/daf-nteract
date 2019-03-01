import React, { PureComponent, SyntheticEvent } from "react";
import { Intent, Tooltip, Button, InputGroup } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { PasswordInputProps, PasswordInputState } from "../types";

const { EYE_OFF, EYE_OPEN, LOCK } = IconNames;
const { WARNING, DANGER, NONE } = Intent;

class PasswordInput extends PureComponent<
  PasswordInputProps,
  PasswordInputState
> {
  constructor(props) {
    super(props);
    this.handleVisibility = this.handleVisibility.bind(this);
  }

  state: PasswordInputState = { isShown: false };

  private handleVisibility(e: SyntheticEvent): void {
    e.preventDefault();
    this.setState({ isShown: !this.state.isShown });
  }

  public render() {
    const { isShown } = this.state;
    return (
      <InputGroup
        large
        intent={this.props.error ? DANGER : NONE}
        type={isShown ? "text" : "password"}
        leftIcon={LOCK}
        rightElement={
          <Tooltip content={`${isShown ? "Hide" : "Show"} Password`}>
            <Button
              icon={isShown ? EYE_OPEN : EYE_OFF}
              intent={WARNING}
              minimal={true}
              onClick={this.handleVisibility}
            />
          </Tooltip>
        }
        placeholder="********"
        required
        id="daf-login-password"
        name="daf-login-password"
      />
    );
  }
}

export default PasswordInput;
