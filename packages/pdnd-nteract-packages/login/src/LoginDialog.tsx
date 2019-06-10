import React, { FunctionComponent, SyntheticEvent, Fragment } from "react";
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

import { ILoginDialogProps } from "../types";
import PasswordInput from "./PasswordInput";

const { DIALOG_BODY, DIALOG_FOOTER, DIALOG_FOOTER_ACTIONS } = Classes;
const { PRIMARY, DANGER, NONE } = Intent;
const { LOG_IN, USER } = IconNames;

const LoginDialog: FunctionComponent<ILoginDialogProps> = ({
  isOpen,
  onClose,
  error,
  isLoading,
  requestLogin
}) => {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    return requestLogin({
      username: formData.get("pdnd-login-email"),
      password: formData.get("pdnd-login-password")
    });
  };
  const commonURL = "https://dataportal.daf.teamdigitale.it/#/";
  return (
    <Dialog
      isOpen={isOpen}
      title={<H3 style={{ color: "hsl(210, 100%, 40%)" }}>Pdnd Login</H3>}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        {isLoading ? (
          "Loading..."
        ) : (
          <Fragment>
            <div className={DIALOG_BODY}>
              <FormGroup
                labelFor="pdnd-login-email"
                label="Email"
                labelInfo="(required)*"
                helperText="Please enter your email"
              >
                <InputGroup
                  large
                  intent={error ? DANGER : NONE}
                  leftIcon={USER}
                  type="email"
                  placeholder="marco.rossi@teamdigitale.it"
                  required
                  id="pdnd-login-email"
                  name="pdnd-login-email"
                />
              </FormGroup>
              <FormGroup
                labelFor="pdnd-login-password"
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
              <AnchorButton
                large
                minimal
                intent={PRIMARY}
                href={`${commonURL}register`}
                target="_blank"
              >
                Sign up
              </AnchorButton>
              <Button
                large
                intent={PRIMARY}
                icon={LOG_IN}
                type="submit"
              >
                Log in
              </Button>
            </div>
          </Fragment>
        )}
      </form>
    </Dialog>
  );
};

export default LoginDialog;
