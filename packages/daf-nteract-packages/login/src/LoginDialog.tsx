import React, { FunctionComponent, SyntheticEvent } from "react";
import {
  Dialog,
  InputGroup,
  FormGroup,
  Classes,
  Button,
  AnchorButton,
  H3,
  Intent
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { LoginDialogProps } from "../types";
import PasswordInput from "./PasswordInput";

const {
  DIALOG_HEADER,
  DIALOG_BODY,
  DIALOG_FOOTER,
  DIALOG_FOOTER_ACTIONS
} = Classes;
const { PRIMARY, DANGER, NONE } = Intent;
const { LOG_IN, USER } = IconNames;

const LoginDialog: FunctionComponent<LoginDialogProps> = ({
  hasLoaded,
  error,
  requestLogin
}) => {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    return requestLogin({
      username: formData.get("daf-login-username"),
      password: formData.get("daf-login-password")
    });
  };
  const commonURL = "https://dataportal.daf.teamdigitale.it/#/";
  return (
    <Dialog isOpen={!hasLoaded || error}>
      <div className={DIALOG_HEADER}>
        <H3 style={{ color: "hsl(210, 100%, 40%)" }}>DAF Login</H3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={DIALOG_BODY}>
          <FormGroup
            labelFor="daf-login-username"
            label="Username"
            labelInfo="(required)*"
            helperText="Please enter your username"
          >
            <InputGroup
              large
              intent={error ? DANGER : NONE}
              leftIcon={USER}
              placeholder="giux78"
              required
              id="daf-login-username"
              name="daf-login-username"
            />
          </FormGroup>
          <FormGroup
            labelFor="daf-login-password"
            label="Password"
            labelInfo="(required)*"
            helperText="Please enter your password"
          >
            <PasswordInput error={error} />
          </FormGroup>
        </div>
        <div className={`${DIALOG_FOOTER} ${DIALOG_FOOTER_ACTIONS}`}>
          <AnchorButton
            style={{ marginRight: "auto", marginLeft: 0 }}
            large
            minimal
            intent={error ? DANGER : NONE}
            href={`${commonURL}requestreset`}
            target="_blank"
          >
            Forgot password?
          </AnchorButton>
          <Button large minimal intent={PRIMARY} icon={LOG_IN} type="submit">
            Log in
          </Button>
          <AnchorButton
            large
            intent={PRIMARY}
            href={`${commonURL}register`}
            target="_blank"
          >
            Sign up
          </AnchorButton>
        </div>
      </form>
    </Dialog>
  );
};

export default LoginDialog;
